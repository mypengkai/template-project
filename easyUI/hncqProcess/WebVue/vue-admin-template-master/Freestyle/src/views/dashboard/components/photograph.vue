<template>
  <div id="photograph">
    <span class="trackTitle">本周轨迹</span>
    <div class="templateBox">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in weekData" :key="index">
          <h4>桩号: {{ item.commandzhuanghao }}</h4>
          <h4>工程类型:{{ item.projectItem }}</h4>
          <h4>拍摄地点: {{ item.commandphotoLocation }}</h4>
          <p>时间: {{ item.commandcreateTime }}</p>
          <img :src="item.commandfilePath" alt>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import homePage from "@/api/homePage.js";
import echarts from "echarts";
export default {
  data() {
    return {
      weekData: []
    };
  },
  mounted() {
    this.shoot();
  },
  methods: {
    shoot() {
      homePage.getPicMessage().then(res => {
        this.weekData = res.data.data;
        console.log(this.weekData);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#photograph {
  margin-top: 2vw;
  width: 100%;
  height: 100%;
  position: relative;
  img {
    width: 20vw;
    height: 10vw;
  }
  .templateBox{
      width: 100%;
      height: 100%;
      overflow-y: scroll;
  }
}
.trackTitle {
  font-size: 18px;
  font-weight: 600;
  position: absolute;
  left: 0.5vw;
  top: -2vw;
}
</style>
