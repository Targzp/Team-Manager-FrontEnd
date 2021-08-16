/*
 * @Author: 胡晨明
 * @Date: 2021-08-16 20:38:12
 * @LastEditTime: 2021-08-16 21:18:41
 * @Description: axios 二次封装
 * @FilePath: \bloge:\Vue_store\manager-fe\src\utils\request.js
 */
import axios from 'axios'
import config from '../config/index'
import { ElMessage } from 'element-plus'
import router from '../router/index'
const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建 axios 实例,添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  // TODO
  const headers = req.headers
  if (!headers.Authorization) {
    headers.Authorization = 'hcm'
  }
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { errno, data, msg } = res.data
  if (errno === 200) {
    return data
  } else if (errno === 4001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
        router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * @description: 请求的核心函数
 * @param {*} options 请求配置
 */
function request (options) {
  options.method = options.method || 'get'

  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }

  return service(options)
}

export default request
