const { Op } = require('sequelize')
const { Profile, User, sequelize } = require('../models')

class ProfileController {
  // static async addProfile(req, res) {
  //   res.json({ message: 'Add a single Profile!!!' })
  // }

  // For Staff/Admin
  static async getMyProfile(req, res) { }
  static async updateMyProfile(req, res) { }
  static async updateMyEmail(req, res) { }
  static async updateMyPassword(req, res) { }

  // For Admin only
  static async getAllProfiles(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let { count, rows } = await Profile.findAndCountAll({
        include: [{
          model: User,
          attributes: { exclude: ['password'] } // remove attr password
        }],
        limit,
        offset
      })

      return res.status(200).json({
        success: true,
        data: { total: count, users: rows },
        message: "Profile fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async getOneProfile(req, res) {
    try {
      const id = req.params.id

      let result = await Profile.findOne({
        where: { id },
        include: [User]
      })
      if (!result) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Profile ID not found.'
        })
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: "Profile fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async updateProfile(req, res) {
    try {
      const id = req.params.id
      const { username, imageUrl, fullname, dateOfBirth } = req.body

      const updatedUser = {
        username, imageUrl, fullname, dateOfBirth
      }

      let [result] = await Profile.update(updatedUser, { where: { id } })
      if (result === 0) {
        // if ID not found when update
        return res.status(404).json({
          success: false,
          data: null,
          message: `Profile ${id} not found!`
        })
      }

      return res.status(200).json({
        success: true,
        data: { username, imageUrl, fullname, dateOfBirth },
        message: `Profile ${id} updated!`
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async deleteProfile(req, res) {
    try {
      const id = req.params.id
      let result = await Profile.destroy({ where: { id } })

      if (result) {
        return res.status(200).json({
          success: true,
          data: { id },
          message: `Profile ${id} has been deleted!`
        })
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: `Profile ${id} not found!`
        })
      }

    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
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