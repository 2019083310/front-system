// ajax的超时处理
const xhr=new XMLHttpRequest()

// 定义超时时间
xhr.timeout=10*1000
// 超时的回调函数
xhr.ontimeout=function(){
  // 取消请求
  xhr.abort()
}