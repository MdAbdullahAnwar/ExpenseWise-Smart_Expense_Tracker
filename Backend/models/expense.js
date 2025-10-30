const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Expense = sequelize.define("Expense", {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Expense);

module.exports = Expense;
