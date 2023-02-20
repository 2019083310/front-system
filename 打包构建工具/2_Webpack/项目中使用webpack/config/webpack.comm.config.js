const path = require('path')

//插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  DefinePlugin
} = require('webpack')
const {
  VueLoaderPlugin
} = require('vue-loader/dist/index')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'javascript/auto',
        use: {
          loader: 'url-loader',
          options: {
            limit: 28 * 1024,
            name: 'img/[name]_[hash:6].[ext]',
            esModule: false
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:6][ext]'
        }
      },
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env']
          ]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      title: 'webpack基础'
    }),
    new DefinePlugin({
      BASE_URL: "'./'",
      __VUE_OPTIONS_API__:true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new VueLoaderPlugin()
  ],
  resolve:{
    extensions:['.wasm', '.mjs', '.js', '.json','.vue','.ts'],
    alias:{
      '@':path.join(__dirname,'../src/js')
    }
  }
}