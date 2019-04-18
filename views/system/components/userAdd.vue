<template>
  <div>
    <el-form class="reverseBox" ref="userFrom" :model="user" label-width="120px" :rules="rules">
      <div style="width:50%">
        <el-form-item label="名称" prop="userName">
          <el-input v-model="user.realName"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="用户帐号" prop="realName">
          <el-input v-model="user.userName"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem!='add'" label="用户帐号" prop="realName">
          <el-input v-model="user.userName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="密码" prop="password">
          <el-input show-password v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item label="组织机构">
          <select-tree
            clearable
            :options="orgTree"
            :props="defaultProps"
            v-on:noDe="handleCheckChange"
            ref="userInfo_userGroup"
            v-model="value"
          />
        </el-form-item>

        <el-form-item label="角色" prop="userKey">
          <el-select v-model="user.userKey" multiple placeholder="请选择角色" ref="selecetedRole">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职位">
          <el-input v-model="user.zhiwei"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobilePhone">
          <el-input
            class="numInput"
            type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
            v-model="user.mobilePhone"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="上传头像" v-if="nowItem=='add'">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="uploadUrl"
            :multiple="false"
            name="files"
            :headers="headers"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :data="user"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="50%" :src="dialogImageUrl" alt="图片">
          </el-dialog>
        </el-form-item>

        <el-form-item label="头像查看" v-if="nowItem!=='add'">
          <img :src="user.picture" alt class="avatar">
        </el-form-item>-->
      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" v-if="nowItem!=='add'" @click="_execute">修 改</el-button>
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm('user')">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import user from "@/api/user.js";
import api1 from "@/api/user.js";
import api from "@/api/role.js";
import Organization from "@/api/Organization.js";
import SelectTree from "@/components/SelectTree/selectTree.vue";
export default {
  inject: ["reload"],
  props: ["nowItem",'conentList'],
  components: {
    SelectTree
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      uploadUrl: process.env.BASE_API + "/rest/sysuser/add",
      orgTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      rules: {
        realName: [{ required: true, message: "必填项", trigger: "blur" }],
        userName: { required: true, message: "必填项", trigger: "blur" },
        password: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        userKey: [{ required: true, message: "必填项", trigger: "blur" }],
        mobilePhone: { required: true, validator: checkPhone, trigger: "blur" },
        portrait: [{ required: true, message: "必填项", trigger: "blur" }]
      }, //表单校验规则
      user: {
        id: "",
        password: "",
        userName: "",
        realName: "",
        userKey: "",
        zhiwei: "",
        departName: "",
        mobilePhone: "",
        picture: "",
        departid: "",
        type: []
      },
      flag: false,
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      id: "",
      name: "",
      value: "",
      uploadFileParams: {},
      files: null,
      dialogFormVisible: true,
      innerVisible: false,
      imageUrl: "",
      roleList: [],
      orgTree: [],
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  watch:{
       conentList(){
           console.log(this.conentList,'conentList')
       }   
  },
  created() {
    this._roleList();
    this._orgTree();
    this.initForm();
  },
  mounted() {},
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.files = URL.createObjectURL(file.raw); // res
    },
    async initForm() {
      if (this.nowItem == "add") return;
      this.user = this.$tool.ObCopy(this.nowItem); //复制
      let { data } = await api1.sysuserCheck(this.nowItem.id); //异步执行取id
      let formData = data.data[data.data.length - 1];
      this.user.mobilePhone = formData.mobilePhone;
      this.user.userKey = formData.userKey;
      this.user.departName = formData.orgNames[0]; // 组织机构
      //给角色和组织机构赋值
      console.log(this.$refs.userInfo_userGroup.$refs.input);
      this.$refs.userInfo_userGroup.$refs.input.labelModel=this.user.departName;
    },
    fileChange(file) {
      this.files = file.raw;
    },
    // 新增用户
    _comfirm(user) {
       const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (this.user.realName == "") {
        this.$message({
          message: "请输入用户名称"
        });
        return false;
      }

      if (this.user.userName == "") {
        this.$message({
          message: "请输入用户账号"
        });
        return false;
      }
      if (this.user.password == "") {
        this.$message({
          message: "请输入密码"
        });
        return false;
      }
      if (this.user.departName == "") {
        this.$message({
          message: "请选择组织机构"
        });
        return false;
      }
      if (this.user.userKey == "") {
        this.$message({
          message: "请选择角色"
        });
        return false;
      }
      if (this.user.zhiwei == "") {
        this.$message({
          message: "请输入职位"
        });
        return false;
      }
      if(this.user.mobilePhone == ''){
           this.$message({
          message: "请输入电话号码"
        });
        return false;
      }
       if(!reg.test(this.user.mobilePhone)){
           this.$message({
          message: "请输入正确的电话号码"
        });
        return false;
      }
      // console.log(this.$refs.selecetedRole.selected)
      let array = this.$refs.selecetedRole.selected;
      let id = '';
      array.forEach(element => {
        id  += element.currentValue + "," ;
        // id =  element.currentValue + "," + id
      });
      console.log(id,'id')

      api1
        .sysuserAdd({
          realName: this.user.realName,
          departid: this.user.departid,
          userName: this.user.userName,
          password: this.user.password,
          userKey: id,
          zhiwei: this.user.zhiwei,
          mobilePhone: this.user.mobilePhone
        })
        .then(res => {
          console.log(res.data);
          if (res.data.respCode == "") {
            this.$message({
              message: "添加用户成功"
            });
          }
          this.$emit("cancel");
          this.$emit("execute");
        });
    },
    //查看
    _execute() {
      // 查看单个 修改
      if (this.nowItem != "add") {
        const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (this.user.realName == "") {
        this.$message({
          message: "请输入用户名称"
        });
        return false;
      }
      if (this.user.departName == "") {
        this.$message({
          message: "请选择组织机构"
        });
        return false;
      }
      if (this.user.userKey == "") {
        this.$message({
          message: "请选择角色"
        });
        return false;
      }
      if (this.user.zhiwei == "") {
        this.$message({
          message: "请输入职位"
        });
        return false;
      }
      if(this.user.mobilePhone == ''){
           this.$message({
          message: "请输入电话号码"
        });
        return false;
      }
       if(!reg.test(this.user.mobilePhone)){
           this.$message({
          message: "请输入正确的电话号码"
        });
        return false;
      }
        let array = this.$refs.selecetedRole.selected;
        let id;
        array.forEach(element => {
          id += element.currentValue + "," + "";
        });
        user
          .sysuserAdd({
            id: this.user.id,
            realName: this.user.realName,
            departid: this.user.departid,
            userName: this.user.userName,
            password: this.user.password,
            userKey: id,
            zhiwei: this.user.zhiwei,
            mobilePhone: this.user.mobilePhone
          })
          .then(res => {
            if (res.data.respCode == "0") {
              this.$message({
                message: "修改成功"
              });
            }
            this.$emit("cancel");
            this.$emit("execute");
          });
      }
    },
    // 传图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed: function(files, fileList) {
      // console.log(files)
      // console.log(fileList)
    },
    // 角色请求列表
    _roleList() {
      api.roleList().then(res => {
        this.roleList = res.data.data;
        // console.log(this.roleList)
      });
    },
    // 组织机构树
    _orgTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.user.departid = data.id;
      this.user.departName = data.name;
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.reverseBox {
  height: 60vh;
  overflow-y: scroll;
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
.numInput {
  .el-input__inner {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
    margin: 20px !important;
  }
  .el-input__inner:hover {
    margin: 20px !important;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
