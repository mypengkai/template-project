<template>
  <div class="login-container">
    <!-- 表头部分 -->
    <div class="logoName">湖 南 常 祁 高 速 公 路 现 场 管 理 系 统</div>
    <!-- 用户登录框部分 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="loginForm.username" type="text" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;font-size:25px;font-weight:600
        "
          @click.native.prevent="handleLogin"
        >登 录</el-button>
        <div class="jy">*建议使用谷歌浏览器阅览*</div>
      </el-form-item>
 
    </el-form>
    <!-- 二维码部分 -->
    <div class="ewmimg1">
      <img src="../../../static/ewm1 (1).png" alt>
      <div class="ewm1">[Android]</div>
    </div>

    <div class="ewmimg2">
      <img src="../../../static/ewm1 (2).png" alt>
      <div class="ewm2">[ios]</div>
    </div>
               <!-- 表尾部分 -->
    <div class="bq">
    <a href="#"><p>版权所有：上海同望信息技术有限公司</p></a>
    <!-- <p>建议使用谷歌浏览器阅览</p> -->
    <p class="phone">联系电话：123456789</p>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      input: "",
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              Cookies.set("names", this.loginForm.username);
              localStorage.setItem("pass", this.loginForm.password);
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.$message.error("请输入正确的用户名或密码");
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    margin-bottom: 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  background: url(../../../static/1.jpg) no-repeat center;
  background-size: cover;
  height: 430px;
  .logoName {
    // margin: 40px 0 0 100px;
    text-align: center;
    padding-top: 4vh;
    font-size: 2.5vw;
    color: #0000ff;
    font-weight: bold;
  }
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    width: 25vw;
    max-width: 100%;
    padding: 1vw;
    margin: 15vh auto;
    background: rgba(255, 255, 255, 0.5);
    position: relative;
  }
  .svg-container {
    padding: 0.5vw;
    vertical-align: middle;
    width: 2.5vw;
    display: inline-block;
  }
  .title {
    font-size: 1.5vw;
    font-weight: 400;
    color: #e6a23c;
    margin: 0px auto 1.5vw auto;
    text-align: center;
    font-weight: bold;
  }
  .jy {
    text-align: center;
    color: red;
    font-size: 0.8vw;
  }
  .ewm1,
  .ewm2 {
    text-align: center;
    color: #fff;
  }
  .ewmimg1 {
    position: absolute;
    right: 40px;
    top: 20%;
  }
  .ewmimg2 {
    position: absolute;
    right: 40px;
    bottom: 20%;
  }
  .bq {
    color: #ccc;
    font-size: 0.8vw;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    .phone {
      font-size: 0.7vw;
    }
  }
}
</style>
