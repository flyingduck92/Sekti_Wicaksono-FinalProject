const ProfileRoutes = require('express').Router()
const { ProfileController } = require('../controllers')

// specific routes first
// ProfileRoutes.post('/create', ProfileController.addProfile)
ProfileRoutes.get('/search', ProfileController.searchProfile)
ProfileRoutes.put('/update/:id', ProfileController.updateProfile)
ProfileRoutes.delete('/delete/:id', ProfileController.deleteProfile)

// less specific routes
ProfileRoutes.get('/', ProfileController.getAllProfiles)
ProfileRoutes.get('/:id', ProfileController.getOneProfile)

module.exports = ProfileRoutes