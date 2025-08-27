const { User, Profile, sequelize } = require('../models')
const { encryptPwd, decryptPwd } = require('../utils/bcrypt')

class UserController {
  static async getAllUsers(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let result = await User.findAll({
        attributes: { exclude: ['password'] }, // remove attr password
        include: [Profile],
        limit,
        offset
      })

      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  }

  static async getOneUser(req, res) {
    try {
      const id = +req.params.id
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid User ID.' })
      }

      let result = await User.findOne({
        where: { id },
        include: [Profile]
      })
      if (!result) {
        return res.status(404).json({ message: 'User ID not found.' })
      }

      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ message: err.message })
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
        return res.status(409).json({ message: 'Email already exists.' })
      }

      // encrypt password 
      let encrypted = await encryptPwd(password)
      // creat user with encrypted password
      let user = await User.create({ email, password: encrypted }, { transaction })
      // create profile
      let profile = await Profile.create({ UserId: user.id }, { transaction })

      await transaction.commit()
      res.status(201).json({ message: 'User created!' })
    } catch (err) {
      await transaction.rollback()
      return res.status(500).json({ message: err.message })
    }
  }

  static async updateUser(req, res) {
    try {
      const id = +req.params.id
      const { email, password } = req.body

      let encryptedPwd = await encryptPwd(password)

      const updatedUser = {
        email,
        password: encryptedPwd
      }

      let [result] = await User.update(updatedUser, { where: { id } })
      return res.status(201).json({ message: `User ${id} updated!` })

    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  }
  static async deleteUser(req, res) {
    try {
      const id = +req.params.id
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid User ID.' })
      }

      let result = await User.destroy({ where: { id } })

      if (result) {
        return res.status(200).json({ message: `User ${id} has been deleted!` })
      } else {
        return res.status(404).json({ message: `User ${id} not found!` })
      }

    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  }

}

module.exports = UserController