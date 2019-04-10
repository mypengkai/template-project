<template>
    <div class="imgez">
        <el-table :data="chakanData" border>
            <el-row>
                <el-col :span="5">
                    <el-table-column property="projectCode" label="代码"></el-table-column>
                </el-col>
                <el-col :span="5">
                    <el-table-column property="projectItem" label="工程名称"></el-table-column>
                </el-col>
                <el-col :span="4">
                    <el-table-column property="projectType" label="工程类型"></el-table-column>
                </el-col>
                <el-col :span="5">
                    <el-table-column property="zhuanghao" label="桩号"></el-table-column>
                </el-col>
            </el-row>
        </el-table>

        <!-- 新的图象 -->
        <div class="database" v-for="(item,index) in datac" :key="index">
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
        <div class="describeBox">
            <span class="fl">
                <p class="br1">自检描述</p>
                <div class="" v-if="imgData!=null">
                    <el-carousel :interval="5000" arrow="always" height="40vh">
                        <el-carousel-item v-for="(item,index) in imgData" :key="index">
                            <img :src="item.filePath" alt="" @click="$emit('imgLeft',0,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div v-else>
                    <div class="zjimg">没有初验图片</div>
                </div>
            </span>
            <span class="rl">
                <p>验收描述</p>
                <div v-if="imgData2!=null">
                         <el-carousel :interval="5000" arrow="always" height="40vh">
                    <el-carousel-item v-for="(item,index) in imgData2" :key="index">
                        <img :src="item.filePath" alt="" @click="$emit('imgLeft',1,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                    </el-carousel-item>
                </el-carousel>
                </div>
                <div v-else>
                      <div class="ysimg">没有验收图片</div>
                </div>
            </span>

        </div>
        <!-- 这里开始 -->
        <!-- <el-row>
            <el-col :span="12">
                <div class="zj">自检资料</div>
            </el-col>
            <el-col :span="12">
                <div class="ys">验收资料</div>
            </el-col>
        </el-row>
        <el-table :data="chakanData" border>
            <el-table-column property="processName" label="工序名"></el-table-column>
            <el-table-column property="planSelfCheckTime" label="计划验收时间"></el-table-column>
            <el-table-column property="planSelfCheckPerson" label="计划自检人"></el-table-column>
            <el-table-column property="realitySelfCheckTime" label="自检时间"></el-table-column>
            <el-table-column property="realitySelfCheckPerson" label="自检人"></el-table-column>
            <el-table-column property="planCheckTime" width="151" label="计划验收时间"></el-table-column>
            <el-table-column property="planCheckPerson" label="计划验收人"></el-table-column>
            <el-table-column property="realityCheckTime" label="验收时间"></el-table-column>
            <el-table-column property="realityCheckPerson" label="验收人"></el-table-column>
            <el-table-column property="state2" label="状态"></el-table-column>
        </el-table>
        <el-row>
            <el-col :span="12">
                <div class="zjm">自检描述:
                    <span>{{zijian}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="ysm">验收描述:
                    <span>{{yanshou}}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12" v-if="imgData!=null">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="(item,index) in imgData" :key="index">
                        <img :src="item.filePath" alt="" @click="$emit('imgLeft',0,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="12" v-else>
                <div class="zjimg">没有初验图片</div>
            </el-col>
            <el-col :span="12" v-if="imgData2!=null">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="(item,index) in imgData2" :key="index">
                        <img :src="item.filePath" alt="" @click="$emit('imgLeft',1,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="12" v-else>
                <div class="ysimg">没有验收图片</div>
            </el-col>
        </el-row> -->
        <!-- 照片详情信息查看 -->
        <el-dialog width="60%" top="5vh" :title="imgForm.state" :visible.sync="imginnerVisible" append-to-body class="dialogBox">
            <el-form class="reverseBox" :model="imgForm" label-width="100px">
                <div style="width:50%">
                    <el-form-item label="验收描述:">
                        <el-input v-model="imgForm.describe"></el-input>
                    </el-form-item>
                    <el-form-item label="拍照时间:">
                        <el-input v-model="imgForm.createTime"></el-input>
                    </el-form-item>
                    <el-form-item label="路基工程:">
                        <el-input v-model="imgForm.photoLocation"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="图片展示:">
                    <el-carousel :interval="3000" arrow="always" height="30vh">
                        <el-carousel-item v-for="item in imgData3" :key="item.index">
                            <img :src="item.filePath" alt="" style="width:100%;height:100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import request from "@/utils/request";
export default {
  props: {
    chakanData: Array,
    imgData: Array,
    imgData2: Array,
    imgId: String,
    zijian: String,
    yanshou: String,
    imgForm: Object,
    imgData3: Array
  },
  data() {
    return {
      imginnerVisible: false,
      datac: []
    };
  },
  created() {
    this.srty();
  },
  methods: {
    srty() {
      this.datac = this.chakanData;
      console.log(this.datac);
    }
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
}
</style>
