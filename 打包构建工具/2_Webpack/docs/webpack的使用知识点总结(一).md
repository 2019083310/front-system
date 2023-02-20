# webpack知识点总结(一)

### webpack官网：https://webpack.js.org/

### 一、webpack的基本使用

#### 1.webpack是什么

​		webpack是一种前端资源构建工具，一个静态资源打包器，在webpack看来，前端所有的资源文件（js/json/css/img/less/html/......）都会作为模块处对应的理。它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源。

#### 2.webpack的五个核心概念

​	Entry--入口(Entry)指示webpack以那个文件为入口起点开始打包，分析构建内部依赖图

​	Output--输出(Output)指示webpack打包后的资源bundles输出到那里去，以及如何命名。

​	Loader--Loader让webpack能够去处理那些非javascript文件（webpack自身只理解javascipt）

​	Plugins--插件(Plugins)可以用于执行范围更广的任务。

​	Mode--模式(Mode)指示webpack使用相应模式的配置.包括开发模式和生产模式

#### 3.webpack初体验

```javascript
1.初始化:npm init --yes
2.下载安装webpack:npm i webpack -cli -g    npm i webpack cli -d
3.创建webpack配置文件:webpack.config.js
4.基本配置:
	entry:'./src/main.js'--入口文件
    output:{
        path:path.resolve(__dirname,'dist')
        filename:'bundle.js'
    }--出口配置
	mode:'development'--开发环境配置
    module:{
        rules:[
            {
                test:'/\.css$/',
                use:['style-loader','css-loader']
            }
        ]
    }--loader的配置
	plugins:[new VueLoaderPlugin()]--插件的配置
```

### 二、webpack开发环境的配置

#### 1.打包样式资源:

```javascript
//要想打包得在文件中有引用关系

npm i css-loader style-loader less-loader less --save-d//安装打包资源相应的loader
	修改配置文件:
		像上面一样:在rules中添加对应的对象，对象中包含正则表达式匹配资源,以及相应的loader,对于样式资源来说,要先识别css对应css-loader，在把css转化为浏览器是别的style 对应style-loader
```

#### 2.打包图片资源:

```javascript
//这个url-loader只能解析样式之中的图片,需要借助html-loader打包html中的图片资源
// limit的作用:图片大小小于8kb，就会被base64处理
// 优点: 减少请求数量（减轻服务器压力）
// 缺点：图片体积会更大（文件请求速度更慢）
	在webpack.config.js中:
    {
        test:/\.(jpg|png|gif|jpeg)$/,
        use:[{
            loader:'url-loader',
            options:{
                limit:8192,
                name: '[hash:10].[ext]',
                esModule:fasle//关闭es6模式
            }
        }]
    }
	{
        test:/\.html$/,
        use:['html-loader']
    }
```

#### 3.打包html资源:

```javascript
在配置中引入插件htmlWebpackPlugins:
   plugins:[new htmlWebpackPlugins({
      template:'./src/index.html'
   })]
```



#### 4.打包其他资源:

```javascript
在配置中:
	{
        exclude:/\.(css|less|js|html|jpg|jpeg|gif|png)$/,
        use:['file-loader']
    }
```

#### 4.devServer的使用:

```javascript
 devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true
  }
```

#### 5.clean-webpack-plugin插件的使用

```javascript
这个插件就是可以让我们每次打包之后不用每次删除里面的内容在打包，他可以自动在第二次打包的时候先清除在打包。
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

在插件里面添加:new CleanWebpackPlugin(),
```

#### 6.copy-webpack-plugin插件的使用

```javascript
这个插件的用处就是可以把目标文件的内容复制粘贴到打包文件夹当中，可以使我们的源码找到所引用的资源。

const copyPlugin = require('copy-webpack-plugin')

new copyPlugin({
      patterns: [
        {
          from: './public/*.ico',
          to: path.join(__dirname, './dist/favicon.ico'),
        },
        {
          from: './public/libs',
          to: path.join(__dirname, './dist/libs'),
        }
      ]
    })

```

#### 7.在webpack中使用代理服务器

```javascript
	如果想要跨域的话有很多方法，其中一种是通过代理服务器的方式，既可以在服务器中设置代理服务器也可以在客户端设置代理服务器，这种方式需要借助第三方插件来完成，我们可以在webpack中设置，具体设置方法为:
	//设置跨域代理服务器
	//这种方式需要在devServer中配置
    proxy: {
      "/api": {
        target: 'http://localhost:3000'
      },
    }
```

#### 8.webpack开发环境的优化

​	webpack开发环境优化主要有两个方面，一方面是打包构建速度的优化，另一方面是代码调试的优化。

##### 	1.打包构建速度的优化--HMR

​		HMR--Hot Module Replacement热模块替换
​		什么意思？---当我们本地启动webpack-dev-server的时候，我们要对源码进行修改的时候,假如有很多文件，那么这时候，我们修改完一个文件之后，webpack-dev-server会对页面进行刷新，它会对所有的文件再一次进行打包构建，那么这时候，所有的文件都会被再一次打包构建，那么这时候，我们只想让这一个修改的文件打包优化，从而提高打包构建的速度，那么这时候就用到了HMR.

```javascript
	使用方法，在webpack的devServer配置中加入hot:true，即可生效
    注意：js，HTML默认是不能使用HMR的，但是我们的html文件只有一个，这就导致了一个问题，html文件不能热更新了，即对html做出改变页面无变化，解决办法：只需要在entry中加入html的位置就可以了
    entry: ['./src/js/index.js', './src/index.html']
	那么怎么样启动js文件的热模块替换？
    在打包js文件入口的js文件中，对需要启动HMR的文件做出配置即可。注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
    if (module.hot) {
  		// 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  		module.hot.accept('./js/b.js', function() {
    		// 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    		// 会执行后面的回调函数
   			add();
  		});
	}
	//css文件的HMR是通过style-loader实现的
```

##### 	2.优化代码调试--source-map

​		优化开发环境的代码调试是什么意思？

​		就是能够通过打包构建后的代码映射到源代码中的相应错误位置，并报出错误信息。

​		实现方式：

```javascript
devtool: 'eval-source-map'
```

​		source-map的用法:

```javascript
source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    source-map：外部
      错误代码准确信息 和 源代码的错误位置
    inline-source-map：内联
      只生成一个内联source-map
      错误代码准确信息 和 源代码的错误位置
    hidden-source-map：外部
      错误代码错误原因，但是没有错误位置
      不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map：内联
      每一个文件都生成对应的source-map，都在eval
      错误代码准确信息 和 源代码的错误位置
    nosources-source-map：外部
      错误代码准确信息, 但是没有任何源代码信息
    cheap-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      只能精确的行
    cheap-module-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      module会将loader的source map加入

    内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

    开发环境：速度快，调试更友好
      速度快(eval>inline>cheap>...)
        eval-cheap-souce-map
        eval-source-map
      调试更友好  
        souce-map
        cheap-module-souce-map
        cheap-souce-map

      --> eval-source-map  / eval-cheap-module-souce-map

    生产环境：源代码要不要隐藏? 调试要不要更友好
      内联会让代码体积变大，所以在生产环境不用内联
      nosources-source-map 全部隐藏
      hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

      --> source-map / cheap-module-souce-map
```
