<template>
  <div>
    <el-form ref="userFrom" :model="user" label-width="120px" :rules="rules">
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
          <el-input v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item label="组织机构">
          <el-input v-model="departName">
            <el-button slot="append" icon="el-icon-edit" @click="innerVisible = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="角色" prop="userKey">
          <el-select v-model="user.userKey" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.rolename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input class="numInput" type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' v-model="user.mobilePhone"></el-input>
        </el-form-item>

        <el-form-item label="上传头像" v-if="nowItem=='add'">
          <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers" :show-file-list="true" :limit="1" :auto-upload="false" :before-upload="handleBeforeUpload" :on-preview="handlePictureCardPreview" :on-change="fileChange" :data="user">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="用户头像" v-else>
          <img :src="portrait" class="avatar">
        </el-form-item> -->

      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>

    <!-- 组织机构树形表单提交 -->
    <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import api2 from "@/api/user.js";
import api from "@/api/role.js";
import api1 from "@/api/Organization.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      uploadUrl: "/a1/rest/sysuser/add",
      orgTree: [],
      defaultProps: {
        children: "children",
        label: "departName"
      },
      rules: {
        userName: { required: true, message: "必填项", trigger: "blur" },
        password: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        realName: [{ required: true, message: "必填项", trigger: "blur" }],
        departName: [{ required: true, message: "必填项", trigger: "blur" }],
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
        mobilePhone: "",
        departid: "",
        // delivery: false,
        type: []
      },
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      id: "",
      departName: "",
      uploadFileParams: {},
      files: null,
      dialogFormVisible: true,
      innerVisible: false,
      imageUrl: "",
      roleList: [],
      orgTree: [],
      Check: [],
      treeData: {}
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
      this.user = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      this.departName = this.user.departName;
    },
    fileChange(file) {
      this.files = file.raw;
    },
    _comfirm() {
      // 表单校验
      if (this.$refs.userFrom.validate()) {
        this.$refs.upload.submit();
      }

      // // 新增
      // this.nowItem == "add" &&
      //   api2.sysuserAdd(this.form).then(res => {
      //     this.$emit("comfirm");
      //   });
      // // 查看单个 修改
      // this.nowItem != "add" &&
      //   api2.sysuserAdd(this.form).then(res => {
      //     this.$emit("comfirm");
      //   });
    },
    //查看

    handleBeforeUpload(file) {
      //上传之前触发
      // console.log("before");
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$notify.warning({
          title: "警告",
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片"
        });
      }
    },
    handlePictureCardPreview(file, fileList) {
      this.imageUrl = file.url;
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
      api1.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.user.departid = data.id;
      this.departName = data.departName;
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
