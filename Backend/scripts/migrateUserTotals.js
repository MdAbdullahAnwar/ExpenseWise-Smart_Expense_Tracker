const sequelize = require("../config/database");
const User = require("../models/user");
const Expense = require("../models/expense");

async function migrateUserTotals() {
  try {
    console.log("Starting migration of user totals...");

    const users = await User.findAll();
    
    for (const user of users) {
      const expenses = await Expense.findAll({
        where: { UserId: user.id },
        attributes: ['amount']
      });

      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
      const totalTransactions = expenses.length;

      user.totalExpenses = totalExpenses;
      user.totalTransactions = totalTransactions;
      await user.save();

      console.log(`Updated user ${user.id}: ${totalTransactions} transactions, ₹${totalExpenses.toFixed(2)}`);
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateUserTotals();
