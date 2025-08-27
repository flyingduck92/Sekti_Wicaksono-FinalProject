'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE', // Profile will be deleted if User is deleted
        onUpdate: 'CASCADE'
      })

      Profile.hasMany(models.Tool, { foreignKey: 'ProfileId', })
    }
  }
  Profile.init({
    username: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    fullname: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    UserId: DataTypes.UUID,
    role: DataTypes.ENUM('staff', 'admin')
  }, {
    sequelize,
    modelName: 'Profile',
  })
  return Profile
}