<template>
  <div class="meetingBox">
    <div id="meetEacth" ref="meetEacth"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import request from "@/utils/request";
export default {
  props: ["formData"],
  data() {
    return {
      //statisicsData: [],
      //  sendData: {
      //   departId: "", // 组织机构id
      //   itemInfoId: "", // 分部分项
      //   startTime: "",
      //   endTime: "",
      //   pageSize:10,
      //   pageNo:1
      // },
    };
  },
  watch:{
      formData(val){
            let mNumber = null;
            let cNumber = null;
            let pNumber = null;
            val.forEach(element => {
              mNumber += Number(element.meetingNumber);
              cNumber += Number(element.commandNumber);
              pNumber += Number(element.processNumber);
            });
            let dataX = ["指令", "变更纪要", "工序"];
            let dataY = [cNumber, mNumber, pNumber];
            this.initEacht(dataX, dataY);
      },
      deep:true
  },
  mounted() {
    //this.init();
  },
  methods: {
    // init() {
    //   request
    //     .post("/rest/projectItemInfo/notPassStatistics", this.sendData)
    //     .then(res => {
    //       if (res.data.ok) {
    //         this.statisicsData = res.data.data.data;
    //         let mNumber = null;
    //         let cNumber = null;
    //         let pNumber = null;
    //         this.statisicsData.forEach(element => {
    //           mNumber += Number(element.meetingNumber);
    //           cNumber += Number(element.commandNumber);
    //           pNumber += Number(element.processNumber);
    //         });
    //         let dataX = ["指令", "变更纪要", "工序"];
    //         let dataY = [cNumber, mNumber, pNumber];
    //         this.initEacht(dataX, dataY);
    //       }
    //     });
    // },

    initEacht(dataX, dataY) {
      this.chart = echarts.init(this.$refs.meetEacth); //定义
      let option = {
        title: {
          text: "不通过统计",
          x: "2",
          textStyle: {
            color: "#000",
            fontSize: "18"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        xAxis: {
          type: "category",
          data: dataX
        },
        yAxis: {
          type: "value",
          splitLine: {
            // 隐藏横线
            show: false
          }
        },
        series: [
          {
            data: dataY,
            type: "bar",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                label: {
                  show: true,
                  position: "top"
                }
              }
            }
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