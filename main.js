import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control

import echarts from 'echarts'

import VideoPlayer from 'vue-video-player' //视频

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.use(ElementUI)
Vue.config.productionTip = false


// router.beforeEach((to, from, next) => {
//   if (to.path == '/Login') {
//     next()
//   } else {
//     var author = JSON.parse(localStorage.getItem('aut'))
//     if (!author) {
//       api.getAuthor(1).then(res => {
//         constantRouterMap.push(...res.data.data)
//         console.log(constantRouterMap)
//         localStorage.setItem('aut', JSON.stringify(res.data.data))
//       })
//       next()
//     } else {
//       constantRouterMap.push(...author)
//       next()
//     }
//   }
// }
// )

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
