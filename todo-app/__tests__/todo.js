/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");

let server, agent;
function extractCSRFToken(response) {
  let $ = cheerio.load(response.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Create a new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo as complete or incomplete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res);
    await agent.post("/todos").send({
      title: "Mark this todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodaycount = parsedGroupedResponse.dueTodayTodos.length;
    const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodaycount - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res);
    let markCompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      completed: true,
      _csrf: csrfToken,
    });

    let parsedUpdatedResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(true);

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res);
    const markIncompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: false,
        _csrf: csrfToken,
      });

    parsedUpdatedResponse = JSON.parse(markIncompleteResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(false);
  });

  test("Deletes a todo", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res);

    await agent.post("/todos").send({
      title: "Delete this todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: csrfToken,
    });

    const todosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const todos = JSON.parse(todosResponse.text);
    dueTodaycount = todos.dueTodayTodos.length;
    const latestTodo = todos.dueTodayTodos[dueTodaycount - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res);
    const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body).toBe(true);

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res);
    const fetchResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    expect(fetchResponse.statusCode).toBe(404);
    expect(fetchResponse.body).toBe(false);
  });
});
