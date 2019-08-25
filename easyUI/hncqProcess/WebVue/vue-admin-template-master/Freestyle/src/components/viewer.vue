<template>
  <div class="viewer">
    <!--<el-row>
      <el-col :span="24">
        <ul class="viewLeft" v-for="(item,index) in imgList" :key="index">
            <li>图片名称：{{item.filename}}</li>
            <li>图片格式：{{item.fileType}}</li>
            <li>图片大小：{{item.fileSize}}</li>
            <li>经度：{{item.lgt}}</li>
            <li>纬度：{{item.lat}}</li>
            <li>拍照位置：{{item.photoLocation}}</li>
        </ul>
      </el-col>
    </el-row>-->
    <el-row>
      <el-col :span="24">
        <div class="viewLeft">
          <ul v-for="(item,index) in imgList" :key="index">
            <li>图片名称：{{item.fileName}}</li>
            <li>图片格式：{{item.fileType}}</li>
            <li>图片大小：{{item.fileSize}}</li>
            <li>经度：{{item.lgt}}</li>
            <li>纬度：{{item.lat}}</li>
            <li>桩号：{{zhuanghao}}</li>

            <li>拍照位置：{{item.photoLocation}}</li>
          </ul>
        </div>
        <div class="viewRight">
          <viewer :images="imgList" class="picBox">
            <img v-for="(item,index) in imgList" :src="item.filePath" :key="index" style="width:100%;height:100%"/>
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
    title: true,
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
  props: ['imgList','zhuanghao'],
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
  overflow: auto;
  .viewLeft {
    width: 30%;
    float: left;
    height: 550px;

    ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
        line-height: 3vh;
        color: black;
      }
    }
  }
  .viewRight {
    width: 70%;
    float: right;
    height: 550px;
    .picBox{
        display: none
     }
  }
}
</style>
