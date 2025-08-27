'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tool.belongsTo(models.Profile, {
        foreignKey: 'ProfileId',
        onDelete: 'SET NULL', // Tool still available, ProfileId set to NULL
        onUpdate: 'CASCADE'
      })
      Tool.belongsTo(models.Category, {
        foreignKey: 'CategoryId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }
  Tool.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    CategoryId: DataTypes.UUID,
    ProfileId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Tool',
  })
  return Tool
}