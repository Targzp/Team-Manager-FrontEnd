/*
 * @Author: 胡晨明
 * @Date: 2021-08-16 22:00:56
 * @LastEditTime: 2021-08-18 22:24:08
 * @Description: 入口文件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\main.js
 */
import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router/index'
import store from './store/index'
import App from './App.vue'
import api from './api/index'
import request from './utils/request'
import storage from './utils/storage'
import './assets/style/index.scss'
import './assets/style/reset.css'

const app = createApp(App)
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(router).use(store).use(ElementPlus).mount('#app')
