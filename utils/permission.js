import Vue from 'vue'

Vue.directive('has', {
  bind(el, binding, vnode) {
    let btnPerObj = vnode.context.$route.meta.btnPermission;
    let btnPermission = [];
    for (var key in btnPerObj) {
      btnPerObj[key] && btnPermission.push(key)
    }
    let isPermission = btnPermission.includes(binding.value);
    !isPermission && (vnode.context[`dis${binding.value}`] = true);
  }
});
