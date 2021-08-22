/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:11:23
 * @LastEditTime: 2021-08-22 15:30:23
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
  },
  noticeCount () {
    return request({
      method: 'get',
      url: '/leave/count',
      data: {},
      mock: true
    })
  },
  getMenuList () {
    return request({
      method: 'get',
      url: '/menu/list',
      data: {},
      mock: true
    })
  },
  getUserList (params) {
    return request({
      method: 'get',
      url: '/users/list',
      data: params,
      mock: true
    })
  },
  userDel (params) {
    return request({
      method: 'post',
      url: '/users/delete',
      data: params,
      mock: true
    })
  },
}