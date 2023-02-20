const http=require('http')
const port=5000

http.createServer(function(req,res){
  // 开启cors
  res.writeHead(200,{
    // 设置允许请求跨域的域名，'*'允许所有的域名
    'Access-Control-Allow-Origin':'*',
    // 跨域允许的请求方法
    'Access-Control-Allow-Methods':'POST,PUT,GET,DELETE,PATCH,OPTIONS',
    // 允许的header类型
    'Access-Control-Allow-Headers':'Content-Type'
  })

  let list=[]
  let num=0

  // 生成10万条数据
  for(let i=0;i<100000;i++){
    num++
    list.push({
      src:'https://p3-passport.byteacctimg.com/img/user-avatar/d71c38d1682c543b33f8d716b3b734ca~300x300.image',
      text:`我是${num}条数据`,
      tid:num
    })
  }

  // 返回数据
  res.end(JSON.stringify(list))
}).listen(port,function(){
  console.log('server is listening on port'+port)
})