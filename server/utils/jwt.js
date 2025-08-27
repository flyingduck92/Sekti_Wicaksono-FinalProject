const jwt = require('jsonwebtoken')
const secretCode = 'coursenet2025'

const generateToken = (data) => {
  const { id, username, email, image } = data

  const token = jwt.sign(
    {
      // payload
      id, username, email, image
    },
    secretCode
  )

  return token
}

const verifierToken = (data) => {
  const verifiedToken = jwt.verify(data, secretCode)

  return verifiedToken
}

module.exports = {
  generateToken,
  verifierToken
}