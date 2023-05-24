'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class buy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      buy.belongsTo(models.hero, { foreignKey: 'heroId' });
    }
  }
  buy.init({
    itemName: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    heroId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'buy',
    updatedAt: false,
    underscored: true
  });
  return buy;
}; 