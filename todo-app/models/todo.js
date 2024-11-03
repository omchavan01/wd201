"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    static displayTodo() {
      return this.findAll();
    }

    static deleteTodo(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }

    static overdue() {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          completed:false,
        },
      });
    }

    static dueToday() {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: today,
          completed:false,
        },
      });
    }

    static dueLater() {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: today },
          completed:false,
        },
      });
    }

    static completed() {
      return this.findAll({
        where: {
          completed:true,
        },
      });
    }

  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
