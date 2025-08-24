
const mainApiRoutes = require('express').Router()
const base = '/api'

const toolRoutes = require('./tool')

// base API
mainApiRoutes.get(`${base}`, function (req, res) {
  res.json({ message: 'Main API routes' })
})

mainApiRoutes.use(`${base}/tool`, toolRoutes)

module.exports = mainApiRoutes