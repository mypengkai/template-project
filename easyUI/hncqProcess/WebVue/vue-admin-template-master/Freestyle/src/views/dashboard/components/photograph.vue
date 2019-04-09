<template>
  <div id="photograph">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in dataArr" :key="index" placement="top">
        <el-card>
          <h4>桩号: {{ activity.commandzhuanghao }}</h4>
          <h4>拍摄地点: {{ activity.logphotoLocation }}</h4>
          <p>时间: {{ activity.logcreateTime }}</p>
          <img :src="activity.logfilePath" alt="">
        </el-card>
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
      dataArr: []
    };
  },
  mounted() {
    this.shoot();
  },
  methods: {
    shoot() {
      homePage.getPicMessage().then(res => {
        this.dataArr = res.data.data;
        console.log(this.dataArr);
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
    width: 5vw;
    height: 5vw;
  }
}
</style>
