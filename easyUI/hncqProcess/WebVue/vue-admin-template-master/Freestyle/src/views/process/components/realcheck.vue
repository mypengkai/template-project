<template>
  <div class="imgez">
    <el-table class="textList" :data="selfList" border>
      <el-row>
        <el-col :span="6">
          <el-table-column property="projectCode" label="代码"></el-table-column>
        </el-col>
        <el-col :span="6">
          <el-table-column property="projectItem" label="工程名称"></el-table-column>
        </el-col>
        <el-col :span="6">
          <el-table-column property="projectType" label="工程类型"></el-table-column>
        </el-col>
        <el-col :span="6">
          <el-table-column property="zhuanghao" label="桩号"></el-table-column>
        </el-col>
      </el-row>
    </el-table>

    <!-- 新的图象 -->
    <div class="database" v-for="(item,index) in selfList" :key="index">
      <!-- 头部的工序名状态 -->
      <div class="headData">
        <!-- 工序名 -->
        <div class="fl">
          <span class="fl processName">
            <p>工序名:</p>
          </span>
          <span class="rl" style="width:70%">
            <p>{{ item.processName }}</p>
          </span>
        </div>
        <!-- 状态 -->
        <div class="rl">
          <span class="fl stateName">
            <p>状态</p>
          </span>
          <span class="rl" style="width:70%">
            <p>{{ item.state2 }}</p>
          </span>
        </div>
      </div>
      <!-- 自检盒子 -->
      <div class="selfinspection fl">
        <div class="textName">
          <p>自检</p>
        </div>
        <!-- 计划盒子 -->
        <div class="selfPlanBox">
          <span style="width:20%" class="br1">
            <p>计划</p>
          </span>
          <span style="width:40%" class="br1">
            <p class="bt1">时间</p>
            <p>{{ item.planSelfCheckTime }}</p>
          </span>
          <span style="width:40%">
            <p class="bt1">自检人</p>
            <p>{{ item.planSelfCheckPerson }}</p>
          </span>
        </div>
        <!-- 实际盒子 -->
        <div class="selfRealityBox">
          <span style="width:20%" class="br1">
            <p>实际</p>
          </span>
          <span style="width:40%" class="br1">
            <p>{{ item.realitySelfCheckTime }}</p>
          </span>
          <span style="width:40%">
            <p>{{ item.realitySelfCheckPerson }}</p>
          </span>
        </div>
      </div>
      <!-- 验收盒子 -->
      <div class="acceptance rl">
        <div class="textNameOne">
          <p>验收</p>
        </div>
        <!-- 计划盒子 -->
        <div class="selfPlanBox">
          <span style="width:50%" class="br1">
            <p class="bt1">时间</p>
            <p>{{ item.planCheckTime }}</p>
          </span>
          <span style="width:50%">
            <p class="bt1">验收人</p>
            <p>{{ item.planCheckPerson }}</p>
          </span>
        </div>
        <!-- 实际盒子 -->
        <div class="selfRealityBox">
          <span style="width:50%" class="br1">
            <p>{{ item.realityCheckTime }}</p>
          </span>
          <span style="width:50%">
            <p>{{ item.realityCheckPerson }}</p>
          </span>
        </div>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="describeBox" v-for="(item,index) in selfList" :key="'describeBox'-index">
      <span class="fl">
        <p class="br1">自检描述: {{ item.selfCheckDescribe }}</p>
        <div class v-if="imgData!=null">
               <ul>
                 <li v-for="(item,index) in imgData" :key="index">
                      <img :src="item.filePath" alt="">
                 </li>
               </ul>
        </div>
        <div v-else>
          <div class="zjimg">没有初验图片</div>
        </div>
      </span>
      <span class="rl">
        <p>验收描述: {{ item.describe }}</p>
        <div v-if="imgData2!=null">
          <ul>
                 <li v-for="(item,index) in imgData2" :key="index">
                      <img :src="item.filePath" alt="">
                 </li>
               </ul>
        </div>
        <div v-else>
          <div class="ysimg">没有验收图片</div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  props: ["selfList"],
  data() {
    return {
      imginnerVisible: false,
      datac: [],
      imgData: [],
      imgData2: []
    };
  },
  watch: {
    selfList() {
      console.log(this.selfList, "selfList");
      this.imgData = this.selfList[0].selfFilePath;
      this.imgData2 = this.selfList[0].filePath;
      this.selfList.forEach(i => {
        i.projectType =
          i.projectType == "1"
            ? "单位工程"
            : i.projectType == "2"
            ? "子单位工程"
            : i.projectType == "3"
            ? "分部工程"
            : i.projectType == "4"
            ? "子分部工程"
            : i.projectType == "5"
            ? "分部项程"
            : i.projectType == "6"
            ? "子分项工程"
            : "";
        i.state1 = i.state1 == 1 ? "已指定验收" : "未指定验收";
        i.state2 == 0
          ? (i.state2 = "指定工序")
          : i.state2 == 1
          ? (i.state2 = "已指定验收计划")
          : i.state2 == 2
          ? (i.state2 = "自检完成")
          : (i.state2 = "验收完成");
      });
    }
  },
  created() {
    // this.srty();
  },
  methods: {
    // srty() {
    //   this.datac = this.selfList;
    //   console.log(this.datac);
    // }
  }
};
</script>

