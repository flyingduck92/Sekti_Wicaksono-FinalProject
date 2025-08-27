const ToolRoutes = require('express').Router()
const { ToolController } = require('../controllers')

ToolRoutes.post('/create', ToolController.addTool)
ToolRoutes.put('/update/:id', ToolController.updateTool)
ToolRoutes.delete('/delete/:id', ToolController.deleteTool)

ToolRoutes.get('/', ToolController.getAllTools)
ToolRoutes.get('/:id', ToolController.getOneTool)

module.exports = ToolRoutes