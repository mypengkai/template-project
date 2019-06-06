import Vue from 'vue'
import {queryButtonPermissionsByUser} from '@/api/login'

/**
 * 权限指令
 */
const ltx=Vue.directive('ltx', {
  bind(el, binding, vnode) {
    let btnName=binding.value;
    //this.nextTick(callback)，当数据发生变化，更新后执行回调。
    // this.$nextTick(callback)，当dom发生变化，更新后执行的回调。
    Vue.nextTick(function(btnName){
      queryButtonPermissionsByUser(binding.value).then(res=> {
        if (!res.data.data) {
          el.parentNode.removeChild(el);
        }
      });
    });
  }
});

export {ltx}
