'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      nickname: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      cls: {
        type: Sequelize.STRING
      },
      career: {
        type: Sequelize.STRING
      },
      license: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.STRING
      },
      schedule: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};