// ?webpack性能优化有很多角度
// ?主要分为开发环境优化和生产环境优化
// ?无论什么环境优化，都是围绕两个方向:打包速度优化，打包体积优化
// todo 打包体积优化
// todo 主要包括，代码分割，tree shaking,gzip压缩,懒加载(react/vue组件)

// todo 打包速度优化
// todo 主要包括：代码丑化,多进程打包(thread-loader),babel-loader的缓存，cacheContent:true,cdn缓存,loader的匹配(one of),pwa(离线缓存)

// *首先我们来看一个重要的:代码分割 code splitting
// *什么意思呢：如果我们不做任何处理的话，会发现，所有的文件在webpack的打包下，会构成一个依赖图，所有的依赖文件
// *都会被打包到一个bundle.js中，那么这个文件中实际上是包含很多代码：
// todo 包括:a.我们的业务代码 b.第三方库的代码 c.webpack的运行时代码
// *这么多代码被打包到同一个js文件中，会造成体积过大
// todo 就会引起几个问题：a.体积过大，不方便管理 b.体积过大，浏览器解析时间长，会出现页面白屏的效果
// ?解决这个问题，可能会有SSR(服务端渲染),懒加载(预加载),代码分割,树摇等处理方式
// *code splitting 主要有三种方式:
// todo a.多入口打包
// todo b.import()的懒加载
// todo c.自定义分包 splitChunksPlugin

// ?1.多入口打包
// todo 指的是在webpack 的entry中我们可以利用entry解析入口文件进行多入口打包，主要的使用方式是:
// ?entry是一个对象，具体的参数属性可以查看官网理解
// entry: {
//   index: {
//     import: './src/index.js'
//   },
//   main: {
//     import: './src/main.js'
//   }
// }