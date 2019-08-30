<template>
  <div class="reverseBox">
    <div style="width: 50%;float: left;">
      <el-row>
        <el-col :span="24">
          <div class="divHeight" style="height: 60px;">
            <span class="spanWord">分部分项:</span>
            <span >{{nowItem.projectItem}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">桩号:</span>
            <span>{{nowItem.zhuanghao===null ? '&nbsp;' : nowItem.zhuanghao}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">巡视人:</span>
            <span>{{nowItem.createName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">巡视时间:</span>
            <span>{{nowItem.createTime}}</span>
          </div>
        </el-col>
      </el-row>
      <template v-if="nowItem.type==='polling'">
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">巡视范围:</span>
              <span>{{nowItem.pollingRange}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">主要施工:</span>
              <span>{{nowItem.constructionSituation}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">质量/安全:</span>
              <span>{{nowItem.qualitySafety}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">处理意见:</span>
              <span>{{nowItem.questionResultIdea}}</span>
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="nowItem.type==='sideStation'">
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">旁站项目:</span>
              <span>{{nowItem.sideStationProject}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">施工过程:</span>
              <span>{{nowItem.sideStationSketch}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">旁站工作:</span>
              <span>{{nowItem.constructionSituation}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">主要数据:</span>
              <span>{{nowItem.sideStationDataRecord}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="divHeight">
              <span class="spanWord">处理结果:</span>
              <span>{{nowItem.questionResultIdea}}</span>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">巡视描述:</span>
            <span>{{nowItem.describe}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">拍照地点:</span>
            <span>{{nowItem.pictureOfCommand[0].photoLocation}}</span>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <div class="divHeight">
            <span class="spanWord">拍照描述:</span>
            <span>{{nowItem.photoDescribe== 'null' ? '': nowItem.photoDescribe}}</span>
          </div>
        </el-col>
      </el-row>-->
    </div>
    <div style="width: 50%;float: right;">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="影像资料" name="image">
          <div class="condition">

            <ul v-for="(node, key) in nowItem.pictureOfCommand" :key="key">

              <li>
                <!-- <img :src="node.filePath" alt="">  -->

                <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                  <!-- <el-image
                    style="width: 100px; height: 100px"
                    :src="node.filePath"
                    fit="fill"
                    @click="pictureShow(nowItem.pictureOfCommand)"
                  ></el-image> -->

                     <img :src="node.filePath" alt=""  @click="pictureShow(nowItem.pictureOfCommand)"   style=" display:block;  width: 100px; height: 100px">
                </template>
                <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                  <video
                    :src="node.filePath"
                    style="width: 100px; height: 100px;"
                    @click="videoPlayerShow(node)"
                  ></video>
                </template>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所在位置" name="place">
          <div style="height: 330px;">
            <Map :nowItem="nowItem"></Map>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 照片预览 -->
    <el-dialog title="图片预览" width="60%" :visible.sync="dialogpicture" append-to-body>
      <viewer :imgList="processPicture"></viewer>
    </el-dialog>

    <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
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
import viewer from "@/components/viewer";
import Map from "./Map";

export default {
  components: {
    Map,
    viewer
  },
  props: {
    nowItem: {
      type: Object
    }
  },
  data() {
    return {
      activeName: "image",
      dialogpicture: false,
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
            src: "",
            type: "video/mp4"
          }
        ],
        poster: "", //你的封面地址
        width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      processVedio: [],
      processPicture: [],
      vedioinnerVisible: false
    };
  },
  methods: {
    pictureShow(node) {
      //图片预览
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
      this.dialogpicture = true;
    },
    videoPlayerShow(node) {
      this.playerOptions.sources[0] = {
        src: node.filePath,
        type: "video/mp4"
      };
      this.vedioinnerVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.reverseBox {
  height: 68vh;
  overflow-y: auto;

  /deep/ .el-input__inner {
    padding: 0 0.5vw;
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 4vh;
  }

  /deep/ .el-form-item__label {
    font-size: 14px;
  }

  /deep/ .el-textarea__inner {
    font-size: 14px;
  }
}
.condition {
  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      float: left;
      width: 12vh;
      height: 12vh;

      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
.spanWord {
  font-size: 14px;
  font-weight: bold;
  float: left;
  margin-right: 10px;
}

.divHeight {
  line-height: 35px;
  height: 35px;
}
</style>
