const todoList = () => {
  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    const overdueTodo = [];
    all.filter((entry) => {
      if (entry.dueDate < new Date().toISOString().slice(0, 10))
        overdueTodo.push(entry);
    });
    return overdueTodo;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    const todayTodo = [];
    all.filter((entry) => {
      if (entry.dueDate === new Date().toISOString().slice(0, 10))
        todayTodo.push(entry);
    });
    return todayTodo;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    const duelaterTodo = [];
    all.filter((entry) => {
      if (entry.dueDate > new Date().toISOString().slice(0, 10))
        duelaterTodo.push(entry);
    });
    return duelaterTodo;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    let check;
    let displayDate;
    let todoDisplay = list
      .map((entry) => {
        if (entry.completed) check = "[x]";
        else check = "[ ]";
        if (entry.dueDate === new Date().toISOString().slice(0, 10))
          displayDate = "";
        else displayDate = entry.dueDate;
        return `${check} ${entry.title} ${displayDate}`;
      })
      .join("\n");
    return todoDisplay;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
