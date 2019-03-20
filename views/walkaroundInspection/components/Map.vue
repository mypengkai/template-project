<template>
  <div id="allmap">
  </div>
</template>

<script>
import api from "@/api/Patrol.js";
export default {
  data() {
    return {
      formMap: [],
      lgt: "",
      lat: "",
      photoLocation: ""
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      api.PatrolList().then(res => {
        this.formMap = res.data.data.data;
        let formMap = this.formMap;
        for (var i = 0; i < formMap.length; i++) {
          this.lat = formMap[i].lat;
          this.lgt = formMap[i].lgt;
          this.photoLocation = formMap[i].photoLocation;
          console.log(this.photoLocation)
        }
        
        var map = new BMap.Map("allmap"); //创建地图实例
        var point = new BMap.Point(this.lat, this.lgt); //经纬度坐标
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
        var infoWindow = new BMap.InfoWindow(this.photoLocation, opts); // 创建信息窗口对象
        map.openInfoWindow(infoWindow, map.getCenter()); // 打开信息窗口
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
#allmap {
  width: 100%;
  height: 100%;
}
</style>