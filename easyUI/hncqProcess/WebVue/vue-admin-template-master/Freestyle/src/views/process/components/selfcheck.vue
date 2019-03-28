<template>
  <div class="selfcheck">
    <el-form :model="processAll" label-width="200px">
      <div style="width:50%">
        <el-form-item label="工程分部分项:">
          <el-input v-model="processAll.projectItem" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="工序名称:">
          <el-input v-model="processAll.projectItem" :disabled="true"></el-input>
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
export default {
  props: ["selfcheckList", "realList"],
  data() {
    return {
      processAll: {
        projectItem: "", // 工程
        startStation: "", // 桩号
        // stateOfprocess: "", //状态
        state: "", //状态
        stateProcess: ""
      },
      FormList: {
        planSelfCheckPerson: "", //计划自检人
        planSelfCheckTime: "", // 计划自检时间
        realitySelfCheckPerson: "", // shiji自检人
        realitySelfCheckTime: "", //shiji自检时间
        photoLocation: "" //    具体位置
      },
      InitList: {
        planCheckTime: "", //jihua验收时间
        planCheckPerson: "", // jihua 验收人
        realityCheckPerson: "", // shiji验收人
        realityCheckTime: "", // 实际验收时间
        photoLocation: "" // 具体位置
      },
      objlist: [], //图片专用(自检)
      imgRealList: [], //验收
      tabPosition: "first",
      tabShow: "three",
      lat: "",
      lgt: ""
    };
  },
  watch: {
    realList() {
      //验收
      console.log(this.realList, "this.realList");
      let conents = this.realList;
      // console.log(conents,'conents')
      this.processAll.projectItem = conents.projectItem;
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
      // console.log(array,'array')
      array.forEach(e => {
        //  状态(图片)
        if (e.state == "0") {
          this.objlist = conents.picMessage;
          this.FormList.photoLocation = conents.photoLocation;
        } else if (e.state == "1") {
          this.imgRealList = conents.picMessage;
          this.InitList.photoLocation = conents.photoLocation;
        }
      });
    },
    selfcheckList() {
      //自检
      console.log(this.selfcheckList, "this.selfcheckList");
      let conents = this.selfcheckList;
      this.processAll.projectItem = conents.projectItem;
      this.processAll.startStation = conents.startStation;
      this.processAll.state = conents.state;
      this.FormList.planSelfCheckPerson = conents.planSelfCheckPerson;
      this.FormList.planSelfCheckTime = conents.planSelfCheckTime;
      this.FormList.realitySelfCheckPerson = conents.realitySelfCheckPerson;
      this.FormList.realitySelfCheckTime = conents.realitySelfCheckTime;
      this.FormList.photoLocation = conents.photoLocation;
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
      let array = conents.picMessage;
      array.forEach(e => {
        //  状态(图片)
        if (e.state == "0") {
          this.objlist = conents.picMessage;
          console.log(this.objlist, "this.objlist");
          this.FormList.photoLocation = conents.photoLocation;
        } else if (e.state == "1") {
          this.imgRealList = conents.picMessage;
          this.InitList.photoLocation = conents.photoLocation;
        }
      });
    }
  },
  mounted() {
    this.realInit(); //初始化地图
    this.selfInit();
  },
  methods: {
    realInit() {
      // 验收地图
      var map = new BMap.Map("realMap"); //在百度地图容器中创建一个地图
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
    },
    selfInit() {
      var map = new BMap.Map("selfMap"); //在百度地图容器中创建一个地图
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

