//get请求，从服务器获取数据
function axios({
  url,
  method='GET',
  params={},
  data={}
}){
  //返回一个promise对象
  return new Promise((resolve,reject)=>{
    //处理method小写转大写
    method =method.toUpperCase()

    //处理query参数（拼接到url上）id=1&xxx=abc
    let queryString=''
    Object.keys(params).forEach(key=>{
      queryString+=`${key}=${
        params[key]
      }&`
    })
    if(queryString){
      //去除最后的&
      queryString=queryString.substring(0,queryString.length-1)
      //拼接到url
      url+='?'+queryString
    }
    //执行异步AJAX请求
    //创建xhr对象
    const request = new XMLHttpRequest()
    //打开连接(初始化请求)
    request.open(method,url,true)
    //发送请求
    if(method==='GET'||method==='DELETE'){
      request.send()
    }else if(method==='PUT'||method==='POST'){
      //设置请求头，告诉服务器请求体的格式是json
      request.setRequestHeader('Content-Type','appliaction/json;charset=utf-8')
      //发送json格式的请求参数
      request.send(JSON.stringify(data))//异步执行
    }
    //绑定监听状态
    request.onreadystatechange=function(){
      //如果请求没有完成,直接结束
      if(request.readyState!==4){
        return;
      }
      // 如果响应状态码在[200, 300)之间代表成功，否则失败
      const {status,statusText}=request
      if(status>=200&&status<300){
        //准备结果数据对象response
        const response={
          data:JSON.parse(request.response),
          status,
          statusText
        }
        return resolve(response)
      }else{
        reject(new Error('request error status is'+status))
      }
    }
  })
}