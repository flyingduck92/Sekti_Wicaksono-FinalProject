const ProfileRoutes = require('express').Router()
const { ProfileController } = require('../controllers')

ProfileRoutes.get('/', ProfileController.getAllProfiles)
ProfileRoutes.get('/:id', ProfileController.getOneProfile)
ProfileRoutes.post('/create', ProfileController.addProfile)
ProfileRoutes.put('/update/:id', ProfileController.updateProfile)
ProfileRoutes.delete('/delete/:id', ProfileController.deleteProfile)

module.exports = ProfileRoutes