# webpack知识点总结(二)

#### 接上一篇webpack知识点总结(一):https://blog.csdn.net/weixin_50903927/article/details/121558016?spm=1001.2014.3001.5501

### 三、webpack生产环境的配置

#### 1.单独提取css文件

```javascript
下载插件:npm i --save-d mini-css-extract-plugin
引入插件:const MiniCssExtractPlugin=require('mini-css-extract-plugin')
使用插件:
	{ 
        test: /\.css$/, 
        use: [ 
            // 创建 style 标签，将样式放入 // 'style-loader', 
            // 这个loader 取代 style-loader。作用：提取 js 中的 css 成单独文件 
            MiniCssExtractPlugin.loader, 
            // 将 css 文件整合到 js 文件中 
         	'css-loader' 
        ] 
   	}
	plugin:[
        new MiniCssExtractPlugin({
            //对输出的css文件重命名
            filename:'css/built.css'
        })
    ]
```

#### 2.css兼容性处理

```javascript
下载插件:npm i --save-d postcss-loader postcss-preset-env
修改配置文件：
	{ 
        test: /\.css$/, 
        use: [ 
            MiniCssExtractPlugin.loader, 
            'css-loader', 
            { 
                loader: 'postcss-loader',
                options: { 
                    ident: 'postcss',
                    plugins: () => [ 
                        // postcss 的插件 
                        require('postcss-preset-env')() 
                    ] 
                }
            }
        ]
    }
	plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }), 
        new MiniCssExtractPlugin({ filename: 'css/built.css' }) 
    ]
```

#### 3.压缩css文件

```javascript
下载安装包：npm install --save-dev optimize-css-assets-webpack-plugin
修改配置文件:
	const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' )
    // 压缩 css 
    new OptimizeCssAssetsWebpackPlugin()
```

#### 4.js语法检查--eslint

```javascript
语法检查： eslint-loader  eslint
         注意：只检查自己写的源代码，第三方的库是不用检查的
         设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"
              }
        airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
	/*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
    */
	{
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
            //对语法错误主动修正
          fix: true
        }
     }
```

#### 5.js兼容性处理

   js兼容性处理：babel-loader @babel/core 
             1. 基本js兼容性处理 --> @babel/preset-env
                   换基本语法，如promise高级语法不能转换
             2. 全部js兼容性处理 --> @babel/polyfill  
                   解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
             3. 需要做兼容性处理的就做：按需加载  --> core-js

```javascript
下载安装包:npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/polyfill core-js
修改配置文件:
	{ 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader', 
        options: { 
            // 预设：指示 babel 做怎么样的兼容性处理 
            presets: [ 
                [ 
                    '@babel/preset-env', 
                    { 
                        // 按需加载 
                        useBuiltIns: 'usage', 
                        // 指定 core-js 版本 
                        corejs: { version: 3 },
                        // 指定兼容性做到哪个版本浏览器 
                        targets: { 
                            chrome: '60', 
                            firefox: '60', 
                            ie: '9', 
                            safari: '10', 
                            edge: '17' 
                        } 
                    } 
                ] 
            ] 
        } 
    }
```

#### 6.js压缩

```javascript
生产模式下会自动压缩js代码--mode='production'
```

#### 7.html文件的压缩

```javascript
 new htmlWebpackPlugin({
      template:path.join(__dirname,'./src/index.html'),
      filename:'webpack.html',
      //压缩html
      minify:{
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
 })
```

#### 8.webpack生产环境的优化

##### 	1.优化方面

```javascript
* 优化打包构建速度
  * oneOf
  * babel缓存
  * 多进程打包
  * externals
  * dll
* 优化代码运行的性能
  * 缓存(hash-chunkhash-contenthash)
  * tree shaking
  * code split
  * 懒加载/预加载
  * pwa
```

##### 	2.优化打包构建速度

- oneOf方法

  - webpack处理各个模块的时候，当处理到每一个模块的时候，都会把这个模块从webpack的配置中过一遍，意思就是每个文件都会进入到webpack配置的每一个loader中，这样速度肯定太慢了，因此可以使用oneof来解决这个问题

    ```javascript
    module:{
        rules:{
            oneOf:[{},{},...要设置的loader]
        }
    }
    ```

  - 但是使用oneof要注意，不能有两个配置处理同一种类型文件，有的话比如对js的处理包括eslint-loader,babel-loader,要把其中一个提取出来放在外面，这样两个loader都可以被处理

- babel缓存

  - babel缓存
  - cacheDirectory: true
        --> 让第二次打包构建速度更快

- 多进程打包

  - 我们的js是单线程的，那么当我们打包一个很大的文件的时候，速度肯定是有点慢的，因此，我们可以开启多线程，来打包，js代码肯定是最多的，因此主要是处理js的打包
  - 使用thread-loader结合babel-loader来开启多线程，但是这里要注意，开启多线程大概要600ms的时间，因此当我们文件非常小的时候，不要开启多线程，在文件很大很大的时候，在开启多线程

