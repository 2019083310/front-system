# Node.js重要知识点总结（一）

### 一、Node.js基础

### 1.Node.js是什么？

​	node.js不是一门语言，不是库，也不是框架，Node.js是一个javascript运行环境，简单点来讲就是Node.js可以解析和执行javascript代码，以前只有浏览器可以执行javascript代码，也就是说现在的javascript代码可以脱离浏览器来进行，这一切都归功于Node.js。

​	浏览器中的javascript:ECMAScript、BOM、DOM

​	Node.js中的javascript:只有EcmaScript

​	Node.js可以进行服务器后台的开发，命令行工具，游戏服务器等...

### 2.Node.js特性

Node.js可以解析js代码(没有浏览器级别的限制)，提供了很多系统级别的API，如：

​	文件的读写操作、进程的管理、网络通信等....

举例：

```javascript
浏览器对ajax网络请求有同源的限制
浏览器不能进行文件读写的操作，但是Node.js可以
Node.js可以进程管理，管理(process模块)
最主要的是进行http/https通信
```

### 3.Node相关工具

NVM--node版本控制管理工具，通过nvm可以安装和切换不同版本的node.js。用法命令如下：

![image-20211116090618381](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20211116090618381.png)

NPM--node.js的包管理工具

### 4.模块化commonJs

Node.js有三类模块:内置的模块，第三方的模块，自定义的模块

内置的模块又称核心模块：如path/http/os/url

第三方的模块：需要使用npm install下载并引入，比如：express/art-template

自定义的模块:我们自己编写的js文件

```javascript
模块定义、接口暴露和引用接口
	在node.js中没有全局作用域，模块与模块之间互不干扰的，这样就造成一个问题，怎么样才能访问其他的自定义模块呢？如果想让外部可以访问模块里面的属性和方法，就必须在模块里通过向外暴露接口exports或者module.exports的方式向外暴露，这样再通过require()方法把需要的模块引入，就可以访问到内部的方法和属性了。
    module.exports={}//require('./js')
	exports.属性/方法=值
	//require()方法有两个作用，第一个是加载并执行js模块的代码，第二个是导入js模块的方法和变量
```

### 5.常用的内置模块

```:
1.url：
	常用的两个方法：url.parse()--解析url成对象
    			url.fromat()--把一个对象格式化为一个url字符串地址
2.queryString：
	queryString.parse()--将url的参数解析为对象格式
    queryString.stringify()--将对象格式的query转化为字符串格式
    queryString.escape()--将参数解析为二进制形式
	queryString.unescape()--将参数不解析为二进制,转化为正常格式
3.http/https:
	ip地址和端口号:ip地址是用来定位计算机的，端口号是用来定位具体的应用程序，所有的互联网的应用程序都需要占用一个端口号，计算机默认的端口号尽量不要访问。
    启动服务器:const http=require('http')
    		const server=http.createServer()

			server.on('request',(req,res)=>{
  				res.end('ok')
			})

			server.listen(8000,()=>{
  				console.log('8000端口启动完毕!')
			})
	request请求处理函数：需要接受两个参数：request和response,一个是请求对象，可以用开获取客户端的一些请求信息，一个是响应对象，用来给客户端发送一些响应信息。//相应的内容是字符串或者二进制buffer
	Content-Type:服务器发送的数据默认是utf-8编码的，浏览器在不知道相应内容的编码的情况下，会按照当前操作系统的编码解析，中文操作系统的默认编码gbk,在http协议中，Content-Type就是用来告诉浏览器我给你发送的数据内容是什么类型，不同的资源对应的Content-Type是不一样的。
	Content-Type工具:https://tool.oschina.net/commons
4.fs:file-system文件系统的意思
	浏览器并不具备读取文件的能力，但是node.js是可以读取文件进行操作的。在Node中想要读取文件，必须引入fs模块，fs.readfile()用来读取文件,fs.writefile()用来写入文件，文件中的存储都是二进制数据，用data.toString()方法转化为字符串.
	const fs=require('fs')

	fs.readFile('../../../node知识点总结.md',(err,data)=>{
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
5.path:路径操作模块
基本操作:
path.parse(url)--把路径转化为对象
      root:根路径  dir:目录  base:包含后缀名的文件名  ext:后缀名  name:不包含后缀名的文件名
path.dirname()--获取路径的目录部分
path.basename()--获取路径的文件名，默认包含扩展名
path.extname()--获取路径的扩展名部分
Path.join()--拼接路径(第二个参数会自动判断/是否多余)
6.body-parser:body post解析中间件
	主要是为了处理Post请求体
    安装：npm i body-parser
	引入:const bodyParse = require("body-parse")
    配置:// parse application/x-www-form-urlencoded
		app.use(bodyParser.urlencoded({ extended: false }))
		// parse application/json
		app.use(bodyParser.json())
	使用:router.post('/login',function(req,res){
			console.log(req.body)
		})
7.events:
	下载:npm i events
    引入:const EventEmitter=require('events')
    使用:class MyEventEmitter extends EventEmitter{}
		const event=new MyEventEmitter()
		event.on('play',(value)=>{
            console.log(value)
        })//自定义事件
		event.emit('play','movie')//触发我们的自定义事件
	在需要的时候这样调用就可以触发我们的自定义事件，满足我们的某种需求
    并且支持定义多个相同的事件，同时也会触发多次
8.Stream:流操作
	const fs=require('fs')

	const readStream=fs.createReadStream('./a.txt')
	const writeStream=fs.createWriteStream('./b.txt')

	readStream.pipe(writeStream)
9.Zlib:跟流操作串联起来的
	const fs=require('fs')
	const zlib=require('zlib')

	const gzip=zlib.createGzip()

	const readStream=fs.createReadStream('./a.txt')
	const writeStream=fs.createWriteStream('./b2.gzip')

	readStream.pipe(gzip).pipe(writeStream)
10.Crypto:加密模块
```

