const http=require('http')
const fs=require('fs')
const path=require('path')

const server=http.createServer()

server.on('request',(req,res)=>{
  if(req.url==='/'){
    fs.readFile('./index.html',(error,data)=>{
      if(error){
        res.end('404 Not Found')
      }
      res.end(data)
    })
  }else if(req.url.indexOf('/public')===0){
    fs.readFile(path.join(__dirname,req.url),(error,data)=>{
      if(error){
        res.end('404 Not Found')
      }
      res.end(data)
    })
  }
})
server.listen(8080,()=>{
  console.log('8080端口启动完毕')
})