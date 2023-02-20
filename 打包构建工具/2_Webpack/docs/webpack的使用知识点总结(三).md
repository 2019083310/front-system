# webpack知识点总结(三)

#### 接上一篇webpack知识点总结(二):https://blog.csdn.net/weixin_50903927/article/details/121574650?spm=1001.2014.3001.5501

### 四、webpack配置模块详解

#### 1.Entry入口模块

​	Entry作为webpack配置的起点，webpack根据Entry找到打包入口，开始打包，一共有三种形式:

- 字符串String：
  - entry:'./src/index.js'----这种情况用于单页面也是目前用得最多的。它会打包成一个chunk,此时chunk的默认名称是main
- 数组Array
  - entry:['./src/index.js','./src/js/count.js']---这种形式用于打包多入口，即多页面，这种形式也会形成一个chunk,默认名称是main
  - 这种形式的主要用途是用于使html的热更新生效
- 对象Object
  - entry:{index:'./src/index.js',add:'./src/js/add.js'}---这种形式主要用于打包多页面，会形成多个chunk,对象里有几个入口就形成几个chunk,chunk的名称是对象的key
  - 特殊用法：
    - 在对象里面嵌套数组即：entry:{index;['./src/index.js','./src/count.js']},---这种情况也会形成一个chunk，它会把这两个文件打包成一个。

#### 2.output出口模块

​	output是webpack打包的出口模块，webpack根据打包的出口，把打包形成的静态资源放到固定的文件夹下，并根据配置形成文件名字。

​	output对象中的属性解释：

```javascript
output:{
    //指定webpack打包后形成的静态资源统一存放的文件夹
    path:path.join(__dirname,'dist')，
    //指定打包的js文件的文件名称(目录+名称)
    filename:'js/bundle.js',
    //指定非入口chunk打包形成的js文件名称，非入口chunk主要包括两种:1.通过node_modules导入的第三方库 2.通过import()语法动态导入的js
	chunkFilename:'js/[name]_chunk.js',
	//指定打包后的静态资源在html中引入的时候要不要加'/'前缀
    publicPath:'/',
	//想让打包后的js文件向外暴露接口，从而引用他们，这个属性是把js文件添加到window中
	libraryTarget:'window',
	library:'[name]'//添加到全局中
}
```

#### 3.module模块

​	mdule这个模块主要是用来添加一些loader的配置，因为webpack只能识别js代码，如果想要让webpack打包其他的文件模块，就需要配置相应的Loader和plugin来实现打包。

​	module里面通常只会有一个属性：rules(是个数组)，在rules里面来实现loader的配置

```javascript
module:{
    rules:[
        {
            test:/\.css$/,
            //多个loader用Use(数组形式)
            use:['style-loader','css-loader']
        },
        {
            //test正则表达式，用来匹配相应的模块文件
            test:/\.js$/,
            //exclude主要是用来忽略我们不想匹配的内容
            exclude:/node_modules/,
            //include用来只匹配我们制定文件夹下的内容
            include:path.join(__dirname,'./src')
            //对应的loader
            loader:'eslint-loader',
            //指定执行的优先顺序，pre先执行，post后执行
            enforce:'pre', 
            //loader中的某些属性设置
            options:{}
        }
    ]
}
```

#### 4.mode模块

​	这个模块就一个作用，用来指定webpack打包的模式，是开发模式，还是生产模式。

​	mode:'production'--生产模式

​	mode:'development'--开发模式

​	注意：指定的是模式，而不是Node.js的环境变量，Node.js的环静变量需要用process来指定，      process.env_NODE_ENV='production'(默认就是生产环境)

#### 5.plugin模块

​	这个模块也是用来扩展webpack打包的功能，可以让webpack识别更多的文件，作出相应的打包操作。里面通常都会用new 引入的插件对象()的形式来调用插件。

#### 6.webpack-dev-server--本地服务器的使用

​	webpack-dev-server这个工具主要是帮我们解决开发过程中当我们文件修改的过于频繁，但是我们还得在浏览器上看到效果，所以我们不得不每次修改都要重启webpack打包构建，这就很不方便，因此我们就可以借助webpack-dev-server这个工具来帮助我们解决这个问题。

​	webpack-dev-server我们要现在本地下载安装，然后再webpack中配置,dev-server就是一个本地服务器，默认运行在3000端口。

​	配置：

```javascript
devServer:{
    //运行的webpack的打包构建的目录
    contentBase:path.join(__dirname,'dist'),
	//监视打包运行代码目录文件的变化，一旦变化就会reload
    watchContentBase:true,//默认就是true
	//端口号
	port:8000,
	//域名
	host:'localhost',
	//是否启动完成自动在浏览器中打开运行
	open:true,//默认是false
	//是否开启热模块替换
	hot:true,
	//不要显示启动服务器日志信息
	clientLogLevel:'none',
	//除了一些基本启动信息以外，不要显示其他内容
	quiet:true,
	//服务器代理---跨域
	proxy:{
        'api':{
            target:'http://localhost:3000'
        }
    }
}
```

#### 7.resolve--解析模块的规则

​	resolve这个选项配置主要是来帮助我们配置一些模块解析的规则，比如配置文件解析的路径别名，配置省略文件路径的后缀名等等。

​	使用：

```javascript
resolve:{
    //配置解析模块路径别名，优点就是简写路径，缺点路径没有提示
    alias:{
        $css:path.join(__dirname,'./src/css')//以后引用css目录下的文件就可以直接使用$css来引用
    },
	//配置省略文件的后缀名
	extensions:['.js','.json','.vue','.css']//这里需要注意的是，同时省略了js,css的别名，会有一点问题，如果js,css文件同名，那么webpack默认会去找同名的js文件，因此如果设置了css省略别名，需要注意文件不要重名。
}
```

#### 8.optimization--代码分割配置

​	这个规则主要是用来设置代码分割，提取node_modules中的文件为一个chunk.

​	使用配置：

```javascript
optimization:{
    splitChunks:{
        chunks:'all',
		minChunks:1,//要提取的chunk最少被引用一次
		maxSize:0,//最大没有限制
		minSize:30*1024,//要分割的chunk最小为30kb
    }
}
```