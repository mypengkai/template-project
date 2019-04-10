<template>
  <div id="broken"></div>
</template>

<script>
import echarts from "echarts";
import homePage from "@/api/homePage.js";
export default {
  mounted() {
    this.statistics();
  },
  methods: {
    statistics() {
      homePage.getUserMessage().then(res => {
          // console.log(res.data.data.splice(0, 5))
        let testData = res.data.data; // 取整个数组
        testData.forEach(v => {
          v.name == "planCheck" && (v.name1 = "任务验收"); // 要
          v.name == "planSelfCheck" && (v.name1 = "计划自检数");
          v.name == "realityCheck" && (v.name1 = "实际验收数");
          v.name == "realitySelfCheck" && (v.name1 = "实际自检数");
          v.name == "z_realityCheck" && (v.name1 = "自主验收"); // 要
          v.name == "z_realitySelfCheck" && (v.name1 = "实际自检数--自主");
          v.name == "command" && (v.name1 = "指令");  // 要
          v.name == "log" && (v.name1 = "日志");  // 要
          v.name == "polling" && (v.name1 = "巡视"); // 要
        });
        let testDataX = [];
        let testDataY = [];
        testData.forEach((v, i) => {
          testDataX.push(v.name1);
          testDataY.push(v.number);
        });
        this.ioi(testDataX, testDataY);
      });
    },
    ioi(testDataX, testDataY) {
      let broken = echarts.init(document.getElementById("broken"));
      var xData = testDataX;

      let option = {
        title: {
          text: "当前用户本月统计",
          x: "1%",
          textStyle: {
            color: "#000",
            fontSize: "18"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff"
            }
          }
        },
        grid: {
          borderWidth: 0,
          left: 80,
          right: 10,
          top: 50,
          bottom: 95,
          textStyle: {
            color: "#fff"
          }
        },
        // legend: {
        //   x: "50%",
        //   top: "11%",
        //   textStyle: {
        //     color: "#90979c"
        //   },
        //   data: ["女", "男", "平均"]
        // },

        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }
        ],
        // X滚动轴
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5"
            },
            textStyle: {
              color: "#000"
            },
            borderColor: "#90979c"
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ],
        series: [
          {
            name: "次数",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter: function(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: testDataY
          }
        ]
      };
      broken.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
#broken {
  width: 100%;
  height: 100%;
}
</style>
