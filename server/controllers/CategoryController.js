const { Category } = require('../models')

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let { count, rows } = await Category.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({
        success: true,
        data: { total: count, categories: rows },
        message: "Category fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async getOneCategory(req, res) {
    try {
      const id = req.params.id

      let result = await Category.findByPk(id)
      if (!result) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Category ID not found.'
        })
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: "Category fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async addCategory(req, res) {
    try {
      const { name } = req.body
      if (!name) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Category name is required.'
        })
      }

      // create category
      let category = await Category.create({ name })
      return res.status(201).json({
        success: true,
        data: category,
        message: 'A brand new category created!'
      })

    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async updateCategory(req, res) {
    try {
      const id = req.params.id
      const { name } = req.body

      const updatedName = { name }

      let [result] = await Category.update(updatedName, { where: { id } })
      console.log(result)
      if (result === 0) {
        // if ID not found when update
        return res.status(404).json({
          success: false,
          data: null,
          message: `Category ${id} not found!`
        })
      }

      return res.status(200).json({
        success: true,
        data: { id, name },
        message: `Category ${id} updated!`
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async deleteCategory(req, res) {
    try {
      const id = req.params.id
      let result = await Category.destroy({ where: { id } })

      if (result) {
        return res.status(200).json({
          success: true,
          data: { id },
          message: `Category ${id} has been deleted!`
        })
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: `Category ${id} not found!`
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

}

module.exports = CategoryController