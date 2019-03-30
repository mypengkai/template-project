<template>
  <div class="p20">
    <!-- 工程痕迹 -->
    <div class="projectConent" v-if="this.traceType === 1">
      <div class="conent" style="width:15%;" v-for="(item,index) in conentOptions" :key="index" @click="pictureLook(item)">
        <div class="pictureBox">
          <img :src="item.filePath" alt>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="16">
              <div class="grid-content bg-purple" style="color:#8080ff">{{item.createTime}}</div>
            </el-col>
            <el-col :span="6" style="color:#8080ff ; margin-top:9px;">
              <!-- 转码 log =日志    selfcheck = 自检   realcheck  = 验收   polling = 巡视   command = 指令 -->
              <template v-if="item.type == 'log'">日志</template>
              <template v-else-if="item.type == 'selfcheck'">自检</template>
              <template v-else-if="item.type== 'realcheck'">验收</template>
              <template v-else-if="item.type == 'polling'">巡视</template>
              <template v-else-if="item.type == 'command'">指令</template>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple" style="color:#8080ff">{{item.fileinfos}}</div>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#8080ff">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">{{item.zhiwei}}</div>
            </el-col>
          </el-row>
          <div class="spanOne">
            <!-- 转码  0 ==> 未处理     1 ==>已完成 -->
            <template v-if="item.state == 0">未处理</template>
            <template v-else-if="item.state == 1">已完成</template>
          </div>
          <span class="spanTwo el-icon-download"></span>
        </div>
      </div>
    </div>
    <!-- ========================================================================================= -->
    <!-- 人员痕迹 -->
    <div class="projectConent" v-if="this.traceType === 2">
      <div class="conent" style="width:15%;" v-for="(item,index) in this.userOptions" :key="index">
        <div class="pictureBox">
          <img :src="item.filePath" alt>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="16">
              <div class="grid-content bg-purple" style="color:#8080ff">{{item.createTime}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light" style="color:#8080ff">{{item.type1}}</div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple" style="color:#8080ff">1</div>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#8080ff">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.zhiwei}}</div>
            </el-col>
          </el-row>
          <div class="spanOne">
            <template v-if="item.state == 0">未处理</template>
            <template v-else-if="item.state == 1">已完成</template>
          </div>
          <span class="spanTwo el-icon-download"></span>
        </div>
      </div>
    </div>
    <!-- ==================================================================== -->
    <!-- 指令查看 -->
    <el-dialog title="指令详情" :visible.sync="dialogTableVisibleCommied" width="60%">
      <inspectionBox :nowItem="nowItem" v-if="nowItem"></inspectionBox>
      <!-- <checkBox :commandList="commandList"></checkBox>  -->
    </el-dialog>
    <!-- 巡视查看 -->
    <el-dialog title="巡视详情" :visible.sync="dialogTableVisiblePolling" width="60%">
      <pollingCheck :pollingList="pollingList"></pollingCheck>
    </el-dialog>
    <!-- 自检查看   验收查看-->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisibleSelfcheck" width="80%">
      <selfcheck :selfcheckList="selfcheckList" :realList="realList"></selfcheck>
    </el-dialog>
    <!-- 日志查看 -->
    <el-dialog title="日志详情" :visible.sync="dialogTableVisiblelogcheck" width="60%">
      <logCheck :logList="logList"></logCheck>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
// import realcheck from "@/views/process/components/realcheck";
import selfcheck from "@/views/process/components/selfcheck";
import logCheck from "@/views/process/components/logCheck";
// import commandCheck from "@/views/process/components/commandCheck";
import pollingCheck from "@/views/process/components/pollingCheck";
import checkBox from "@/views/instruct/components/checkBox";
import inspectionBox from "../components/inspectionBox";
import checkPicture from "@/views/walkaroundInspection/components/CheckPicture";

export default {
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
    // commandCheck,
    selfcheck,
    logCheck,
    pollingCheck,
    checkBox,
    inspectionBox,
    checkPicture
  },
  data() {
    return {
      nowItem: "",
      dialogTableVisibleCommied: false, //指令
      dialogTableVisiblePolling: false, //巡视
      dialogTableVisibleSelfcheck: false, // 自检
      dialogTableVisiblelogcheck: false, //日志
      realList: [], //验收
      pollingList: [], //巡视
      selfcheckList: [], // 自检
      commandList: [], // 指令
      logList: [] //日志
    };
  },

  created() {},
  computed: {
    title() {
      return this.traceType === 1 ? "工程痕迹管理" : "人员痕迹管理";
    }
  },

  methods: {
    //查看图片详细
    pictureLook(item) {
      //指令
      if (item.type == "command") {
        this.dialogTableVisibleCommied = true;
        request
          .post("/rest/mark/getPictureDetail", {
            processLogId: item.id
          })
          .then(res => {
            this.commandList = res.data.data;
            this.nowItem = this.commandList;
            
          });
      }
      //日志
      if (item.type == "log") {
        this.dialogTableVisiblelogcheck = true;
        request
          .post("/rest/mark/getPictureDetail", {
            processLogId: item.id
          })
          .then(res => {
            this.logList = res.data.data;
          });
      }

      //巡视查看
      if (item.type == "polling") {
        this.dialogTableVisiblePolling = true;
        request
          .post("/rest/mark/getPictureDetail", {
            processLogId: item.id
          })
          .then(res => {
            this.pollingList = res.data.data;
            console.log(this.pollingList, "this.pollingList");
          });
      }
      //验收
      if (item.type == "realcheck") {
        this.dialogTableVisibleSelfcheck = true;
        request
          .post("/rest/mark/getPictureDetail", {
            processLogId: item.id
          })
          .then(res => {
            this.realList = res.data.data;
          });
      }
      //自检
      if (item.type == "selfcheck") {
        this.dialogTableVisibleSelfcheck = true;
        request
          .post("/rest/mark/getPictureDetail", {
            processLogId: item.id
          })
          .then(res => {
            this.selfcheckList = res.data.data;
          });
      }
    }
  },
   watch: {
    dialogTableVisibleCommied(val) {
      !val && (this.nowItem = ""); // 监听弹窗是否关闭 清空数据 防止回填
    }
  }
};
</script>

<style lang="scss" scoped>
.p20 {
  margin: 0;
  padding: 0;
  // overflow: hidden;
  max-height: 470px;
  overflow-x: hidden;
  .conent {
    overflow: hidden;
    float: left;
    margin: 10px 0.82%;
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
      margin-top: 20px;
      box-sizing: border-box;
      padding: 10px;
      overflow: hidden;
      h3 {
        font-size: 12px;
        margin: 20px 0;
        min-height: 30px;
      }
      p {
        font-size: 14px;
      }
      .grid-content {
        font-size: 14px;
        margin: 10px 0;
      }
      .spanOne {
        float: left;
        font-size: 14px;
        color: red;
      }
      .spanTwo {
        float: right;
        font-size: 20px;
        // color: red;
      }
    }
  }
  .conent:hover {
    border: 1px solid red;
  }
}
</style>
