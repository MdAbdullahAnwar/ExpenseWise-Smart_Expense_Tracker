const Expense = require("../models/expense");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.addExpense = async (userId, expenseData) => {
  const { amount, description, category } = expenseData;
  
  const expense = await Expense.create({ 
    amount, 
    description, 
    category, 
    UserId: userId 
  });

  const user = await User.findByPk(userId);
  console.log('Before update:', { totalExpenses: user.totalExpenses, totalTransactions: user.totalTransactions });
  
  user.totalExpenses = parseFloat(user.totalExpenses) + parseFloat(amount);
  user.totalTransactions = user.totalTransactions + 1;
  await user.save();
  
  console.log('After update:', { totalExpenses: user.totalExpenses, totalTransactions: user.totalTransactions });

  return expense;
};

exports.updateExpense = async (userId, expenseId, expenseData) => {
  const { amount, description, category } = expenseData;
  
  const expense = await Expense.findOne({ where: { id: expenseId } });
  if (!expense) throw new Error("Expense not found");
  if (expense.UserId !== userId) throw new Error("Not authorized");

  const oldAmount = parseFloat(expense.amount);
  const newAmount = parseFloat(amount);
  const difference = newAmount - oldAmount;

  expense.amount = amount;
  expense.description = description;
  expense.category = category;
  await expense.save();

  if (difference !== 0) {
    const user = await User.findByPk(userId);
    user.totalExpenses = parseFloat(user.totalExpenses) + difference;
    await user.save();
  }

  return expense;
};

exports.deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOne({ where: { id: expenseId } });
  if (!expense) throw new Error("Expense not found");
  if (expense.UserId !== userId) throw new Error("Not authorized");

  const amount = parseFloat(expense.amount);
  
  await expense.destroy();

  const user = await User.findByPk(userId);
  user.totalExpenses = parseFloat(user.totalExpenses) - amount;
  user.totalTransactions = user.totalTransactions - 1;
  await user.save();
};

exports.getExpenses = async (userId) => {
  return await Expense.findAll({ where: { UserId: userId } });
};
