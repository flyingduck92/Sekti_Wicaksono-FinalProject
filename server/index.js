const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.port || 3000

app.listen(port, console.log(`App listen at http://localhost:${port}`))
