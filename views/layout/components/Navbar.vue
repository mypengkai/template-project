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
          <el-dropdown-item>
            <span style="display:block;" @click="xiuPass">修改密码</span>
          </el-dropdown-item>
          <!-- </router-link> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="component-item">
         <mallki class-name="mallki-text" text="现场管理系统"/>
      </div>
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
    <!-- 修改密码弹框 -->
    <el-dialog title="修改个人信息" :visible.sync="xiuFormVisible">
      <el-form :model="formPass" :rules="ruleses" ref="wordForm">
        <el-form-item label="原密码" label-width="120px" prop="passWord">
          <el-input v-model="formPass.passWord"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" prop="xinpassWoed">
          <el-input v-model="formPass.xinpassWoed"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiaoForm()">取 消</el-button>
        <el-button type="primary" @click="xiuForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import request from "@/utils/request";
import Mallki from "@/components/TextHoverEffect/Mallki";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Mallki
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  data() {
    return {
      dialogFormVisible: false,
      xiuFormVisible: false,
      formPass: {
        passWord: "",
        xinpassWoed: ""
      },
      form: {
        name: "",
        createName: "",
        mobilePhone: "",
        officePhone: "",
        email: ""
      },
      ruleses: {
        passWord: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        xinpassWoed: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请输入打入6位以上的密码", trigger: "blur" }
        ]
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
    xiuPass() {
      this.xiuFormVisible = true;
    },
    quxiaoForm() {
      this.formPass.passWord = "";
      this.formPass.xinpassWoed = "";
      this.xiuFormVisible = false;
    },
    xiuForm() {
      this.$refs.wordForm.validate(valid => {
        if (valid) {
          let pass = localStorage.getItem("pass");
          console.log(pass);
          if (this.formPass.passWord == this.formPass.xinpassWoed) {
            this.$message({
              showClose: true,
              message: "请输入不一样的密码",
              type: "warning"
            });
            return false;
          }
          if (this.formPass.passWord != pass) {
            this.$message({
              showClose: true,
              message: "请输入正确的原密码",
              type: "warning"
            });
            return false;
          }
          let passData = {
            password: this.formPass.xinpassWoed,
            oldpassword: this.formPass.passWord
          };
          return request
            .post("/rest/UsersController/resetPassword", passData)
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  showClose: true,
                  message: "恭喜你，修改密码成功",
                  type: "success"
                });
                localStorage.setItem("pass", this.formPass.xinpassWoed);
                this.formPass.passWord = "";
                this.formPass.xinpassWoed = "";
                this.xiuFormVisible = false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        Cookies.remove('names')
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    // 请求接口
    fn() {
      return request.get("/rest/user").then(res => {
        if (res.status == 200) {
          this.form.name = res.data[0].createBy;
          this.form.createName = res.data[0].createName;
          this.form.mobilePhone = res.data[0].mobilePhone;
          this.form.officePhone = res.data[0].officePhone;
          this.form.email = res.data[0].email;
        }
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
.component-item{
  min-height: 100px;
  padding-right: 150px;
  text-align: center;
}
</style>

