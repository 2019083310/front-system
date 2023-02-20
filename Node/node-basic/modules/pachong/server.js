const http=require('http')
const server=http.createServer()
const https=require('https')
const cheerio=require('cheerio')

function filterData(data){
  const $=cheerio.load(data)
  $('.section-item-box p').each((index,el)=>{
    console.log($(el).text())
  })
}
server.on('request',(req,res)=>{
  let data=''
  https.get('https://www.meizu.com',(res)=>{
    res.on('data',(d)=>{
      data+=d
    })
    res.on('end',()=>{
      filterData(data)
    })
  })
  res.end('hello')
})
server.listen('8000',()=>{
  console.log('8000端口启动完毕')
})