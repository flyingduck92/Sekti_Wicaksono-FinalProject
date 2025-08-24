class ProfileController {
  static async getAllProfiles(req, res) {
    res.json({ message: 'Get all Profiles!!!' })
  }

  static async getOneProfile(req, res) {
    res.json({ message: 'Get a single Profile!!!' })
  }

  static async addProfile(req, res) {
    res.json({ message: 'Add a single Profile!!!' })
  }

  static async updateProfile(req, res) {
    res.json({ message: 'Update a single Profile!!!' })

  }
  static async deleteProfile(req, res) {
    res.json({ message: 'Delete a single Profile!!!' })
  }

}

module.exports = ProfileController