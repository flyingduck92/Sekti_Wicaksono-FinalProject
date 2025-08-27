const bcrypt = require('bcrypt')
const saltRound = 10

const encryptPwd = async (data) => {
  const encrypted = await bcrypt.hashSync(data, saltRound)
  return encrypted
}

const decryptPwd = async (data, hashPwd) => {
  const decrypted = await bcrypt.compareSync(data, hashPwd)
  return decrypted
}

module.exports = {
  encryptPwd,
  decryptPwd
}