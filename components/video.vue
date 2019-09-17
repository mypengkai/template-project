<template>
  <div class="videoBox">
    <el-row>
      <el-col :span="8">
        <ul>
          <li>视频名称：{{fileData.fileName}}</li>
          <li>视频格式：{{fileData.fileType}}</li>
          <li>视频大小：{{fileData.fileSize}}</li>
          <li>经度：{{fileData.lgt}}</li>
          <li>纬度：{{fileData.lat}}</li>
          <li>拍照地点：{{fileData.photoLocation}}</li>
        </ul>
      </el-col>
      <el-col :span="16">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props:{
      fileData:{
          type:Object,
      }
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "" //url地址
          }
        ],
        poster: "", //你的封面地址
        //width:document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    };
  },
  created() {
    this.initVideo();
  },
  methods: {
    initVideo() {
      this.playerOptions.sources = [];
      this.playerOptions.sources[0] = {
        src: this.fileData.filePath,
        type: "video/mp4"
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.video-js .vjs-icon-placeholder {
  width: 100%;
  height: 100%;
  display: block;
}
.vjs-custom-skin > .video-js {
  width: 100%;
  height: 100%;
}
ul {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
    line-height: 5vh;
    color: black;
  }
}
</style>