const CategoryRoutes = require('express').Router()
const { CategoryController } = require('../controllers')

CategoryRoutes.get('/', CategoryController.getAllCategories)
CategoryRoutes.get('/:id', CategoryController.getOneCategory)
CategoryRoutes.post('/create', CategoryController.addCategory)
CategoryRoutes.put('/update/:id', CategoryController.updateCategory)
CategoryRoutes.delete('/delete/:id', CategoryController.deleteCategory)

module.exports = CategoryRoutes