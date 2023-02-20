# AJAX知识点总结

### 一、原生AJAX

### 1.1AJAX简介

AJAX全称为Asynchronous Javascript And XML,就是异步的JavaScript和XML。通过AJAX可以在浏览器中实现向服务器发送异步请求，最大的优势：无刷新获取数据。

### 1.2XML简介

XML可扩展标记语言，XML被设计用来传输和存储数据。XML和HTML类似，不同的是HTML中都是预定义标签，而XML中没有预定义标签，全都是自定义标签，用来表示一些数据，如：

```javascript
比如说有一个学生数据
name="张三";age="14";sex="男";
用XML表示：
<student>
		<name>张三</name>
		<age>18</age>
		<sex>男</sex>
</student>
```

注：XML现在已经被JSON取代了

### 1.3AJAX的优缺点

优点：无需刷新页面与服务端进行通信，来更新部分页面内容

缺点：没有浏览历史，不能回退，SEO不友好

### 1.4AJAX的使用

使用步骤：

```javascript
1.创建XML对象：const xhr=new XMLHttpRequest()
2.设置请求信息：xhr.open(method,url)
3.发送请求：xhr.send()
4.接收响应数据：xhr.onreadystatechange=function(){
    	if(readystate===4){
            if(status>=200&&status<300){
                const responseText=xhr.responseText
            }
        }
	}
5.参数的传递：get请求的参数拼接在url后面就可以即--url?username=liu&password=123
			post请求的参数需要设置请求体，把参数通过xhr.send()传递出去
	// post请求必须要设置请求参数格式的类型
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') 
	// 发送请求(POST请求要带参数)
	xhr.send('name=zhangsan&age=20');
6.请求参数的格式：
	设置请求头为：application/x-www-form-urlencoded,传递参数格式为：name=zhangsan&age=20
	设置请求头为：application/json,传递参数格式为：{name: 'zhangsan', age: '20', sex: '男'}
7.ajax状态码：
	0：请求未初始化(还没有调用open())
	1：请求已经建立，但是还没有发送(还没有调用send())
	2：请求已经发送
	3：请求正在处理中，通常响应中已经有部分数据可以用了
	4：响应已经完成，可以获取并使用服务器的响应了
8.onload事件与onreadystatechange事件的区别：
	Onload不兼容ie低版本，不需要判断状态码，只能被调用一次
    onreadystatechange兼容ie低版本，需要判断状态码，可以被调用多次
```

### 1.4.2解决ie缓存问题

问题：在低版本的ie浏览器中，ajax请求有严重的缓存问题，即在请求的地址不发生变化的情况下，只有第一次请求会真正发送到服务器端，后续的请求都会从浏览器的缓存中获取结果，即使服务器端数据更新了，客户端拿到的依然是缓存中的旧数据。

解决方案：在请求地址的后面加上请求参数，保证每一次请求的参数不同

```javascript
xhr.open('get', 'http://www.example.com?t=' + Date.now());
```

### 1.5ajax封装

```javascript
function ajax(options){
  //默认值
  let defaults={
    type:'get',
    url:'',
    header:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    data:{},
    success(){},
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
```

### 1.6同源政策

### 1.6.1AJAX请求限制

ajax只能向自己的服务器发送请求，比如现在有一个A网站、有一个B网站，A网站中的HTML文件只能向A网站服务器中发送ajax请求，B网站中的HTML文件只能向B网站发送AJAX请求，但是A网站是不能向B网站发送AJAX请求的，同理，B网站也不能向A网站发送AJAX请求。

### 1.6.2什么是同源

如果两个页面拥有相同的协议、域名、端口号，那么这两个页面就属于同一个源，其中只要有一个不相同，就是不同源。

