const ProfileRoutes = require('express').Router()
const { ProfileController } = require('../controllers')
const { authentication } = require('../middlewares/auth')
const { adminOnly } = require('../middlewares/authorization')

ProfileRoutes.use(authentication) // protect routes from here

// My Profile (staff and admin)
ProfileRoutes.get('/me', ProfileController.getMyProfile)
ProfileRoutes.put('/me/update/:id', ProfileController.updateMyProfile)
ProfileRoutes.put('/me/email/:id', ProfileController.updateMyEmail)
ProfileRoutes.put('/me/password/:id', ProfileController.updateMyPassword)

// specific routes first
// Only Admin has permission
ProfileRoutes.get('/search', adminOnly, ProfileController.searchProfile)
ProfileRoutes.put('/update/:id', adminOnly, ProfileController.updateProfile)
ProfileRoutes.delete('/delete/:id', adminOnly, ProfileController.deleteProfile)

// less specific routes
ProfileRoutes.get('/', adminOnly, ProfileController.getAllProfiles)
ProfileRoutes.get('/:id', adminOnly, ProfileController.getOneProfile)

module.exports = ProfileRoutes