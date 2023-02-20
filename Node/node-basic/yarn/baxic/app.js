const express=require('express')
const app=express()

app.get('/',(req,res)=>{
  res.send('ok')
})

app.listen(8080,()=>{
  console.log('8080端口启动完毕!')
})