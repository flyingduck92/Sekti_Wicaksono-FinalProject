const toolRoutes = require('express').Router()

toolRoutes.get('/', function (req, res) {
  res.json({ message: 'Get all tools' })
})

module.exports = toolRoutes