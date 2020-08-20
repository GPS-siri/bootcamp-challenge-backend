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
    userId: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    salt: DataTypes.STRING,
    nickname: DataTypes.STRING,
    phone: DataTypes.STRING,
    cls: DataTypes.STRING,
    career: DataTypes.STRING,
    license: DataTypes.STRING,
    introduction: DataTypes.STRING,
    schedule: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};