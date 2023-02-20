const url=require('url')

const urlString='https://www.baidu.com:443/path/index.html?id=2&name="liu"'

const obj={
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com:443',
  port: '443',
  hostname: 'www.baidu.com',
  hash: null,
  search: '?id=2',
  query: 'id=2',
  pathname: '/path/index.html',
  path: '/path/index.html?id=2',
  href: 'https://www.baidu.com:443/path/index.html?id=2'
}
console.log(url.parse(urlString))
// console.log(url.format(obj))
