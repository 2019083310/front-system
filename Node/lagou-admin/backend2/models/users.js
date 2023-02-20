const {Users}=require('../utils/db')

//查询用户
const findUser=(username)=>{
  return Users.findOne({username})
}

//注册用户
const signup=({username,password})=>{
  return new Users({
    username,
    password
  }).save()
}
//获取用户列表
const findList=()=>{
  return Users.find().sort({_id:-1})
}

//删除用户
const remove=(id)=>{
  return Users.deleteOne({_id:id})
}

module.exports={
  findUser,
  signup,
  findList,
  remove
}