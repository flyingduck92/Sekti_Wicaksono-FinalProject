const UserRoutes = require('express').Router()
const { UserController } = require('../controllers')

UserRoutes.get('/', UserController.getAllUsers)
UserRoutes.get('/:id', UserController.getOneUser)
UserRoutes.post('/create', UserController.addUser)
UserRoutes.put('/update/:id', UserController.updateUser)
UserRoutes.delete('/delete/:id', UserController.deleteUser)

module.exports = UserRoutes