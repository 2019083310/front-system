# 基于NodeJs实现的前后端分离项目总结(一)

### 项目地址：https://github.com/2019083310/lagou-admin

### 一、项目架构

#### 1.项目初始化

```javascript
开发架构:
	前后端分离
准备阶段:
	首先全局安装node.js  官网地址:https://nodejs.org/en/
	项目用的是express框架,npm包管理工具    express中文网:https://www.expressjs.com.cn/
	可以用express项目生成器快速生成express框架结构   
	全局安装express生成器:npm install -g express-generator
	然后控制台执行express生成express框架
项目结构:
	本项目服务端基于Node.js采用RMVP的框架结构,即R--Router/M--Model/V--View/P(C)--Controller
backend采用的技术:
	Node.js
	Express框架(router,satatic,cookie-session,moment时间格式化)
    MongoDB数据库
    jsonwebtoken(jwt)/cookie、session
	multer图片文件的表单上传
    EJS模板(也可以用art-template,jade)
	bcrypt密码加密
    网络请求:Jquery中的AJAX(跨域:cors第三方插件)
frontend采用的技术:
	webpack前端模块化
    js模块化:CommonJs,ES Module
    js库:jQuery
    UI组件库:Bootstrap
    RMVC:art-template
	SPA:single page application
    路由:sme-router
	跨域:http-proxy-middleware
后台开发的主要接口:
	登录验证
	用户的添加、删除、获取用户列表、权限验证
    职位的添加、删除、修改、上传职位图片文件等
```

#### 2.项目结构代建

首先搭建路由模块，主要有三个路由:

```javascript
app.js中写入以下代码:
	app.use('/api/users',usersRouter)//后台管理模块的用户管理路由
	app.use('/api/positions',positionsRouter)//后台用户管理模块的职位管理路由

	app.use('/mobile',mobileRouter)//真正的上线网页上的内容获取路由
R--Router在routes文件夹下新建三个js代表三个路由的模块
```

接着连接数据库，设计数据库的表的结构

```javascript
在Node.js中对MongoDB数据库的操作需要借助第三方中间件mongoose	npm i mongoose 
在utils文件夹下新建db.js,对数据库进行连接，设计需要的表结构，并且建立集合
//连接数据库操作
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/lagou-admin',{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  // useFindAndModify: true
})
//数据库连接
mongoose.connection.on('success',()=>{
  console.log('connect success!')
})

mongoose.connection.on('error',()=>{
  console.log('connect error!')
})

//创建数据模型
const Schema=mongoose.Schema
//用户
const UsersSchema=new Schema({
  username:{
    required:true,
    type:String
  },
  password:{
    required:true,
    type:String
  }
})

//职位列表
const PositionsSchema=new Schema({
  companyName:String,
  positionName:String,
  city:String,
  createTime:String,
  salary:String,
  companyLogo: String
})

//创建集合
const Users=mongoose.model('Users',UsersSchema)
const Positions=mongoose.model('Positions',PositionsSchema)

exports.Users=Users
exports.Positions=Positions
```

接着搭建各部分所需要的数据M--Model层

​	新建文件夹models,在里面新建三个文件:users.js/positions.js/mobile.js分别对应不同的路由进行不用的数据库操作。

在搭建控制层，对相应的路由做出相应的操作，实现对应路由的功能。

最后搭建Views层，通过模板渲染，返回给客户端对应的数据结构，服务端与客户端进行通信的主要形式JSON.

### 二、功能开发

#### 1.登录注册功能

​	本项目并没有实现注册功能，而是通过先添加一个用户的形式实现登录，在登陆之后再做相应的操作，但是有拦截功能，开发完之后，会进行的登录验证，没有权限不能进项相应的操作，也不能直接进行路由跳转。

​	登录这个操作是比较相对麻烦的，因为要实现密码的加密，token的生成和携带以及验证token。

​	首先要明白登录的过程:

