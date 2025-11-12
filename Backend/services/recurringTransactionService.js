const BankAccount = require("../models/bankAccount");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../config/database");

exports.processRecurringTransactions = async () => {
  const transaction = await sequelize.transaction();
  try {
    const today = new Date().getDate();
    
    const recurringAccounts = await BankAccount.findAll({
      where: {
        isRecurring: true,
        recurringDay: today
      },
      transaction
    });

    for (const account of recurringAccounts) {
      account.balance = parseFloat(account.balance) + parseFloat(account.recurringAmount);
      await account.save({ transaction });
      
      await Expense.create({
        amount: account.recurringAmount,
        description: `Recurring credit to ${account.name}`,
        category: 'Salary',
        note: 'Auto-generated from recurring bank account',
        expenseDate: new Date(),
        type: 'income',
        isRecurring: false,
        recurringDay: null,
        UserId: account.UserId,
        BankAccountId: account.id
      }, { transaction });
      
      const user = await User.findByPk(account.UserId, { transaction });
      if (user) {
        user.totalTransactions = user.totalTransactions + 1;
        await user.save({ transaction });
      }
      
      console.log(`Credited ₹${account.recurringAmount} to ${account.name}`);
    }

    const recurringExpenses = await Expense.findAll({
      where: {
        isRecurring: true,
        recurringDay: today
      },
      include: [{ model: User }, { model: BankAccount }],
      transaction
    });

    for (const expense of recurringExpenses) {
      const newExpense = await Expense.create({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        note: expense.note,
        expenseDate: new Date(),
        type: expense.type,
        isRecurring: false,
        recurringDay: null,
        UserId: expense.UserId,
        BankAccountId: expense.BankAccountId
      }, { transaction });

      if (expense.BankAccountId) {
        const account = await BankAccount.findByPk(expense.BankAccountId, { transaction });
        if (account) {
          if (expense.type === 'income') {
            account.balance = parseFloat(account.balance) + parseFloat(expense.amount);
          } else {
            account.balance = parseFloat(account.balance) - parseFloat(expense.amount);
          }
          await account.save({ transaction });
        }
      }

      const user = await User.findByPk(expense.UserId, { transaction });
      if (user) {
        if (expense.type === 'expense') {
          user.totalExpenses = parseFloat(user.totalExpenses) + parseFloat(expense.amount);
        }
        user.totalTransactions = user.totalTransactions + 1;
        await user.save({ transaction });
      }

      console.log(`Processed recurring ${expense.type}: ${expense.description} - ₹${expense.amount}`);
    }

    await transaction.commit();
    console.log(`Processed ${recurringAccounts.length} recurring account credits and ${recurringExpenses.length} recurring transactions`);
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing recurring transactions:", error);
  }
};
