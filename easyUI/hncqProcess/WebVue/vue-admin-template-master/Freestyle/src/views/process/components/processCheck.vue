<template>
  <div class="demo-image__preview" style="padding:0 20px">
    <div class="conentBox" style="overflow-y: auto; height: 75vh;">
      <table
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;"
      >
        <tr>
          <th width="20%">分部分项</th>
          <th width="5%" height="35px">编码</th>
          <th width="10%">桩号</th>
          <th width="5%">完成状态</th>
        </tr>
        <tr>
          <td>{{currentProcess.projectItem}}</td>
          <td>{{currentProcess.projectid.split('_')[1]}}</td>
          <td>{{currentProcess.zhuanghao}}</td>
          <td>{{currentProcess.iscomplete == '1' ? '已完成' : '未完成'}}</td>
        </tr>
      </table>
      <table
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; text-align: center; line-height: 28px; margin-top: 5px;border-collapse:collapse;border:none;"
      ></table>
      <table
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; text-align: center; line-height: 28px; margin-top: 5px;border-collapse:collapse;border:none;"
      >
        <tr>
          <th width>工序名称</th>
          <td colspan="2">{{currentProcess.processName}}</td>
          <th>状态</th>
          <td>
            <template
              v-if="currentProcess.adopt===null || currentProcess.adopt==='' || currentProcess.adopt===undefined"
            >
              <template v-if="currentProcess.state2===0">已指定工序,待指定计划</template>
              <template v-else-if="currentProcess.state2===1">已指定计划,待自检</template>
              <template v-else-if="currentProcess.state2===2">已自检,待验收</template>
            </template>
            <template v-else>
              <template v-if="currentProcess.state2===2 && currentProcess.adopt==='0'">不通过,待自检</template>
              <template v-else-if="currentProcess.state2===3 && currentProcess.adopt==='1'">已验收,通过</template>
            </template>
          </td>
        </tr>
        <tr>
          <th width="10%"></th>
          <th colspan="2" width="45%" height="35px">自检资料</th>
          <th colspan="2" width="45%" height="35px">验收资料</th>
        </tr>
        <tr>
          <td rowspan="2">计划</td>
          <td>时间</td>
          <td>自检人</td>
          <td>时间</td>
          <td>验收人</td>
        </tr>
        <tr>
          <td>{{currentProcess.planSelfCheckTime===null ? '&nbsp;': currentProcess.planSelfCheckTime}}</td>
          <td>{{currentProcess.planSelfCheckPerson===null ? '&nbsp;': currentProcess.planSelfCheckPerson}}</td>
          <td>{{currentProcess.planCheckTime===null ? '&nbsp;': currentProcess.planCheckTime}}</td>
          <td>{{currentProcess.planCheckPerson===null ? '&nbsp;': currentProcess.planCheckPerson}}</td>
        </tr>
        <tr>
          <td>实际</td>
          <td>{{currentProcess.realitySelfCheckTime===null ? '&nbsp;': currentProcess.realitySelfCheckTime}}</td>
          <td>{{currentProcess.realitySelfCheckPerson===null ? '&nbsp;': currentProcess.realitySelfCheckPerson}}</td>
          <td>{{currentProcess.realityCheckTime===null ? '&nbsp;': currentProcess.realityCheckTime}}</td>
          <td>{{currentProcess.realityCheckPerson===null ? '&nbsp;': currentProcess.realityCheckPerson}}</td>
        </tr>
        <tr>
          <td>描述</td>
          <td
            colspan="2"
          >{{currentProcess.selfCheckDescribe===null ? '&nbsp;': currentProcess.selfCheckDescribe}}</td>
          <td
            colspan="2"
          >{{currentProcess.checkDescribe===null ? '&nbsp;': currentProcess.checkDescribe}}</td>
        </tr>
        <tr>
          <td colspan="3" height="400px">
            <div class="block">
              <template v-if="currentProcess.SelfCheckFile!==null">
                <el-timeline>
                  <el-timeline-item
                    :timestamp="'自检时间：'+item.createtime"
                    placement="top"
                    style="padding:10px;text-align: left"
                    v-for="(item, index) in currentProcess.SelfCheckFile"
                    :key="index"
                  >
                    <el-card class="elCard">
                      <h4 style="text-align: left;">
                        完成状态:
                        <span>{{item.isadopt=='1'?'通过':'不通过'}}</span>
                      </h4>
                      <h4 style="text-align: left;">
                        自检描述:
                        <span>{{item.checkexplain}}</span>
                      </h4>
                      <h4 style="text-align: left;">影像资料:</h4>
                      <template v-if="item.infolist!==null">
                        <ul
                          v-for="(node, key) in item.infolist"
                          :key="key"
                          style="margin-left:10px"
                        >
                          <li style="float: left;margin-left: 10px">
                            <template
                              v-if="node.fileType==='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'"
                            >
                              <el-image
                                style="width: 100px; height: 100px"
                                :src="node.filePath"
                                fit="fill"
                                @click="pictureShows(item.infolist, 0)"
                              ></el-image>
                            </template>
                            <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                              <div class="video-box">
                                <video id="video" style="width:100px;height:100px">
                                  <source :src="node.filePath" type="video/mp4" />
                                </video>
                                <div class="video-img" @click="videoPlayerShow(node)"></div>
                              </div>
                            </template>
                          </li>
                        </ul>
                      </template>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </template>
              <template v-else>没有自检照片</template>
            </div>
          </td>
          <td colspan="2">
            <div class="class">
              <template v-if="currentProcess.CheckFile!==null">
                <el-timeline>
                   <!-- item.createtime -->
                  <el-timeline-item
                    :timestamp="'验收时间：'+item.createtime"
                    placement="top"
                    style="padding: 10px;text-align: left"
                    v-for="(item, index) in currentProcess.CheckFile"
                    :key="index"
                  >
                    <el-card class="elCard">
                      <h4 style="text-align: left;">
                        完成状态:
                        <span>{{item.isadopt=='1'?'通过':'不通过'}}</span>
                      </h4>
                      <h4 style="text-align: left;">
                        验收描述:
                        <span>{{item.checkexplain}}</span>
                      </h4>
                      <h4 style="text-align: left;">影像资料:</h4>
                      <template v-if="item.infolist!==null">
                        <ul v-for="(node, key) in item.infolist" :key="key">
                          <li style="float: left;margin-left:10px">
                            <template
                              v-if="node.fileType==='jpg' ||node.fileType == 'png' ||node.fileType == 'jpeg'"
                            >
                              <el-image
                                style="width: 100px; height: 100px"
                                :src="node.filePath"
                                fit="fill"
                                @click="pictureShows(item.infolist)"
                              ></el-image>
                            </template>
                            <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                              <div class="video-box">
                                <video id="video2" style="width:100px;height:100px">
                                  <source :src="node.filePath" type="video/mp4" />
                                </video>
                                <div class="video-img" @click="videoPlayerShow(node)"></div>
                              </div>
                            </template>
                          </li>
                        </ul>
                      </template>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </template>

              <template v-else>没有验收照片</template>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <br />

    <div style="text-align: center;">
      <el-button
        v-if="currentProcess.previousPage==='yes'"
        size="mini"
        type="primary"
        icon="el-icon-arrow-left"
        class="pan-btn light-blue-btn"
        @click="processPageOne('0')"
      >上一道工序</el-button>
      <el-button
        v-if="currentProcess.nextPage==='yes'"
        size="mini"
        type="primary"
        @click="processPageOne('1')"
      >下一道工序 <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>

    <!-- 图片详情弹出层 -->
    <el-dialog title="图片详情" width="50%" :visible.sync="imginnerVisible" append-to-body>
      <viewer :imgList="processPicture" :zhuanghao="zhuanghao"></viewer>
    </el-dialog>
    <el-dialog title="影像资料" width="50%" :visible.sync="vedioinnerVisible" append-to-body>
      <!--      <viewer :imgList="processPicture"></viewer>-->
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import viewer from "@/components/viewer";

