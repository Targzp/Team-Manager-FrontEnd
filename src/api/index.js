/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:11:23
 * @LastEditTime: 2021-09-09 20:14:47
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
      mock: false
    })
  },
  getMenuList(params) {
    return request({
      method: 'get',
      url: '/menu/list',
      data: params,
      mock: false
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
  getAllUserList() {
    return request({
      method: 'get',
      url: '/users/all/list',
      data: {},
      mock: false
    })
  },
  getPermissionList() {
    return request({
      method: 'get',
      url: '/users/getPermissionList',
      data: {},
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
  getRoleNameList() {
    return request({
      method: 'get',
      url: '/roles/allList',
      data: {},
      mock: false
    })
  },
  getRoleList(params) {
    return request({
      method: 'get',
      url: '/roles/list',
      data: params,
      mock: false
    })
  },
  getDeptList(params) {
    return request({
      method: 'get',
      url: '/dept/list',
      data: params,
      mock: false
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
      mock: false
    })
  },
  roleSubmit(params) {
    return request({
      method: 'post',
      url: '/roles/operate',
      data: params,
      mock: false
    })
  },
  updatePermission(params) {
    return request({
      method: 'post',
      url: '/roles/update/permission',
      data: params,
      mock: false
    })
  },
  deptSubmit(params) {
    return request({
      method: 'post',
      url: '/dept/operate',
      data: params,
      mock: false
    })
  },
  getApplyList(params) {
    return request({
      method: 'get',
      url: '/leave/list',
      data: params,
      mock: false
    })
  },
  applySubmit(params) {
    return request({
      method: 'post',
      url: '/leave/operate',
      data: params,
      mock: false
    })
  },
  approveSubmit(params) {
    return request({
      method: 'post',
      url: '/leave/approve',
      data: params,
      mock: false
    })
  },
}