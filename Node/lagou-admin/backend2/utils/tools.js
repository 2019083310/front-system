// const bcrypt=require('bcrypt')
//jwt的用法
const jwt=require('jsonwebtoken')
const fs=require('fs')
const path=require('path')

//密码加密
exports.hash=(myPlaintextPassword)=>{
  return new Promise((resolve,reject)=>{
    bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
      if (err) {
        reject(err)
      }
      resolve(hash)
    })
  })
}

//生成token
exports.sign=(username)=>{
  const privateKey=fs.readFileSync(path.join(__dirname,'../keys/rsa_private_key.pem'))
  const token=jwt.sign({username},privateKey,{algorithm:'RS256'})
  return token
}

//解密验证
exports.verify=(token)=>{
  const publicKey=fs.readFileSync(path.join(__dirname,'../keys/rsa_public_key.pem'))
  const result=jwt.verify(token,publicKey)
  return result
}