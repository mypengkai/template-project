<template>
  <div class="instructBox">
    
    <div id="instrEacth" ref="instrEacth"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
        
    };
  },
  mounted() {
    this.initEacht();
  },
  methods: {
    initEacht() {
      this.chart = echarts.init(this.$refs.instrEacth); //定义
      let option = { 
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
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
          },
          
        ]
      };
      this.chart.setOption(option); //展示
    }
  }
};
</script>
<style lang="scss" scoped>
.instructBox {
  h3 {
    font-size: 18px;
    font-weight: bold;
  }
  .contentBox {
    width: 8vw;
    height: 4vw;
    line-height: 4vw;
    border-radius: 10%;
    p {
      text-align: center;
    //   padding-top: 1vw;
      color: #fff;
    }
  }
  .col1 {
    background: #4dd0e1;
  }
  .col2 {
    background: #4895f6;
  }
  .col3 {
    background: #f6b51a;
  }
  .col4 {
    background: #1d953f;
  }
}
#instrEacth {
  width: 100%;
  height: 50vh;
}
</style>