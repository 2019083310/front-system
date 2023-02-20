//jsonp的封装
function jsonp(options){
  let params=''
  // 参数的拼接
  for(let attr in options.data){
    params+=`&${attr}=${options.data[attr]}`
  }
  // 创建一个函数
  let fn='myJsonp'+Math.random().toString().replace('.','')
  // 变成全局函数
  window[fn]=options.success
  // 创建script标签
  let script=document.createElement('script')
  // 添加src属性
  script.src=options.url+'?callback='+fn+params
  // 向body中添加script标签
  document.body.appendChild(script)
  // 为script标签添加onload事件
  script.onload=function(){
    document.body.removeChild(script)
  }
}