6.中间件--代理服务器(跨域）

```javascript
const http = require('http')
const server = http.createServer()
const fs=require('fs')
const {createProxyMiddleware}=require('http-proxy-middleware')

server.on('request', (req, res) => {
  if(req.url==='/'){
    fs.readFile('./server.html',(err,data)=>{
      res.end(data)
    })
  }
  const urlStr=req.url
  if(/\/vips-mobile/.test(urlStr)){
    const proxy=createProxyMiddleware('/vips-mobile',{
      target:'https://mapi.vip.com',
      changeOrigin:true
    })
    proxy(req,res)
  }else if(/\/api/.test(urlStr)){
    const proxy2=createProxyMiddleware('/api',{
      target:'https://m.lagou.com',
      changeOrigin:true
    })
    proxy2(req,res)
  }else{
    console.log('error')
  }
  // res.end('ok')
})

server.listen(5500, () => {
  console.log('5500端口启动完毕!')
})
```

7.Node爬虫

```javascript
通过node也可以爬虫,服务器的访问是没有同源政策的，因此可以发送网络请求接口获取网页数据
这里简要说明一下简单的爬虫，后续会继续说明node爬虫的实现过程及其细节
const http=require('http')
const server=http.createServer()
const https=require('https')
const cheerio=require('cheerio')

function filterData(data){
  const $=cheerio.load(data)
  $('.section-item-box p').each((index,el)=>{
    console.log($(el).text())
  })
}
server.on('request',(req,res)=>{
  let data=''
  https.get('https://www.meizu.com',(res)=>{
    res.on('data',(d)=>{
      data+=d
    })
    res.on('end',()=>{
      filterData(data)
    })
  })
  res.end('hello')
})
server.listen('8000',()=>{
  console.log('8000端口启动完毕')
})
```

8.node中的其他成员--（__dirname和__filename）

```javascript
__dirname:动态获取当前模块文件所处目录的绝对路径
__fiename:动态获取当前文件的绝对路径
在文件操作中，使用相对路径是不可靠的，因为node中文件操作的路径被设计为相对于执行node命令所处的路径。为了解决这个问题，需要使用__dirname()或__filename()把相对路径变为绝对路径.(绝对路径不受影响)
```
