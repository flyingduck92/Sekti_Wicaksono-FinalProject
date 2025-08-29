const ToolRoutes = require('express').Router()
const { ToolController } = require('../controllers')
const { authentication } = require('../middlewares/auth')

// only update/delete his/her own Tool
const { staffOrOwner } = require('../middlewares/authorization')
const { Tool } = require('../models')

ToolRoutes.use(authentication) // protect routes from here

// staff and admin can create/search/get
// /api/tool/create
// ToolRoutes.post('/search', ToolController.searchTool)
ToolRoutes.post('/create', ToolController.addTool)
ToolRoutes.get('/', ToolController.getAllTools)
ToolRoutes.get('/:id', ToolController.getOneTool)

// only admin or owner can update/delete
ToolRoutes.put('/update/:id', staffOrOwner(Tool), ToolController.updateTool)
ToolRoutes.delete('/delete/:id', staffOrOwner(Tool), ToolController.deleteTool)

module.exports = ToolRoutes