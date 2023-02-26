// ?这个文件是用来处理vue

import {
  createApp
} from 'vue'
import Hello from '@/vue/hello.vue'


// ?引入vue组件
const app = createApp(Hello)

app.mount('#app')