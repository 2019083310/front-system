# 网络请求--Axios知识点整理



### 一，HTTP相关

1.前后台交互的基本过程

```javascript
1.前台应用从浏览器端向服务器发送http请求(请求报文)
2.后台服务器接收到请求后，调度服务器应用处理请求，向浏览器端返回Http响应(响应报文)
3.浏览器端接收到响应，解析显示响应体/调用监事回调
```

2.HTTP请求报文

```javascript
1.请求行:请求方式/url
2.多个请求头:一个请求头由name:value组成,如Host/Cookie/Content-type头
3.请求体(有JSON格式和urlencoded)
```

3.HTTP响应报文

```javascript
1.响应行:响应状态吗/对应的文本(status/statusText)
2.多个响应头:如Content-type、set-Cookie头
3.响应体(响应体的内容只能是字符串或者Buffer形式)
```

4.不同类型的请求及作用

```javasc
1.Get请求:从服务端请求数据
2.POst请求:向服务端添加数据
3.Put请求:向服务端更新数据
4.Delete:删除服务端数据
```

5.API分类

```javascript
1.Rest Api:
	发送请求进行CRUD那个操作由请求方式决定
    同一个请求路径可以进行多个操作(get/post/put/delete)
2.非Rest Api:
	请求方式不决定请求的CRUD操作
	一个请求路径只对应一个操作，一般只有get/post
```

6.常见响应状态吗

```javascript
100--Continue 继续。客户端应继续请求
200--OK，请求成功
201--Created 已创建。成功请求并创建了新的资源
202--已接受。已经接受请求，但并未处理完成
204--No Content 无内容。服务器成功处理，但并未返回内容
206--部分内容。服务器成功处理了部分Get请求
301--永久移动。请求的资源已被永久移动到新的URL，返回信息会包括新的URL，浏览器会自动定向到新URL，今后任何新的请求都应使用新的URL代替
302--临时移动。与301类似，但资源只是临时移动，客户端应继续使用原有的URL
304--未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源，客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源
305--使用代理。所请求的资源必须通过使用代理访问。
400--客户端请求的语法错误，服务器无法理解
401--请求要求用户的身份认证
403--服务器理解请求客户端的请求，但是拒绝执行此请求
404--服务器无法根据客户端的请求找到资源，通过此状态码设计人员可以设置无法找到资源的个性页面
405--客户端中的请求方法被禁止
408--服务器等待客户端发送的请求时间过长，超时
414--请求的URL过长，服务器无法处理
500--服务器内部错误，无法完成请求
505--服务器不支持请求的HTTP协议的版本，无法完成处理
```

7.HTTP常用的请求头

```javascript
Accept--可接受的响应内容类型(Content-types)
Accept-Charset--可接受的字符集
Accept-Encoding--可接受的响应内容的编码方式
Authorization--用于表示HTTP协议中需要认证资源的认证信息
Cookie--之前服务器通过set-Cookie设置的一个HTTP协议Cookie
```

8.HTTP强缓存和协商缓存

![image-20211110094935938](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20211110094935938.png)

