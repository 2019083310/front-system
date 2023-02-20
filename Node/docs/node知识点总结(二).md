# node重要知识点总结（二）

### 一.静态资源的使用详解

​	当我们在浏览器中向服务器发送请求的时候，服务器根据访问的url路径返回给我们一个html页面，浏览器在渲染解析的时候遇到link,script,img,a标签的时候会再次向服务器发送请求，这些img,css,js等文件被我们放在静态资源服务器中，那么这个时候node作为服务端，怎么返回给客户端数据？

​	node会把这些资源统一放在一个文件夹下，当客户端发送对应的请求的时候，Node根据req.url做路径判断，如果包含某个路径，node就去这个路径的文件夹下读取资源，并把读取到的数据返回，这样客户端再次解析渲染就会达到我们想要的目的。

​	实现细节：node文件读取的路径是相对于node的执行目录进行文件读取的，这样就有可能造成一些问题，读不到对应的数据。因此我们需要通过path模块进行路径拼接结合__dirname把相对路径变成绝对路径，这样就解决了路径问题。

```javascript
const http=require('http')
const fs=require('fs')
const path=require('path')

const server=http.createServer()

server.on('request',(req,res)=>{
  if(req.url==='/'){
    fs.readFile('./index.html',(error,data)=>{
      if(error){
        res.end('404 Not Found')
      }
      res.end(data)
    })
  }else if(req.url.indexOf('/public')===0){
    fs.readFile(path.join(__dirname,req.url),(error,data)=>{
      if(error){
        res.end('404 Not Found')
      }
      res.end(data)
    })
  }
})
server.listen(8080,()=>{
  console.log('8080端口启动完毕')
})
```

express框架提供给了我们更好的静态资源处理方法：

```javascript
const express=require('express')
const app=express()
app.use('/public/',express.static(path.join(__dirname,'./public/')))
```

### 二.Yarn的使用

yarn是FaceBook发布的一款取代npm的包管理工具。

yarn的特点：速度快，更安全，更可靠。

下载yarn：npm install -g yarn

yarn的常用命令：

```  
yarn --version    查看版本号
yarn init         初始化项目
yarn list         显示所有配置项
yarn install      安装所有package.json里面的包，并将包及其他的依赖保存进yarn.lock
yarn add package  安装相应的包
yarn add package@version     安装特定版本的包
yarn add --dev    加到devDependencies
yarn add --peer   加到peerDependencies
yarn remove package  移除某个包
yarn upgrade package  更新包
yarn run          用于执行在package中script属性下定义的脚本
yarn info package   用于查看某个包的最新版本信息
yarn cache clean  清除缓存
yarn config get registry  查看yarn源
yarn config set registry https://registry.npm.taobao.org/  yarn换源
```

### 三.Express框架

### 1.EXpress介绍

Express是基于Node.js开发的快速，高效，极简，开放的web开发框架。

### 2.Hello world实例

```javascript
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

### 3.express中间件

Express应用常使用的中间件：

- 应用级中间件
- 路由级中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

1. 应用级中间件

```javascript
应用级中间件绑定到app对象，使用app.use和app.method(),其中method处理http请求的方法。
const app=express()

//1.没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
//2.挂载路径的中间件，任何包含指向该路径的请求都会执行它
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
//3.挂载路径的中间件，只有是get请求的路径才会处理
app.get('/user/:id', function (req, res, next) {
  res.send('USER')
})
//4.路由句柄，可以为路径定义多个路由，即该路径可以有多个处理函数
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})
//5.如果需要在中间件栈中跳过剩余的中间件，可以调用next('route')方法将控制权交给下一个路由
app.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route')
  // 否则将控制权交给栈中下一个中间件
  else next() //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('regular')
});
```

​	2.路由级中间件

```javascript
路由级中间件绑定的对象为express.Router()
const router=express.Router()
路由级中间件使用router.use()或router.VERB()加载
//1.没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
//2.挂载路径的中间件，会匹配所有符合该路径的所有请求
router.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
//3.挂载路径的中间件，只会执行符合get请求的路由
router.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route')
  // 负责将控制权交给栈中下一个中间件
  else next() //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('regular')
})
//最重要的是将路由挂载到应用中
app.use('/',router)
```

​	3.错误处理中间件

```javascript
错误处理中间件有四个参数，定义错误处理中间件时必须使用这四个参数。即使不需要Next对象，也必须在声明中有他，否则中间件会被识别为一个常规中间件，不能处理错误请求。
app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('server error')
})
```

​	4.内置中间件

```javascript
express.static()--是express的唯一内置中间件，他是为了提供静态资源列表。
每个应用可以有多个静态资源列表。
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('files'))
```

​	5.第三方中间件

```javascript
通过第三方中间件，可以为Express框架扩展更多的功能。
安装所需要的node模块，并在应用中加载，可以在应用中加载，也可以在路由中加载。
npm install cookie-parser
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

// 加载用于解析 cookie 的中间件
app.use(cookieParser())
```

### 4.设计模式MVP

```javascript
	以前MVC这种模式在后端是很常见的，M即Model数据层，V即Views视图层，C即Controller控制层，这种模式Model层与Views是可以进行数据交换的，并且系统的结构复杂，因此为了避免Views层与Model层进行数据交换，node中用RMVP模式进行设计，R--Router路由，M--MOdel数据层,V--Views视图层，P(C)--Controller控制层，RMVP模式很好的解决了VM之间的通信，他们都通过C进行数据交换。
	MVP模式模型与视图完全分离，我们可以修改视图而不影响模型。所有的交互都发生在Controller内部。便于单元测试。代码复用性提高。但是接口比较多，很容易晕。
