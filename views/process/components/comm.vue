<template>
  <div class="diaMAP">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item style="width:17vw" label="相关工程" label-width="120px">
        <el-input v-model="form.projectItem" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item style="width:17vw" label="创建时间" label-width="120px">
        <el-input v-model="form.createTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="指令内容" label-width="120px">
        <div>
          <el-timeline :reverse="reverse" :class="{timelineBox:activities.length < 5}">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="convertIcon(activity, 'icon')"
              :type="convertIcon(activity, 'type')"
              :size="convertIcon(activity,'size')"
              :timestamp="activity.createTime"
            >{{activity.commandStagePeople1}}: {{activity.name}}</el-timeline-item>
          </el-timeline>

          <div class="topBar">
            <span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 态:</span>
            <el-input v-model="state" :disabled="true"></el-input>
          </div>

          <div class="textareaBar">
            <span>相关描述:</span>
            <el-input type="textarea" v-model="remark" :disabled="true"></el-input>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="allBox">
      <div class="selfBox">
        <h3>发起指令</h3>
        <div class="content">
          <el-tabs type="border-card" v-model="tabPosition">
            <el-tab-pane label="影像资料" name="first">
              <el-carousel :interval="3000" arrow="always" height="300px">
                <el-carousel-item v-for="(item,index) in objlist" :key="index">
                  <img :src="item.picture" alt style="width:100%;height:100%">
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
        <h3>接收指令</h3>
        <div class="content">
          <el-tabs type="border-card" v-model="tabShow">
            <el-tab-pane label="影像资料" name="three">
              <el-carousel :interval="3000" arrow="always" height="300px">
                <el-carousel-item v-for="(item,index) in imgRealList" :key="index">
                  <img :src="item.picture" alt style="width:100%;height:100%">
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
// import instructMap from "@/views/instruct/components/instructMap";
export default {
  props: ["commandID"],
  components: {
    // instructMap
  },
  data() {
    return {
      reverse: true,
      activities: [
        {
          name: "",
          createTime: ""
        }
      ],
      activitiesIcon: [
        // 完成指令的人
        {
          size: "large",
          type: "success",
          icon: "el-icon-check"
        },
        // 正在处理中
        {
          size: "large",
          type: "primary",
          icon: "el-icon-loading"
        },
        // 转发人
        {
          size: "large",
          type: "info",
          icon: "el-icon-refresh"
        },
        // 发出指令的人
        {
          size: "large",
          type: "primary",
          icon: "el-icon-location-outline"
        }
      ],
      commList: [],
      tabPosition: "first",
      tabShow: "three",
      imgRealList: [],
      objlist: [],
      getID: "", // 传入ID
      form: {
        projectItem: "",
        createTime: ""
      },
      state: "",
      remark: ""
    };
  },
  watch: {
    commandID(val) {
      // this.getID = val;
      this.commInit();
    }
  },
  created() {
    this.commInit();
  },
 
  mounted() {},

  methods: {
    commInit() {
      request
        .post("/rest/command/searchOne", {
          id: this.commandID
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.commList = res.data.data;
          }
          this.form.projectItem = this.commList.projectItem;
          this.form.createTime = this.commList.createTime;
          this.remark = this.commList.remark;
          this.state = this.commList.commandState;
          this.objlist = this.commList.pictureOfCommand;
          this.imgRealList = this.commList.finishPictureOfCommand;
          this.activities = this.commList.commandUser;
          // 指令状态处理
          if (this.state == 0) {
            this.state = "未处理";
          }
          if (this.state == 1) {
            this.state = "已处理";
          }
          //    发起人定位
          if (this.objlist.length > 0) {
            let formData = this.objlist[0];
            if (formData.lat == null) {
              formData.lat = 112.376609;
            }
            if (formData.lgt == null) {
              formData.lat = 26.405528;
            }
            if (formData.photoLocation == null) {
              formData.photoLocation = "湖南常祁";
            }
            var map = new BMap.Map("selfMap"); //创建地图实例
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

          //   接收人定位
          if (this.imgRealList.length > 0) {
            let contentData = this.imgRealList[0];
            if (contentData.lat == null) {
              contentData.lat = 112.376609;
            }
            if (contentData.lgt == null) {
              formData.lat = 26.405528;
            }
            if (contentData.photoLocation == null) {
              contentData.photoLocation = "湖南常祁";
            }
            var map1 = new BMap.Map("realMap"); //创建地图实例
            var point1 = new BMap.Point(contentData.lgt, contentData.lat); //经纬度坐标
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
              title: contentData.photoLocation // 信息窗口标题
            };
            var infoWindow1 = new BMap.InfoWindow("", opts1); // 创建信息窗口对象
            map1.openInfoWindow(infoWindow1, map1.getCenter()); // 打开信息窗口
          }
        });
    },

    convertIcon(activity, type) {
      // 指令人处理
      this.activities.forEach(v => {
        v.commandStagePeople == 1 && (v.commandStagePeople1 = "发出指令的人");
        v.commandStagePeople == 2 && (v.commandStagePeople1 = "转发指令的人");
        v.commandStagePeople == 3 && (v.commandStagePeople1 = "正在处理指令");
        v.commandStagePeople == 4 && (v.commandStagePeople1 = "完成指令的人");
      });
      // 发出指令的人
      if (activity.commandStagePeople == 1) {
        if (type === "icon") {
          return this.activitiesIcon[3].icon;
        } else if (type === "type") {
          return this.activitiesIcon[3].type;
        }
      } else if (activity.commandStagePeople == 2) {
        //转发指令的人
        if (type === "icon") {
          return this.activitiesIcon[2].icon;
        } else if (type === "type") {
          return this.activitiesIcon[2].type;
        }
      } else if (activity.commandStagePeople == 3) {
        // 正在处理指令
        if (type === "icon") {
          return this.activitiesIcon[1].icon;
        } else if (type === "type") {
          return this.activitiesIcon[1].type;
        }
      } else if (activity.commandStagePeople == 4) {
        //完成指令的人
        if (type === "icon") {
          return this.activitiesIcon[0].icon;
        } else if (type === "type") {
          return this.activitiesIcon[0].type;
        }
      }
    }
    // 地图
  }
};
</script>
<style lang="scss" scoped>
.diaMAP {
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
      font-size: 16px;
      font-weight: normal;
    }
  }
  .realBox {
    width: 50%;
    float: right;
    text-align: center;
    h3 {
      font-size: 16px;
      font-weight: normal;
    }
  }
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
  }
}
.TimeAndType {
  height: 7vh;
  span {
    display: block;
  }
}
.timelineBox {
  height: 10vh;
  .el-timeline-item {
    float: left;
  }
  /deep/.el-timeline-item__tail {
    position: absolute;
    left: 15px;
    width: 8vw;
    border-top: 2px solid #e4e7ed !important;
    border-left:0
  }
}
.navb {
  width: 30%;
  height: 7%;
  margin-left: 30px;
}
.intervalBox {
  element.style {
    margin-left: transparent;
  }
}
.reverseBox {
  height: 75vh;
  overflow-y: scroll;
}
.accomplish {
  display: block;
  text-align: center;
  font-size: 1vw;
}
</style>


