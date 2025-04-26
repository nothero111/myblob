import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'amfe-flexible'
import '@/styles/common.css'
import '@/styles/js/rem.js'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
