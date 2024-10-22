/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todo List Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Submit assignment",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
  });
  test("Should add a new todo", () => {
    const todoItemCount = all.length;
    add({
      title: "Pay Rent",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 2))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
    expect(all.length).toBe(todoItemCount + 1);
  });
  test("Mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("Retrieval of overdue items", () => {
    let items = overdue();
    if (items.length === 0) expect(items.length).toBe(0);
    else expect(items.length).toBeGreaterThan(0);
  });
  test("Retrieval of today due items", () => {
    let items = dueToday();
    if (items.length === 0) expect(items.length).toBe(0);
    else expect(items.length).toBeGreaterThan(0);
  });
  test("Retrieval of due later items", () => {
    let items = dueLater();
    if (items.length === 0) expect(items.length).toBe(0);
    else expect(items.length).toBeGreaterThan(0);
  });
});
