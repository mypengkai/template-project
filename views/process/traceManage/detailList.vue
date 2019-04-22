<template>
  <div class="p20 conentlist">
    <!-- 工程痕迹 -->
    <div class="projectConent" v-if="this.traceType === 1">
      <div
        class="conent"
        v-for="(item,index) in conentOptions"
        :key="index"
        @click="pictureLook(item)"
      >
        <div class="pictureBox">
          <img :src="item.filePath" alt>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple timeOut" style="color:#8080ff">{{item.createTime}}</div>
            </el-col>
            <el-col :span="6" style="color:#8080ff ; margin-top:0.5vw;">
              <!-- 转码 log =日志    selfcheck = 自检   realcheck  = 验收   polling = 巡视   command = 指令 -->
              <template v-if="item.type == 'log'">日志</template>
              <template v-else-if="item.type == 'selfcheck'">自检</template>
              <template v-else-if="item.type== 'realcheck'">验收</template>
              <template v-else-if="item.type == 'polling'">巡视</template>
              <template v-else-if="item.type == 'command'">指令</template>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#8080ff; height:1vw; line-height:1vw; ">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.zhiwei}}</div>
            </el-col>
          </el-row>
          <div class="spanOne" :style="{'color':(item.state == flag ? 'red' :'green')}">
            <!-- 转码  0 ==> 未处理     1 ==>已完成 -->
            <template v-if="item.state == 0">未处理</template>
            <template v-else-if="item.state == 1">已完成</template>
          </div>
        </div>
      </div>
    </div>
    <!-- ========================================================================================= -->
    <!-- 人员痕迹 -->
    <div class="projectConent" v-if="this.traceType === 2">
      <div
        class="conent"
        style="width:18%;"
        v-for="(item,index) in this.userOptions"
        :key="index"
        @click="pictureLook(item)"
      >
        <div class="pictureBox">
          <img :src="item.filePath" alt>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple timeOut" style="color:#8080ff">{{item.createTime}}</div>
            </el-col>
            <el-col :span="6" style="color:#8080ff ; margin-top:0.5vw;">
              <!-- 转码 log =日志    selfcheck = 自检   realcheck  = 验收   polling = 巡视   command = 指令 -->
              <template v-if="item.type == 'log'">日志</template>
              <template v-else-if="item.type == 'selfcheck'">自检</template>
              <template v-else-if="item.type== 'realcheck'">验收</template>
              <template v-else-if="item.type == 'polling'">巡视</template>
              <template v-else-if="item.type == 'command'">指令</template>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#8080ff; height:1vw; line-height:1vw;">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.zhiwei}}</div>
            </el-col>
          </el-row>
          <div class="spanOne" :style="{'color':(item.state == flag ? 'red' :'green')}">
            <template v-if="item.state == 0">未处理</template>
            <template v-else-if="item.state == 1">已完成</template>
          </div>
        </div>
      </div>
    </div>
    <!-- ==================================================================== -->
    <!-- 指令查看 -->
    <el-dialog title="指令详情" :visible.sync="dialogTableVisibleCommied" width="60%" class="dialogBox">
      <comm :commandId="commandId" v-if="hackReset"></comm>
    </el-dialog>
    <!-- 巡视查看 -->
    <el-dialog title="巡视详情" :visible.sync="dialogTableVisiblePolling" width="60%" class="dialogBox">
      <pollingCheck :targetID="targetID"></pollingCheck>
    </el-dialog>
    <!--验收查看-->
    <el-dialog
      fullscreen
      title="查看详情"
      :visible.sync="dialogTableVisibleRealcheck"
     
     
    >
      <processCheck :realList="realList"></processCheck>
    </el-dialog>
    <!-- 自检查看 -->
    <el-dialog
      fullscreen
      title="查看详情"
      :visible.sync="dialogTableVisibleSelfcheck"
    
     
    >
      <processCheck :realList="selfList"></processCheck>
    </el-dialog>
    <!-- 日志查看 -->
    <el-dialog
      title="日志详情"
      :visible.sync="dialogTableVisiblelogcheck"
      width="60%"
      class="dialogBox"
    >
      <logCheck :targetID="targetID"></logCheck>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import comm from "@/views/process/components/comm";
