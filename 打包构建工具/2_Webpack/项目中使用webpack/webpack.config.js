const path = require('path')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader/dist/index')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

const {
  DefinePlugin
} = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  mode: 'development',
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          // 创建 style 标签，将样式放入 // 'style-loader', 
          // 这个loader 取代 style-loader。作用：提取 js 中的 css 成单独文件 
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      //webpack5新的处理方式，以前的url-loader，file-loader使社区在维护的
      // 现在webpack5内置了处理这些模块的功能成为assetModuleType---资源模块类型
      // {
      //   test: /\.(jpg|jpeg|png|svg|gif)$/,
      //   loader: 'url-loader',
      //   type:"javascript/auto",
      //   options: {
      //     limit:28*1024,
      //     name:'img/[name]_[hash:8].[ext]',
      //     esModule:false
      //   }
      // }
      // 资源模块类型 assetsModuleType
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      filename: 'index.html',
      title: '你好啊，李银河',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new copyWebpackPlugin({
      patterns: [{
        from: './public/*.ico',
        to: path.join(__dirname, 'dist/favicon.ico')
      }]
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[hash:8].css'
    }),
    new CssMinimizerPlugin()
  ],
  devServer: {
    static: {
      // webpack5不支持contentBase,支持static
      // contentBase:'./abc',
      directory: path.join(__dirname, './public')
    },
    hot: true,
    open: true,
    compress: true,
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://128.30.1.4',
        changeOrigin: true,
        pathWrite: ''
      }
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.vue', '.ts'],
    alias: {
      '@': path.join(__dirname, './src')
    }
  }
}