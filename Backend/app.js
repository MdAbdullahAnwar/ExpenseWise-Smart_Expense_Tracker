const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const sequelize = require("./config/database");
const recurringTransactionService = require("./services/recurringTransactionService");

const User = require("./models/user");
const Expense = require("./models/expense");
const BankAccount = require("./models/bankAccount");
const Order = require("./models/order");

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

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
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const allowedOrigins = [
  'https://expense-wise-smart-expense-tracker.vercel.app',
  'https://expense-wise-smart-expense-tracker.vercel.app/',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowed => allowed === origin || allowed === origin + '/')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/password", passwordRoutes);
app.use("/bank-account", bankAccountRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize
  .sync({ alter: process.env.NODE_ENV === 'production' })
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
