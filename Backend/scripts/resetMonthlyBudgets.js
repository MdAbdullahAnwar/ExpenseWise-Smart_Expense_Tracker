const sequelize = require('../config/database');
const User = require('../models/user');

async function resetMonthlyBudgets() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  
  if (today.getDate() === 1) {
    const transaction = await sequelize.transaction();
    
    try {
      const usersToReset = await User.findAll({
        where: {
          [sequelize.Sequelize.Op.or]: [
            { lastBudgetReset: null },
            { lastBudgetReset: { [sequelize.Sequelize.Op.lt]: firstOfMonth } }
          ]
        },
        transaction
      });
      
      if (usersToReset.length > 0) {
        await User.update(
          { totalExpenses: 0, totalTransactions: 0, lastBudgetReset: todayStr },
          { 
            where: {
              [sequelize.Sequelize.Op.or]: [
                { lastBudgetReset: null },
                { lastBudgetReset: { [sequelize.Sequelize.Op.lt]: firstOfMonth } }
              ]
            },
            transaction 
          }
        );
        
        await transaction.commit();
        console.log(`Monthly budgets reset for ${usersToReset.length} users on ${today.toDateString()}`);
      } else {
        await transaction.commit();
        console.log('All users already reset for this month');
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Error resetting monthly budgets:', error);
    }
  }
}

module.exports = resetMonthlyBudgets;
