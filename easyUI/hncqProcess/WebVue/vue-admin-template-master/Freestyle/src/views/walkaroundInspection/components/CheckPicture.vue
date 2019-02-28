<template>
  <div>
    <el-form :model="form">

      <div style="width:50%">
        <el-form-item label="经度" :label-width="formLabelWidth" v-if="nowItem=='add'">
          <el-input v-model="form.lgt"></el-input>
        </el-form-item>

        <el-form-item label="纬度" :label-width="formLabelWidth" v-if="nowItem=='add'">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>

        <el-form-item label="具体位置" :label-width="formLabelWidth" v-if="nowItem=='add'">
          <el-input v-model="form.photoLocation"></el-input>
        </el-form-item>

        <el-form-item label="资料表述" :label-width="formLabelWidth" v-if="nowItem=='add'">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="上传头像" :label-width="formLabelWidth" v-if="nowItem=='add'">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/" 
        list-type="picture-card" 
        :on-preview="handlePictureCardPreview" 
        :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <!-- 查看照片 -->
      <el-form-item label="用户照片" v-if="nowItem !=='add'">
        <img :src="form.filePath" class="avatar">
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm">保 存</el-button>
      <el-button @click="$emit('cancel')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import api from "@/api/processInfoLog.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        filePath: "", // 查看单个照片
        describe: "", // 资料表述
        photoLocation: "", // 具体位置
        lgt: "", // 经度
        lat: "", // 纬度
        files: "" // 上传的文件
      },
      dialogFormVisible: true,
      formLabelWidth: "100px",
      dialogImageUrl: "",
      dialogVisible: false
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    _comfirm() {
      // 上传每日日志
      this.nowItem == "add" &&
        api.everyDayLog(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个照片
      this.nowItem != "add" &&
        api.everyDayLogPageList(this.form).then(res => {
          this.$emit("comfirm");
        });
    }
  }
};
</script>

<style>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
