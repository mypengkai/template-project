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
import 'babel-polyfill'
import VideoPlayer from 'vue-video-player' //视频
// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import "@/utils/permission"
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 2017,
  inline: true,
  button: true,
  navbar: true,
  title: true,
  toolbar: true,
  tooltip: true,
  movable: true,
  zoomable: true,
  rotatable: true,
  scalable: true,
  transition: true,
  fullscreen: false,
  keyboard: true,
  url: 'data-source'
})

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

