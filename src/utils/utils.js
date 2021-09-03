/*
 * @Author: 胡晨明
 * @Date: 2021-08-23 22:10:49
 * @LastEditTime: 2021-09-03 15:58:38
 * @LastEditors: Please set LastEditors
 * @Description: 工具函数封装
 * @FilePath: \bloge:\Vue_store\manager-fe\src\utils\utils.js
 */

export default {
    /**
     * @description: 时间格式化
     * @param {*} date
     * @param {*} rule
     */
    formateDate(date, rule) {
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let key in o) {
            if (new RegExp(`(${key})`).test(fmt)) {
                const val = o[key] + ''
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length))
            }
        }
        return fmt
    },
    generateRoute(list) {
        let routes = []
        const deep = (list) => {
            list.map(item => {
                if (item.action) {
                    routes.push({
                        name: item.component,
                        path: item.path,
                        meta: {
                            title: item.menuName
                        },
                        component: item.component
                    })
                }
                if (item.children && !item.action) {
                    deep(item.children)
                }
            })
        }
        deep(list)
        return routes
    }
}