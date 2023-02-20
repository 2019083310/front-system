const crypto=require('crypto')

const password='123456'
const result=crypto.createHash('md5').update(password).digest('hex')

console.log(result)