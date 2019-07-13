<template>
  <div style="top:50%;left: 50%;">
    <h1>正在进行跳转...</h1>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import {Loading} from 'element-ui'
export default {
  name: "noPasswordLogin",
  data(){
    return {}
  },
  beforeCreate(){
    let loadingInstance =Loading.service({
      text: "正在进行单点登录链接...",
      background: 'rgba(0, 0, 0, 0.7)',
      lock: true,
      spinner: 'el-icon-loading',
      fullscreen: true
    });
    this.$store.dispatch("getinit", {
      username: this.$tool.getUrlKey('username'),
      timestamp: this.$tool.getUrlKey('timestamp'),
        pwd: this.$tool.getUrlKey('pwd')
    }).then(() => {
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close();
      });
      Cookies.set("names", this.$tool.getUrlKey('username'));
      this.$router.push({ path: this.redirect || "/" });
    });
  }
}
</script>

