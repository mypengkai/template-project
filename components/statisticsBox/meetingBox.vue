<template>
  <div class="meetingBox">
     <div id="meetEacth" ref="meetEacth"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initEacht();
  },
  methods: {
    initEacht() {
      this.chart = echarts.init(this.$refs.meetEacth); //定义
      let option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          splitLine: {         // 隐藏横线
            show: false
          }
        },
        series: [
          {
            data: [120, 180, 150, 80, 70, 110, 130],
            type: "bar",
             itemStyle: {
                normal: {
                  color: 'rgba(0,191,183,1)',
                   label: {
                    show: true,
                    position: 'top',
                  }
                }
              },
          }
        ]
      };
      this.chart.setOption(option); //展示
    }
  }
};
</script>
<style lang="scss" scoped>
.meetingBox {
    width: 100%;
    height: 100%;   
  h3 {
    font-size: 18px;
    font-weight: bold;
  }
}
#meetEacth {
  width: 100%;
  height: 70vh;
}
</style>