<template>
  <div id="cookie"></div>
</template>

<script>
import echarts from "echarts";
import homePage from "@/api/homePage.js";
export default {
  mounted() {
    this.record();
  },
  methods: {
    record() {
      homePage.getOrgNumber().then(res => {
        console.log(res.data.data);
        let cookieData = res.data.data;

        let cookieDataName = [];
        cookieData.forEach(v => {
          v.name == "gongxu" && (v.name1 = "任务验收");
          v.name == "zizhu" && (v.name1 = "自主验收");
          v.name == "zhiling" && (v.name1 = "指令");
          v.name == "xunshi" && (v.name1 = "巡视");
          v.name == "log" && (v.name1 = "日志");
          cookieDataName.push(v.name1);
        });
        this.lol(cookieData, cookieDataName);
      });
    },
    lol(cookieData, cookieDataName) {
      let cookie = echarts.init(document.getElementById("cookie"));
      let option = {
        title: {
          text: "全局轨迹",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: cookieDataName
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: cookieData[0].number, name: cookieData[0].name1 },
              { value: cookieData[1].number, name: cookieData[1].name1 },
              { value: cookieData[2].number, name: cookieData[2].name1 },
              { value: cookieData[3].number, name: cookieData[3].name1 },
              { value: cookieData[4].number, name: cookieData[4].name1 }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      cookie.setOption(option);
      window.onresize = cookie.resize;
    }
  }
};
</script>

<style>
#cookie {
  width: 100%;
  height: 90%;
}
</style>
