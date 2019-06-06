import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//
export const constantRouterMap = [{
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录',
      icon: 'table'
    }
  }, {
    path: '/platform',
    name: 'platform',
    component: () => import('@/views/platform/index'),
    hidden: true,
    meta: {
      title: '单点登录',
      icon: 'table'
    }
  }, {
    path: '/',
    component: () => import('@/views/layout/Layout'),
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: {
      title: '首页',
      icon: 'table'
    },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
