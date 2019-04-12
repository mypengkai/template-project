<template>
  <div class="selfcheck">
    <el-form :model="processAll" label-width="150px">
      <div style="width:50%">
        <el-form-item label="工程分部分项:">
          <el-input v-model="processAll.projectItem" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="工序名称:">
          <el-input v-model="processAll.processName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="桩号:">
          <el-input v-model="processAll.zhuanghao" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-input v-model="processAll.stateProcess" :disabled="true"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="allBox">
      <div class="selfBox">
        <h3>自检</h3>
        <el-form :inline="true" :model="FormList" class="demo-form-inline" label-width="150px">
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
        <el-form :model="FormList" label-width="150px" class="elInput">
          <el-form-item label="具体位置:" style="width:30vw">
            <el-input v-model="FormList.photoLocation" :disabled="true" ></el-input>
          </el-form-item>
        </el-form>

        <div class="content">
          <el-tabs type="border-card" v-model="tabPosition">
            <el-tab-pane label="影像资料" name="first">
              <div class="imgContation">
               
                  <ul>
                    <li v-for="(item,index) in objlist" :key="index" @click="selfPicture(item)">
                      <img :src="item.filePath" alt style="width:100%;height:100%">
                    </li>
                  </ul>
                
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="所在位置" name="second" style="max-height:300px;">
              <div id="selfMap"></div>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
      <div class="realBox">
        <h3>验收</h3>
        <el-form :inline="true" :model="InitList" class="demo-form-inline" label-width="150px">
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
        <el-form :model="FormList" label-width="150px" class="elInput">
          <el-form-item  label="具体位置:"    style="width:30vw">
            <el-input v-model="InitList.photoLocation" :disabled="true" v-if="flag"></el-input>
          </el-form-item>
        </el-form>
        <div class="content">
          <el-tabs type="border-card" v-model="tabShow">
            <el-tab-pane label="影像资料" name="three">
              <div class="imgContation">
                  <ul>
                    <li v-for="(item,index) in imgRealList" :key="index" @click="selfPicture(item)">
                      <img :src="item.filePath" alt style="width:100%;height:100%">
                    </li>
                  </ul>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="所在位置" name="four" style="max-height:300px;">
              <div id="realMap" v-if="flag"></div>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
     <el-dialog title="图片预览" :visible.sync="dialogTable" width="80%" append-to-body>
          <viewer :photo="realPicture"></viewer>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import viewer from "@/components/viewer";
