const queryString=require('querystring')

const query='id=2&name=tongyi&from=北京'                                                                       
const queryObj = { id: '2', name: 'tongyi', from: '北京' }
const queryEscape = 'id%3D2%26name%3Dtongyi%26from%3D%E5%8C%97%E4%BA%AC'
const query2 = 'id:2/name:tongyi/from:北京'

const newQuery = queryString.stringify(queryObj, null, null, {
  encodeURIComponent(string) {
    return queryString.unescape(string)
  }
})

console.log(queryString.parse(query))
console.log(queryString.stringify(queryObj))
console.log(newQuery)
console.log(queryString.escape(query))
console.log(queryString.unescape(query))
console.log(queryString.unescape(queryEscape))
console.log(queryString.parse(query2,'/',':'))
