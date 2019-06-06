import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {generateIndexRouter } from '@/utils/index'
import {constantRouterMap } from '@/router'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permissionList.length ===0) {
        store.dispatch('GetPermissionList').then(res => { // 拉取用户信息
          const menuData=res.data.data;
          if (menuData === null || menuData === "" || menuData === undefined) {
            return;
          }
          let constRoutes = generateIndexRouter(menuData);
          // 添加主界面路由
          store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            //debugger;
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
              //next({ path: redirect })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
          next()
        }).catch((err) => {
          Message({
            showClose: true,
            message: '请求用户信息失败，请重试！',
            type: 'error'
          });
          store.dispatch('LogOut').then(() => {
            next({ path: '/login', query: { redirect: to.fullPath } })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
