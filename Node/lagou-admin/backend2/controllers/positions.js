const positionsModel=require('../models/positions')
const moment=require('moment')

//添加职位
exports.add=async (req,res,next)=>{
  // console.log(req.body)
  res.set('Content-Type','application/json;charset=utf-8')
  const result= await positionsModel.add({
    ...req.body,
    companyLogo:req.companyLogo,
    createTime:moment().format('YYYY年MM月DD日 HH:mm:ss')
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

//删除职位
exports.remove=async (req,res,next)=>{
  res.set('content-type', 'application/json; charset=utf-8')
  const {id}=req.body
  console.log(req.body)
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

exports.listone = async (req, res, next) => {
  let result = await positionsModel.listone(req.body.id)
  if (result) {
    res.json(result)
  } else {
    res.render('fail', {
      data: JSON.stringify({
        message: '获取数据失败。'
      })
    })
  }
}

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