<template>
  <div class="viewer" >
    <div class="viewLeft" v-for="(item,index) in photo" :key="index">
      <ul>
        <li>图片名称：{{item.fileName}}</li>
        <li>图片格式：{{item.fileType}}</li>
        <li>图片大小：{{item.fileSize}}</li>
        <li>经度：{{item.lgt}}</li>
        <li>纬度：{{item.lat}}</li>
      </ul>
    </div>
    <div class="viewRight" style="height:300px">
      <viewer :images="photo">
        <!-- <el-carousel :interval="3000" arrow="always" height="30vh">
          <el-carousel-item > -->
            <img v-for="(item,index) in photo" :key="index" :src="item.filePath" alt style="width:100%;height:100%" >
          <!-- </el-carousel-item>
        </el-carousel> -->
      </viewer>
    </div>
  </div>
</template>
<script>
export default {
  props: ["photo"],
  data() {
    return {
       
    };
  },
};
</script>
<style lang="scss" scoped>
.viewer {
    height: 100%;
    overflow: hidden;
  .viewLeft {
    float: left;
    width: 40%;
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
        height: 6vh;
        line-height: 6vh;
        color: black;
        font-size: 0.8vw;
      }
    }
  }
  .viewRight{
      float: right;
      width: 60%;
  }
}
</style>
