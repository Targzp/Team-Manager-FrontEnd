/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:11:23
 * @LastEditTime: 2021-08-25 21:26:41
 * @LastEditors: Please set LastEditors
 * @Description: api 管理
 * @FilePath: \bloge:\Vue_store\manager-fe\src\api\index.js
 */
import request from '../utils/request'
export default {
  login(params) {
    return request({
      method: 'post',
      url: '/users/login',
      data: params,
      mock: false
    })
  },
  noticeCount() {
    return request({
      method: 'get',
      url: '/leave/count',
      data: {},
      mock: true
    })
  },
  getMenuList(params) {
    return request({
      method: 'get',
      url: '/menu/list',
      data: params,
      mock: true
    })
  },
  getUserList(params) {
    return request({
      method: 'get',
      url: '/users/list',
      data: params,
      mock: false
    })
  },
  userDel(params) {
    return request({
      method: 'post',
      url: '/users/delete',
      data: params,
      mock: false
    })
  },
  getRoleList() {
    return request({
      method: 'get',
      url: '/roles/allList',
      data: {},
      mock: true
    })
  },
  getDeptList() {
    return request({
      method: 'get',
      url: '/dept/list',
      data: {},
      mock: true
    })
  },
  userSubmit(params) {
    return request({
      method: 'post',
      url: '/users/operate',
      data: params,
      mock: false
    })
  },
  menuSubmit(params) {
    return request({
      method: 'post',
      url: '/menu/operate',
      data: params,
      mock: true
    })
  }
}