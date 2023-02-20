// 1.创建xml对象
const xhr=new XMLHttpRequest()

// 2.设置请求信息
xhr.open(method,url)

// 3.发送请求
// 如果是post或者put请求，需要把请求体放在send中，get请求拼接在url后面
// get---url?name=coder&age=18

//post请求还需设置请求发送的数据格式
xhr.setRequestHeader('Content-Type','application/json')
// json发送数据得格式：JSON.stringify(obj)

// xhr.setRequestHeader('Content-Type','application/www-form-urlencoded')
//www-form-urlencoded发送请求的格式:'name=coder&age=18' 

xhr.send()

// 4.判断请求的状态信息
//监听请求的状态改变的事件有两个
// readystateChange事件兼容ie浏览器，需要判断状态码
// load事件不兼容ie,不需要判断状态码 

xhr.onreadystatechange=function(){
  // ajax的请求状态码一共有五个
  // 0:0表示还未发送请求，还没有调用open发送
  // 1：1表示请求已经建立，还未调用send方法
  // 2:2表示请求已经发送
  // 3：表示还未收到全部的响应信息
  // 4：表示服务器发送响应数据完成
  if(xhr.readyState===4&&xhr.status>=200&&xhr.status<300){
    // 这种状态表示请求成功，收到该服务器的响应
    // xhr.response中存有服务器发送的响应信息
  }
}