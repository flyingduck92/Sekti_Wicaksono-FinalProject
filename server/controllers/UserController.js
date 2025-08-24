class UserController {
  static async getAllUsers(req, res) {
    res.json({ message: 'Get all Users!!!' })
  }

  static async getOneUser(req, res) {
    res.json({ message: 'Get a single User!!!' })
  }

  static async addUser(req, res) {
    res.json({ message: 'Add a single User!!!' })
  }

  static async updateUser(req, res) {
    res.json({ message: 'Update a single User!!!' })

  }
  static async deleteUser(req, res) {
    res.json({ message: 'Delete a single User!!!' })
  }

}

module.exports = UserController