const { Op } = require('sequelize')
const { Profile, User, Tool } = require('../models')
const { encryptPwd } = require('../utils/bcrypt')

class ProfileController {
  // static async addProfile(req, res) {
  //   res.json({ message: 'Add a single Profile!!!' })
  // }

  // For Staff/Admin (Self-services)
  static async getMyProfile(req, res) {
    try {
      const profile = await Profile.findOne({
        where: { UserId: req.user.id },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Tool }
        ]
      })

      if (!profile) {
        return res.status(404).json({
          success: false,
          data: profile,
          message: "Profile not found"
        })
      }

      return res.status(200).json({
        success: true,
        data: profile,
        message: "Profile found"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async updateMyProfile(req, res) {
    try {
      const { username, imageUrl, fullname, dateOfBirth } = req.body

      if (username) {
        const exists = await Profile.findOne({
          where: { username, UserId: { [Op.ne]: req.user.id } }
        })
        if (exists) {
          return res.status(409).json({
            success: false,
            data: null,
            message: "Username already exists"
          })
        }
      }

      const profileUpdated = await Profile.update(
        { username, imageUrl, fullname, dateOfBirth },
        { where: { UserId: req.user.id } }
      )

      if (profileUpdated) {
        return res.status(200).json({
          success: true,
          data: profileUpdated,
          message: "Profile updated"
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

  static async updateMyEmail(req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Email required'
        })
      }

      const exists = await User.findOne({
        where: { email, id: { [Op.ne]: req.user.id } }
      })
      if (exists) {
        return res.status(500).json({
          success: false,
          data: null,
          message: 'Email already exists'
        })
      }

      const updatedEmail = await User.update(
        { email },
        { where: { id: req.user.id } }
      )

      if (updatedEmail) {
        return res.status(200).json({
          success: true,
          data: updatedEmail,
          message: 'Email updated'
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

  static async updateMyPassword(req, res) {
    try {
      const { password } = req.body
      if (!password) {
        return res.status(500).json({
          success: false,
          data: null,
          message: 'Password required'
        })
      }

      const encryptedPwd = await encryptPwd(password)

      const updatedPassword = await User.update(
        { password: encryptedPwd },
        { where: { id: req.user.id } }
      )

      if (updatedPassword) {
        return res.status(200).json({
          success: true,
          data: updatedPassword,
          message: 'Password updated'
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



  // For Admin only
  static async getAllProfiles(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let { count, rows } = await Profile.findAndCountAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] } // remove attr password
          },
          {
            model: Tool
          }
        ],
        limit,
        offset
      })

      return res.status(200).json({
        success: true,
        data: { total: count, profiles: rows },
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
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] } // remove attr password
          },
          {
            model: Tool
          }
        ]
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

      if (username) {
        // check if username already exists on others ID
        const usernameExists = await Profile.findOne({
          where: {
            username,
            id: {
              [Op.ne]: id
            }
          }
        })

        if (usernameExists) {
          return res.status(409).json({
            success: false,
            data: null,
            message: `Username already exists.`
          })
        }
      }

      const updatedUser = { username, imageUrl, fullname, dateOfBirth }
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
        include: [
          {
            model: User,
            required: false // LEFT JOIN: include Profiles even its have no Users
          },
          {
            model: Tool
          }
        ],
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
        data: { total: count, profiles: rows },
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