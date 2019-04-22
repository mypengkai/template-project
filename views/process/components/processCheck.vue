<template>
  <div class="imgez">
    <el-table class="textList" :data="realList" border>
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
    <div class="database" v-for="(item,index) in realList" :key="index">
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
        <div class="textName">自检</div>
        <!-- 计划盒子 -->
        <div class="selfPlanBox">
          <span style="width:20%" class="br1">
            <p>计划</p>
          </span>
          <span style="width:40%" class="br1">
            <div class="bt1">时间</div>
            <p>{{ item.planSelfCheckTime }}</p>
          </span>
          <span style="width:40%">
            <div class="bt1">自检人</div>
            <p>{{ item.planSelfCheckPerson }}</p>
          </span>
        </div>
        <!-- 实际盒子 -->
        <div class="selfRealityBox">
          <span style="width:20%" class="br1">
            <p>实际</p>
          </span>
          <span style="width:40%" class="br1">
            <div class="bt1">时间</div>
            <p>{{ item.realitySelfCheckTime }}</p>
          </span>
          <span style="width:40%">
            <div class="bt1">自检人</div>
            <p>{{ item.realitySelfCheckPerson }}</p>
          </span>
        </div>
      </div>
      <!-- 验收盒子 -->
      <div class="acceptance rl">
        <div class="textName">验收</div>
        <!-- 计划盒子 -->
        <div class="selfPlanBox">
          <span style="width:20%" class="br1">
            <p>计划</p>
          </span>
          <span style="width:40%" class="br1">
            <div class="bt1">时间</div>
            <p>{{ item.planCheckTime }}</p>
          </span>
          <span style="width:40%">
            <div class="bt1">验收人</div>
            <p>{{ item.planCheckPerson }}</p>
          </span>
        </div>
        <!-- 实际盒子 -->
        <div class="selfRealityBox">
           <span style="width:20%" class="br1">
            <p>实际</p>
          </span>
          <span style="width:40%" class="br1">
            <div class="bt1">时间</div>
            <p>{{ item.realityCheckTime }}</p>
          </span>
          <span style="width:40%">
            <div class="bt1">验收人</div>
            <p>{{ item.realityCheckPerson }}</p>
          </span>
        </div>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="describeBox" v-for="(item,index) in realList" :key="'describeBox'-index">
      <span class="fl">
        <div class="br1 first-box">自检描述: {{ item.selfCheckDescribe }}</div>
        <div class="second-box" v-if="imgData!=null">
          <ul>
            <li v-for="(item,index) in imgData" :key="index" @click="pictureShow(item)">
              <img :src="item.filePath" alt>
            </li>
          </ul>
        </div>
        <div v-else>
          <div class="zjimg">没有初验图片</div>
        </div>
      </span>
      <span class="rl">
        <div class="first-box">验收描述: {{ item.describe }}</div>
        <div  v-if="imgData2!=null">
          <ul>
            <li v-for="(item,index) in imgData2" :key="index" @click="pictureShows(item)">
              <img :src="item.filePath" alt>
            </li>
          </ul>
        </div>
        <div v-else>
          <div class="ysimg">没有验收图片</div>
        </div>
      </span>
    </div>
      <!-- // 自检 -->
      <el-dialog title="图片预览" :visible.sync="dialogProcess" fullscreen append-to-body>
          <viewer :photo="processPicture" :imgList="imgData"></viewer>
    </el-dialog>

     <!-- // 验收 -->
      <el-dialog title="图片预览" :visible.sync="dialogProcesss" fullscreen append-to-body>
          <viewer :photo="processPicture" :imgList="imgData2"></viewer>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import viewer from "@/components/viewer";
export default {
  props: ["realList"],
  components:{
      viewer
  },
  data() {
    return {
      imginnerVisible: false,
      datac: [],
      imgData: [],
      imgData2: [],
      dialogProcess:false,    // 自检
      dialogProcesss:false,  // y验收
      processPicture:[],
    };
  },
  watch: {
    realList() {
      this.imgData = this.realList[0].selfFilePath;
      this.imgData2 = this.realList[0].filePath;
      this.realList.forEach(i => {
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
    },
   
  },
  created() {
  },
  methods: {
    //图片预览(自检)
      pictureShow(item){
        let array = []
        array.push(item)
        this.processPicture= array
        this.dialogProcess = true
    },
    //验收
     pictureShows(item){
        let array = []
        array.push(item)
        this.processPicture= array
        this.dialogProcesss = true
    }
  }
};
</script>

<style lang="scss" scoped>
.imgez {
  // height: 80vh;
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
  .zjimg{
      border-right: 1px solid #666;
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
  overflow: hidden;
  border: 1px solid #666;
  .headData {
    div {
      width: 50%;
      .processName {
        width: 30%;
        border-right:1px solid #666;
        background-color: rgba(190, 195, 195, 0.5) !important;
      }
      .stateName {
        width: 30%;
        border-right: 1px solid #666;
        border-left: 1px solid #666;
        background-color: rgba(190, 195, 195, 0.5) !important;
      }
      span {
        display: block;
        text-align: center;
      }
    }
  }
  //   自检盒子
  .selfinspection,.acceptance {
    width: 50%;
    border-top: 1px solid #666;
    .textName {
      border-bottom: 1px solid #666;
      text-align: center;
      height: 5vh;
      line-height: 5vh;
      background-color: rgba(190, 195, 195, 0.5) !important;
    }
    .selfPlanBox,
    .selfRealityBox {
      overflow: hidden;
      border-bottom: 1px solid #666;
      span {
        display: block;
        float: left;
        text-align: center;
        height: 10vh;
        &:first-child {
          line-height: 8vh;
          background-color: rgba(190, 195, 195, 0.5) !important;
          
        }
        &:nth-child(2),
        &:nth-child(3) {
          div {
            height: 5vh;
            line-height: 5vh;
            background-color: rgba(190, 195, 195, 0.5) !important;
          }
        }
      }
    }
  }
  //   验收盒子
  .acceptance {
    width: 50%;
    border-left: 1px solid #666;
  }
  .selfRealityBox{
     border-bottom: 0 !important;
  }
}
.describeBox {
  min-height: 50vh;
  border: 1px solid #666;
  margin-top: 1vh;
  span {
    width: 50%;
    display: block;
    text-align: center;
     .first-box{
          border-bottom: 1px solid #666;
          height:5vh;
    }
     .second-box{
           border-right: 1px solid #666;
            height:45vh;
     }
    div {
      height: 5vh;
      line-height: 5vh;
      padding: transparent !important;
    }
  }
 
  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      width: 33%;
      height: 20vh;
      padding: 1%;
      float: left;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>