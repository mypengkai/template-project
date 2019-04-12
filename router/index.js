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
      component: () => import('@/views/dashboard/index'),
    }]
  },
  {
    path: '/trees',
    component: Layout,
    redirect: '/example/tree',
    name: 'Example',
    meta: { title: '日志管理', icon: 'check' },
    children: [
      {
        path: 'trees',
        name: 'Trees',
        component: () => import('@/views/trees/index'),
        meta: { title: '日志查看', icon: 'check' }
      }
    ]
  },

  {
    path: '/walkaroundInspection',
    component: Layout,
    meta: { title: '巡视管理', icon: 'example' },
    children: [
      {
        path: 'PatrolCheck',
        name: 'PatrolCheck',
        component: () => import('@/views/walkaroundInspection/PatrolCheck'),
        meta: { title: '巡视查看', icon: 'form' }
      }
    ]
  },

  {
    path: '/instruct',
    component: Layout,
    meta: { title: '指令管理', icon: 'instruct' },
    children: [
      {
        path: 'instructCheck',
        name: 'instructCheck',
        component: () => import('@/views/instruct/instructCheck'),
        meta: { title: '指令查看', icon: 'instructCheck' }
      },
      {
        path: 'instructReceive',
        name: 'instructReceive',
        component: () => import('@/views/instruct/instructReceive'),
        meta: { title: '指令接受', icon: 'instructReceive' }
      },
      {
        path: 'instructSend',
        name: 'instructSend',
        component: () => import('@/views/instruct/instructSend'),
        meta: { title: '指令发送', icon: 'instructSend', show: true }
      },
    ]
  },

  {
    path: '/accept',
    component: Layout,
    meta: { title: '工序验收', icon: 'example' },
    children: [
      {
        path: 'accept',
        name: 'SelectTree',
        component: () => import('@/views/process/accept'),
        meta: { title: '工序验收', icon: 'acceptance' }
      },
      {
        path: 'acceptjh',
        name: 'acceptjh',
        component: () => import('@/views/process/acceptjihua'),
        meta: { title: '验收计划查询', icon: 'acceptance' }
      },
      {
        path: 'accepthj',
        name: 'accepthj',
        component: () => import('@/views/process/accepthenji'),
        meta: { title: '验收痕迹查询', icon: 'acceptance' }
      },
      {
        path: "traceManage",
        name: "TraceManage",
        component: () => import('@/views/process/traceManage/traceManage'),
        meta: {
          title: "痕迹管理",
          icon: "acceptance"
        }
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
        meta: { title: '工程管理', icon: 'engineering' }
      },
      {
        path: 'processing',
        name: 'processing',
        component: () => import('@/views/basicManage/processManage'),
        meta: { title: '工序管理', icon: 'acceptance' }
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/basicsData/recharge'),
        meta: { title: '短信记录', icon: 'acceptance' }
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('@/views/basicsData/record'),
        meta: { title: '短信充值', icon: 'acceptance' }
      }
    ]
  },


  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user'),
        meta: { title: '用户信息', icon: 'information' }
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/system/resource'),
        meta: { title: '资源管理', icon: 'resource' }
      },
      {
        path: 'userDictionaries',
        name: 'userDictionaries',
        component: () => import('@/views/system/userDictionaries'),
        meta: { title: '组织机构', icon: 'dictionaries' }
      },
    ]
  },
  {
    path: '/synchronization',
    component: Layout,
    meta: { title: '数据同步', icon: 'example' },
    children: [
    {
    path: 'department',
    name: 'department',
    component: () => import('@/views/synchronization/department'),
    meta: { title: '同步部门', icon: 'example' }
    },
    {
    path: 'subscriber',
    name: 'subscriber',
    component: () => import('@/views/synchronization/subscriber'),
    meta: { title: '用户同步', icon: 'information' }
    }
    ]
    },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
