const { Op } = require('sequelize')
const { Tool, Category, Profile } = require('../models')

class ToolController {
  static async getAllTools(req, res) {
    try {
      // pagination
      const limit = Number(req.query.limit) || 10
      const offset = Number(req.query.offset) || 0

      let { count, rows } = await Tool.findAndCountAll({
        include: [Profile, Category],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({
        success: true,
        data: { total: count, tools: rows },
        message: "Tools fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async getOneTool(req, res) {
    try {
      const id = req.params.id

      let result = await Tool.findOne({
        where: { id },
        include: [Profile, Category]
      })
      if (!result) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Tool ID not found.'
        })
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: "Tool fetch success"
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async addTool(req, res) {
    try {
      const { code, name, price, stock, imageUrl, CategoryId, ProfileId } = req.body

      // check email exists
      let toolExists = await Tool.findOne({ where: { code } })
      if (toolExists) {
        return res.status(409).json({
          success: false,
          data: null,
          message: 'Tool code already exists.'
        })
      }

      let tool = await Tool.create({ code, name, price, stock, imageUrl, CategoryId, ProfileId })
      return res.status(201).json({
        success: true,
        data: tool,
        message: 'Tool created.'
      })

    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }
  }

  static async updateTool(req, res) {
    try {
      const id = req.params.id
      const { code, name, price, stock, imageUrl, CategoryId, ProfileId } = req.body

      const updatedUser = {
        code, name, price, stock, imageUrl, CategoryId, ProfileId
      }

      let [result] = await Tool.update(updatedUser, { where: { id } })
      if (result === 0) {
        // if ID not found when update
        return res.status(404).json({
          success: false,
          data: null,
          message: `Tool ${id} not found!`
        })
      }

      const updatedTool = await Tool.findOne({
        where: { id },
        include: [Profile, Category]
      })

      return res.status(200).json({
        success: true,
        data: updatedTool,
        message: `Tool ${id} updated!`
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message
      })
    }

  }
  static async deleteTool(req, res) {
    try {
      const id = req.params.id
      let result = await Tool.destroy({ where: { id } })

      if (result) {
        return res.status(200).json({
          success: true,
          data: { id },
          message: `Tool ${id} has been deleted!`
        })
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: `Tool ${id} not found!`
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

  static async searchTool(req, res) {
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
      let { count, rows } = await Tool.findAndCountAll({
        include: [Profile, Category],
        where: {
          [Op.or]: [
            { code: { [Op.like]: `%${searchQuery}%` } }, // Tool.code
            { name: { [Op.like]: `%${searchQuery}%` } }, // Tool.name
          ]
        },
        limit,
        offset,
      })

      return res.status(200).json({
        success: true,
        data: { total: count, tools: rows },
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

module.exports = ToolController