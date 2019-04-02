<template>
  <div id="photograph">

  </div>
</template>

<script>
import homePage from "@/api/homePage.js";
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.shoot();
  },
  methods: {
    shoot() {
      homePage.getPicMessage().then(res => {
        let dataArr = res.data.data;
        let dataArrX = [];
        let dataArrY = [];
        let dataArrZ = [];
        let dataArrL = [];
        dataArr.forEach((v, i) => {
          dataArrX.push(v.selfcreateTime); //时间
          dataArrY.push(v.selfzhuanghao); //桩号
          dataArrZ.push(v.selfphotoLocation); //地点
          dataArrL.push(v.selffilePath); //照片
        });
        this.Tiemshaft(dataArrX, dataArrY, dataArrZ, dataArrL);
      });
    },
    Tiemshaft(dataArrX, dataArrY, dataArrZ, dataArrL) {
      let photograph = echarts.init(document.getElementById("photograph"));
      var xData = dataArrX;
      let option = {
        title: {
          text: "本周巡检",
          x: "1%",

          textStyle: {
            color: "#fff",
            fontSize: "22"
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
          top: 100,
          bottom: 95,
          textStyle: {
            color: "#fff"
          }
        },
        legend: {
          x: "50%",
          top: "11%",
          textStyle: {
            color: "#90979c"
          },
          data: ["桩号", "地点", "照片"]
        },

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
              color: "#fff"
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
            name: "桩号",
            type: "bar",
            stack: "总量",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff"
                  },
                  position: "insideTop",
                  formatter: function(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: dataArrY
          },

          {
            name: "地点",
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
            data: dataArrZ
          },
          {
            name: "照片",
            type: "line",
            stack: "总量",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
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
            data: dataArrL
          }
        ]
      };
      photograph.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
#photograph {
  width: 100%;
  height: 100%;
}
</style>
