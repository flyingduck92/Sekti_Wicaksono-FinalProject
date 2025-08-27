const jwt = require('jsonwebtoken')
const secretCode = process.env.JWT_SECRET

const generateToken = (data) => {
  // store this attributes for login token
  const { id, email, role, profileId } = data

  // payload
  const token = jwt.sign(
    { id, email, role, profileId },
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