import './assets/css/basic.css'
import './assets/css/index.less'

import './assets/font/iconfont.css'

import {add} from './utils/math'

// 为div增加一个tupian
const bgDiv=document.createElement('div')
bgDiv.style.width=200+'px'
bgDiv.style.height=200+'px'
bgDiv.style.display='inline-block'
bgDiv.className='bg-image'

document.body.appendChild(bgDiv)

// 字体的处理
const iEl=document.createElement('i')

iEl.className='iconfont icon-ashbin'
document.body.appendChild(iEl)

// 引入vue组件
import {createApp} from 'vue'
import App from './vue/App.vue'

createApp(App).mount('#app')
console.log(add(1,2))

if(module.hot){
  module.hot.accept('./utils/math.js',()=>{
    console.log('util更新了');
  })
}