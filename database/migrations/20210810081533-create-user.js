'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
         type:Sequelize.UUID,
         defaultValue:Sequelize.UUIDV4
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      role: {
      type:Sequelize.ENUM('admin','user'),
      defaultValue:'user',
      allowNull:false
    },
      active: {
        type: Sequelize.ENUM('active','inactive'),
        defaultValue:'active',
        allowNull:false
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull:true
      },
      resetPasswordExpire:{
        type: Sequelize.DATE,
        allowNull:true
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
    await queryInterface.dropTable('users');
  }
};