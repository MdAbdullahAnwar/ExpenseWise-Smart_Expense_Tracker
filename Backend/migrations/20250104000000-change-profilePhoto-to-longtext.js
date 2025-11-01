'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profilePhoto', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profilePhoto', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
};
