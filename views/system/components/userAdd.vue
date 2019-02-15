<template>
    <div>
        <el-form :model="form">
            <el-form-item label="用户账号" :label-width="formLabelWidth">
                <el-input v-model="form.account" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户类型" :label-width="formLabelWidth">
                <el-input v-model="form.userType" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="组织机构" :label-width="formLabelWidth">
                <el-input v-model="form.org" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-input v-model="form.userRole" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="手机号码" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="上传头像" :label-width="formLabelWidth">
                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        name: "",
        account: "",
        userType: "",
        org: "",
        userRole: "",
        mobile: "",
        delivery: false,
        type: []
      },
      formLabelWidth: "120px",
      dialogFormVisible: true,
      imageUrl: ""
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
