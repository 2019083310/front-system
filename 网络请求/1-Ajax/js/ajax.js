function ajax(options){
  //默认值
  let defaults={
    type:'get',
    url:'',
    header:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    data:{},
    success(data){

    },
    error(){}
  }
  //使用用户传递的参数替换默认的参数
  Object.assign(defaults,options)
  //创建ajax对象
  const xhr=new XMLHttpRequest()
  //参数拼接
  let params=''
  //循环参数
  for(let i in defaults.data){
    params+=i+'='+defaults.data[i]+'&'
    //去掉参数中最后一个&
    params=params.substring(0,params.length-1)
  }
  //判断是什么请求
  if(defaults.type==='get'){
    //将参数拼接在url地址后面
    defaults.url+='?'+params
  }
  //设置请求信息
  xhr.open(defaults.type,defaults.url)
  //如果请求类型为post
  if(defaults.type==='post'){
    //设置请求头
    xhr.setRequestHeader('Content-Type',defaults.header['Content-Type'])
    if(defaults.header['Content-Type']==='application/json'){
      xhr.send(JSON.stringify(defaults.data))
    }else{
      xhr.send(params)
    }
  }else{
    xhr.send()
  }
  //接收请求
  xhr.onreadystatechange=function(){
    if(xhr.readyState===4){
      if(xhr.status>=200&&xhr.status<300){
        //获取服务端返回数据类型
        const contentType=xhr.getResponseHeader('content-type')
        //获取相应数据
        const result=xhr.responseText
        //如果服务器返回的数据是json格式
        if(contentType.includes('application/json')){
          //将json字符串转化为json对象
          result=JSON.parse(result)
        }
        //请求成功
        defaults.success(result,xhr)
      }else{
        defaults.error(xhr)
      }
    }
  }
  //当网络中断时
  xhr.onerror=function(){
    defaults.error(xhr)
  }
}