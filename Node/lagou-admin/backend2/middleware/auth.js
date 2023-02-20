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