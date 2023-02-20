const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin=require('html-webpack-plugin')
// const MiniCssExtractPlugin=require('mini-css-extract-plugin')
module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // mode: 'development',
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          // 创建 style 标签，将样式放入 
          'style-loader', 
          // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件 
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test:/\.(jpg|png|jpeg)$/,
        use:{
          loader:'url-loader',
          options:{
            limit:8192,
            name:'img/[name].[hash:10].[ext]'
          }
        }
      },
      {
        test:/\.html$/,
        use:['html-loader']
      },
      {
        exclude:/\.(css|less|js)$/,
        use:['file-loader']
      }
    ]
  },
  plugins:[
    new htmlWebpackPlugin({
      template:'./src/index.html'
    }),
    // new MiniCssExtractPlugin({
    //   filename:'css/bundle.css'
    // })
  ],
  resolve: {
    extensions: ['.js', '.css', '.vue'],
    // 可以省略扩展名， 比如引入vue文件'./vue/App.vue' 可以写成'./vue/App'
  },
  devServer:{
    contentBase:'./dist',
    inline:true
  }
}