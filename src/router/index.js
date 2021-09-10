/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:02
 * @LastEditTime: 2021-09-10 16:39:01
 * @LastEditors: Please set LastEditors
 * @Description: 前端路由配置
 * @FilePath: \bloge:\Vue_store\manager-fe\src\router\index.js
 */
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '@/components/Home.vue'
import storage from '../utils/storage'
import api from '../api/index'
import utils from '../utils/utils'
const modules =
  import.meta.glob('../views/*.vue')

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
          title: '欢迎使用'
        },
        component: () => import('@/views/Welcome.vue')
      },
      /* {
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
      },
      {
        name: 'Dept',
        path: 'system/dept',
        meta: {
          title: '部门管理'
        },
        component: () => import('@/views/Dept.vue'),
      } */
    ]
  },
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

async function loadAsyncRoutes() {
  const userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    try {
      const {
        menuList
      } = await api.getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map(route => {
        let url = `../views/${route.component}.vue`
        route.component = modules[url]
        router.addRoute("Home", route)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

;
(async () => {
  await loadAsyncRoutes()
})()

// 导航守卫
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router