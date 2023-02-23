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

// ?把第三方包合并为一个chunk打包成单独chunk
import dayjs from 'dayjs'
console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))

const res = formatDateTime(undefined,null)

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

// ?处理ts文件
import './ts/math.ts'

// ?懒加载引入js文件
import('./utils/01_mode.js').then(res=>{
  console.log('mode.js引入成功')
  console.log(res)
})