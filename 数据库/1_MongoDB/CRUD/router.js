const express=require('express')
const router=express.Router()
const Student=require('./student')

//渲染首页
router.get('/',(req,res)=>{
  Student.find((error,students)=>{
    if(error){
      return res.status(500).send('Server error')
    }
    res.render('index.html',{
      fruits:[
        '苹果',
        '香蕉',
        '橘子'
      ],
      students:students
    })
  })
})
//渲染添加学生页面
router.get('/students',(req,res)=>{
  res.render('new.html')
})
//处理添加学生页面
router.post('/students',(req,res)=>{
  console.log(req.body)
  new Student(req.body).save().then(()=>{
    // if(error){
    //   return res.status(500).send('Server error')
    // }
    res.redirect('/')
  })
})
//渲染编辑页面
router.get('/edit',(req,res)=>{
  console.log(req.query)
  Student.findById(req.query.id.replace(/"/g,''),(err,student)=>{
    if(err){
      console.log(err)
      return res.status(500).send('Server error')
    }
    res.render('edit.html',{
      student:student
    })
  })
})

//处理编辑请求
router.post('/edit',(req,res)=>{
  var id=req.body.id.replace(/"/g,'')
  Student.findByIdAndUpdate(id,req.body,(err)=>{
    if(err){
      return res.status(500).send('Server error')
    }
    res.redirect('/')
  })
})
//处理删除请求
router.get('/delete',(req,res)=>{
  let id=req.query.id.replace(/"/g,"");
    Student.findByIdAndRemove(id,(error)=>{
        if(error){
            return res.status(500).send('Server error')
        }
        res.redirect('/')
    })
})
module.exports=router