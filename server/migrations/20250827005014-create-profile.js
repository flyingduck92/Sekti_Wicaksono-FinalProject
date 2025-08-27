'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.UUID
      },
      role: {
        type: Sequelize.ENUM('staff', 'admin'),
        defaultValue: 'staff'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      indexes: [
        { unique: true, fields: ['username'], name: 'index_profile_username' },
        { fields: ['fullname'], name: 'index_profile_fullname' },
      ]
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles')
  }
}