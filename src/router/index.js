/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:02
 * @LastEditTime: 2021-08-27 16:31:52
 * @LastEditors: Please set LastEditors
 * @Description: 前端路由配置
 * @FilePath: \bloge:\Vue_store\manager-fe\src\router\index.js
 */
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [{
    name: 'Home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: {
      name: 'Welcome'
    },
    children: [{
        name: 'Welcome',
        path: 'welcome',
        meta: {
          title: '欢迎使用 WorkTile'
        },
        component: () => import('@/views/Welcome.vue')
      },
      {
        name: 'User',
        path: 'system/user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/User.vue'),
      },
      {
        name: 'Menu',
        path: 'system/menu',
        meta: {
          title: '菜单管理'
        },
        component: () => import('@/views/Menu.vue'),
      },
      {
        name: 'Role',
        path: 'system/role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/views/Role.vue'),
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router