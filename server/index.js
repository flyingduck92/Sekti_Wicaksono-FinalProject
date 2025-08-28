const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const mainApiRoutes = require('./routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

// mainAPI 
app.use(mainApiRoutes)

app.listen(port, () => console.log(`App listen at http://localhost:${port}`))