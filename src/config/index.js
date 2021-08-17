/**
 * @description: 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/602cc57a15bee9d95f525b451f5e2c66/api'
  },
  test: {
    baseApi: '/test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/602cc57a15bee9d95f525b451f5e2c66/api'
  },
  prod: {
    baseApi: '/futurefe.com/api',
    mockApi: ''
  }
}
export default {
  env: env,
  mock: true,
  namespace: 'manager',
  ...EnvConfig[env]
}