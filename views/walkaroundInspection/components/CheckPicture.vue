<template>
  <div>
    <el-form :model="form" label-width="100px" ref="userFrom">

      <div style="width:50%">
        <el-form-item label="经度" v-if="nowItem=='add'">
          <el-input type="number" v-model="form.lgt"></el-input>
        </el-form-item>

        <el-form-item label="纬度" v-if="nowItem=='add'">
          <el-input type="number" v-model="form.lat"></el-input>
        </el-form-item>

        <el-form-item label="具体位置" v-if="nowItem=='add'">
          <el-input v-model="form.photoLocation"></el-input>
        </el-form-item>

        <el-form-item label="资料表述" v-if="nowItem=='add'">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="上传照片" v-if="nowItem=='add'">
        <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers" :show-file-list="true" :limit="1" :auto-upload="false" :before-upload="handleBeforeUpload" :on-preview="handlePictureCardPreview" :on-change="fileChange" :data="form">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 查看照片 -->
      <el-form-item label="用户照片" v-if="nowItem !=='add'">
        <img :src="form.filePath" class="avatar" @click="innerVisible = true">
      </el-form-item>
    </el-form>
    <div class="tar">
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm">保 存</el-button>
      <el-button @click="$emit('cancel')">取 消</el-button>
    </div>

    <!-- 照片详情信息查看 -->
    <el-dialog width="30%" title="详情查看" :visible.sync="innerVisible" append-to-body>

    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/processInfoLog.js";
import { getToken } from "@/utils/auth";
export default {
  props: ["nowItem"],
  data() {
    return {
      uploadUrl: "/a1/rest/processInfoLog/everyDayLog",
      form: {
        filePath: "", // 查看单个照片
        describe: "", // 资料表述
        photoLocation: "", // 具体位置
        lgt: "", // 经度
        lat: "", // 纬度
        files: "" // 上传的文件
      },
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      files: null,
      imageUrl: "",
      dialogFormVisible: true,
      dialogImageUrl: "",
      dialogVisible: false,
      innerVisible: false
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      // console.log(this.nowItem);
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
    },
    handleAvatarSuccess(res, file) {
      this.form.files = URL.createObjectURL(file.raw); // res
    },
    fileChange(file) {
      this.files = file.raw;
    },
    handlePictureCardPreview(file, fileList) {
      this.imageUrl = file.url;
    },
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
    _comfirm() {
      // 表单校验
      if (this.$refs.userFrom.validate()) {
        this.$refs.upload.submit();
      }
      // 上传每日日志
      // this.nowItem == "add" &&
      //   api.everyDayLog(this.form).then(res => {
      //     this.$emit("comfirm");
      //   });
      // 查看单个照片
      // this.nowItem != "add" &&
      //   api.everyDayLogPageList(this.form).then(res => {
      //     this.$emit("comfirm");
      //   });
    }
  }
};
</script>

<style>
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
