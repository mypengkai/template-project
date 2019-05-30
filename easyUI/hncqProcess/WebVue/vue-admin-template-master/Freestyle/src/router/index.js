import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login/index'
import error from "@/views/login/index"

import dashboard from '@/views/dashboard'
import platform from '@/views/platform/index'

import trees from '@/views/trees/index'

import PatrolCheck from '@/views/walkaroundInspection/PatrolCheck'
import instructCheck from '@/views/instruct/instructCheck'
import instructReceive from '@/views/instruct/instructReceive'
import instructSend from '@/views/instruct/instructSend'
import accept from '@/views/process/accept'
import acceptjh from '@/views/process/acceptjihua'
import accepthj from '@/views/process/accepthenji'
import traceManage from '@/views/process/traceManage/traceManage'

import engineering from '@/views/basicsData/engineering'
import processing from '@/views/basicManage/processManage'

import role from '@/views/system/role'
import user from '@/views/system/user'
import resource from '@/views/system/resource'
import userDictionaries from '@/views/system/userDictionaries'


import department from '@/views/synchronization/department'
import subscriber from '@/views/synchronization/subscriber'




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
// resolve => require(['../components/hello'], resolve),
export const constantRouterMap = [
  // { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/login',
    // component: login => require(['@/views/login/index'], login),
    component: login,
    hidden: true
  },

  // { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/404',
    // component: error => require(['@/views/login/index'], error),
    component: error,
    hidden: true
  },
  // 平台入口模块
  {
    path: '/platform',
    name: 'platform',
    component: platform,
    //  component: platform=>require(['@/views/platform/index'],platform),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: {
      title: '首页',
      icon: 'table'
    },
    children: [{
      path: 'dashboard',
      // component: () => import('@/views/dashboard/index'),
      // component: dashboard => require(['@/views/dashboard/index'], dashboard)
      component: dashboard
    }]
  },
  {
    path: '/trees',
    component: Layout,
    redirect: '/example/tree',
    name: 'Example',
    meta: {
      title: '日志管理',
      icon: 'check'
    },
    children: [{
      path: 'trees',
      name: 'Trees',
      // component: () => import('@/views/trees/index'),
      // component: trees => require(['@/views/trees/index'], trees),
      component: trees,
      meta: {
        title: '日志查看',
        icon: 'check'
      }
    }]
  },

  {
    path: '/walkaroundInspection',
    component: Layout,
    meta: {
      title: '巡视管理',
      icon: 'example'
    },
    children: [{
      path: 'PatrolCheck',
      name: 'PatrolCheck',
      // component: () => import('@/views/walkaroundInspection/PatrolCheck'),
      // component: PatrolCheck => require(['@/views/walkaroundInspection/PatrolCheck'], PatrolCheck),
      component: PatrolCheck,
      meta: {
        title: '巡视查看',
        icon: 'form'
      }
    }]
  },

  {
    path: '/instruct',
    component: Layout,
    meta: {
      title: '指令管理',
      icon: 'instruct'
    },
    children: [{
        path: 'instructCheck',
        name: 'instructCheck',
        // component: () => import('@/views/instruct/instructCheck'),
        // component: instructCheck => require(['@/views/instruct/instructCheck'], instructCheck),
        component: instructCheck,
        meta: {
          title: '指令查看',
          icon: 'instructCheck'
        }
      },
      {
        path: 'instructReceive',
        name: 'instructReceive',
        // component: () => import('@/views/instruct/instructReceive'),
        // component: instructReceive => require(['@/views/instruct/instructReceive'], instructReceive),
        component: instructReceive,
        meta: {
          title: '指令接受',
          icon: 'instructReceive'
        }
      },
      {
        path: 'instructSend',
        name: 'instructSend',
        // component: () => import('@/views/instruct/instructSend'),
        // component: instructSend => require(['@/views/instruct/instructSend'], instructSend),
        component: instructSend,
        meta: {
          title: '指令发送',
          icon: 'instructSend',
          show: true
        }
      },
    ]
  },

  {
    path: '/accept',
    component: Layout,
    meta: {
      title: '工序验收',
      icon: 'example'
    },
    children: [{
        path: 'accept',
        name: 'SelectTree',
        // component: () => import('@/views/process/accept'),
        // component: accept => require(['@/views/process/accept'], accept),
        component: accept,
        meta: {
          title: '工序验收',
          icon: 'acceptance'
        }
      },
      {
        path: 'acceptjh',
        name: 'acceptjh',
        // component: () => import('@/views/process/acceptjihua'),
        // component: acceptjh => require(['@/views/process/acceptjihua'], acceptjh),
        component: acceptjh,
        meta: {
          title: '验收计划查询',
          icon: 'acceptance'
        }
      },
      {
        path: 'accepthj',
        name: 'accepthj',
        // component: () => import('@/views/process/accepthenji'),
        // component: accepthj => require(['@/views/process/accepthenji'], accepthj),
        component: accepthj,
        meta: {
          title: '验收痕迹查询',
          icon: 'acceptance'
        }
      },
      {
        path: "traceManage",
        name: "TraceManage",
        // component: () => import('@/views/process/traceManage/traceManage'),
        // component: traceManage => require(['@/views/process/traceManage/traceManage'], traceManage),
        component: traceManage,
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
    meta: {
      title: '基础数据',
      icon: 'example'
    },
    children: [{
        path: 'engineering',
        name: 'basicsData',
        // component: () => import('@/views/basicsData/engineering'),
        // component: engineering => require(['@/views/basicsData/engineering'], engineering),
        component: engineering,
        meta: {
          title: '工程管理',
          icon: 'engineering'
        }
      },
      {
        path: 'processing',
        name: 'processing',
        // component: () => import('@/views/basicManage/processManage'),
        // component: processing => require(['@/views/basicManage/processManage'], processing),
        component: processing,
        meta: {
          title: '工序管理',
          icon: 'acceptance'
        }
      },
      // {
      //   path: 'recharge',
      //   name: 'recharge',
      //   component: () => import('@/views/basicsData/recharge'),
      //   meta: { title: '短信记录', icon: 'acceptance' }
      // },
      // {
      //   path: 'record',
      //   name: 'record',
      //   component: () => import('@/views/basicsData/record'),
      //   meta: { title: '短信充值', icon: 'acceptance' }
      // }
    ]
  },


  {
    path: '/system',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [{
        path: 'role',
        name: 'role',
        // component: () => import('@/views/system/role'),
        // component: role => require(['@/views/system/role'], role),
        component: role,
        meta: {
          title: '角色管理',
          icon: 'role'
        }
      },
      {
        path: 'user',
        name: 'user',
        // component: () => import('@/views/system/user'),
        // component: user => require(['@/views/system/user'], user),
        component: user,
        meta: {
          title: '用户信息',
          icon: 'information'
        }
      },
      {
        path: 'resource',
        name: 'resource',
        // component: () => import('@/views/system/resource'),
        // component: resource => require(['@/views/system/resource'], resource),
        component: resource,
        meta: {
          title: '资源管理',
          icon: 'resource'
        }
      },
      {
        path: 'userDictionaries',
        name: 'userDictionaries',
        // component: () => import('@/views/system/userDictionaries'),
        // component: userDictionaries => require(['@/views/system/userDictionaries'], userDictionaries),
        component: userDictionaries,
        meta: {
          title: '组织机构',
          icon: 'dictionaries'
        }
      },
    ]
  },
  {
    path: '/synchronization',
    component: Layout,
    meta: {
      title: '数据同步',
      icon: 'example'
    },
    children: [{
        path: 'department',
        name: 'department',
        // component: () => import('@/views/synchronization/department'),
        // component: department => require(['@/views/synchronization/department'], department),
        component: department,
        meta: {
          title: '同步部门',
          icon: 'example'
        }
      },
      {
        path: 'subscriber',
        name: 'subscriber',
        // component: () => import('@/views/synchronization/subscriber'),
        // component: subscriber => require(['@/views/synchronization/subscriber'], subscriber),
        component: subscriber,
        meta: {
          title: '用户同步',
          icon: 'information'
        }
      }
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
// 异步路由表
export const asyncRouterMap=[
  {
    path: '/platform',
    name: 'platform',
    component: platform,
    //  component: platform=>require(['@/views/platform/index'],platform),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: {
      title: '首页',
      icon: 'table'
    },
    children: [{
      path: 'dashboard',
      // component: () => import('@/views/dashboard/index'),
      // component: dashboard => require(['@/views/dashboard/index'], dashboard)
      component: dashboard
    }]
  },
  {
    path: '/trees',
    component: Layout,
    redirect: '/example/tree',
    name: 'Example',
    meta: {
      title: '日志管理',
      icon: 'check'
    },
    children: [{
      path: 'trees',
      name: 'Trees',
      // component: () => import('@/views/trees/index'),
      // component: trees => require(['@/views/trees/index'], trees),
      component: trees,
      meta: {
        title: '日志查看',
        icon: 'check'
      }
    }]
  },

  {
    path: '/walkaroundInspection',
    component: Layout,
    meta: {
      title: '巡视管理',
      icon: 'example'
    },
    children: [{
      path: 'PatrolCheck',
      name: 'PatrolCheck',
      // component: () => import('@/views/walkaroundInspection/PatrolCheck'),
      // component: PatrolCheck => require(['@/views/walkaroundInspection/PatrolCheck'], PatrolCheck),
      component: PatrolCheck,
      meta: {
        title: '巡视查看',
        icon: 'form'
      }
    }]
  },

  {
    path: '/instruct',
    component: Layout,
    meta: {
      title: '指令管理',
      icon: 'instruct'
    },
    children: [{
        path: 'instructCheck',
        name: 'instructCheck',
        // component: () => import('@/views/instruct/instructCheck'),
        // component: instructCheck => require(['@/views/instruct/instructCheck'], instructCheck),
        component: instructCheck,
        meta: {
          title: '指令查看',
          icon: 'instructCheck'
        }
      },
      {
        path: 'instructReceive',
        name: 'instructReceive',
        // component: () => import('@/views/instruct/instructReceive'),
        // component: instructReceive => require(['@/views/instruct/instructReceive'], instructReceive),
        component: instructReceive,
        meta: {
          title: '指令接受',
          icon: 'instructReceive'
        }
      },
      {
        path: 'instructSend',
        name: 'instructSend',
        // component: () => import('@/views/instruct/instructSend'),
        // component: instructSend => require(['@/views/instruct/instructSend'], instructSend),
        component: instructSend,
        meta: {
          title: '指令发送',
          icon: 'instructSend',
          show: true
        }
      },
    ]
  },

  {
    path: '/accept',
    component: Layout,
    meta: {
      title: '工序验收',
      icon: 'example'
    },
    children: [{
        path: 'accept',
        name: 'SelectTree',
        // component: () => import('@/views/process/accept'),
        // component: accept => require(['@/views/process/accept'], accept),
        component: accept,
        meta: {
          title: '工序验收',
          icon: 'acceptance'
        }
      },
      {
        path: 'acceptjh',
        name: 'acceptjh',
        // component: () => import('@/views/process/acceptjihua'),
        // component: acceptjh => require(['@/views/process/acceptjihua'], acceptjh),
        component: acceptjh,
        meta: {
          title: '验收计划查询',
          icon: 'acceptance'
        }
      },
      {
        path: 'accepthj',
        name: 'accepthj',
        // component: () => import('@/views/process/accepthenji'),
        // component: accepthj => require(['@/views/process/accepthenji'], accepthj),
        component: accepthj,
        meta: {
          title: '验收痕迹查询',
          icon: 'acceptance'
        }
      },
      {
        path: "traceManage",
        name: "TraceManage",
        // component: () => import('@/views/process/traceManage/traceManage'),
        // component: traceManage => require(['@/views/process/traceManage/traceManage'], traceManage),
        component: traceManage,
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
    meta: {
      title: '基础数据',
      icon: 'example'
    },
    children: [{
        path: 'engineering',
        name: 'basicsData',
        // component: () => import('@/views/basicsData/engineering'),
        // component: engineering => require(['@/views/basicsData/engineering'], engineering),
        component: engineering,
        meta: {
          title: '工程管理',
          icon: 'engineering'
        }
      },
      {
        path: 'processing',
        name: 'processing',
        // component: () => import('@/views/basicManage/processManage'),
        // component: processing => require(['@/views/basicManage/processManage'], processing),
        component: processing,
        meta: {
          title: '工序管理',
          icon: 'acceptance'
        }
      },
      // {
      //   path: 'recharge',
      //   name: 'recharge',
      //   component: () => import('@/views/basicsData/recharge'),
      //   meta: { title: '短信记录', icon: 'acceptance' }
      // },
      // {
      //   path: 'record',
      //   name: 'record',
      //   component: () => import('@/views/basicsData/record'),
      //   meta: { title: '短信充值', icon: 'acceptance' }
      // }
    ]
  },


  {
    path: '/system',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [{
        path: 'role',
        name: 'role',
        // component: () => import('@/views/system/role'),
        // component: role => require(['@/views/system/role'], role),
        component: role,
        meta: {
          title: '角色管理',
          icon: 'role'
        }
      },
      {
        path: 'user',
        name: 'user',
        // component: () => import('@/views/system/user'),
        // component: user => require(['@/views/system/user'], user),
        component: user,
        meta: {
          title: '用户信息',
          icon: 'information'
        }
      },
      {
        path: 'resource',
        name: 'resource',
        // component: () => import('@/views/system/resource'),
        // component: resource => require(['@/views/system/resource'], resource),
        component: resource,
        meta: {
          title: '资源管理',
          icon: 'resource'
        }
      },
      {
        path: 'userDictionaries',
        name: 'userDictionaries',
        // component: () => import('@/views/system/userDictionaries'),
        // component: userDictionaries => require(['@/views/system/userDictionaries'], userDictionaries),
        component: userDictionaries,
        meta: {
          title: '组织机构',
          icon: 'dictionaries'
        }
      },
    ]
  },
  {
    path: '/synchronization',
    component: Layout,
    meta: {
      title: '数据同步',
      icon: 'example'
    },
    children: [{
        path: 'department',
        name: 'department',
        // component: () => import('@/views/synchronization/department'),
        // component: department => require(['@/views/synchronization/department'], department),
        component: department,
        meta: {
          title: '同步部门',
          icon: 'example'
        }
      },
      {
        path: 'subscriber',
        name: 'subscriber',
        // component: () => import('@/views/synchronization/subscriber'),
        // component: subscriber => require(['@/views/synchronization/subscriber'], subscriber),
        component: subscriber,
        meta: {
          title: '用户同步',
          icon: 'information'
        }
      }
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})