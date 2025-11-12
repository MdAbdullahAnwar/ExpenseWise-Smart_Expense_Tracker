const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const sequelize = require("./config/database");
const recurringTransactionService = require("./services/recurringTransactionService");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequest = require("./models/forgotPasswordRequest");
const BankAccount = require("./models/bankAccount");

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(BankAccount);
BankAccount.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

BankAccount.hasMany(Expense);
Expense.belongsTo(BankAccount, { constraints: true, onDelete: "SET NULL" });

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const bankAccountRoutes = require("./routes/bankAccountRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/password", passwordRoutes);
app.use("/bank-account", bankAccountRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database synced");
    console.log("Run 'node scripts/migrateUserTotals.js' to populate existing user totals");
    
    cron.schedule('0 0 * * *', () => {
      console.log('Running monthly salary cron job');
      recurringTransactionService.processRecurringTransactions();
    });
    console.log("Monthly salary cron job scheduled (runs daily, credits on matching day)");
  })
  .catch((err) => console.error("Database sync error:", err));

module.exports = app;
