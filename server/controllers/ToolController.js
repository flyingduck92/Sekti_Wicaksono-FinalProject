class ToolController {
  static async getAllTools(req, res) {
    res.json({ message: 'Get all tools!!!' })
  }

  static async getOneTool(req, res) {
    res.json({ message: 'Get a single tool!!!' })
  }

  static async addTool(req, res) {
    res.json({ message: 'Add a single tool!!!' })
  }

  static async updateTool(req, res) {
    res.json({ message: 'Update a single tool!!!' })

  }
  static async deleteTool(req, res) {
    res.json({ message: 'Delete a single tool!!!' })
  }

}

module.exports = ToolController