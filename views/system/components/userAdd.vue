<template>
  <div>
    <el-form class="reverseBox" ref="userFrom" :model="user" label-width="120px" :rules="rules">
      <div style="width:50%">
        <el-form-item label="用户账号" v-if="nowItem=='add'" prop="userName">
          <el-input v-model="user.userName"></el-input>
        </el-form-item>

        <el-form-item label="用户账号" v-if="nowItem!=='add'" prop="userName">
          <el-input v-model="user.userName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="realName">
          <el-input v-model="user.realName"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="密码" prop="password">
          <el-input show-password v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item label="组织机构">
            <select-tree clearable :options="orgTree" :props="defaultProps" v-on:noDe="handleCheckChange" v-model="value" />
          <!-- <el-input v-model="user.departName" :disabled="true">
            <el-button slot="append" icon="el-icon-edit" @click="innerVisible = true"></el-button>
          </el-input> -->


        
        </el-form-item>

        <el-form-item label="角色" prop="userKey">
          <el-select v-model="user.userKey" multiple placeholder="请选择角色">
            <el-option v-for="(item,index) in roleList" :key="index.id" :label="item.rolename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职位">
          <el-input v-model="user.zhiwei"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobilePhone">
          <el-input class="numInput" type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' v-model="user.mobilePhone"></el-input>
        </el-form-item>

        <el-form-item label="上传头像" v-if="nowItem=='add'">
          <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" :multiple="false" name="files" :headers="headers" list-type="picture-card" :limit="1" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-exceed="handleExceed" :data="user">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="50%" :src="dialogImageUrl" alt="图片">
          </el-dialog>
        </el-form-item>

        <el-form-item label="头像查看" v-if="nowItem!=='add'">
          <img :src="user.picture" alt="" class="avatar">
        </el-form-item>

      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" v-if="nowItem!=='add'" @click="_execute">修 改</el-button>
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm('userFrom')">保 存</el-button>
    </div>

   
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import user from "@/api/user.js";
import api from "@/api/role.js";
import Organization from "@/api/Organization.js";
import SelectTree from "@/components/SelectTree/selectTree.vue";
export default {
  inject: ["reload"],
  props: ["nowItem"],
  components:{
    SelectTree
  },
  data() {
    return {
      uploadUrl: process.env.BASE_API + "/rest/sysuser/add",
      orgTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      rules: {
        userName: { required: true, message: "必填项", trigger: "blur" },
        password: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        realName: [{ required: true, message: "必填项", trigger: "blur" }],
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        userKey: [{ required: true, message: "必填项", trigger: "blur" }],
        mobilePhone: { required: true, message: "必填项", trigger: "blur" },
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
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      id: "",
      name: "",
      value:"",
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
  created() {
    this.initForm();
    this._roleList();
    this._orgTree();
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.form.files = URL.createObjectURL(file.raw); // res
    },
    initForm() {
      if (this.nowItem == "add") return;
      this.user = this.$tool.ObCopy(this.nowItem); //复制
      this.name = this.user.name;
    },
    fileChange(file) {
      this.files = file.raw;
    },
    _comfirm(file) {
      // 表单校验
       this.$refs[file].validate(valid => {
        if (valid) {
          // 新增
           if (this.$refs.userFrom.validate()) {
        this.$refs.upload.submit();
      }
      this.$emit("cancel");
      this.reload();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
     
    },
    //查看
    _execute() {
      // 查看单个 修改
      this.nowItem != "add" &&
        user.sysusermodify(this.user).then(res => {
          this.$emit("execute");
        });
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
