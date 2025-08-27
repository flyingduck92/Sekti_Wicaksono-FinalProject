const CategoryRoutes = require('express').Router()
const { CategoryController } = require('../controllers')
const { authentication } = require('../middlewares/auth')

CategoryRoutes.use(authentication) // protect routes from here

CategoryRoutes.post('/create', CategoryController.addCategory)
CategoryRoutes.put('/update/:id', CategoryController.updateCategory)
CategoryRoutes.delete('/delete/:id', CategoryController.deleteCategory)
CategoryRoutes.get('/', CategoryController.getAllCategories)
CategoryRoutes.get('/:id', CategoryController.getOneCategory)

module.exports = CategoryRoutes