```

![img](https://iknow-pic.cdn.bcebos.com/1ad5ad6eddc451da29541014b1fd5266d11632aa)



### 5.路由

- 路由是由一个URL、HTTP请求(get,post,put,patch,delete等)和若干个句柄组成，它的结构如下：

app.method(path,callback,callback...),app是express对象的一个实例。

- 1.路由方法

  - 路由方法就包括很多了，比如get/post/put/patch/delete等
  - app.all()是一个特殊的路由方法，没有HTTP方法与其对应，不管使用get/post/put/delete或任何其它请求，这个方法都会执行
  - get---请求数据，获取前端的参数可以使用req.query
  - post--添加数据，获取前端的参数可以使用第三方中间件body-parser，配置好了通过req.body获取
  - put--修改数据(覆盖式修改)，获取前端的参数也是通过req.body
  - patch--修改数据(可以选择性修改)
  - delete--删除数据，获取前端参数通过req.query

- 2.路由路径

  - 路由路径和请求方法一起定义了请求的端点，它可以是字符串、字符串模式或者是正则表达式。

  - 使用字符串的路由实例

    ```javascript
    // 匹配根路径的请求
    app.get('/', function (req, res) {
      res.send('root');
    });
    
    // 匹配 /about 路径的请求
    app.get('/about', function (req, res) {
      res.send('about');
    });
    ```

  - 使用字符串模式的路由路径实例

    ```javascript
    // 匹配 acd 和 abcd
    app.get('/ab?cd', function(req, res) {
      res.send('ab?cd');
    });
    
    // 匹配 abcd、abbcd、abbbcd等
    app.get('/ab+cd', function(req, res) {
      res.send('ab+cd');
    });
    
    // 匹配 abcd、abxcd、abRABDOMcd、ab123cd等
    app.get('/ab*cd', function(req, res) {
      res.send('ab*cd');
    });
    
    // 匹配 /abe 和 /abcde
    app.get('/ab(cd)?e', function(req, res) {
     res.send('ab(cd)?e');
    });
    ```

  - 使用正则表达式的路由路径实例

    ```javascript
    // 匹配任何路径中含有 a 的路径：
    app.get(/a/, function(req, res) {
      res.send('/a/');
    });
    
    // 匹配 butterfly、dragonfly，不匹配 butterflyman、dragonfly man等
    app.get(/.*fly$/, function(req, res) {
      res.send('/.*fly$/');
    });
    ```

- 3.路由句柄

  - 路由句柄就是为请求处理提供多个回调函数，其行为类似于中间件。惟一的区别是这些回调函数有可能调用next('route')方法略过其它路由回调函数，把控制权交给剩下的路径。

  - 路由句柄可以有多种形式，可以是一个函数，一个函数数组，或者两者混合，如下所示：

    ```javascript
    //使用一个回调函数处理路由：
    app.get('/example/a', function (req, res) {
      res.send('Hello from A!');
    });
    
    //使用多个回调函数处理路由（记得指定 next 对象）：
    app.get('/example/b', function (req, res, next) {
      console.log('response will be sent by the next function ...');
      next();
    }, function (req, res) {
      res.send('Hello from B!');
    });
    
    //使用回调函数数组处理路由：
    var cb0 = function (req, res, next) {
      console.log('CB0')
      next()
    }
    var cb1 = function (req, res, next) {
      console.log('CB1')
      next()
    }
    var cb2 = function (req, res) {
      res.send('Hello from C!')
    }
    app.get('/example/c', [cb0, cb1, cb2])
    
    //混合使用函数和函数数组处理路由：
    var cb0 = function (req, res, next) {
      console.log('CB0')
      next()
    }
    
    var cb1 = function (req, res, next) {
      console.log('CB1')
      next()
    }
    app.get('/example/d', [cb0, cb1], function (req, res, next) {
      console.log('response will be sent by the next function ...')
      next()
    }, function (req, res) {
      res.send('Hello from D!')
    })
    ```

- 4.响应方法

  - res.send()--发送各种类型的响应
  - res.render()--渲染模板并发送给客户端
  - res.end()--终结响应处理流程
  - res.redirect()--重定向请求
  - res.json()--发送一个支持json格式的响应
  - res.sendStatus()--设置响应状态吗，将其以字符串的形式发送

- 5.express.Router()

  - 可使用express.Router()类创建模块化，可挂载的路由句柄

    ```javascript
    const express = require('express');
    const router = express.Router();
    
    // 该路由使用的中间件
    router.use(function timeLog(req, res, next) {
      console.log('Time: ', Date.now());
      next();
    });
    // 定义网站主页的路由
    router.get('/', function(req, res) {
      res.send('Birds home page');
    });
    // 定义 about 页面的路由
    router.get('/about', function(req, res) {
      res.send('About birds');
    });
    
    module.exports = router;
    ```

- 6.app.route()

  - 可使用app.route()创建路由的链式路由句柄。

    ```javascript
    app.route('/book')
      .get(function(req, res) {
        res.send('Get a random book');
      })
      .post(function(req, res) {
        res.send('Add a book');
      })
      .put(function(req, res) {
        res.send('Update the book');
      });
    ```