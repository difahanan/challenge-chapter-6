'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     hero.hasMany(models.buy, {
      foreignKey: 'heroId'
     }) 
    }
  }
  hero.init({
    heroName: DataTypes.STRING,
    role: DataTypes.STRING,
    emblem: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'hero',
    tableName: 'hero',
    updatedAt: false,
    underscored: true
  });
  return hero;
};