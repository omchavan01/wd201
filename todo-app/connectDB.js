const Sequelize = require("sequelize");

const database = "wd-todo-dev";
const username = "postgres";
const password = "sonuom";
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully.",
    );
    await sequelize.sync();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connect,
  sequelize,
};
