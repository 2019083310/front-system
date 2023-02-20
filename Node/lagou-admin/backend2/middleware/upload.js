const path=require('path')
const multer=require('multer')
const mime=require('mime')
const fs=require('fs')

//定义存储位置和扩展名
const storage=multer.diskStorage({
  destination(req,file,cb){
    cb(null,path.join(__dirname,'../public/uploads'))
  },
  filename(req,file,cb){
    let ext=mime.getExtension(file.mimetype)
    let filename=file.fieldname+'-'+Date.now()+'.'+ext
    cb(null,filename)
  }
})

//定义文件大小限制和数量限制
const limits={
  fileSize:200000,
  files:1
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
      // if(req.file&&companyLogo_old){
      //   try{
      //     fs.unlinkSync(path.join(__dirname,`../public/uploads/${companyLogo_old}`))
      //     req.companyLogo=req.file.companyLogo
      //     next()
      //   }catch(e){
      //     res.render('succ', {
      //       data: JSON.stringify({
      //         message: '删除文件失败。'
      //       })
      //     })
      //   }
      // }
      // // }else if(!req.file&&companyLogo_old){
      // //   req.companyLogo=companyLogo_old
      // //   next()
      // // }else{
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
