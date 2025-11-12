const User = require("../models/user");
const Expense = require("../models/expense");
const { fn, col, Op } = require("sequelize");

exports.getLeaderboard = async (currentUserId, type = 'expense', timeRange = 'all') => {
  const whereClause = { type };
  
  if (timeRange !== 'all') {
    const now = new Date();
    let startDate;
    
    if (timeRange === 'weekly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (timeRange === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    whereClause.expenseDate = { [Op.gte]: startDate };
  }

  const leaderboardData = await User.findAll({
    attributes: [
      'id',
      'name', 
      'email',
      'isPremium',
      [fn('COALESCE', fn('SUM', col('Expenses.amount')), 0), 'totalAmount'],
      [fn('COUNT', col('Expenses.id')), 'totalTransactions']
    ],
    include: [{
      model: Expense,
      attributes: [],
      where: whereClause,
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
    totalAmount: parseFloat(user.totalAmount || 0).toFixed(2),
    totalTransactions: parseInt(user.totalTransactions || 0),
    isCurrentUser: user.id === currentUserId
  }));
};
