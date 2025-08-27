const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: `Only Admin can access this.`
    })
  }
  next()
}

const staffOrOwner = (model, foreignKey = 'ProfileId') => {

  return async (req, res, next) => {
    if (req.user.role === 'admin') return next()

    const id = req.params.id
    const record = await model.findByPk(id)
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Record not found.`
      })
    }
    if (record[foreignKey] !== req.user.profileId) {
      return res.status(404).json({
        success: false,
        message: `Forbidden: You're not the owner of this record.`
      })
    }

  }
}

module.exports = { adminOnly, staffOrOwner }