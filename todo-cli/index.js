/* eslint-disable no-unused-vars */
const { sequelize, connect } = require("./connectDB.js");
const Todo = require("./todoModel.js");

const resetTable = async () => {
  try {
    await connect();

    // Delete all records in the table
    await Todo.destroy({ where: {}, truncate: true });
    console.log("All records deleted");

    // Reset the primary key sequence to start from 1
    await sequelize.query(`ALTER SEQUENCE "todos_id_seq" RESTART WITH 1;`);
    console.log("Primary key sequence reset to start from 1");
  } catch (error) {
    console.error("Error resetting table:", error);
  }
};

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "First item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created Todo with id:${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the table`);
  } catch (error) {
    console.error(error);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(todoList);
  } catch (error) {
    console.error(error);
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });
    console.log(todo.displayableString());
  } catch (error) {
    console.error(error);
  }
};

const updateItem = async (id) => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      },
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteItem = async (id) => {
  try {
    const deleteRow = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deleteRow} row with id : ${id}!`);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  //   await createTodo();
  //   await resetTable();
  //   await countItems();
  await getAllTodos();
  //   await getSingleTodo();
  //   await updateItem(2);
  //   await deleteItem(1);
})();
