const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
  merge
} = require('webpack-merge')

const path = require('path')
const commConfig = require('./webpack.comm.config')

module.exports = merge(commConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: './public',
        to: './',
        globOptions: {
          ignore: [
            '**/index.html'
          ]
        }
      }]
    }),
  ]
})