const { Op } = require('sequelize')
const { Profile, User, sequelize } = require('../models')

class ProfileController {
  // static async addProfile(req, res) {
  //   res.json({ message: 'Add a single Profile!!!' })
  // }

  static async getAllProfiles(req, res) {
    res.json({ message: 'Get all Profiles!!!' })
  }

  static async getOneProfile(req, res) {
    res.json({ message: 'Get a single Profile!!!' })
  }

  static async updateProfile(req, res) {
    res.json({ message: 'Update a single Profile!!!' })

  }
  static async deleteProfile(req, res) {
    res.json({ message: 'Delete a single Profile!!!' })
  }

  static async searchProfile(req, res) {
    try {
      // searchquery and pagination
      const searchQuery = req.query.search
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      if (!searchQuery) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Missing search query'
        })
      }

      // search at User and Profile Table 
      const { count, rows } = await Profile.findAndCountAll({
        include: [{
          model: User,
          required: false // LEFT JOIN: include Profiles even its have no Users
        }],
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${searchQuery}%` } }, // Profile.username
            { fullname: { [Op.like]: `%${searchQuery}%` } }, // Profile.fullname
            { '$User.email$': { [Op.like]: `%${searchQuery}%` } }, // User.email
          ]
        },
        limit,
        offset
      })

      return res.status(200).json({
        success: true,
        data: { total: count, users: rows },
        message: "Search complete"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }
}

module.exports = ProfileController