```javascript
客户端向服务器第一次发起登录请求（不传输用户名和密码）。
服务器利用RSA算法产生一对公钥和私钥。并保留私钥， 将公钥发送给客户端。
客户端收到公钥后， 加密用户密码，向服务器发送用户名和加密后的用户密码； 同时另外产生一对公钥和私钥，自己保留私钥, 向服务器发送公钥； 于是第二次登录请求传输了用户名和加密后的密码以及客户端生成的公钥。
服务器利用保留的私钥对密文进行解密，得到真正的密码。 经过判断， 确定用户可以登录后，生成sessionId和token， 同时利用客户端发送的公钥，对token进行加密。最后将sessionId和加密后的token返还给客户端。
客户端利用自己生成的私钥对token密文解密， 得到真正的token。
```

​	实现过程:

```javascript
通过/api/users/signin这个接口开发相应的操作，首先我们新建keys文件夹，引入RSA算法生成的两队秘钥，在utils下新建tools.js进行jsonwebtoken操作生成token及验证token的两个函数。
登录的过程首先会进行用户名的密码判断，如果正确服务端才会生成token返回给客户端。
//jwt的用法
const jwt=require('jsonwebtoken')
const fs=require('fs')
const path=require('path')

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
```

整体代码：

```javascript
const signIn=async (req,res,next)=>{
  const {username,password}=req.body

  let result=await usersModel.findUser(username)
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
```

models中users.js的部分

```javascript
const {Users}=require('../utils/db')

//查询用户
const findUser=(username)=>{
  return Users.findOne({username})
}
```

​	服务端是通过设置响应头部字段的方式把生成的token发送给客户端，客户端是通过AJAX请求成功之后，在success回调函数中通过jQuery的AJAX的API中特有的属性jqXHR,通过jqXHR.getResponseHeader('X-Access-Token')把响应字段中的token取出来，放在localstroge中。

​	那么第二次登录验证时客户端会通过AJAX把本地的token放在请求头中，服务器通过verify方法对token验证，如果正确，就可以登录，否则没有权限登录。

#### 2.权限验证

​	在服务端需要对接口进行权限控制，不能让非法用户得到数据，只有合法用户，才能请求用户权限的数据，因此设计权限验证功能。

​	只需要在用户请求的接口上，先进行权限验证验证通过之后，在执行别的操作。

```javascript
const {verify} =require('../utils/tools')

const auth=(req,res,next)=>{
  // if(req.session.username){
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
    //console.log(result)
    next()
  }catch(e){
    res.render('fail',{
      data:JSON.stringify({
        message:'请先登录!'
      })
    })
  }
}

exports.auth=auth
```

​	其次在客户端也需要权限验证，只有登陆之后才能跳转到其他功能界面。

```javascript
//权限验证后端接口
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

//客户端路由限制
router.use(async (req, res, next) => {
  // 第一个打开的页面
  let result = await authModel()
  if(result.ret) {
    router.go(req.url)
  } else {
    router.go('/signin')
  }
})
```

#### 3.添加用户功能

​	用户注册就是通过对应的路由，服务端收到post请求之后，对密码进行加密，把加密后的数据存储在数据库中，客户端通过调用接口得到数据把界面呈现在用户面前。

路由:

```javascript
//注册
router.post('/', auth,signup);
```

Controllers中的users.js

```javascript
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
```

models中的users.js

```javascript
//注册用户
const signup=({username,password})=>{
  return new Users({
    username,
    password
  }).save()
}
```

#### 4.获取用户列表

路由：

```javascript
//获取用户列表
router.get('/', auth,list)
```

Controllers中的users.js

```javascript
//获取用户列表
const list=async (req,res,next)=>{
  res.set('Content-Type','application/json;charset=utf-8')
  const listResult=await usersModel.findList()
  res.render('succ',{
    data:JSON.stringify(listResult)
  })
}
```

models中的uers.js

```javascript
//获取用户列表
const findList=()=>{
  return Users.find().sort({_id:-1})
}
```

#### 5.删除用户

路由:

```javascript
//删除用户
router.delete('/',auth, remove)
```

Controllers中的uers.js

```javascript
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
```

models中的uers.js

```javascript
//删除用户
const remove=(id)=>{
  return Users.deleteOne({_id:id})
}
```

#### 6.退出用户

路由:

```javascript
//退出
router.get('/signout',auth,signout)
```

Controllers中的uers.js

```javascript
//退出账户
const signout=(req,res,next)=>{
  req.session=null;
  res.render('succ',{
    data:JSON.stringify({
      message:"成功退出登录!"
    })
  })
}
```