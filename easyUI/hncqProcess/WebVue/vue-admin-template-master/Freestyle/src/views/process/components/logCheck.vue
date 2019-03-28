<template>
  <div class="logCheck">
    <el-form :inline="true" :model="form" label-width="200px">
      <el-form-item label="姓名">
        <el-input v-model="form.createname" :disabled="true" style="width:160%"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="form.createTime" :disabled="true" style="width:160%"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form" label-width="200px">
      <div style="width:50%">
        <el-form-item label="日志描述">
          <el-input v-model="form.describe" :disabled="true" style="width:200%"></el-input>
        </el-form-item>
        <el-form-item label="具体位置">
          <el-input v-model="form.photoLocation" :disabled="true" style="width:200%"></el-input>
        </el-form-item>
        <el-form-item label="照片描述">
          <el-input v-model="form.photoDescribe" :disabled="true" style="width:200%"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="影像资料" name="first">
          <el-carousel :interval="3000" arrow="always" height="300px">
            <el-carousel-item v-for="(item,index) in imgList" :key="index">
              <img :src="item.filePath" alt style="width:100%;height:100%">
            </el-carousel-item>
          </el-carousel>
        </el-tab-pane>
        <el-tab-pane label="所在位置" name="second">
          <div id="logmap"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: ["logList"],
  data() {
    return {
      imgList: [], //图片
      form: {
        createname: "", // 创建人
        createTime: "", //时间
        photoLocation: "", // 位置
        photoDescribe: "", //图片描述
        describe: "" //日志描述
      },
      tabPosition: "first"
    };
  },
  watch: {
    logList() {
      // 监测父组件数据
      console.log(this.logList, "this.logList");
      this.form.createname = this.logList.createname;
      this.form.createTime = this.logList.createTime;
      this.form.photoLocation = this.logList.photoLocation;
      this.form.photoDescribe = this.logList.photoDescribe;
      this.form.describe = this.logList.describe;
      this.imgList = this.logList.picMessage;
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    ininMap() {
      var map = new BMap.Map("logmap");
      var point = new BMap.Point(120.382029, 30.312903);
      map.centerAndZoom(point, 9);
      var marker = new BMap.Marker(point);
      var mapPoints = [
        {
          x: 30.312903,
          y: 120.382029,
          title: "A",
          con: "我是A",
          branch: "老大"
        },
        {
          x: 30.215855,
          y: 120.024568,
          title: "B",
          con: "我是B",
          branch: "老二"
        },
        {
          x: 30.18015,
          y: 120.174968,
          title: "C",
          con: "我是C",
          branch: "老三"
        },
        {
          x: 30.324994,
          y: 120.164399,
          title: "D",
          con: "我是D",
          branch: "老四"
        },
        { x: 30.24884, y: 120.305074, title: "E", con: "我是E", branch: "老五" }
      ];

      map.addOverlay(marker);
      map.enableScrollWheelZoom(true);
      // 函数 创建多个标注
      function markerFun(points, label, infoWindows) {
        var markers = new BMap.Marker(points);
        map.addOverlay(markers);
        markers.setLabel(label);
        markers.addEventListener("mouseover", function(event) {
          map.openInfoWindow(infoWindows, points); //参数：窗口、点  根据点击的点出现对应的窗口
        });
      }
      for (var i = 0; i < mapPoints.length; i++) {
        var points = new BMap.Point(mapPoints[i].y, mapPoints[i].x); //创建坐标点
        var opts = {
          width: 250,
          height: 100,
          title: mapPoints[i].title
        };
        var label = new BMap.Label(mapPoints[i].branch, {
          offset: new BMap.Size(25, 5)
        });
        var infoWindows = new BMap.InfoWindow(mapPoints[i].con, opts);
        markerFun(points, label, infoWindows);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.imgBox {
  width: 100%;
}
#logmap {
  width: 100%;
  height: 300px;
}
.content {
  margin-left: 110px;
}
</style>
