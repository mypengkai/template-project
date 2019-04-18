<template>
  <div class="viewer">
    <el-row>
      <el-col :span="8">
        <div class="viewLeft" v-for="(item,index) in photo" :key="index">
          <ul>
            <li>图片名称：{{item.fileName}}</li>
            <li>图片格式：{{item.fileType}}</li>
            <li>图片大小：{{item.fileSize}}</li>
            <li>经度：{{item.lgt}}</li>
            <li>纬度：{{item.lat}}</li>
            <li>拍照位置：{{item.photoLocation}}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="viewRight">
          <viewer :images="photo" class="picBox">
            <img
              v-for="(item,index) in photo"
              :key="index"
              :src="item.filePath"
              alt
              style="width:100%;height:100%"
            >
          </viewer>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
    zIndexInline: 2017,
    inline: true,
    button: true,
    navbar: true,
    title: false,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: false,
    keyboard: true,
    url: "data-source"
});
export default {
  props: ["photo"],
  data() {
    return {};
  },
  created() {},
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      this.$viewer.show();
    }
  }
};
</script>
<style lang="scss" scoped>
.viewer {
  .viewLeft {
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
        height: 10vh;
        line-height: 3vh;
        color: black;
        font-size: 1vw;
      }
    }
  }
  .viewRight {
    width: 100%;
    height: 80vh;
    .picBox{
        display: none
     }
  }
}
</style>
