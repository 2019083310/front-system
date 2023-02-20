const express=require('express')
const app=express()

const bodyParser=require('body-parser')

const router=require('./router')

app.engine('html',require('express-art-template'))

app.use('/node_modules',express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(router)

app.listen(8000,()=>{
  console.log('8000端口启动完毕')
})