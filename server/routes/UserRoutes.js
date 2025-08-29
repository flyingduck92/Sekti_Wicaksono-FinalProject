const UserRoutes = require('express').Router()
const { UserController } = require('../controllers')
const { authentication } = require('../middlewares/auth')
const { adminOnly } = require('../middlewares/authorization')

// for login and register
UserRoutes.post('/login', UserController.loginUser)
UserRoutes.post('/create', UserController.addUser)

UserRoutes.use(authentication) // protect routes from here

// Admin Only
// UserRoutes.get('/search', adminOnly, UserController.searchUser)
UserRoutes.post('/add', UserController.addUser)
UserRoutes.put('/update/:id', adminOnly, UserController.updateUser)
UserRoutes.delete('/delete/:id', adminOnly, UserController.deleteUser)

// less specific routes
UserRoutes.get('/', adminOnly, UserController.getAllUsers)
UserRoutes.get('/:id', adminOnly, UserController.getOneUser)

// Admin Only
// /api/user/update
// UserRoutes.get('/search', UserController.searchUser)
// UserRoutes.put('/update/:id', UserController.updateUser)
// UserRoutes.delete('/delete/:id', UserController.deleteUser)

// less specific routes
// UserRoutes.get('/', UserController.getAllUsers)
// UserRoutes.get('/:id', UserController.getOneUser)

module.exports = UserRoutes