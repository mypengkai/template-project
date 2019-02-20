<template>
  <div>
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户账号">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="form.realName"></el-input>
      </el-form-item>

      <el-form-item label="用户类型">
        <el-input v-model="form.userType"></el-input>
      </el-form-item>

      <el-form-item label="组织机构">
        <el-input v-model="form.departname"></el-input>
      </el-form-item>

      <el-form-item label="角色">
        <el-input v-model="form.userKey"></el-input>
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>

      <el-form-item label="上传头像" v-if="nowItem=='add'">
        <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="handleChange" action="">
          <img v-if="portrait" :src="portrait" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="用户头像" v-else>
        <img :src="portrait" class="avatar">
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>
  </div>
</template>

<script>
import api from "@/api/user.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        userName: "",
        realName: "",
        userType: "",
        departname: "",
        userKey: "",
        mobile: "",
        // delivery: false,
        type: [],
        portrait: ""
      },
      portrait: "",
      formLabelWidth: "120px",
      dialogFormVisible: true
    };
  },
  created() {
    this.initForm();
  },

  methods: {
    handleChange(file) {
      this.form.portrait = file.raw;
      console.log(file);
      this.portrait = URL.createObjectURL(file.raw); // res
    },
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      this.portrait = this.form.portrait;
    },
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.sysuserAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个 修改
      this.nowItem != "add" &&
        api.sysuserAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
