const bcrypt = require('bcrypt')
const saltRound = 10

const encryptPwd = (data) => {
  const encrypted = bcrypt.hashSync(data, saltRound)
  return encrypted
}

const decryptPwd = (data, hashPwd) => {
  const decrypted = bcrypt.compareSync(data, hashPwd)
  return decrypted
}

module.exports = {
  encryptPwd,
  decryptPwd
}