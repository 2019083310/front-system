import {
  formatDateTime
} from '@/utils/format'

// 引入css文件
import '@/assets/css/index.css'
import '@/assets/css/font.css'

// 引入less文件
import './assets/less/index.less'
import {
  createApp
} from 'vue'
import Hello from '@/vue/hello.vue'

import dayjs from 'dayjs'
console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))

const res = formatDateTime()

console.log(res)
console.log(1)

// ?引入vue组件
const app=createApp(Hello)

app.mount('#app')

// document.write('zbc')
// console.log(1)

// ?hot只能处理非入口文件的其它Js文件
if(module.hot){
  module.hot.accept('./utils/format.js',()=>{
    console.log('hot')
  })
}

const customVariable='coderyliu'
console.log(customVariable)

import './ts/math.ts'