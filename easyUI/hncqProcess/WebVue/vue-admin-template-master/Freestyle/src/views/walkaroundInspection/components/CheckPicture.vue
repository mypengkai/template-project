<template>
  <div>
    <el-form :model="form" label-width="10vw">
      <!-- 查看照片 -->
      <el-form-item label="" v-if="nowItem !=='add'">
        <img :src="form.filePath" style="cursor:pointer" class="avatar" @click="innerVisible = true">
      </el-form-item>
    </el-form>
    <div class="tar">
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm">保 存</el-button>
      <el-button @click="$emit('cancel')">取 消</el-button>
    </div>

    <!-- 照片详情信息查看 -->
    <el-dialog width="60%" title="详情查看" :visible.sync="innerVisible" append-to-body>
      <el-form :model="form" label-width="200px">
        <div style="width:50%">
          <!-- <el-form-item label="类型">
            <el-input v-model="form.projectType"></el-input>
          </el-form-item> -->

          <el-form-item label="时间">
            <el-input v-model="form.createTime"></el-input>
          </el-form-item>

          <el-form-item label="桩号">
            <el-input v-model="form.zhuanghao"></el-input>
          </el-form-item>

          <el-form-item label="具体位置">
            <el-input v-model="form.photoLocation"></el-input>
          </el-form-item>

          <el-form-item label="资料表述">
            <el-input v-model="form.projectItem"></el-input>
          </el-form-item>

          <el-form-item label="照片表述">
            <el-input v-model="form.describe"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="照片">
          <el-carousel :interval="3000" arrow="always" height="30vh">
            <el-carousel-item v-for="item in 1" :key="item">
              <img :src="form.filePath" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/processInfoLog.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        projectType: "", //类型
        createTime: "", //  创建时间
        zhuanghao: "", // 桩号
        filePath: "", // 查看单个照片
        describe: "", // 照片表述
        photoLocation: "", // 具体位置
        projectItem: "" // 资料表述
      },
      dialogFormVisible: true,
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

<style lang="scss" scoped>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