![img](https://img-blog.csdnimg.cn/eae7bf0e17b24738bb995f7dc6c29c1f.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA55Sf5ZG95piv5pyJ5YWJ55qE,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 1.6.3同源政策的目的

同源政策是为了保证用户信息的安全，防止恶意的网站窃取用户数据，即不能向非同源地址发送ajax请求，如果请求，浏览器就会报错。

### 1.6.4使用JSONP解决同源限制问题

jsonp是json with padding的缩写，他不属于ajax请求，但是它可以模拟ajax请求。只支持get请求

步骤：

```javascript
1.将不同源的服务端的请求地址写在script标签的src属性中
<script src='http://www.example.com'></script>
2.服务端响应数据必须是一个函数的调用，真正要发送给客户端的数据需要作为函数调用的参数
const data='fn({name:'liu',age:21})'
res.send(data)
3.在客户端全局作用域下定义函数fn
//注意要将函数定义放在script标签的前面，因为script标签加载完服务器端的响应内容以后会直接调用这个准备好的函数，如果客户端没有定义这个函数，函数在调用时找不到这个函数定义的部分，代码将会报错。
function fn (data) {
    
}
4.在fn函数内部对服务器端返回的数据进行处理
function fn (data) {
	console.log(data)    
}
5.示例
<body>
	<script>
		function fn (data) {
            // 在客户端定义函数
			console.log('客户端的fn函数被调用了')
			console.log(data);
		}
	</script>
	<!-- 1.将非同源服务器端的请求地址写在script标签的src属性中 -->
	<script src="http://localhost:8000/home"></script>
</body>
服务端：
// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
// 创建web服务器
const app = express();
// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));
// 创建路由
app.get('/test', (req, res) => {
    // 在服务器调用函数
    const result = 'fn({name: "张三"})';
    res.send(result);
});
// 监听端口
app.listen(8000);
```

### 1.6.5JSONP的封装

```javascript
//jsonp的封装
function jsonp(options){
  let params=''
  //参数的拼接
  for(let attr in options.data){
    params+='&'+attr+'='+options.data[attr]
  }
  //函数的创建
  let fnName='myJsonp'+Math.random().toString().replace('.','')
  //变成全局函数
  window[fnName]=options.success
  //创建script标签
  let script=document.createElement('script')
  //添加src属性
  script.src=options.url+'?callback='+fnName+params
  //向body中添加script标签
  document.body.appendChild(script)
  //为script标签添加onload事件
  script.onload=function(){
    document.body.removeChild(script)
  }
}
```

### 1.6.6服务端优化

服务端接收到客户端传过来的函数名称，并且拼接函数调用，在函数内部还需要将真实的数据放在里面，如果数据是从数据库查找来的json对象，我们还需要将其转化为json字符串，比较麻烦，因此我们可以使用node的express框架给我们提供的res.jsonp()方法

```javascript
app.get('/better',(req,res)=>{
    res.jsonp({name:"liu",age:20})
})
```

### 1.7CORS跨域资源共享

CORS：全称为Cross-origin resource sharing,即跨域资源共享，它允许浏览器向跨越服务器发送ajax请求，克服了ajax只能同源使用的限制。

```jsx
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
```

### 1.8访问非同源数据服务器端

同源政策是浏览器给予ajax技术的限制，服务器端是不存在同源政策的限制，服务器端可以直接访问非同源网站中的数据。所以对于客户端来讲，如果想要获取非同源网站中的数据，可以让自己的服务器端获取非同源网站中的数据，等到自己的服务器端获取到数据之后，自己网站的服务器端再将数据响应到客户端，这样就绕过了浏览器的同源政策的限制。

### 1.9CORS跨域资源共享

```javascript
node服务端设置：--这样就就通过CORS解决了跨域问题
app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Methods', 'GET, POST');
     next();
 })
```

### 1.10withCredentials属性

​	使用ajax技术发送跨域请求时，默认情况下不会在请求中携带cookie信息，但是如果两台服务器都是我们自己的，我们想要实现跨域请求，需要在客户端和服务器端进行处理，

​	在客户端ajax对象下有一个属性，withCredentials：指定在涉及到跨域请求时，是否携带cookie信息，默认值为false。

​	在服务器端响应头中设置字段：Access-Control-Allow-Credentials:true允许请求时携带cookie

### 二、jQuery中的ajax

### 2.1、$.ajax()方法概述

```javascript
//引入jQuery
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
$.ajax({
    type:'get',//请求方式
    url:'http://localhost:8000',//url地址
    data:{name:'liu',age:20},//请求参数
    contentType:'application/x-www-form-urlencoded',
    beforeSend(){//允许我们在请求发送之前做一些处理，比如验证请求参数的格式
        return false//return false 之后就不会再发送了
    },
    success(res){},//成功回调函数
    error(err){}//失败回调函数
})
```

### 2.2发送JSONP请求

```javascript
$.ajax({
    url:'http://localhost:8000',
    dateType:'jsonp',//指定当前发送jsonp请求
    jsonp:'cb',//修改callback参数名称
    jsonCallback:'fnName',//指定函数名称
    success(data){}
})
```

### 三、面试问题

1.JSONP缺点

​	JSONP只支持get，因为script标签只能使用get请求；JSONP需要后端配合返回指定格式的数据

2.跨域

​	ajax请求受浏览器同源政策的限制，不允许进行跨域请求，但是script标签的src属性中的链接却可以访问跨域的js脚本，利用这个特性，服务端不再返回JSON格式的数据，而是返回一段调用某个函数的Js代码，在src中调用，这样实现了跨域。

3.dom是什么？

文档对象模型(Document Object Model),简称DOM，是w3c组织推荐的处理可扩展标志性语言的标准编程接口，在网页上，组织页面的对象被组织在一个树形结构中，用来表示文档中对象的标准模型就称为DOM。

4.关于dom的api有哪些？

节点创建型api,节点查询型api,节点修改型api,节点属性型api,节点关系型api，节点样式型api等

5.如何实现跨域？

```javascript
1.JSONP的使用     2.CORS跨域资源共享      3.代理服务器    4.websocket
```

6.ajax的优势？

```javascript
1. 通过异步模式，提升了用户体验

2. 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用

3. Ajax引擎在客户端运行，承担了一部分本来由服务器承担的工作，从而减少了大用户量下的服务器负载。
```
