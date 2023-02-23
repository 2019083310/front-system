// ?mode有三个值：development production none
// todo 1.在none模式下，webpack打包不会做任何的优化处理
// todo 2.在development模式下，会做很多的优化处理，包括，devtool调试为eval-source-map,环境变量注入，缓存等等
// todo 3.在production模式下会做环境变量注入process.env_NODE_ENV='production'

// *更多的优化处理看webpack官方文档
const process=require('process')
console.log(process)