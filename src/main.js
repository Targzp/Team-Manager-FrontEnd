import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router/index'
import App from './App.vue'
import request from './utils/request'

const app = createApp(App)
app.config.globalProperties.$request =  request
app.use(router).use(ElementPlus).mount('#app')
