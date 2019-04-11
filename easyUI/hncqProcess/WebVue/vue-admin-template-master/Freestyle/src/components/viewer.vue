<template>
  <div class="viewer" >
    <el-row>
        <el-col :span="8">
            <div class="viewLeft" v-for="(item,index) in photo" :key="index">
                <ul>
                  <li>图片名称：{{item.fileName}}</li>
                  <li>图片格式：{{item.fileType}}</li>
                  <li>图片大小：{{item.fileSize}}</li>
                  <li>经度：{{item.lgt}}</li>
                  <li>纬度：{{item.lat}}</li>
                </ul>
              </div>
        </el-col>
        <el-col :span="16"> 
              <div class="viewRight" >
                  <viewer :images="photo">
                        <img v-for="(item,index) in photo" :key="index" :src="item.filePath" alt style="width:100%;height:100%" >
                  </viewer>
                </div>
      </el-col>
</el-row>
  </div>
</template>
<script>
export default {
  props: ["photo"],
  data() {
    return {
       
    };
  },
  created(){
      
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
        line-height:3vh;
        color: black;
        font-size: 0.8vw;
      }
    }
  }
  .viewRight{
       width:300px;
       height:300px;
       margin:0 auto;
       
  }
}
/deep/.viewer-container {
    width: 60%;
    height: 80%;
    // bottom: 0;
    direction: ltr;
    font-size: 0;
    // left: 0; 
    line-height: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    -webkit-tap-highlight-color: transparent;
    top: 0;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
