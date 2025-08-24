class CategoryController {
  static async getAllCategories(req, res) {
    res.json({ message: 'Get all categories!!!' })
  }

  static async getOneCategory(req, res) {
    res.json({ message: 'Get a single category!!!' })
  }

  static async addCategory(req, res) {
    res.json({ message: 'Add a single category!!!' })
  }

  static async updateCategory(req, res) {
    res.json({ message: 'Update a single category!!!' })

  }
  static async deleteCategory(req, res) {
    res.json({ message: 'Delete a single category!!!' })
  }

}

module.exports = CategoryController