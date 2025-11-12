const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BankAccount = sequelize.define("BankAccount", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurringAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  recurringDay: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

module.exports = BankAccount;
