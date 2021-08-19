/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:11:23
 * @LastEditTime: 2021-08-19 14:06:58
 * @LastEditors: Please set LastEditors
 * @Description: api 管理
 * @FilePath: \bloge:\Vue_store\manager-fe\src\api\index.js
 */
import request from '../utils/request'
export default {
  login (params) {
    return request({
      method: 'post',
      url: '/users/login',
      data: params,
      mock: false
    })
  }
}