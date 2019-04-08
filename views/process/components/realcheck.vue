<template>
  <div class="realcheck">
    <el-form :model="initList" label-width="200px">
      <div style="width:50%">
        <el-form-item label="验收描述:">
          <el-input v-model="initList.describe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="验收人:">
          <el-input v-model="initList.userName" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-input v-model="initList.createTime" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="工程分部分项:">
          <el-input v-model="initList.photoLocation" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="图片说明:">
          <el-input v-model="initList.photoDescribe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="具体位置:">
          <el-input v-model="initList.photoLocation" :disabled = 'true'></el-input>
        </el-form-item>
      </div>
    </el-form>
      <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="图片展示" name="first">
          <el-carousel :interval="3000" arrow="always" height="300px">
            <el-carousel-item v-for="(item,index) in object" :key="index">
              <img :src="item.filePath" alt style="width:100%;height:100%">
            </el-carousel-item>
          </el-carousel>
        </el-tab-pane>
        <el-tab-pane label="详细地图" name="second">
          <div id="realmap"></div>
        </el-tab-pane>
      </el-tabs>
    </div>



  </div>
</template>

<script>
export default {
  props: ["realList"], 
  data() {
    return {
      initList: {
        describe: "",
        userName:'',
        createTime: "",
        // createTime: "",
        photoLocation: "",
        photoDescribe: "",
        lgt: "",
        lat: "",
        filePath: ""
      },
      object: [],
      tabPosition:'first'
    };
  },
  watch: {
    //监听父组件传递的数据
    realList() {
      // console.log(this.realList, "this.realList");
      let conent = this.realList;
      let list = [];
      this.initList.describe = this.realList[0].describe;
     
      this.initList.createTime = this.realList[0].createTime;
      this.initList.photoLocation = this.realList[0].photoLocation;
      this.initList.lgt = this.realList[0].lgt;
      this.initList.lat = this.realList[0].lat;
      // 合并图片项(2 3项图片合并)
      for (var key in conent) {
        if (conent[0] != conent[key]) {
          list.push(conent[key]);
        }
      }
      this.object = list;
    }
  },
   mounted() {
    var map = new BMap.Map("realmap"); //创建地图实例
    window.map = map        //将地图放到全局
    var point = new BMap.Point(this.initList.lat, this.initList.lgt); //经纬度坐标
    map.centerAndZoom(point, 14); //初始化地图,设置中心点坐标和地图级别
    var marker = new BMap.Marker(point); //创建标注
    map.addOverlay(marker); //将标注添加到地图中
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.enableDoubleClickZoom(true);
    map.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
    map.addControl(new BMap.ScaleControl()); // 比例尺
    map.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
    map.addControl(new BMap.MapTypeControl()); //地图类型
    var traffic = new BMap.TrafficLayer(); // 创建交通流量图层实例
    map.addTileLayer(traffic); // 将图层添加到地图上
    var stCtrl = new BMap.PanoramaControl();
    stCtrl.setOffset(new BMap.Size(0, 40));
    map.addControl(stCtrl);
    var opts = {
      width: 180, // 信息窗口宽度
      height: 50, // 信息窗口高度
      title: "" // 信息窗口标题
    };
    var infoWindow = new BMap.InfoWindow(this.initList.photoLocation, opts); // 创建信息窗口对象
    map.openInfoWindow(infoWindow, map.getCenter()); // 打开信息窗口
  }
};
</script>
<style lang="scss" scoped>
.imgBox {
  width: 100%;
  
}
#realmap {
  width: 100%;
  height: 300px;
}
.content {
  margin-left: 110px;
}
</style>
