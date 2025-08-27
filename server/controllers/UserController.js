const { Op } = require('sequelize')
const { User, Profile, sequelize } = require('../models')
const { encryptPwd, decryptPwd } = require('../utils/bcrypt')
const { generateToken } = require('../utils/jwt')

class UserController {
  static async getAllUsers(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password'] }, // remove attr password
        include: [Profile],
        limit,
        offset
      })

      return res.status(200).json({
        success: true,
        data: { total: count, users: rows },
        message: "Users fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async getOneUser(req, res) {
    try {
      const id = req.params.id

      let result = await User.findOne({
        where: { id },
        include: [Profile]
      })
      if (!result) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'User ID not found.'
        })
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: "User fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async addUser(req, res) {
    // transaction open
    const transaction = await sequelize.transaction()

    try {
      const { email, password } = req.body

      // check email exists
      let emailExists = await User.findOne({ where: { email }, transaction })
      if (emailExists) {
        await transaction.rollback()
        return res.status(409).json({
          success: false,
          data: null,
          message: 'Email already exists.'
        })
      }

      // encrypt password 
      let encrypted = await encryptPwd(password)
      // creat user with encrypted password
      let user = await User.create({ email, password: encrypted }, { transaction })
      // create profile
      let profile = await Profile.create({ UserId: user.id }, { transaction })

      await transaction.commit()
      return res.status(201).json({
        success: true,
        data: { id: user.id, email: user.email },
        message: 'User created!'
      })

    } catch (err) {
      await transaction.rollback()
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async updateUser(req, res) {
    try {
      const id = req.params.id
      const { email, password } = req.body

      let encryptedPwd = await encryptPwd(password)

      const updatedUser = {
        email,
        password: encryptedPwd
      }

      let [result] = await User.update(updatedUser, { where: { id } })
      if (result === 0) {
        // if ID not found when update
        return res.status(404).json({
          success: false,
          data: null,
          message: `User ${id} not found!`
        })
      }

      return res.status(200).json({
        success: true,
        data: { id, email },
        message: `User ${id} updated!`
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = req.params.id
      let result = await User.destroy({ where: { id } })

      if (result) {
        return res.status(200).json({
          success: true,
          data: { id },
          message: `User ${id} has been deleted!`
        })
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: `User ${id} not found!`
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

  // static async searchUser(req, res) {
  //   try {
  //     // searchquery and pagination
  //     const searchQuery = req.query.search
  //     const limit = Number(req.query.limit) || 10
  //     const offset = Number(req.query.offset) || 0

  //     if (!searchQuery) {
  //       return res.status(400).json({
  //         success: false,
  //         data: null,
  //         message: 'Missing search query'
  //       })
  //     }

  //     // search at User and Profile Table 
  //     const { count, rows } = await User.findAndCountAll({
  //       attributes: { exclude: ['password'] },
  //       include: [{
  //         model: Profile,
  //         required: false // LEFT JOIN: include Users even its have no Profile
  //       }],
  //       where: {
  //         [Op.or]: [
  //           { email: { [Op.like]: `%${searchQuery}%` } }, // User.email
  //           { '$Profile.username$': { [Op.like]: `%${searchQuery}%` } }, // Profile.username
  //           { '$Profile.fullname$': { [Op.like]: `%${searchQuery}%` } }, // Profile.fullname
  //         ]
  //       },
  //       limit,
  //       offset
  //     })

  //     return res.status(200).json({
  //       success: true,
  //       data: { total: count, users: rows },
  //       message: "Search complete"
  //     })
  //   } catch (err) {
  //     return res.status(500).json({
  //       success: false,
  //       data: null,
  //       message: err.message
  //     })
  //   }
  // }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body

      let userFound = await User.findOne({ where: { email } })
      if (userFound) {
        if (await decryptPwd(password, userFound.password)) {
          // valid user
          // return res.status(200).json({ message: 'Valid User!' })

          const access_token = generateToken(userFound)
          return res.status(200).json({
            success: true,
            data: { access_token },
            message: 'User Logged-in!'
          })

        } else {
          return res.status(409).json({
            success: false,
            data: null,
            message: 'Invalid password!'
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Email not found!'
        })
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

}

module.exports = UserController