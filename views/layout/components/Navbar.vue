<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../../static/timg.jpg" alt="" class="user-avatar">

          <i class="el-icon-caret-bottom" />
        </div>

        <!-- 修改个人信息功能 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link class="inlineBlock"> -->
          <el-dropdown-item>
            <span style="display:block;" @click="xiugai">修改个人信息</span>
          </el-dropdown-item>
          <!-- </router-link> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="headline">现场管理系统</div>
    </el-menu>
    <div>
      <breadcrumb />
    </div>
    <!-- 修改信息弹出框 -->
    <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户账户" label-width="120px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="form.createName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px">
          <el-input v-model="form.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="form.officePhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import request from "@/utils/request";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        createName: "",
        mobilePhone: "",
        officePhone: "",
        email: ""
      }
    };
  },

  mounted() {
    this.fn();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    xiugai() {
      this.dialogFormVisible = true;
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    // 请求接口
    fn() {
      return request.get("/rest/user").then(res => {
        console.log(res);
        this.form.name = res.data[0].createBy;
        this.form.createName = res.data[0].createName;
        this.form.mobilePhone = res.data[0].mobilePhone;
        this.form.officePhone = res.data[0].officePhone;
        this.form.email = res.data[0].email;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 80px;
  line-height: 80px;
  border-radius: 0px !important;
  background-color: rgb(48, 65, 86);
  position: relative;
  .headline {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 2vw;
    color: #cccccc;
    letter-spacing: 10px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 14px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

