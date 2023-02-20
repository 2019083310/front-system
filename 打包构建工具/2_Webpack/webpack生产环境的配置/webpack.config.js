const path = require('path')

// Tree-Shaking的副作用：如果我们只是引入一个函数，但是没有使用，在引入的函数所在的文件使用了，依然会进行打包
// 不光是函数，原型链、给window添加属性都会被打包，可以通过sideEffect:false来解决
// 但是又会引起一个问题，css,less这样的文件也会被过滤，因此解决的办法是在Package.json中通过sideEffect:['*.css']
// 忽略对指定文件的过滤
// 只有esModule才能实现Tree-shaking commonJs不可以
const CompressionPlugin=require('compression-webpack-plugin')

const webapck = require('webpack')

//对打包进行方便化,不用手动删除dist文件夹
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

//引入pwa使用插件
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

//打包html文件
const htmlWebpackPlugin = require('html-webpack-plugin')

//css文件的提取兼容性处理
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//css文件的压缩
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

//设置node.js环境变量
// process.env.NODE_ENV='production'//默认是production的环境
//找到环境变量之后会去package.json文件中去找browserslist的环境
//browserslist的环境就是设置浏览器的兼容性


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'js/bundle.[contenthash:10].js'
  },
  mode: 'production', //这个并不决定Node.js的环境
  module: {
    rules: [
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   //优先执行
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   options: {
      //     // 自动修复eslint的错误
      //     fix: true
      //   }
      // },
      {
        oneOf: [{
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader, //代替style-loade,从js文件中提取css成单独文件，通过link标签引入r
              // 'style-loader',//style-loader是从js文件提取出css并生成style放入到页面中
              'css-loader', //css-loader是将css放入js文件中
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugin: () => [
                    //postcss的插件，用于寻找环境变量
                    require('postcss-preset-env')()
                  ]
                }
              }
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              'thread-loader',
              {
              loader: 'babel-loader',
              options: {
                //预设，指示babel做怎么样的兼容性处理
                presets: [
                  [
                    '@babel/preset-env',
                    // {
                    //   //按需加载
                    //   useBuiltIns:'usage',
                    //   //指定core-js版本
                    //   corejs:{
                    //     version:2
                    //   },
                    //   //指定兼容性做到哪个版本的浏览器
                    //   targets:{
                    //     chrome: '60',
                    //     firefox: '60',
                    //     ie: '8',
                    //     safari: '10',
                    //     edge: '17'
                    //   }
                    // }
                  ]
                ],
                // 开启babel缓存
                // 第二次构建时，会读取之前的缓存
                cacheDirectory: true
              }
            }]
          },
          {
            test: /\.(jpg|png|gif)/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
              esModule: false
            }
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          },
          {
            exclude: /\.(js|css|less|html|jpg|png|gif)/,
            loader: 'file-loader',
            options: {
              outputPath: 'media'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html',
      //压缩html
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 对css文件重命名
      filename: 'css/built.[contenthash:10].css'
    }),
    //压缩css文件
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      /*
        1. 帮助serviceworker快速启动
        2. 删除旧的 serviceworker
        
        生成一个 serviceworker 配置文件~
      */
      clientsClaim: true,
      skipWaiting: true
    }),
    // 避免引入的第三方库未使用的文件,减小打包后文件的体积
    new webapck.IgnorePlugin(/\.\/local/, /moment/),
    new CompressionPlugin({
      test:/\.(js|css)$/i,
      filename:'[path][base].gz',
      algorithm:'gzip',
      threshold:10240,
      minRatio:0.8,
      deleteOriginalAssets:true
    })
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  externals: {
    // 拒绝jQuery被打包进来
    jquery: 'jQuery'
  }
}