// ?使用entry需要借助两个库来使用
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

// import {
//   formatDateTime
// } from '@/utils/format'

// 引入css文件
import '@/assets/css/index.css'
import '@/assets/css/font.css'

// 引入less文件
import './assets/less/index.less'

import ReactDom from 'react-dom/client'

// ?把第三方包合并为一个chunk打包成单独chunk
import dayjs from 'dayjs'
console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))

// const res = formatDateTime(undefined,null)
// ?hot只能处理非入口文件的其它Js文件
if(module.hot){
  module.hot.accept('./utils/format.js',()=>{
    console.log('hot')
  })
}

// ?处理ts文件
import './ts/math.ts'

// ?懒加载引入js文件
import('./utils/01_mode.js').then(res=>{
  console.log('mode.js引入成功')
  console.log(res)
})

// ?处理react
import App from './react/App.jsx'
const root=ReactDom.createRoot(document.querySelector('#root'))
root.render(<App></App>)