- externals

  - 这个主要是用来处理通过CDN引进来的连接，我们做处理不希望通过cdn的连接被打包

    ```javascript
    externals: {
        // 拒绝jQuery被打包进来
        jquery: 'jQuery'
      }
    ```

- dll

  - 这个技术就是用来对node_modules中的插件库单独打包成一个文件，而不是一个chunk

##### 3.优化代码运行性能

- tree shaking

  ​	什么是tree shaking?---就是为了去除源代码中没有使用的代码

  - 使用前提：1.必须使用ES6模块化    2.必须是生产模式production
  - 使代码体积减小，请求速度加快
  - 在一些版本中可能会有一些问题因此要在在package.json中配置 
          "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
            问题：可能会把css / @babel/polyfill （副作用）文件干掉
          "sideEffects": ["*.css", "*.less"]---解决这个问题

- 文件资源缓存
       hash: 每次wepack构建时会生成一个唯一的hash值。
          问题: 因为js和css同时使用一个hash值。
            如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
        chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
          问题: js和css的hash值还是一样的
            因为css是在js中被引入的，所以同属于一个chunk
        contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样    
        --> 让代码上线运行缓存更好使用

  ​	chunk就是以一个js文件为打包入口引入来的css,js,img等这种形式称为chunk

- code split---代码分割

  - 代码分割是什么意思？
  
    - 当我们打包文件时，所有的入口文件中引入的js/css/node_modules等这些模块，都会被打包到同一个js文件中，这样就会造成文件体积太大，导致我们请求资源时间过长，出现白屏现象，因此我们要想办法把不同的js模块提取出来，分割成多个打包的js文件。
    - 我们开发时，有单页面和多页面，现在大部分都是单页面，单页面肯定是有一个入口文件，但是多页面就会有多个入口文件。
  
  - 使用方法一：
  
    ```javascript
    修改入口文件:
     // 单入口
     // entry: './src/js/index.js',
     entry: {
        // 多入口：有一个入口，最终输出就有一个bundle
        index: './src/js/index.js',
        test: './src/js/test.js'
      },
     output: {
        // [name]：取文件名
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
      }
    ```
  
  - 使用方法二:
  
    ```javascript
    方法二就是将js模块中引入的node_modules中的第三方插件库提取成一个单独的js文件
    在webpack配置中添加optimization
    optimization: {
        splitChunks: {
          chunks: 'all'
        }
    }
    
    有两个作用:
    1. 可以将node_modules中代码单独打包一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
    ```
  
  - 使用方法三:
  
    ```javascript
    	方法三主要是对单页面打包js文件的处理主要是通过import('src')的动态导入语法实现的，能将通过import()语法导入的js文件打包成一个单独的文件
    	使用方法，就是在入口文件处，通过使用import()语法导入模块就可以了
    ```
  
- 懒加载/预加载

   - 这种方式主要也是解决单页面的代码运行速度的优化。

   - 懒加载就是按需导入，意思就是当我用到的时候才从服务器请求相应的代码，没用到的时候就不请求。

   - 实现方式，也是通过import('src')动态导入语法实现的

      ```javascript
      //这种操作是异步方法，会返回一个promise对象，因此存在弊端，就是当我这个导入的文件太大时，可能会造成请求时间过长，用户等待的现象。
      import(/* webpackChunkName: 'test' */'./test')
          .then(({ mul }) => {//导入成功的回调
          	console.log(mul(4, 5));
      	}).catch(()=>{//导入失败的回调
          	console.log('导入失败!')
      	})
      ```

   - 预加载就可以解决懒加载导入文件过大造成请求时间过长的问题，但是预加载的兼容性比较差，只适合干版本的浏览器，使用的时候要慎重。

   - 实现方式，和懒加载差不多，只需要在Import()语法上加入webpackPrefetch: true即可,表示预加载

      ```javascript
      import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test')
          .then(({ mul }) => {
          	console.log(mul(4, 5));
        	});
      //实现原理就是，在一开始请求的时候，如果其他资源都请求完成时，那么这个时候浏览器就可以偷偷去服务器请求预加载的资源，那么在用到的时候就可以直接从缓存读取，非常快。
      ```

- pwa

   - pwa是什么？就是一种离线可以访问网站的技术，比如淘宝就用了pwa

   - pwa结合serviceworker来使用，在webpack中借助workbox-webpack-plugin来使用

      ```javascript
      npm i workbox-webpack-plugin
      const WorkboxWebpackPlugin=require('workbox-webpack-plugin')
      new WorkboxWebpackPlugin.GenerateSW({
            /*
              1. 帮助serviceworker快速启动
              2. 删除旧的 serviceworker
              
              生成一个 serviceworker 配置文件~
            */
            clientsClaim: true,
            skipWaiting: true
          })
      ```

   - 还要在入口文件处注册serviceworker

      ```javascript
      // 注册serviceWorker
      // 处理兼容性问题
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => {
              console.log('sw注册成功了~');
            })
            .catch(() => {
              console.log('sw注册失败了~');
            });
        });
      }
      ```

   - 另外需要注意的是serviceworker必须运行在服务器端，也就是要把打包生成的静态资源挂载到服务器上。
