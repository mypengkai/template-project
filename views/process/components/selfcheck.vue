<template>
  <div class="selfcheck">
    <el-form :model="processAll" label-width="200px">
      <div style="width:50%">
        <el-form-item label="工程分部分项:">
          <el-input v-model="processAll.projectItem" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="工序名称:">
          <el-input v-model="processAll.processName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="桩号:">
          <el-input v-model="processAll.startStation" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-input v-model="processAll.stateProcess" :disabled="true"></el-input>
        </el-form-item>
      </div>
    </el-form>

      <div class="allBox">
      <div class="selfBox">
        <h3>自检</h3>
        <el-form :inline="true" :model="FormList" class="demo-form-inline">
          <el-form-item label="计划自检人：">
            <el-input v-model="FormList.planSelfCheckPerson" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="计划自检时间：">
            <el-input v-model="FormList.planSelfCheckTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="实际自检人：">
            <el-input v-model="FormList.realitySelfCheckPerson" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="实际自检时间：">
            <el-input v-model="FormList.realitySelfCheckTime" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="FormList" label-width="160px" class="elInput">
          <el-form-item label="具体位置:">
            <el-input v-model="FormList.photoLocation" :disabled="true"></el-input>
          </el-form-item>
        </el-form>

        <div class="content">
          <el-tabs type="border-card" v-model="tabPosition">
            <el-tab-pane label="影像资料" name="first">
              <el-carousel :interval="3000" arrow="always" height="300px">
                <el-carousel-item v-for="(item,index) in objlist" :key="index">
                  <img :src="item.filePath" alt style="width:100%;height:100%">
                </el-carousel-item>
              </el-carousel>
            </el-tab-pane>
            <el-tab-pane label="所在位置" name="second">
              <div id="selfMap"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="realBox">
        <h3>验收</h3>
        <el-form :inline="true" :model="InitList" class="demo-form-inline">
          <el-form-item label="计划验收人：">
            <el-input v-model="InitList.planCheckPerson" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="计划验收时间：">
            <el-input v-model="InitList.planCheckTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="实际验收人：">
            <el-input v-model="InitList.realityCheckPerson" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="实际验收时间：">
            <el-input v-model="InitList.realityCheckTime" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="FormList" label-width="160px" class="elInput">
          <el-form-item label="具体位置:">
            <el-input v-model="InitList.photoLocation" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="content">
          <el-tabs type="border-card" v-model="tabShow">
            <el-tab-pane label="影像资料" name="three">
              <el-carousel :interval="3000" arrow="always" height="300px">
                <el-carousel-item v-for="(item,index) in imgRealList" :key="index">
                  <img :src="item.filePath" alt style="width:100%;height:100%">
                </el-carousel-item>
              </el-carousel>
            </el-tab-pane>
            <el-tab-pane label="所在位置" name="four">
              <div id="realMap"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  props: ["targetID"],
  data() {
    return {
      selfList: [], // 自检数据
      realList: [], // 验收数据
      processAll: {
        projectItem: "", // 工程
        startStation: "", // 桩号
        state: "", //状态
        stateProcess: "",
        processName: "" // 工序名
      },
      FormList: {
        planSelfCheckPerson: "", //计划自检人
        planSelfCheckTime: "", // 计划自检时间
        realitySelfCheckPerson: "", // shiji自检人
        realitySelfCheckTime: "", //shiji自检时间
        photoLocation: "" //    自检具体位置
      },
      InitList: {
        planCheckTime: "", //jihua验收时间
        planCheckPerson: "", // jihua 验收人
        realityCheckPerson: "", // shiji验收人
        realityCheckTime: "", // 实际验收时间
        photoLocation: "" // 验收具体位置
      },
      objlist: [], //图片专用(自检)
      imgRealList: [], //验收
      tabPosition: "first",
      tabShow: "three"
    };
  },
  created() {
   
            this.realInit();  
 
   
            this.selfInit();
    
    
  },
  mounted() {},
  methods: {
    // 验收
    realInit() {
      request
        .post("/rest/mark/getPictureDetail", {
          processLogId: this.targetID,
          Mark: 1
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.realList = res.data.data;
            console.log(this.realList, "this.realList");
          }
          let conents = this.realList;
          this.processAll.projectItem = conents.projectItem;
          this.processAll.processName = conents.processName;
          this.processAll.startStation = conents.startStation;
          this.processAll.state = conents.state;
          this.FormList.planSelfCheckPerson = conents.planSelfCheckPerson;
          this.FormList.planSelfCheckTime = conents.planSelfCheckTime;
          this.FormList.realitySelfCheckPerson = conents.realitySelfCheckPerson;
          this.FormList.realitySelfCheckTime = conents.realitySelfCheckTime;

          this.InitList.planCheckTime = conents.planCheckTime;
          this.InitList.planCheckPerson = conents.planCheckPerson;
          this.InitList.realityCheckPerson = conents.realityCheckPerson;
          this.InitList.realityCheckTime = conents.realityCheckTime;
          if (this.processAll.state == "0") {
            this.processAll.stateProcess = "指定";
          }
          if (this.processAll.state == "1") {
            this.processAll.stateProcess = "已指定";
          }
          if (this.processAll.state == "2") {
            this.processAll.stateProcess = "未完成";
          }
          // 图片
          let array = conents.picMessage;
          array.forEach(e => {
            //  状态(图片)
            if (e.state == "0") {
              this.objlist.push(e);
              this.FormList.photoLocation = e.photoLocation;
            }
            if (e.state == "1") {
              this.imgRealList.push(e);
              this.InitList.photoLocation = e.photoLocation;
            }
          });
            //  ===============     地图 +++++===========
          let lgt;
          let lat;
          if (this.imgRealList.length > 0 ) {
            lgt = this.imgRealList[0].lgt;
            lat = this.imgRealList[0].lat;
          }
          if (this.imgRealList.length == 0) {
            lgt = 112.59; // 长沙经纬度
            lat = 28.12;
          }
          console.log(lgt, "lgt", lat, "lat");
          var map = new BMap.Map("realMap");
          var point = new BMap.Point(lgt, lat); // 默认第一个坐标为中心点
          map.centerAndZoom(point, 9);
          var marker = new BMap.Marker(point);
          let mapPoints = this.imgRealList;
          // console.log(mapPoints,'mapPoints')
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
            var points = new BMap.Point(mapPoints[i].lgt, mapPoints[i].lat); //创建坐标点
            var opts = {
              width: 180,
              height: 50,
              title: mapPoints[i].title
            };
            var label = new BMap.Label(mapPoints[i].photoLocation, {
              offset: new BMap.Size(25, 5)
            });
            var infoWindows = new BMap.InfoWindow(
              mapPoints[i].photoLocation,
              opts
            );
            markerFun(points, label, infoWindows);
          }
        });
    },
    // 自检
    selfInit() {
      request
        .post("/rest/mark/getPictureDetail", {
          processLogId: this.targetID,
          Mark: 0
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.selfList = res.data.data;
          }
            console.log(this.selfList,"this.selfList")
          // 自检信息
          let conents = this.selfList;
          this.processAll.projectItem = conents.projectItem;
          this.processAll.processName = conents.processName;
          this.processAll.startStation = conents.startStation;
          this.processAll.state = conents.state;
          this.FormList.planSelfCheckPerson = conents.planSelfCheckPerson;
          this.FormList.planSelfCheckTime = conents.planSelfCheckTime;
          this.FormList.realitySelfCheckPerson = conents.realitySelfCheckPerson;
          this.FormList.realitySelfCheckTime = conents.realitySelfCheckTime;

          this.InitList.planCheckTime = conents.planCheckTime;
          this.InitList.planCheckPerson = conents.planCheckPerson;
          this.InitList.realityCheckPerson = conents.realityCheckPerson;
          this.InitList.realityCheckTime = conents.realityCheckTime;
          if (this.processAll.state == "0") {
            this.processAll.stateProcess = "指定";
          }
          if (this.processAll.state == "1") {
            this.processAll.stateProcess = "已指定";
          }
          if (this.processAll.state == "2") {
            this.processAll.stateProcess = "未完成";
          }
          // 图片
          let arr = conents.picMessage;
          arr.forEach(event => {
            //  状态(图片)
            if (event.state == "0") {
              this.objlist.push(event);
              this.FormList.photoLocation = event.photoLocation;
            }
            if (event.state == "1") {
              this.imgRealList.push(event);
              this.InitList.photoLocation = event.photoLocation;
            }
          });
          //    ===============     地图 +++++===========
          let lgt;
          let lat;
          if (this.objlist.length > 0) {
            lgt = this.objlist[0].lgt;
            lat = this.objlist[0].lat;
          }
          if (this.objlist.length ==  0) {
            lgt = 112.59; // 长沙经纬度
            lat = 28.12;
          }
          var map = new BMap.Map("selfMap");
          var point = new BMap.Point(lgt, lat); // 默认第一个坐标为中心点
          map.centerAndZoom(point, 9);
          var marker = new BMap.Marker(point);
          let mapPoints = this.imgRealList;
          // console.log(mapPoints,'mapPoints')
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
            var points = new BMap.Point(mapPoints[i].lgt, mapPoints[i].lat); //创建坐标点
            var opts = {
              width: 250,
              height: 100,
              title: mapPoints[i].title
            };
            var label = new BMap.Label(mapPoints[i].photoLocation, {
              offset: new BMap.Size(25, 5)
            });
            var infoWindows = new BMap.InfoWindow(
              mapPoints[i].photoLocation,
              opts
            );
            markerFun(points, label, infoWindows);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.selfcheck {
  max-height: 600px;
  overflow-x: hidden;
}
.imgBox {
  width: 100%;
}
#selfMap,
#realMap {
  width: 100%;
  height: 300px;
}
.content {
  margin-left: 60px;
}
.allBox {
  overflow: hidden;

  .selfBox {
    width: 50%;
    float: left;
    text-align: center;
    h3 {
      font-size: 24px;
    }
  }
  .realBox {
    width: 50%;
    float: right;
    text-align: center;
    h3 {
      font-size: 24px;
    }
  }
}
</style>