![preview](https://segmentfault.com/img/bVuuo2/view)

9.什么时候使用强缓存或者协商缓存呢?

```javascript
	在第一次请求时，服务器会将页面最后修改时间通过`Last-Modified`标识由服务器发送给客户端，客户端记录修改时间；服务器还会生成一个Etag，并发送给客户端.
    浏览器请求某一资源时，会先获取该资源缓存的header信息，然后根据header中的Cache-Control和Expires来判断是否过期。若没过期则直接从缓存中获取资源信息，包括缓存的header的信息，所以此次请求不会与服务器进行通信。这里判断是否过期，则是强缓存相关。
	如果显示已过期，浏览器会向服务器端发送请求，这个请求会携带第一次请求返回的有关缓存的header字段信息，比如客户端会通过If-None-Match头将先前服务器端发送过来的Etag发送给服务器，服务会对比这个客户端发过来的Etag是否与服务器的相同，若相同，就将If-None-Match的值设为false，返回状态304，客户端继续使用本地缓存，不解析服务器端发回来的数据，若不相同就将If-None-Match的值设为true，返回状态为200，客户端重新机械服务器端返回的数据；客户端还会通过If-Modified-Since头将先前服务器端发过来的最后修改时间戳发送给服务器，服务器端通过这个时间戳判断客户端的页面是否是最新的，如果不是最新的，则返回最新的内容，如果是最新的，则返回304，客户端继续使用本地缓存。
```

10.get和post的区别

```javascript
1.get参数通过url传递，post放在request body中
2.get请求在url中传递的参数是有长度限制的，而Post没有
3.get比post更不安全，因为参数直接暴露在Url中，所以不能用来传递敏感信息
4.get请求只能进行URL编码，而post支持多重编码方式
5.get请求的参数会被完整保留在浏览历史记录里，而post中参数不会被保留
6.GET和POST本质上就是TCP链接，并无差别。但是由于HTTP的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。 GET 产生一个 TCP 数据包；POST 产生两个 TCP 数据包。
```

### 二、json-server的使用

1.json-server是什么？

用来快速搭建REST API 的工具包

2.使用json-server

```javascipt
1.在线文档:https://github.com/typicode/json-server
2.下载:npm install -g json-server
3.目标根目录下创建数据库json文件:dn.json
{
	"posts": [
		{ "id": 1, "title": "json-server", "author": "typicode" },
		{ "id": 2, "title": "json-server2", "author": "typicode" }
	],
	"comments": [
		{ "id": 1, "body": "some comment", "postId": 1 }
	],
	"profile": { "name": "typicode" }
}
4.启动服务器执行命令:json-server --watch db.json
5.使用浏览器访问测试
http://localhost:3000/posts
http://localhost:3000/posts/1
```

2.1使用axios访问测试

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>
    <button onclick="testGet()">GET请求</button>
    <button onclick="testPost()">POST请求</button>
    <button onclick="testPut()">PUT请求</button>
    <button onclick="testDelete()">DELETE请求</button>
  </div>
  <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.js"></script>
  <script>
    function testGet(){
      axios.get('http://localhost:3000/posts').then(res=>{
        console.log(res)
      })
    }
    function testPost(){
      axios.post('http://localhost:3000/posts',{'title':'json-server3','author':'type'}).then(res=>{
        alert('ok')
      })
    }
    function testPut(){
      axios.put('http://localhost:3000/posts/2',{'title':'json'}).then(res=>{
        alert('ok')
      })
    }
    function testDelete(){
      axios.delete('http://127.0.0.1:3000/posts/2').then(res=>{
        alert('ok')
        })
    }
  </script>
</body>
</html>
```

三、XMLHttpRequest的基本使用

1.特点

```javascript
函数的返回值为promise，成功的结果为response,失败的结果为error
能处理多种类型请求:get/post/put/delete
函数的参数为一个配置对象:url/method/params/data
响应json数据自动解析为js
```

2.区别ajax请求与一般的http请求

```javascript
AJAX请求是一种特别的http请求：只有通过XHR/Fetch发送的是ajax请求，其他的一般是HTTP请求
浏览器端接收到响应
    一般请求: 浏览器一般会直接显示响应体数据, 也就是我们常说的刷新/跳转页面
    ajax请求: 浏览器不会对界面进行任何更新操作, 只是调用监视的回调函数并传入响应相关数据
```

3.使用xhr封装简版的axios

```javascript
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
        resolve(response)
      }else{
        reject(new Error('request error status is'+status))
      }
    }
  })
}
```

四、axios的理解和使用

```javascript
1.axios是什么？
	前端最流行的ajax请求库，react/vue官方都推荐使用axios发送ajax请求
	文档:https://hithub.com/axios/axios
2.特点：
	基于xhr+promise的异步ajax请求库
	浏览器/node端都可以使用
	支持请求/响应拦截器
	支持请求取消
    请求/响应数据切换
	批量发送多个请求
3.axios常用语法:
	axios(config)-通用/最本质的发送任意类型的请求方式,config请求对象，可以包含请求方式/请求路径/请求参数
	axios.get(url,params)--get请求
    axios.post(url,data)--向服务器添加数据
    axios.put(url,data)--修改服务器中的数据
    axios.delete(url,params)--删除服务器中的数据
    axios.interceptors.request.use(config=>return config)//请求拦截器，一定要把请求对象config返回,可以在里面设置config的相关配置比如请求头的信息
	axios.interceptors.response.use(res=>return res.data)//响应拦截器，可以对服务中的返回的数据做一定的处理返回
	axios.create({})--创建一个axios实例,使用方法和axios一样，但是这个实例没有取消请求和执行多个异步请求的功能/没有axios.cancel()/axios.all(promise)/axios.spread()功能//它的里面可以接受一个对象，是axios的默认配置，包括baseURL,Timeout
    axios.defaults.xxx--请求的默认全局配置(baseURl/method/timeout)
	axios.cancel()--用于创建取消请求的错误对象
    axios.CancelToken()--用于创建取消请求的token对象
    axios.isCancel()--是否是一个取现请求的错误
    axios.all(promise)--用于批量执行多个异步任务
4.拦截器函数/ajax请求/请求的回调函数的执行顺序
	说明：调用axios()并不是立即发送ajax请求,而是需要经过一个较长的流程
	流程:请求拦截器2=>请求拦截器1=>发送ajax请求=>响应拦截器1=>响应拦截器2=>得到响应回调
5.取消请求
	基本流程:
		let cancel;//用于保存取消请求的函数
		配置cancelToken对象：cancelToken:new axios.CancalToken(c=>cancel=c)
		在后面特定时机调用cancel函数取消请求
        在错误回调中判断如果error是cancel，做相应处理
```

