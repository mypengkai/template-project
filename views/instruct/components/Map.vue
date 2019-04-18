<template>
  <div id="newallmap"></div>
</template>

<script>
import BMap from "BMap";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {}
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //复制nowItem传来的值
      if (this.form.data.finishPictureOfCommand.length > 0) {
       
        let formData = this.form.data.finishPictureOfCommand[0];
        if (formData.lat == null) {
          formData.lat = 112.376609;
        } return;
        if (formData.lgt == null) {
          formData.lat = 26.405528;
        } return;
        let locationData = this.form.data;
        if (locationData.photoLocation == null) {
          locationData.photoLocation = "湖南常祁";
        } return;
        
        var map = new BMap.Map("newallmap"); //创建地图实例
        var point = new BMap.Point(formData.lgt, formData.lat); //经纬度坐标
        map.centerAndZoom(point, 14); //初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
        map.addControl(new BMap.ScaleControl()); // 比例尺
        map.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
        map.addControl(new BMap.MapTypeControl()); //地图类型
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        map.enableDoubleClickZoom(true);
        var traffic = new BMap.TrafficLayer(); // 创建交通流量图层实例
        map.addTileLayer(traffic); // 将图层添加到地图上
        var marker = new BMap.Marker(point); //创建标注
        map.addOverlay(marker);
        map.centerAndZoom(point, 15);
        var stCtrl = new BMap.PanoramaControl();
        stCtrl.setOffset(new BMap.Size(0, 40));
        map.addControl(stCtrl);
        var opts = {
          width: 180, // 信息窗口宽度
          height: 50, // 信息窗口高度
          title: locationData.photoLocation // 信息窗口标题
        };
        var infoWindow = new BMap.InfoWindow("", opts); // 创建信息窗口对象
        map.openInfoWindow(infoWindow, map.getCenter()); // 打开信息窗口
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
#newallmap {
  width: 100%;
  height: 100%;
}
</style>
