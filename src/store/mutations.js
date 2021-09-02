/*
 * @Author: 胡晨明
 * @Date: 2021-08-18 22:14:58
 * @LastEditTime: 2021-08-18 22:21:23
 * @LastEditors: Please set LastEditors
 * @Description: Mutations 业务层数据提交
 * @FilePath: \bloge:\Vue_store\manager-fe\src\store\mutations.js
 */
import storage from '../utils/storage'

export default {
  saveUserInfo(state, payload) {
    state.userInfo = payload
    storage.setItem('userInfo', payload)
  },
  saveUserMenuList(state, payload) {
    state.menuList = payload
    storage.setItem('menuList', payload)
  },
  saveUserActionList(state, payload) {
    state.actionList = payload
    storage.setItem('actionList', payload)
  }
}