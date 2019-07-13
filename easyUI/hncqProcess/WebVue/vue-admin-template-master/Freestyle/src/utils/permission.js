import Vue from 'vue'

/**
 * 权限指令
 */
const ltx=Vue.directive('ltx', {
  bind(el, binding, vnode) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      let list = vnode.context.$store.state.user.buttonList;
      for (let item of list) {
        if (item === value) {
          return true;
        }
      }
      return false;
    }

  }
});

export {ltx}
