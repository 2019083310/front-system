// ?webpack-dev-server的使用
// todo 1.compress 是否gzip压缩
// compress:true

// todo 2.hotOnly表示代码出错是否重新加载页面，hotOnly:false 进行就可以了

// todo 3.proxy 代理比较重要，是我们解决跨域的有效方案
// ?利用的原理就是当我们浏览器向服务器发送请求的时候，如果匹配到/api字段，把浏览器向服务器发送请求的base-url替换成target
// ?target就是服务器的真实地址，这样就不会产生跨域
// ?changeOrigin的作用是把向服务器发送请求的Header中的host替换成服务器的真实地址，也就是target
// *这样做的原因是因为，服务器有可能会进行校验，判断浏览器的host和服务器的Host是否一样，不一样可以防止爬虫
// '/api':{
    // target:"服务器的地址",
    // changeOrigin:true
    // pathWrite:{
        // 'api':''
    // }
// }

// todo 4.host:'0.0.0.0'
// ?这样我们npm run dev 的时候开启webpack-dev-server，和我们网络在同一个网段的设备，可以通过我们电脑的ip地址访问

// todo 5.historyApiFallback
// ?为true 的时候可以让用户访问不存在的路由时 返回Index.html