const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  monthlyBudget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  totalExpenses: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
  },
  totalTransactions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  lastBudgetReset: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

module.exports = User;
