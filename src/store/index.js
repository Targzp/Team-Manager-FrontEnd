/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:09
 * @LastEditTime: 2021-08-30 16:37:43
 * @LastEditors: Please set LastEditors
 * @Description: Vuex 状态管理
 * @FilePath: \bloge:\Vue_store\manager-fe\src\store\index.js
 */

import {
    createStore
} from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
    userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
    menuList: storage.getItem('menuList') || [], // 获取当前用户菜单列表
    actionList: storage.getItem('actionList') || [], // 获取当前用户按钮列表
    noticeCount: 0 // 获取当前用户审批通知数
}
export default createStore({
    state,
    mutations
})