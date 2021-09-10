/*
 * @Author: your name
 * @Date: 2021-08-21 23:00:25
 * @LastEditTime: 2021-09-10 16:30:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \bloge:\Vue_store\manager-fe\src\config\index.js
 */
/**
 * @description: 环境配置封装
 */
const env =
  import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/602cc57a15bee9d95f525b451f5e2c66/api'
  },
  test: {
    baseApi: '/test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/602cc57a15bee9d95f525b451f5e2c66/api'
  },
  prod: {
    baseApi: '/api',
    mockApi: ''
  }
}
export default {
  env: env,
  mock: false,
  namespace: 'manager',
  ...EnvConfig[env]
}