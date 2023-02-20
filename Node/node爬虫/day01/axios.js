const fs=require('fs')
const request=require('request')

const httpUrl='https://www.1905.com/vod/list/n_1_t_1/o3p1.html'
//获取分类里的电影连接
//根据电影链接获取电影里的详细信息

function req(url){
  return new Promise((resolve,reject)=>{
    request.get(url,(err,res,body)=>{
      if(err){
        reject(err)
      }else{
        resolve(res,body)
      }
    })
  })
}
//获取起始页面的所有分类地址
async function getClassUrl(){
  let {res,body}=await req(httpUrl)
  let reg=/<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs
  //解析html内容
  let result=reg.exec(body)[1]
  let reg1=/<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;" >(.*?)<\/a>/igs
  let arrClass=[]
  
}