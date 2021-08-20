'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    user_id: {
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    username:{
      type: DataTypes.STRING,
      allowNull:false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    active: {
      type:DataTypes.ENUM('active','inactive'),
      defaultValue:'active',
      allowNull:false
    },
    role: {
      type:DataTypes.ENUM('admin','user','landlord'),
      defaultValue:'user',
      allowNull:false
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull:true
      },
      resetPasswordExpire:{
        type: DataTypes.DATE,
        allowNull:true
      },
  }, {
    sequelize,
    tableName:'users',
    modelName: 'User',
  });
  return User;
};