const path=require('path')
const http=require('http')
const server=http.createServer()
server.on('request',(req,res)=>{
  // console.log(req.url)
  const pathURL='c:web/www.a.html'
  console.log(path.parse(pathURL))
  console.log(path.dirname(pathURL))
  console.log(path.basename(pathURL))
  console.log(path.join())
  res.end('ok')
})
server.listen(4000,()=>{
  console.log('4000端口启动完毕')
})