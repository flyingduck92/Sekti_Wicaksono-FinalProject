const { verifierToken } = require('../utils/jwt')
const { User, Profile } = require('../models')

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers
    if (!access_token) {
      return res.status(401).json({
        success: false,
        message: `Access token required`
      })
    }

    const payload = verifierToken(access_token)
    const user = await User.findByPk(payload.id, { include: Profile })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Invalid token`
      })
    }

    // data on loggedIn 
    req.user = {
      id: user.id,
      email: user.email,
      role: user.Profile.role,
      profileId: user.Profile.id,
    }
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: `Invalid or expired token`
    })
  }
}

module.exports = { authentication }