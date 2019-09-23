import Vue from 'vue'

/**
 * 权限指令(自定义)
 */
// ltx => v-ltx   指令名称
// bind  函数 初始化时调用一次（只一次）
// el   指令所绑定的元素，可以用来直接操作 DOM 
// binding   对象（包含指令名称name;指令绑定值value.........）
// vnode    Vue 编译生成的虚拟节点
const ltx=Vue.directive('ltx', {
  bind(el, binding, vnode) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      // 获取按钮权限
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
