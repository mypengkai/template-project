import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import $ from 'jquery'
import '@/icons' // icon
import '@/permission' // permission control

import VideoPlayer from 'vue-video-player' //视频

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.use(ElementUI)
Vue.prototype.$ = $
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
