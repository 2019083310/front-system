import './css/index.css'

import './css/a.less'

import {a,b,c} from './js/a'

console.log(a)
console.log(b)
console.log(c)

document.write('123')

import add from './js/b'

add()

if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./js/b.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
   add();
  });
}

