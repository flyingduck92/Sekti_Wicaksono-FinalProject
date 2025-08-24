const ToolRoutes = require('express').Router()
const { ToolController } = require('../controllers')

ToolRoutes.get('/', ToolController.getAllTools)
ToolRoutes.get('/:id', ToolController.getOneTool)
ToolRoutes.post('/create', ToolController.addTool)
ToolRoutes.put('/update/:id', ToolController.updateTool)
ToolRoutes.delete('/delete/:id', ToolController.deleteTool)

module.exports = ToolRoutes