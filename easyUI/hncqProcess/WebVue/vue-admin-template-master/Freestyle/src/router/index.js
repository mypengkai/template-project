import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: { title: '首页', icon: 'table' },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },


  {
    path: '/trees',
    component: Layout,
    redirect: '/example/tree',
    name: 'Example',
    meta: { title: '日志管理', icon: 'example' },
    children: [
      {
        path: 'trees',
        name: 'Trees',
        component: () => import('@/views/trees/index'),
        meta: { title: '日志查看', icon: 'tree' }
      }
    ]
  },

  {
    path: '/xsgl',
    component: Layout,
    meta: { title: '巡视管理', icon: 'example' },
    children: [
      {
        path: 'xsck',
        name: 'Xsck',
        component: () => import('@/views/xsgl/xsck'),
        meta: { title: '巡视查看', icon: 'form' }
      }
    ]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/table',
    name: 'table',
    meta: { title: '树形控件', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/treeTable/treeTable.vue'),
        meta: { title: '基础树', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '可选择默认展开', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    meta: { title: '轮播图', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '普通轮播', icon: 'form' }
      },
      {
        path: 'lantern',
        name: 'lantern',
        component: () => import('@/views/lantern/index'),
        meta: { title: '卡片3D', icon: 'form' }
      }
    ]
  },

  {
    path: '/video',
    component: Layout,
    children: [
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/index'),
        meta: { title: '视频', icon: 'link' }
      }
    ]
  },

  {
    path: '/basicsData',
    component: Layout,
    meta: { title: '基础数据', icon: 'example' },
    children: [
      {
        path: 'engineering',
        name: 'basicsData',
        component: () => import('@/views/basicsData/engineering'),
        meta: { title: '工程管理', icon: 'form' }
      },
    ]
  },

  {
    path: '/process',
    component: Layout,
    meta: { title: '工序验收', icon: 'example' },
    children: [
      {
        path: 'accept',
        name: 'process',
        component: () => import('@/views/process/accept'),
        meta: { title: '工序验收', icon: 'form' }
      },
    ]
  },

  {
    path: '/inform',
    component: Layout,
    meta: { title: '通知', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'inform',
        component: () => import('@/views/inform/index'),
        meta: { title: '通知首页', icon: 'form' }
      },
    ]
  },

  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'form' }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user'),
        meta: { title: '用户字典', icon: 'form' }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