export default {
  // props: ['realList', 'processInfoId'],
  props: {
    realList: {
      type: Object
    }
    // ,
    // processInfoId:{
    //     type:String
    // }
  },
  components: {
    viewer
  },
  data() {
    return {
      imginnerVisible: false,
      processPicture: [],
      zhuanghao: "",
      // checkTime:'',
      // selfTime:'',
      CheckFile: [],
      SelfCheckFile: [],
      currentProcess: {},
      currentProcessInfoId: "",
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "" //url地址
          }
        ],
        poster: "", //你的封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      processVedio: [],
      vedioinnerVisible: false
    };
  },
  watch: {
    realList: {
      handler(newVal, oldVal) {
        this.currentProcess = newVal;
        this.currentProcessInfoId = newVal.infoId;
      },
      deep: true
    },
   
  },
  created() {
     
  },
  methods: {
     

    pictureShows(node) {
      let newArr = [];
      for (let i = 0; i < node.length; i++) {
        if (
          node[i].fileType == "jpg" ||
          node[i].fileType == "png" ||
          node[i].fileType == "jpeg"
        ) {
          newArr.push(node[i]);
        }
      }
      this.processPicture = newArr;
      this.zhuanghao = this.currentProcess.zhuanghao;
      this.imginnerVisible = true;
    },
    videoPlayerShow(node) {
      this.playerOptions.sources = [];
      this.playerOptions.sources[0] = {
        src: node.filePath,
        type: "video/mp4"
      };
      this.vedioinnerVisible = true;
    },
    processPageOne(state) {
      //工序翻页
      request
        .post("/rest/processCheck/getProcessNextDetail", {
          id: this.currentProcessInfoId,
          isNext: state
        })
        .then(res => {
          let that = this;
          if (res.data.data) {
            this.currentProcess = res.data.data;
            this.currentProcessInfoId = res.data.data.infoId;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  & :last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
  text-align: center;
}

th {
  background-color: #f5f5f5;
  color: #000;
  border: 1px solid #ddd;
}

td {
  border: 1px solid #ddd;
}

/*.video-js .vjs-icon-placeholder {
    width: 30%;
    height: 30%;
    display: block;
  }*/
.vjs-custom-skin > .video-js {
  width: 35%;
  height: 40%;
}

/deep/ ul,
li {
  list-style-type: none;
}
.elCard {
  h4 {
    span {
      font-weight: normal;
    }
  }
}
/deep/ .el-dialog__wrapper {
  overflow-y: hidden;
}

.video-box {
  position: relative;
}

.video-box video {
  display: inline-block;
  vertical-align: baseline;
}

.video-box .video-img {
  text-align: center;
  position: absolute;
  top: 25%;
  left: 25%;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background: url(../../../imgs/play.png) no-repeat;
  background-size: 50% 50%;
  cursor: pointer;
}
</style>
