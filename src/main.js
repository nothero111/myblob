import { createApp } from 'vue'
import pinia from '@/stores'
import 'amfe-flexible'
import '@/styles/common.css'
import '@/styles/js/rem.js'
import App from './App.vue'
import router from './router'
// 新增：导入组件
import mavonEditor from 'mavon-editor'

// 新增：导入样式
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(mavonEditor)
app.mount('#app')
