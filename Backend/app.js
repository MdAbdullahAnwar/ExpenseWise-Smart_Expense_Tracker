const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequest = require("./models/forgotPasswordRequest");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/password", passwordRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    console.log("Run 'node scripts/migrateUserTotals.js' to populate existing user totals");
  })
  .catch((err) => console.error("Database sync error:", err));

module.exports = app;
