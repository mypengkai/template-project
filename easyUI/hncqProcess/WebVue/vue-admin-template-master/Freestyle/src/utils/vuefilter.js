import Vue from 'vue'
import yxDialog from '@/components/yx_dialog'
import processQy from '@/components/processQy'
import echartsTem from '@/components/echartsTem'
// import rem from './rem'
/*图片地址*/
Vue.prototype.$imgSrc = process.env.BASE_API;
Vue.component("yxDialog", yxDialog);//全局组件
Vue.component("processQy", processQy);//全局组件
Vue.component("echartsTem", echartsTem);//全局组件
/*筛选*/
Vue.filter('formatDate', (value, ALLTime = true) => {
  var d = new Date(value);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  month = month < 10 ? '0' + month : '' + month;
  let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
  let hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
  let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
  let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
  if (ALLTime) return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  else return `${year}-${month}-${day}`
})
Vue.filter('titlefilter', (val, titlefilter) => {
  return val.substring(0, titlefilter) + '...'
})
Vue.filter('noAny', (val) => {
  if (!val) return "暂无";
  else return val;
})
