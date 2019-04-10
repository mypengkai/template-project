<template>
  <div id="photograph">
    <span class="p20">本周轨迹</span>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in weekData" :key="index">
          <h4>桩号: {{ item.commandzhuanghao }}</h4>
          <h4>拍摄地点: {{ item.logphotoLocation }}</h4>
          <p>时间: {{ item.logcreateTime }}</p>
          <img :src="item.logfilePath" alt="">
      </el-timeline-item>
    </el-timeline>
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
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#photograph {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  img {
    width: 8vw;
    height: 8vw;
  }
}
</style>
