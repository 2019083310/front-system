const http = require('http')
const server = http.createServer()
const fs = require('fs')
const template = require('art-template')
const url = require('url')
const path = require('path')

let comments = [{
    name: '张三',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三2',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三3',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三4',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  },
  {
    name: '张三5',
    message: '今天天气不错！',
    dateTime: '2015-10-16'
  }
];

server.on('request', (req, res) => {
  const obj=url.parse(req.url,true)
  const pathname=obj.pathname
  // console.log(url.parse(req.url,true))
  // res.setHeader('Content-Type','text/plain;charset=utf-8')
  // res.end('hello 你好呀')
  // res.setHeader('Content-Type','text/html;charset=utf-8')
  // res.end('<a href="http://www.baidu.com">百度</a>')
  if (req.url === '/') {
    fs.readFile('./views/index.html', (error, data) => {
      if (error) {
        console.log('404 Not Found')
        return
      }
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(template.render(data.toString(), {
        comments: comments
      }))
    })
  } else if (req.url === '/post') {
    fs.readFile('./views/post.html', (error, data) => {
      if (error) {
        console.log('404 Not Found')
        return
      }
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(data)
    })
  } else if (pathname === '/pinglun') {
    let com=obj.query
    com.dateTime='2019-8-12 17:11:22'
    comments.unshift(com)
    // console.log(obj.query)
    res.statusCode=302
    res.setHeader('Location','/')
    res.end()
  } else {
    fs.readFile('./views/404.html', (error, data) => {
      if (error) {
        console.log('404 Not Found')
        return
      }
      res.end(data)
    })
  }
})

server.listen(8000, () => {
  console.log('8000端口启动完毕!')
})