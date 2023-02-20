const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

const copyPlugin = require('copy-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  entry: ['./src/index.js', './src/index.html'],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            // name:'[hash:10].[ext]',
            outputPath: 'imgs',
            esModule: false
          }
        }
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        exclude: /\.(html|css|jpg|png|jpeg|gif|js|less)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'media'
          }
        }
      }
    ]
  },
  mode: 'development',
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    // new copyPlugin({
    //   patterns: [
    //     {
    //       from: './public/*.ico',
    //       to: path.join(__dirname, './dist/favicon.ico'),
    //     },
    //     {
    //       from: './public/libs',
    //       to: path.join(__dirname, './dist/libs'),
    //     }
    //   ]
    // })
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    hot: true,
    // port:3000
    //设置跨域代理服务器
    // proxy: {
    //   "/api": {
    //     target: 'http://localhost:3000'
    //   },
    // }
  },
  devtool: 'eval-source-map'
}