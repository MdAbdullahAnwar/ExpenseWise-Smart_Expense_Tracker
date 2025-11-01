const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.addExpense = async (userId, expenseData) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category, note, expenseDate } = expenseData;
    
    const expense = await Expense.create({ 
      amount, 
      description, 
      category,
      note,
      expenseDate,
      UserId: userId 
    }, { transaction });

    const user = await User.findByPk(userId, { transaction });
    user.totalExpenses = parseFloat(user.totalExpenses) + parseFloat(amount);
    user.totalTransactions = user.totalTransactions + 1;
    await user.save({ transaction });

    await transaction.commit();
    return expense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.updateExpense = async (userId, expenseId, expenseData) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category, note, expenseDate } = expenseData;
    
    const expense = await Expense.findOne({ where: { id: expenseId }, transaction });
    if (!expense) throw new Error("Expense not found");
    if (expense.UserId !== userId) throw new Error("Not authorized");

    const oldAmount = parseFloat(expense.amount);
    const newAmount = parseFloat(amount);
    const difference = newAmount - oldAmount;

    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    expense.note = note;
    expense.expenseDate = expenseDate;
    await expense.save({ transaction });

    if (difference !== 0) {
      const user = await User.findByPk(userId, { transaction });
      user.totalExpenses = parseFloat(user.totalExpenses) + difference;
      await user.save({ transaction });
    }

    await transaction.commit();
    return expense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteExpense = async (userId, expenseId) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({ where: { id: expenseId }, transaction });
    if (!expense) throw new Error("Expense not found");
    if (expense.UserId !== userId) throw new Error("Not authorized");

    const amount = parseFloat(expense.amount);
    
    await expense.destroy({ transaction });

    const user = await User.findByPk(userId, { transaction });
    user.totalExpenses = parseFloat(user.totalExpenses) - amount;
    user.totalTransactions = user.totalTransactions - 1;
    await user.save({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getExpenses = async (userId) => {
  return await Expense.findAll({ where: { UserId: userId } });
};
