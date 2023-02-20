const usersModel = require('../models/users')
const { Users } = require('../utils/db')
const {
  sign,verify
} = require('../utils/tools')

//注册用户
const signup = async (req, res, next) => {
  res.set('Content-Type', 'application/json;charset=utf-8')
  const {
    username,
    password
  } = req.body

  // 密码加密
  // const bcryptPassword = await hash(password)

  //判断用户是否存在
  let findResult = await usersModel.findUser(username)
  if (findResult) {
    res.render('fail', {
      data: JSON.stringify({
        message: '用户名已存在!'
      })
    })
  } else {
    //数据库里没有这个用户，开始添加
    let result = await usersModel.signup({
      username,
      password
    })

    res.render('succ', {
      data: JSON.stringify({
        message: '注册成功!'
      })
    })
  }
}

//用户登录
const signIn=async (req,res,next)=>{
  const {username,password}=req.body

  let result=await usersModel.findUser(username)
  // console.log(result)
  //验证用户是否为合法用户
  if(result){
    if(result.password===password){
      // console.log(req.session)
      // req.session.username=username
      const token=sign(username)
      res.set('Access-Control-Expose-Headers', 'X-Access-Token')
      res.set('X-Access-Token',token)
      res.render('succ',{
        data:JSON.stringify({username})
      })
    }else{
      res.render('fail',{
        data:JSON.stringify({
          message:'用户名或密码错误!'
        })
      })
    }
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'用户名或密码错误!'
      })
    })
  }
}

//获取用户列表
const list=async (req,res,next)=>{
  res.set('Content-Type','application/json;charset=utf-8')
  const listResult=await usersModel.findList()
  res.render('succ',{
    data:JSON.stringify(listResult)
  })
}
//删除用户
const remove=async (req,res,next)=>{
  res.set('Content-Type','application/json;charset=utf-8')
  const {id}=req.body
  let result=await usersModel.remove(id)
  if(result){
    res.render('succ',{
      data:JSON.stringify({
        message:'用户删除成功!'
      })
    })
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'用户删除失败!'
      })
    })
  }
}

//退出账户
const signout=(req,res,next)=>{
  req.session=null;
  res.render('succ',{
    data:JSON.stringify({
      message:"成功退出登录!"
    })
  })
}

//权限验证
const isAuth=(req,res,next)=>{
  // if(req.session.username){
  //   res.render('succ',{
  //     data:JSON.stringify({
  //       message:'验证通过'
  //     })
  //   })
  //   // res.send('ok')
  //   next()
  // }else{
  //   res.render('fail',{
  //     data:JSON.stringify({
  //       message:'请先登录!'
  //     })
  //   })
  // }
  const token=req.get('X-Access-Token')
  try{
    const result=verify(token)
    res.render('succ', {
      data: JSON.stringify({
        username: result.username
      })
    })
  }catch(e){
    res.render('fail',{
      data:JSON.stringify({
        message:'请先登录!'
      })
    })
  }
}

exports.signup = signup
exports.list=list
exports.remove=remove
exports.signIn=signIn
exports.isAuth=isAuth
exports.signout=signout