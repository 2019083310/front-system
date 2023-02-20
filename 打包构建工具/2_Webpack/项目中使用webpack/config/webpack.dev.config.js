const {
  merge
} = require('webpack-merge')
const path = require('path')
const commConfig = require('./webpack.comm.config')

module.exports = merge(commConfig, {
  // 设置模式
  // development 开发阶段, 会设置development
  // production 准备打包上线的时候, 设置production
  mode: 'development',
  devtool: 'eval-source-map',
  // watch:true,
  devServer: {
    // webpack5不支持contentBase,支持static
    // contentBase:'./abc',
    static: {
      directory: path.join(__dirname, '../public')
    },
    hot: true,
    // host:'0.0.0.0',
    port: 8888,
    // open:true,
    compress: true,
    proxy: {
      'api': {
        target: 'http://127.0.0.1:5000',
        secure: false,
        changeOrigin: true,
      }
    }
  },
})