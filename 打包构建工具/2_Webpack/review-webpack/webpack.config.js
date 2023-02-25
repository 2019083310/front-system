const path = require('path')

// ?帮助我们在开发环境快速打包清除build以前打包的plugin
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

// ?对文件复制到打包文件中
const CopyWebpackPlugin = require('copy-webpack-plugin')

// ? 打包html文件使用HtmlWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

// ?把css文件单独提取出来
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// ?压缩css文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// ?处理vue sfc
const {
  VueLoaderPlugin
} = require('vue-loader/dist/index')

module.exports = {
  // ?热更新之前写法
  // entry: './src/index.js',
  // ?热更新之后写法
  // *js,HTML默认是不能使用HMR的，但是我们的html文件只有一个，这就导致了一个问题，html文件不能热更新了，
  // *即对html做出改变页面无变化，解决办法：只需要在entry中加入html的位置就可以了
  // *css文件的HMR是通过style-loader实现的
  entry: ['./src/index.js', './public/index.html'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name][contenthash:8].js',
    // ?通过node_modules或者import()语法引入的单独打包形成一个文件
    chunkFilename: 'js/[name][contenthash:8].js',
    // ?这个clean为true可以替换clean-webpack-plugin插件
    // clean:true
  },
  module: {
    rules: [
      // * style-loader css==>style内部样式表
      // * css-loader对css文件的处理
      // * less-loader对less文件的处理 less==>css
      // ?如果要转化为外部样式表，需要CSSPlugin处理
      {
        test: /\.css$/,
        use: [
          // *热更新要用style-loader
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          // postcss处理样式兼容
          {
            loader: 'postcss-loader',
            // options: {
            //   ident: 'postcss',
            //   plugins: () => [
            //     // postcss 的插件 
            //     require('postcss-preset-env')()
            //   ]
            // }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader', 'less-loader'
        ]
      },
      // *打包处理图片资源
      // todo 1.使用url-laoder
      // 这个url-loader只能解析样式之中的图片,需要借助html-loader打包html中的图片资源
      // limit的作用:图片小于10kb，就会被base64处理
      // 优点: 减少请求数量（减轻服务器压力）
      // 缺点：图片体积会更大（文件请求速度更慢）
      // {
      //   test: /\.(jpg|jpeg|gif|png|svg)$/,
      //   type: "javascript/auto",
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       limit: 1024 * 10,
      //       name: 'img/[hash:10].[ext]',
      //       esModule: false
      //     }
      //   }
      // }
      // todo 2.使用asset-module-type处理图片资源
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        type: 'asset',
        generator: {
          filename: 'img/[hash:10].[ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024
          }
        }
      },
      // ?打包处理文件或者其它资源  或者用file-loader
      {
        test: /\.(woff2?|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name][hash:8].[ext]'
        }
      },
      // ?处理vue sfc
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // ?处理html的图片资源
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // ?babel-loader的使用  js兼容处理 jsx处理
      {
        test: /\.(m?jsx?|ts)$/,
        exclude: /node_modules/,
        //   // *loader的使用方式：三种
        //   // todo 1.use:['style-loader','css-loader','less-loader']
        //   // todo 2.use:'babel-loader'
        //   // todo 3.use:[{loader:'babel-loader'}]
        loader: 'babel-loader',
        //   options: {
        //     // 预设，指示babel需要做什么兼容性处理
        //     // *@babel/presets-env 基本兼容性处理，不能处理promise
        //     // *@babel/polyfill 全部兼容性处理
        //     // *core-js做压缩处理
        //     // presets: [
        //     //   // require('@babel'),
        //     //   {
        //     //     // 按需加载 
        //     //     useBuiltIns: 'usage',
        //     //     // 指定 core-js 版本 
        //     //     corejs: {
        //     //       version: 3
        //     //     },
        //     //     // 指定兼容性做到哪个版本浏览器 
        //     //     targets: {
        //     //       chrome: '60',
        //     //       firefox: '60',
        //     //       ie: '9',
        //     //       safari: '10',
        //     //       edge: '17'
        //     //     }
        //     //   }
        //     // ]
        //   }
      }
    ]
  },
  plugins: [
    // ? 打包html文件使用HtmlWebpackPlugin
    // *注意，html文件中有icon，所以需要其它的plugin帮助打包Icon
    new HtmlWebpackPlugin({
      title: 'webpack review',
      filename: 'index.html',
      template: path.join(__dirname, './public/index.html'),
      //* 压缩html
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: './public/favicon.ico',
        to: path.join(__dirname, './dist/favicon.ico')
      }]
    }),
    // ?提取css文件
    new MiniCssExtractPlugin({
      filename: 'css/[hash:10].css'
    }),
    // ?压缩css文件
    new OptimizeCssAssetsWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  // ?production环境下，js会自动压缩
  // !生产环境下+ES6模块化，会有tree shaking（树摇下来，无用代码）
  mode: 'production',
  resolve: {
    // 可以不用写后缀名引入文件
    extensions: ['.mjs', '.js', '.json', '.css', '.vue'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  //? source-map 开发环境下，调试用
  // * 包括：source-map,inline-source-map,hidden-source-map,eval-source-map等
  devtool: 'source-map',
  // ?开启dev-server  实时更新最新代码
  // *webpack-cli 升级到 4.x 的时候，就不能用 webpack-dev-server 跑脚本了，而是改为 webpack serve 去跑
  devServer: {
    // ?这里的static可以是一个数组，['public','文件夹']
    // ?表示的是index.html中请求不到的url,最后到static的文件夹中寻找文件
    static: {
      // webpack5不支持contentBase,支持static
      // contentBase:'./abc',
      directory: path.join(__dirname, './public')
    },
    port: 8088,
    open: true,
    // host: '0.0.0.0',
    // ?HMR热模块替换 hotModuleReplacement 开启dev sever 更新文件页面会刷新，会全部进行打包，
    // ?开启热更新，只对内容改变的文件打包
    hot: true,
    //设置跨域代理服务器
    //这种方式需要在devServer中配置
    proxy: {
      'api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        pathWrite: ''
      }
    },
    // ?compress属性表示是否进行gzip压缩
    compress: true,
    historyApiFallback: true
  },
  // ?代码分割 第三方库单独打包形成一个chunk
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  // todo 通过这个可以把webpack认为某个包打包文件太大的提示禁用掉
  performance: {
    hints: false
  }
}