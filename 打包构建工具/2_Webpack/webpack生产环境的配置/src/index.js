import './css/a.css';
import './css/b.css';
// import add from './js/a';

import $ from 'jquery'

//eslint-disable-next-line
console.log($)

// import '@babel/preset-env';

import { a, b } from './js/b';
// import { get } from 'core-js/core/dict';
// eslint-disable-next-line
console.log(a)
// eslint-disable-next-line
console.log(b)
// eslint-disable-next-line
// console.log(c)
// add();

const promise = new Promise((resolve) => {
  setTimeout(() => {
    // eslint-disable-next-line
    console.log('hello ~~~');
    resolve();
  }, 1000);
});
// eslint-disable-next-line
console.log(promise)

// $('#btn').click(function(){
//   const result=import(/*webpackChunkName:'test'*/'./js/a').then(res=>{
//     //eslint-disable-next-line
//     console.log(res)
//   })
//   //eslint-disable-next-line
//   console.log(result)
// })

// 注册serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}''

// 引入日期时间库
import moment from 'moment'

console.log('local',moment.locale())
