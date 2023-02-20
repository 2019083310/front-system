const http = require('http')
const server = http.createServer()
const fs=require('fs')
const {createProxyMiddleware}=require('http-proxy-middleware')

server.on('request', (req, res) => {
  if(req.url==='/'){
    fs.readFile('./server.html',(err,data)=>{
      res.end(data)
    })
  }
  const urlStr=req.url
  if(/\/vips-mobile/.test(urlStr)){
    const proxy=createProxyMiddleware('/vips-mobile',{
      target:'https://mapi.vip.com',
      changeOrigin:true
    })
    proxy(req,res)
  }else if(/\/api/.test(urlStr)){
    const proxy2=createProxyMiddleware('/api',{
      target:'https://m.lagou.com',
      changeOrigin:true
    })
    proxy2(req,res)
  }else{
    console.log('error')
  }
  // res.end('ok')
})

server.listen(5500, () => {
  console.log('5500端口启动完毕!')
})