function ajax({
  url,
  method='GET',
  data={},
  params={},
  success,
  error
}){
  // 将Method全部转为大写
  method=method.toUpperCase()

  // 拼接url
  let queryString=''
  for(const key in params){
    queryString+=`${key}=${params[key]}&`
  }
  // 去除最后的&
  queryString=queryString.slice(0,queryString.length-1)

  // 1.创建XML对象
  const xhr=new XMLHttpRequest()

  // 2.初始化发送请求信息
  if(method==='GET'||method==='DELETE'){
    url+='?'+queryString
  }
  xhr.open(method,url)

  // 3.发送请求
  if(method==='PUT'||method==='POST'){
    xhr.setRequestHeader('Content-Type','application/json')
    xhr.send(JSON.stringify(data))
  }else if(method==='GET'||method==='DELETE'){
    xhr.send()
  }

  // 4.监听state的改变
  xhr.onreadystatechange=function(){
    if(xhr.readyState===4&&xhr.status>=200&&xhr.status<300){
      // 获取服务端返回的响应信息类型
      const contentType=xhr.getResponseHeader('Content-Type')
      // 获取相应数据
      const res=xhr.response
      if(contentType==='application/json'){
        return JSON.parse(res)
      }
      // 请求成功
      success(res,xhr)
    }else{
      error(xhr)
    }
  }

  // 网络中断时
  xhr.onerror=function(){
    error(xhr)
  }
}
