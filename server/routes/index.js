const mainApiRoutes = require('express').Router()
const base = '/api'

const CategoryRoutes = require('./CategoryRoutes')
const ToolRoutes = require('./ToolRoutes')
const UserRoutes = require('./UserRoutes')
const ProfileRoutes = require('./ProfileRoutes')

// base API
mainApiRoutes.get(`${base}`, function (req, res) {
  res.json({ message: 'Main API routes' })
})

mainApiRoutes.use(`${base}/category`, CategoryRoutes)
mainApiRoutes.use(`${base}/tool`, ToolRoutes)
mainApiRoutes.use(`${base}/user`, UserRoutes)
mainApiRoutes.use(`${base}/profile`, ProfileRoutes)

module.exports = mainApiRoutes