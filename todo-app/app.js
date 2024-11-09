/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const { connect } = require("./connectDB.js");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("tiny-csrf");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");
const bcryptjs = require("bcryptjs");
const user = require("./models/user.js");
const saltRounds = 10;

connect();
// Set EJS as view engine
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("A secret string"));
app.use(csrf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my-super-secret-key-139794678463243278480",
    resave: false, // prevents unnecessary session saving
    saveUninitialized: false, // do not save empty sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24 hours
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          const result = await bcryptjs.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid Password");
          }
        })
        .catch((error) => {
          return error;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  response.render("index.ejs", {
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    const loggedInUserName =
      request.user.firstName + " " + request.user.lastName;
    const overdueTodos = await Todo.overdue(loggedInUser);
    const dueTodayTodos = await Todo.dueToday(loggedInUser);
    const dueLaterTodos = await Todo.dueLater(loggedInUser);
    const completedTodos = await Todo.completed(loggedInUser);
    if (request.accepts("html")) {
      response.render("todos.ejs", {
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
        loggedInUserName,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
        loggedInUserName,
      });
    }
  },
);

app.get("/signup", (request, response) => {
  response.render("signup.ejs", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/signin", (request, response) => {
  response.render("signin.ejs", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/signout", (request, response, next) => {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    response.redirect("/");
  });
});

app.post(
  "/session",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  (request, response) => {
    response.redirect("/todos");
  },
);

app.post("/users", async (request, response) => {
  const hashedPwd = await bcryptjs.hash(request.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (error) => {
      if (error) {
        console.log(error);
      }
      return response.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    try {
      const todo = await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(
      "We have to mark a Todo as complete/incomplete with ID: ",
      request.params.id,
    );
    const todoId = request.params.id;
    const { completed } = request.body;
    try {
      const updatedTodo = await Todo.setCompletionStatus(todoId, completed);
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
      const deletedTodo = await Todo.deleteTodo(
        request.params.id,
        loggedInUser,
      );
      if (deletedTodo) return response.status(200).json(true);
      else return response.status(404).json(false);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // response.send(true)
  },
);

module.exports = app;
