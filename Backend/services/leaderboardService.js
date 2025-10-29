const User = require("../models/user");
const Expense = require("../models/expense");
const { fn, col } = require("sequelize");

exports.getLeaderboard = async (currentUserId) => {
  const leaderboardData = await User.findAll({
    attributes: [
      'id',
      'name', 
      'email',
      'isPremium',
      [fn('COALESCE', fn('SUM', col('Expenses.amount')), 0), 'totalExpenses'],
      [fn('COUNT', col('Expenses.id')), 'totalTransactions']
    ],
    include: [{
      model: Expense,
      attributes: [],
      required: false
    }],
    group: ['User.id'],
    order: [[fn('COALESCE', fn('SUM', col('Expenses.amount')), 0), 'DESC']],
    raw: true
  });

  return leaderboardData.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    name: user.name,
    email: user.email,
    isPremium: user.isPremium,
    totalExpenses: parseFloat(user.totalExpenses || 0).toFixed(2),
    totalTransactions: parseInt(user.totalTransactions || 0),
    isCurrentUser: user.id === currentUserId
  }));
};
