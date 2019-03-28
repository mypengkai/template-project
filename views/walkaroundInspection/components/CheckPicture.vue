<template>
  <div>
    <!-- 照片详情信息查看 -->
    <el-form :model="form" label-width="100px">
      <div>
        <el-form-item label="工程分部分项">
          <el-input v-model="form.projectItem"></el-input>
        </el-form-item>

        <el-form-item label="巡视人姓名">
          <el-input v-model="form.createName"></el-input>
        </el-form-item>

        <el-form-item label="时间">
          <el-input v-model="form.createTime"></el-input>
        </el-form-item>

        <el-form-item label="桩号">
          <el-input v-model="form.zhuanghao"></el-input>
        </el-form-item>

        <el-form-item label="拍照地点">
          <el-input v-model="photoLocation"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>

        <el-form-item label="照片表述">
          <el-input v-model="form.photoDescribe"></el-input>
        </el-form-item>
      </div>

      <!-- 导航切换 -->
      <div class="navb">
        <el-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect" text-color="#ccc" active-text-color="#409EFF">
          <el-menu-item index="1" @click="nowType=0">信息中心</el-menu-item>
          <el-menu-item index="2" @click="nowType=1">项目地图</el-menu-item>
        </el-menu>
      </div>

      <!-- 轮播信息 -->
      <div style="height:25vh" v-if="nowType==0">
        <el-form-item label="">
          <el-carousel :interval="3000" arrow="always" height="25vh">
            <el-carousel-item v-for="(item,index) in filePathImg" :key="index">
              <img :src="item.picture" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </div>
      <!-- 地图 -->
      <div style="height:25vh" v-if="nowType==1">
        <Map :nowItem="nowItem"></Map>
      </div>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/Patrol.js";
import Map from "./Map";
export default {
  components: {
    Map
  },
  props: ["nowItem"],
  data() {
    return {
      form: {
        createName: "", // 巡视人姓名
        projectType: "", //类型
        createTime: "", //  创建时间
        zhuanghao: "", // 桩号
        projectCode: "", // 工程码
        lgt: "", // 经度
        lat: "", // 纬度
        filePath: "", // 查看单个照片
        describe: "", // 表述
        photoDescribe: "", // 照片描述
        photoLocation: "", // 拍照地点
        projectItem: "" // 资料表述
      },
      filePathImg: [],
      nowType: 0,
      photoLocation:"",
      activeIndex: "1",
      activeIndex2: "1",
      innerVisible: false
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); // 复制
      this.filePathImg = this.form.pictureOfCommand; // 照片详情数组
      // console.log(this.form.pictureOfCommand[0].photoLocation);
      this.photoLocation = this.form.pictureOfCommand[0].photoLocation
    },

    // 切换
    handleSelect(key, keyPath) {},
    _comfirm() {
      // 上传每日日志
      this.nowItem == "add" &&
        api.everyDayLog(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个照片
      this.nowItem != "add" &&
        api.PatrolList(this.form).then(res => {
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
.navb {
  width: 30%;
  height: 7%;
  margin-left: 30px;
}
</style>
