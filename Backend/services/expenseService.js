const Expense = require("../models/expense");
const User = require("../models/user");
const BankAccount = require("../models/bankAccount");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.addExpense = async (userId, expenseData) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category, note, expenseDate, BankAccountId, type = 'expense', isRecurring = false, recurringDay = null } = expenseData;
    
    let accountId = BankAccountId;
    if (!accountId) {
      const defaultAccount = await BankAccount.findOne({
        where: { UserId: userId, isDefault: true },
        transaction
      });
      accountId = defaultAccount?.id;
    }

    const expense = await Expense.create({ 
      amount, 
      description, 
      category,
      note,
      expenseDate,
      type,
      isRecurring,
      recurringDay: isRecurring ? recurringDay : null,
      UserId: userId,
      BankAccountId: accountId
    }, { transaction });

    if (accountId) {
      const account = await BankAccount.findByPk(accountId, { transaction });
      if (type === 'income') {
        account.balance = parseFloat(account.balance) + parseFloat(amount);
      } else {
        account.balance = parseFloat(account.balance) - parseFloat(amount);
      }
      await account.save({ transaction });
    }

    const user = await User.findByPk(userId, { transaction });
    if (type === 'expense') {
      user.totalExpenses = parseFloat(user.totalExpenses) + parseFloat(amount);
    }
    user.totalTransactions = user.totalTransactions + 1;
    await user.save({ transaction });

    await transaction.commit();
    
    const createdExpense = await Expense.findByPk(expense.id, {
      include: [{ model: BankAccount, attributes: ['id', 'name'] }]
    });
    return createdExpense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.updateExpense = async (userId, expenseId, expenseData) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category, note, expenseDate, BankAccountId, type, isRecurring = false, recurringDay = null } = expenseData;
    console.log('Received expenseData:', expenseData);
    console.log('Extracted BankAccountId:', BankAccountId, 'type:', typeof BankAccountId);
    
    const expense = await Expense.findOne({ where: { id: expenseId }, transaction });
    if (!expense) throw new Error("Expense not found");
    if (expense.UserId !== userId) throw new Error("Not authorized");

    const oldAmount = parseFloat(expense.amount);
    const oldType = expense.type;
    const newAmount = parseFloat(amount);
    const newType = type || oldType;
    const difference = newAmount - oldAmount;
    const oldBankAccountId = expense.BankAccountId;
    const newBankAccountId = BankAccountId === null || BankAccountId === undefined ? null : BankAccountId;

    if (oldBankAccountId) {
      const oldAccount = await BankAccount.findByPk(oldBankAccountId, { transaction });
      if (oldAccount) {
        if (oldType === 'income') {
          oldAccount.balance = parseFloat(oldAccount.balance) - oldAmount;
        } else {
          oldAccount.balance = parseFloat(oldAccount.balance) + oldAmount;
        }
        await oldAccount.save({ transaction });
      }
    }

    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    expense.note = note;
    expense.expenseDate = expenseDate;
    expense.type = newType;
    expense.isRecurring = isRecurring;
    expense.recurringDay = isRecurring ? recurringDay : null;
    expense.BankAccountId = newBankAccountId;
    console.log('Saving expense with BankAccountId:', newBankAccountId);
    await expense.save({ transaction });
    console.log('Saved expense BankAccountId:', expense.BankAccountId);

    if (newBankAccountId) {
      const newAccount = await BankAccount.findByPk(newBankAccountId, { transaction });
      if (newAccount) {
        if (newType === 'income') {
          newAccount.balance = parseFloat(newAccount.balance) + newAmount;
        } else {
          newAccount.balance = parseFloat(newAccount.balance) - newAmount;
        }
        await newAccount.save({ transaction });
      }
    }

    const user = await User.findByPk(userId, { transaction });
    if (oldType === 'expense') {
      user.totalExpenses = parseFloat(user.totalExpenses) - oldAmount;
    }
    if (newType === 'expense') {
      user.totalExpenses = parseFloat(user.totalExpenses) + newAmount;
    }
    await user.save({ transaction });

    await transaction.commit();
    
    const updatedExpense = await Expense.findByPk(expenseId, {
      include: [{ model: BankAccount, attributes: ['id', 'name'] }],
      raw: false
    });
    return updatedExpense;
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
    const expenseType = expense.type;
    
    if (expense.BankAccountId) {
      const account = await BankAccount.findByPk(expense.BankAccountId, { transaction });
      if (account) {
        if (expenseType === 'income') {
          account.balance = parseFloat(account.balance) - amount;
        } else {
          account.balance = parseFloat(account.balance) + amount;
        }
        await account.save({ transaction });
      }
    }

    await expense.destroy({ transaction });

    const user = await User.findByPk(userId, { transaction });
    if (expenseType === 'expense') {
      user.totalExpenses = parseFloat(user.totalExpenses) - amount;
    }
    user.totalTransactions = user.totalTransactions - 1;
    await user.save({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getExpenses = async (userId) => {
  const BankAccount = require("../models/bankAccount");
  return await Expense.findAll({ 
    where: { UserId: userId },
    include: [{ model: BankAccount, attributes: ['id', 'name'] }]
  });
};
