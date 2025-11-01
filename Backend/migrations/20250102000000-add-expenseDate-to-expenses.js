'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Expenses', 'expenseDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    
    // Set default value for existing rows
    await queryInterface.sequelize.query(
      "UPDATE Expenses SET expenseDate = DATE(createdAt) WHERE expenseDate IS NULL"
    );
    
    // Make it NOT NULL after setting values
    await queryInterface.changeColumn('Expenses', 'expenseDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Expenses', 'expenseDate');
  }
};
