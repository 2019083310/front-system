# 基于NodeJs实现的前后端分离项目总结(二)

### 项目地址：https://github.com/2019083310/lagou-admin

### 三、职位列表接口开发

#### 1.获取职位列表

路由:

```javascript
//获取职位列表
router.get('/list',list)
```

Controllers中的positions.js

```javascript
const positionsModel=require('../models/positions')
const moment=require('moment')
//获取职位列表
exports.list=async (req,res,next)=>{
  const result=await positionsModel.list()
  if(result){
    res.json(result)
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'获取数据失败!'
      })
    })
  }
}
```

models中的positions.js

```javascript
const {Positions}=require('../utils/db')

//获取职位列表
exports.list=()=>{
  return Positions.find()
}
```

#### 2.添加职位

​	这里添加职位就很麻烦了，因为添加的内容中有图片的上传操作，那么图片的上传怎么传给服务端呢，这里用到了非常重要的第三方中间件multer，这个中间件就可以帮助我们识别multer形式的表单结构，这样服务端接收到的就是二进制的数据了。

​	在middleware文件夹下新建upload.js

```javascript
const path=require('path')
const multer=require('multer')
const mime=require('mime')//mime这个中间件是用来获取上传的文件的格式
const fs=require('fs')

//定义存储位置和扩展名
const storage=multer.diskStorage({
  destination(req,file,cb){
    cb(null,path.join(__dirname,'../public/uploads'))
  },
  filename(req,file,cb){
    let ext=mime.getExtension(file.mimetype)//获取扩展名
    let filename=file.fieldname+'-'+Date.now()+'.'+ext
    cb(null,filename)
  }
})

//定义文件大小限制和数量限制
const limits={
  fileSize:200000,//相当于200kb
  files:1//允许上传的文件数量
}

//定义内容限制
const fileFilter=(req,file,cb)=>{
  // 这个函数应该调用 `cb` 用boolean值来
  // 指示是否应接受该文件

  const acceptType=[
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
  ]
  if(!acceptType.includes(file.mimetype)){
    //如果有问题，你可以总是发送一个错误
    cb(new Error('文件类型应该是.png,.jpg,gif'))
  }else{
    //接受这个文件
    cb(null,true)
  }
}

//调用multer
const upload=multer({
  storage,
  limits,
  fileFilter
}).single('companyLogo')

//定义这个upload路径的中间件处理函数
const uploadMiddleware=async (req,res,next)=>{
  upload(req,res,(err)=>{
    if(err instanceof multer.MulterError){
      res.render('fail',{
        data:JSON.stringify({
          message:'文件超出2000k'
        })
      })
    }else if(err){
      res.render('fail',{
        data:JSON.stringify({
          message:err.message
        })
      })
    }else{
      	const {companyLogo_old}=req.body
        if(!req.file){
          req.companyLogo=companyLogo_old
          next()
        }else{
          req.companyLogo=req.file.filename
          next()
        }    
      // }
      // next()
    }
  })
}

module.exports=uploadMiddleware
//接下来我们就可以正常进行添加职位的操作了
```

路由:

```javascript
//添加职位列表
router.post('/add',uploadMiddleware,add)
```

Controllers中的positions.js

```javascript
const positionsModel=require('../models/positions')
const moment=require('moment')

//添加职位
exports.add=async (req,res,next)=>{
  // console.log(req.body)
  res.set('Content-Type','application/json;charset=utf-8')
  const result= await positionsModel.add({
    ...req.body,
    companyLogo:req.companyLogo,
    createTime:moment().format('YYYY年MM月DD日 HH:mm:ss')//moment是一个时间格式化工具
  })
  if(result){
    res.render('succ',{
      data:JSON.stringify({
        message:'职位添加成功!'
      })
    })
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'职位添加失败!'
      })
    })
  }
}

```

models中的positions.js

```javascript
const {Positions}=require('../utils/db')

//添加职位
exports.add=(data)=>{
  return new Positions(data).save()
}
```

#### 3.编辑职位信息

路由:

```javascript
//修改职位信息
router.patch('/update',uploadMiddleware,update)
```

Controllers中的positions.js

```javascript
const positionsModel=require('../models/positions')
const moment=require('moment')

//更新职位列表
exports.update=async (req,res,next)=>{
  res.set('Content-Type','application/json;charset=utf-8')
  const data={
    ...req.body
  }
  if(req.companyLogo){
    data['companyLogo']=req.companyLogo
  }
  let result=await positionsModel.update(data)

  if(result){
    res.render('succ',{
      data:JSON.stringify({
        message:"职位编辑成功!"
      })
    })
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'职位编辑失败!'
      })
    })
  }
}
```

models中的positions.js

```javascript
const {Positions}=require('../utils/db')

//更新职位
exports.update=(data)=>{
  return Positions.findByIdAndUpdate(data.id,data)
}
```

#### 4.删除职位

路由:

```javascript
//删除职位
router.delete('/remove',remove)
```

Controllers中的positions.js

```javascript
const positionsModel=require('../models/positions')
const moment=require('moment')

//删除职位
exports.remove=async (req,res,next)=>{
  res.set('content-type', 'application/json; charset=utf-8')
  const {id}=req.body
  //console.log(req.body)
  const result=await positionsModel.remove(id)
  console.log(result)
  try{
    if(result.deletedCount>0){
      res.render('succ',{
        data:JSON.stringify({
          message:'职位删除成功！'
        })
      })
    }else{
      res.render('fail',{
        data:JSON.stringify({
          message:'删除职位失败!'
        })
      })
    }
  }catch(e){
    res.render('fail',{
      data:JSON.stringify({
        message:'删除职位失败!'
      })
    })
  }
}

```

models中的positions.js

```javascript
const {Positions}=require('../utils/db')

//删除职位
exports.remove=(id)=>{
  return Positions.deleteOne({_id:id})
}

```

#### 5.获取要修改的职位列表信息

路由:

```javascript
//获取要修改的职位列表的数据
router.post('/listone',listone)
```

Controllers中的positions.js

```javascript
const positionsModel=require('../models/positions')
const moment=require('moment')

//获取职位列表
exports.list=async (req,res,next)=>{
  const result=await positionsModel.list()
  if(result){
    res.json(result)
  }else{
    res.render('fail',{
      data:JSON.stringify({
        message:'获取数据失败!'
      })
    })
  }
}
```

models中的positions.js

```javascript
const {Positions}=require('../utils/db')

//获取职位列表
exports.list=()=>{
  return Positions.find()
}
```

