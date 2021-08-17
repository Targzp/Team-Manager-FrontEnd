/*
 * @Author: 胡晨明
 * @Date: 2021-08-17 12:59:53
 * @LastEditTime: 2021-08-17 13:23:51
 * @Description: storage 二次封装
 * @FilePath: \bloge:\Vue_store\manager-fe\src\utils\storage.js
 */
import config from '../config/index'
export default {
  setItem (key, val) {
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
  },
  getStorage () {
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  getItem (key) {
    return this.getStorage()[key]
  },
  clearItem (key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
  },
  clearAll () {
    window.localStorage.clear()
  }
}