import logCheck from "@/views/process/components/logCheck";
import pollingCheck from "@/views/process/components/pollingCheck";
import processCheck from "@/views/process/components/processCheck";
import realcheck from "@/views/process/components/realcheck";
export default {
  inject: ["reload"],
  name: "DetailList",
  props: {
    traceType: {
      type: Number,
      default: 1
    },
    conentOptions: {}, //工程数据
    userOptions: {} //人员数据
  },
  components: {
    logCheck,
    pollingCheck,
    comm,
    realcheck,
    processCheck
  },
  data() {
    return {
      dialogTableVisibleCommied: false, //指令
      dialogTableVisiblePolling: false, //巡视
      dialogTableVisibleSelfcheck: false, // 自检
      dialogTableVisiblelogcheck: false, //日志
      dialogTableVisibleRealcheck: false, // 验收
      targetID: "", // 点击每一项的ID
      commandId: "", // 指令查询ID
      processList: {}, //自检验收信息
      flag: false,
      selfList: [], // 自检数据
      realList: [], // 验收数据
      hackReset: false
    };
  },
  created() {},
  mounted() {
  
  },
  computed: {
    title() {
      return this.traceType === 1 ? "工程痕迹管理" : "人员痕迹管理";
    }
  },

  methods: {
    //查看图片详细
    pictureLook(item) {
      this.targetID = item.id;
      //指令
      if (item.type == "command") {
        this.dialogTableVisibleCommied = true;
        this.commandId = item.commandId;
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
      //日志
      if (item.type == "log") {
        this.dialogTableVisiblelogcheck = true;
      }
      //巡视查看
      if (item.type == "polling") {
        this.dialogTableVisiblePolling = true;
      }
      // 验收
      if (item.type == "realcheck") {
        this.dialogTableVisibleRealcheck = true;
        request
          .post("/rest/processCheck/getProcessDetail", {
            id: item.processId
          })
          .then(res => {
            if (res.data.respCode == "0") {
              let arr = [];
              arr.push(res.data.data);
              this.realList = arr;
            }
          });
      }
      // 自检
      if (item.type == "selfcheck") {
        this.dialogTableVisibleSelfcheck = true;
        request
          .post("/rest/processCheck/getProcessDetail", {
            id: item.processId
          })
          .then(res => {
            if (res.data.respCode == "0") {
              let array = [];
              array.push(res.data.data);
              this.selfList = array;
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.conentlist {
  margin: 0;
  padding: 0;
  .conent {
    overflow: hidden;
    width: 18%;
    float: left;
    margin: 10px 1%;
    box-sizing: border-box;
    border: 1px solid transparent; //透明边框占位
    .pictureBox {
      width: 100%;
      background: url("./images/bkg007.png") no-repeat;
      background-size: 100% 100%;
      height: 150px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .p20-contation {
      border: 1px solid #ccc;
      margin-top: 10px;
      box-sizing: border-box;
      padding: 10px;
      overflow: hidden;
      h3 {
        font-size: 12px;
        margin: 10px 0;
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: normal;
      }
      p {
        font-size: 12px;
      }
      .timeOut {
        overflow: hidden;
        height: 18px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .grid-content {
        font-size: 0.8vw;
        max-height: 1vw;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        margin: 0.5vw 0;
        font-weight: normal;
      }
      .spanOne {
        float: left;
        font-size: 1vw;
        height: 1vw;
        color: red;
      }
      .spanTwo {
        float: right;
        font-size: 20px;
      }
    }
  }
  .conent:hover {
    border: 1px solid red;
  }
}
</style>
