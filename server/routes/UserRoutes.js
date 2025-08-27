const UserRoutes = require('express').Router()
const { UserController } = require('../controllers')

// specific routes first
UserRoutes.get('/search', UserController.searchUser)
UserRoutes.post('/login', UserController.loginUser)
UserRoutes.post('/create', UserController.addUser)
UserRoutes.put('/update/:id', UserController.updateUser)
UserRoutes.delete('/delete/:id', UserController.deleteUser)

// less specific routes
UserRoutes.get('/', UserController.getAllUsers)
UserRoutes.get('/:id', UserController.getOneUser)

module.exports = UserRoutes