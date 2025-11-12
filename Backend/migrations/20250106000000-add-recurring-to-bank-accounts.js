'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BankAccounts', 'isRecurring', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    
    await queryInterface.addColumn('BankAccounts', 'recurringAmount', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0
    });
    
    await queryInterface.addColumn('BankAccounts', 'recurringDay', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BankAccounts', 'isRecurring');
    await queryInterface.removeColumn('BankAccounts', 'recurringAmount');
    await queryInterface.removeColumn('BankAccounts', 'recurringDay');
  }
};
