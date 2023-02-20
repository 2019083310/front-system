const express=require('express')
const app=express()

app.get('/index',(req,res)=>{
  const data=req.query
  console.log(data)
  res.send(data)
})

app.listen(8080,()=>{
  console.log('8080端口启动完毕')
})