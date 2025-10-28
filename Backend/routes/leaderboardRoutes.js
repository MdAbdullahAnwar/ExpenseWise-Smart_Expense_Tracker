const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const User = require("../models/user");
const Expense = require("../models/expense");
const authMiddleware = require("../middlewares/authMiddleware");

// Get leaderboard - Premium users only (but shows all users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user || !user.isPremium) {
      return res.status(403).json({ message: "Premium feature only" });
    }

    // Get ALL users (premium and non-premium)
    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'isPremium']
    });

    // Get expenses for each user and calculate totals
    const leaderboardData = await Promise.all(
      allUsers.map(async (dbUser) => {
        const expenses = await Expense.findAll({
          where: { userId: dbUser.id },
          attributes: ['amount']
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
        const totalTransactions = expenses.length;

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          isPremium: dbUser.isPremium,
          totalExpenses,
          totalTransactions,
          isCurrentUser: dbUser.id === req.userId
        };
      })
    );

    // Sort by total expenses descending
    leaderboardData.sort((a, b) => b.totalExpenses - a.totalExpenses);

    // Add ranks and format
    const formattedLeaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      totalExpenses: user.totalExpenses.toFixed(2),
      totalTransactions: user.totalTransactions,
      isCurrentUser: user.isCurrentUser
    }));

    res.status(200).json(formattedLeaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
