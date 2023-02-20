const fs=require('fs')
const path=require('path')

fs.readFile(path.join(__dirname,'../../../docs/node知识点总结(一).md'),(err,data)=>{
  if(err){
    console.log('读取文件失败')
  }
  console.log(data.toString())
})

fs.writeFile('./readme.md','你是最棒的',(err,data)=>{
  if(err){
    console.log(err)
  }
  console.log(data)
})