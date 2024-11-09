"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static async setCompletionStatus(id, status) {
      await this.update(
        { completed: status },
        {
          where: {
            id: id,
          },
        },
      );
      return this.findByPk(id);
    }

    static deleteTodo(id, userId) {
      return this.destroy({
        where: {
          id: id,
          userId,
        },
      });
    }

    static overdue(userId) {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          completed: false,
          userId,
        },
      });
    }

    static dueToday(userId) {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: today,
          completed: false,
          userId,
        },
      });
    }

    static dueLater(userId) {
      const today = new Date().toISOString().slice(0, 10);
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: today },
          completed: false,
          userId,
        },
      });
    }

    static completed(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
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