<style lang="scss" scoped>
.imgez {
  height: 60vh;
  overflow-y: scroll;
  .zj,
  .ys {
    text-align: center;
    font-weight: 800;
    color: #666;
    border: 1px solid #ebeef5;
    height: 30px;
    line-height: 30px;
  }
  .zjm,
  .ysm {
    text-align: center;
    color: #666;
    border: 1px solid #ebeef5;
    height: 30px;
    line-height: 30px;
  }
  .zjimg,
  .ysimg {
    text-align: center;
    height: 45vh;
    line-height: 45vh;
  }
}
.reverseBox {
  height: 68vh;
  overflow-y: scroll;
  /deep/.el-input__inner {
    padding: 0 0.5vw;
  }
  .el-form-item {
    margin-bottom: 4vh;
  }
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
// 新表格
.database {
  width: 100%;
  height: 50.6vh;
  border: 1px solid #666;
  .headData {
    height: 7vh;
    div {
      width: 50%;
      .processName {
        width: 30%;
        border-right: 1px solid #666;
      }
      .stateName {
        width: 30%;
        border-right: 1px solid #666;
        border-left: 1px solid #666;
      }
      span {
        display: block;
        height: 7vh;
        text-align: center;
      }
    }
  }
  //   自检盒子
  .selfinspection {
    width: 50%;
    height: 42vh;
    border-top: 1px solid #666;
    border-right: 1px solid #666;
    .textName {
      height: 5vh;
      border-bottom: 1px solid #666;
      text-align: center;
    }
    .selfPlanBox {
      height: 18vh;
      border-bottom: 1px solid #666;
      span {
        display: block;
        float: left;
        height: 18vh;
        text-align: center;
      }
    }
    .selfRealityBox {
      height: 18vh;
      span {
        display: block;
        float: left;
        height: 18vh;
        text-align: center;
      }
    }
  }
  //   验收盒子
  .acceptance {
    width: 50%;
    height: 42vh;
    border-top: 1px solid #666;
    .textNameOne {
      height: 5vh;
      border-bottom: 1px solid #666;
      text-align: center;
    }
    .selfPlanBox {
      height: 18vh;
      border-bottom: 1px solid #666;
      span {
        display: block;
        float: left;
        height: 18vh;
        text-align: center;
      }
    }
    .selfRealityBox {
      height: 18vh;
      span {
        display: block;
        float: left;
        height: 18vh;
        text-align: center;
      }
    }
  }
}
.describeBox {
  height: 50vh;
  border: 1px solid #666;
  margin-top: 1vh;
  span {
    width: 50%;
    display: block;
    text-align: center;
    p {
      height: 5vh;
      border-bottom: 1px solid #666;
      padding: transparent !important;
    }
  }
  ul{
    padding: 0;
    margin: 0;
    li{
      list-style: none;
      width:33%;
      height:15vh;
      padding: 1%;
      float: left;
      img{
         width:100%;
         height:100%;
         display: block;
      }
    }
  }
}
</style>