export default {
  props: {
    processList: {}
  },
  components:{
     viewer
  },
  data() {
    return {
      selfList: [], // 自检数据
      realList: [], // 验收数据
      dialogTable:false,
      processAll: {
        projectItem: "", // 工程
        zhuanghao: "", // 桩号
        state: "", //状态
        stateProcess: "",
        processName: "" // 工序名
      },
      FormList: {
        planSelfCheckPerson: "", //计划自检人
        planSelfCheckTime: "", // 计划自检时间
        realitySelfCheckPerson: "", // 实际自检人
        realitySelfCheckTime: "", //实际自检时间
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
      tabShow: "three",
      flag: true,
      imgListOne:[],   //自检
      selfImgOne:[],    // 验收
      realPicture:[],    // 自检预览信息
    };
  },
  created() {},
  watch: {
    processList(val) {
      if (this.processList.type == "realcheck") {
        this.realInit();
      }
      if (this.processList.type == "selfcheck") {
        this.selfInit();
      }
    }
  },
  mounted() {
    if (this.processList.type == "realcheck") {
      this.realInit();
    }
    if (this.processList.type == "selfcheck") {
      this.selfInit();
    }
  },
  methods: {
    // 验收
    realInit() {
      if (this.processList.type == "realcheck") {
        this.flag = true;
        request
          .post("/rest/processCheck/getProcessDetail", {
            id: this.processList.processId
          })
          .then(res => {
            if (res.data.respCode == "0") {
              if (res.data.data == null && !res.data.data.length) return false;
              this.realList = res.data.data;
            }
            let conents = this.realList;
            this.processAll.projectItem = conents.projectItem;
            this.processAll.processName = conents.processName;
            this.processAll.zhuanghao = conents.zhuanghao;
            this.processAll.state = conents.state2;
            this.FormList.planSelfCheckPerson = conents.planSelfCheckPerson;
            this.FormList.planSelfCheckTime = conents.planSelfCheckTime;
            this.FormList.realitySelfCheckPerson =
              conents.realitySelfCheckPerson;
            this.FormList.realitySelfCheckTime = conents.realitySelfCheckTime;

            this.InitList.planCheckTime = conents.planCheckTime;
            this.InitList.planCheckPerson = conents.planCheckPerson;
            this.InitList.realityCheckPerson = conents.realityCheckPerson;
            this.InitList.realityCheckTime = conents.realityCheckTime;
            this.objlist = conents.selfFilePath; // 自检位置
            this.imgListOne = this.objlist[0]
            this.imgRealList = conents.filePath; // 验收位置
            this.selfImgOne = this.imgRealList[0]
            if (this.processAll.state == "0") {
              this.processAll.stateProcess = "指定工序";
            }
            if (this.processAll.state == "1") {
              this.processAll.stateProcess = "已指定验收工序";
            }
            if (this.processAll.state == "2") {
              this.processAll.stateProcess = "自检完成";
            }
            if (this.processAll.state == "3") {
              this.processAll.stateProcess = "验收完成";
            }
            if (this.imgRealList.length > 0) {
              let formData = conents.filePath[0];
              this.InitList.photoLocation = conents.filePath[0].photoLocation;
              // if (formData.lgt == "" || formData.lgt == null) {
              //    formData.lgt = 112.376609;
              // }
              // if (formData.lat == "" || formData.lat == null) {
              //   formData.lat = 26.405528;
              // }
              // if (
              //   formData.photoLocation == "" ||
              //   formData.photoLocation == null
              // ) {
              //   formData.photoLocation = "湖南常祁";
              // }
              var map = new BMap.Map("realMap"); //创建地图实例
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
                title: formData.photoLocation // 信息窗口标题
              };
              var infoWindow = new BMap.InfoWindow("", opts); // 创建信息窗口对象
              map.openInfoWindow(infoWindow, map.getCenter()); // 打开信息窗口
            }
            //   自检地图
            if (this.objlist.length > 0) {
              this.FormList.photoLocation =
                conents.selfFilePath[0].photoLocation;
              let selfData = conents.selfFilePath[0];
              // if (selfData.lgt == "" || selfData.lgt == null) {
              //   selfData.lgt = 112.376609;
              // }
              // if (selfData.lat == "" || selfData.lat == null) {
              //   selfData.lat = 26.405528;
              // }
              // if (
              //   selfData.photoLocation == "" ||
              //   selfData.photoLocation == null
              // ) {
              //   selfData.photoLocation = "湖南常祁";
              // }
              var map1 = new BMap.Map("selfMap"); //创建地图实例
              var point1 = new BMap.Point(selfData.lgt, selfData.lat); //经纬度坐标
              map1.centerAndZoom(point1, 14); //初始化地图,设置中心点坐标和地图级别
              map1.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
              map1.addControl(new BMap.ScaleControl()); // 比例尺
              map1.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
              map1.addControl(new BMap.MapTypeControl()); //地图类型
              map1.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
              map1.enableDoubleClickZoom(true);
              var traffic1 = new BMap.TrafficLayer(); // 创建交通流量图层实例
              map1.addTileLayer(traffic1); // 将图层添加到地图上
              var marker1 = new BMap.Marker(point1); //创建标注
              map1.addOverlay(marker1);
              map1.centerAndZoom(point1, 15);
              var stCtrl1 = new BMap.PanoramaControl();
              stCtrl1.setOffset(new BMap.Size(0, 40));
              map1.addControl(stCtrl1);
              var opts1 = {
                width: 180, // 信息窗口宽度
                height: 50, // 信息窗口高度
                title: selfData.photoLocation // 信息窗口标题
              };
              var infoWindow1 = new BMap.InfoWindow("", opts1); // 创建信息窗口对象
              map1.openInfoWindow(infoWindow1, map1.getCenter()); // 打开信息窗口
            }
          });
      }
    },
    // 自检
    selfInit() {
      if (this.processList.type == "selfcheck") {
        this.flag = false;
        request
          .post("/rest/processCheck/getProcessDetail", {
            id: this.processList.processId
          })
          .then(res => {
            if (res.data.respCode == "0") {
              this.selfList = res.data.data;
            }
            // 自检信息
            let conents = this.selfList;
            this.processAll.projectItem = conents.projectItem;
            this.processAll.processName = conents.processName;
            this.processAll.zhuanghao = conents.zhuanghao;
            this.processAll.state = conents.state2;
            this.FormList.planSelfCheckPerson = conents.planSelfCheckPerson;
            this.FormList.planSelfCheckTime = conents.planSelfCheckTime;
            this.FormList.realitySelfCheckPerson =
              conents.realitySelfCheckPerson;
            this.FormList.realitySelfCheckTime = conents.realitySelfCheckTime;

            this.InitList.planCheckTime = conents.planCheckTime;
            this.InitList.planCheckPerson = conents.planCheckPerson;
            this.InitList.realityCheckPerson = conents.realityCheckPerson;
            this.InitList.realityCheckTime = conents.realityCheckTime;

            this.objlist = conents.selfFilePath;
            this.imgListOne = this.objlist[0]
           
            if (this.processAll.state == "0") {
              this.processAll.stateProcess = "指定工序";
            }
            if (this.processAll.state == "1") {
              this.processAll.stateProcess = "自检完成";
            }
            if (this.processAll.state == "2") {
              this.processAll.stateProcess = "验收完成";
            }
            if (this.objlist.length > 0) {
              this.FormList.photoLocation =
                conents.selfFilePath[0].photoLocation;
              let selfData = conents.selfFilePath[0];
              // if (selfData.lgt == "" || selfData.lgt == null) {
              //   selfData.lgt = 112.376609;
              // }
              // if (selfData.lat == "" || selfData.lat == null) {
              //   selfData.lat = 26.405528;
              // }
              // if (
              //   selfData.photoLocation == "" ||
              //   selfData.photoLocation == null
              // ) {
              //   selfData.photoLocation = "湖南常祁";
              // }
              var map1 = new BMap.Map("selfMap"); //创建地图实例
              var point1 = new BMap.Point(selfData.lgt, selfData.lat); //经纬度坐标
              map1.centerAndZoom(point1, 14); //初始化地图,设置中心点坐标和地图级别
              map1.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
              map1.addControl(new BMap.ScaleControl()); // 比例尺
              map1.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
              map1.addControl(new BMap.MapTypeControl()); //地图类型
              map1.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
              map1.enableDoubleClickZoom(true);
              var traffic1 = new BMap.TrafficLayer(); // 创建交通流量图层实例
              map1.addTileLayer(traffic1); // 将图层添加到地图上
              var marker1 = new BMap.Marker(point1); //创建标注
              map1.addOverlay(marker1);
              map1.centerAndZoom(point1, 15);
              var stCtrl1 = new BMap.PanoramaControl();
              stCtrl1.setOffset(new BMap.Size(0, 40));
              map1.addControl(stCtrl1);
              var opts1 = {
                width: 180, // 信息窗口宽度
                height: 50, // 信息窗口高度
                title: selfData.photoLocation // 信息窗口标题
              };
              var infoWindow1 = new BMap.InfoWindow("", opts1); // 创建信息窗口对象
              map1.openInfoWindow(infoWindow1, map1.getCenter()); // 打开信息窗口
            }
          });
      }
    },
    // z自检图片预览    // 验收图片预览
    selfPicture(item){
          let array = []
          array.push(item)
          this.realPicture = array
          this.dialogTable = true
    },
   

  }
};
</script>

<style lang="scss" scoped>
.selfcheck {
  max-height: 60vh;
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
  padding: 0 4vh;
  .imgContation {
      ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      float: left;
      width: 25%;
      height: 15vh;
      padding: 1%;
      img{
         width: 100%;
         height:100%;
         display: block;
      }
    }
  }  
  }
}
.allBox {
  overflow: hidden;
  .selfBox {
    width: 50%;
    float: left;
    h3 {
      font-size: 20px;
      text-align: center;
      font-weight: normal;
    }
  }
  .realBox {
    width: 50%;
    float: right;
    h3 {
      font-size: 20px;
      text-align: center;
      font-weight: normal;
    }
  }
}
</style>

