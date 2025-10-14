const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
    allowNull: false,
  },
  razorpay_order_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpay_payment_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpay_signature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);

module.exports = Order;
