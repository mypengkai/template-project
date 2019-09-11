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
        <div class="pictureBox" >
            <template v-if="item.filetype=='jpg'||item.filetype == 'png' ||item.filetype == 'jpeg'">
              <img :src="item.filePath" alt />
            </template>
              <template  v-else-if="item.filetype==='mp4' || item.filetype==='mov'">
                <img :src="url" alt />
             </template>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="24" style="color:#409eff;margin-top:0.5vw;font-weight: bolder">
              <template v-if="item.infoLogType == 'command'">指令</template>
              <template v-else-if="item.infoLogType== 'processCheck'">工序验收</template>
              <template v-else-if="item.infoLogType == 'polling'">巡视</template>
              <template v-else-if="item.infoLogType == 'sideStation'">旁站</template>
              <template v-else-if="item.infoLogType == 'meeting'">变更纪要</template>
            </el-col>
          </el-row>
          <el-row>
               <el-col :span="24">
              <div
                class="grid-content bg-purple timeOut"
              ><span>创建时间:</span>&nbsp;&nbsp;{{item.infoLogCreateTime}}</div>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#409eff; height:1vw; line-height:1vw; ">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content bg-purple">{{item.job_name_cn}}</div>
            </el-col>
          </el-row>
          <div class="spanOne" :style="{'color':(item.state == flag ? 'red' :'green')}">
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

        <div class="pictureBox" >
            <template v-if="item.filetype=='jpg'||item.filetype == 'png' ||item.filetype == 'jpeg'">
              <img :src="item.filePath" alt />
            </template>
              <template  v-else-if="item.filetype==='mp4' || item.filetype==='mov'">
                <img :src="url" alt />
             </template>
        </div>
        <div class="p20-contation">
          <el-row>
            <el-col :span="10" style="color:#409eff ; margin-top:0.5vw;font-weight: bolder">
              <template v-if="item.infoLogType== 'processCheck'">工序验收</template>
              <template v-else-if="item.infoLogType == 'command'">指令</template>
              <template v-else-if="item.infoLogType == 'polling'">巡视</template>
              <template v-else-if="item.infoLogType == 'sideStation'">旁站</template>
              <template v-else-if="item.infoLogType == 'meeting'">变更纪要</template>
            </el-col>
            <el-col :span="24">
              <div
                class="grid-content bg-purple timeOut"
              ><span>创建时间:</span>&nbsp;&nbsp;{{item.infoLogCreateTime}}</div>
            </el-col>
          </el-row>
          <h3>{{item.projectItem}}</h3>
          <p style="color:#409eff; height:1vw; line-height:1vw;">{{item.zhuanghao}}</p>
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple">{{item.realname}}</div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple-light">{{item.departname}}</div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content bg-purple">{{item.job_name_cn}}</div>
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
      <!-- <checkBox :nowItem="commandList" v-if="hackReset"></checkBox> -->
      <orderInstruct :nowItem="commandList" v-if="hackReset"></orderInstruct>
    </el-dialog>
    <!-- 巡视查看 -->
    <el-dialog title="巡视详情" :visible.sync="dialogTableVisiblePolling" width="60%" class="dialogBox">
      <CheckPicture :nowItem="nowItem" v-if="hackReset"></CheckPicture>
    </el-dialog>
    <!-- 会议 -->
    <el-dialog title="变更纪要详情" :visible.sync="dialogTableVisibleMeeting" fullscreen>
      <meetingDetail :changeId="meetId" v-if="hackReset"></meetingDetail>
    </el-dialog>
    <!--工序查看-->
    <el-dialog fullscreen title="工序详情" :visible.sync="dialogTableVisibleRealcheck">
      <processCheck :processInfoId="processInfoId" :realList="realList" v-if="hackReset"></processCheck>
    </el-dialog>
    <!-- 旁站 -->
    <el-dialog title="旁站详情" :visible.sync="dialogTableVisibleSelfcheck">
      <CheckPicture :nowItem="nowItem" v-if="hackReset"></CheckPicture>
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
import meetingDetail from "@/views/meeting/meetingDetail";
import CheckPicture from "@/views/walkaroundInspection/components/CheckPicture";
import checkBox from "@/views/instruct/components/checkBox";
import orderInstruct from "@/views/instruct/components/orderInstruct"
export default {
  inject: ["reload"],
  name: "DetailList",
  props: {
    traceType: {
      type: Number,
      default: 1
    },
    conentOptions: {
       type:Array
    }, //工程数据
    userOptions: {
       type:Array
    } //人员数据
  },
  components: {
    logCheck,
    pollingCheck,
    comm,
    realcheck,
    processCheck,
    meetingDetail,
    CheckPicture,
    checkBox,
    orderInstruct
  },
  data() {
    return {
      dialogTableVisibleCommied: false, //指令
      dialogTableVisiblePolling: false, //巡视
      dialogTableVisibleNotice: false, //通知
      dialogTableVisibleMeeting: false, //会议
      dialogTableVisibleSelfcheck: false, // 旁站
      dialogTableVisiblelogcheck: false, //日志
      dialogTableVisibleRealcheck: false, // 验收
      targetID: "", // 点击每一项的ID
      commandId: "", // 指令查询ID
      processList: {}, //自检验收信息
      flag: false,
      selfList: [], // 自检数据
      realList: {}, // 工序数据
      processInfoId: "", // 验收数据
      hackReset: false,
      meetId: "", // 会议id
      nowItem: [], // 旁站数据 巡视
      commandList: {}, // 指令数据
      url:'',
    };
  },
  created() {


  },
  watch:{
      conentOptions(val){
          val.forEach(e => {
              if(e.filetype=='mp4'){
                   let str = e.filePath;
                   let endstr = str.replace("mp4","jpg");
                   this.url = endstr;
                   console.log( this.url,"this.url1")
              }else if(e.filetype=='mov'){
                   let str = e.filePath;
                   let endstr = str.replace("mov","jpg");
                   this.url = endstr;
                   console.log( this.url,"this.url2")
              }
          });
      },
      userOptions(val){
            val.forEach(e => {
              if(e.filetype=='mp4'){
                   let str = e.filePath;
                   let endstr = str.replace("mp4","jpg");
                   this.url = endstr;

              }else if(e.filetype=='mov'){
                   let str = e.filePath;
                   let endstr = str.replace("mov","jpg");
                   this.url = endstr;
              }
          });
      },
       deep:true,
  },
  computed: {
    title() {
      return this.traceType === 1 ? "工程痕迹管理" : "人员痕迹管理";
    }
  },
  methods: {
    //查看详细
    pictureLook(item) {
      //指令
      if (item.infoLogType == "command") {
        request
          .post("/rest/command/searchOne", { id: item.infoLogProcessId })
          .then(res => {
            this.commandList = res.data.data;
            this.dialogTableVisibleCommied = true;
          });

        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
      //旁站
      if (item.infoLogType == "sideStation") {
        request.post("/rest/Patrol/chakan/" + item.infoLogId).then(res => {
          if (res.data.ok) {
            this.nowItem = res.data.data;
            this.dialogTableVisibleSelfcheck = true;
          }
        });
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
      //巡视查看
      if (item.infoLogType == "polling") {
        request.post("/rest/Patrol/chakan/" + item.infoLogId).then(res => {
          this.nowItem = res.data.data;
          this.dialogTableVisiblePolling = true;
        });

        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
      // 工序
      if (item.infoLogType == "processCheck") {
        this.processInfoId = item.infoLogProcessId;
        request
          .post("/rest/processCheck/getProcessDetail", {
            id: item.infoLogProcessId
          })
          .then(res => {
            if (res.data.ok) {
              this.realList = res.data.data;
            }
          });
        this.dialogTableVisibleRealcheck = true;
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
      //会议纪要
      if (item.infoLogType == "meeting") {
        this.dialogTableVisibleMeeting = true;
        this.meetId = item.infoLogProcessId;
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
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
    border: 1px solid transparent;

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
    border: 1px solid #409eff;
  }
}
</style>
