<template>
  <div class="diaMAP elInputBox">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item style="width:30vw" label="分部分项：" label-width="120px">
        <el-input v-model="form.projectItem"  readonly></el-input>
      </el-form-item>

      <el-form-item style="width:30vw" label="创建时间：" label-width="120px">
        <el-input v-model="form.createTime" readonly></el-input>
      </el-form-item>

      <el-form-item label="指令时间轴：" label-width="120px">
        <!-- 参考图标 -->
        <div class="reference">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities2"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
        </div>

        <div class="pta">
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="convertIcon(activity, 'icon')"
              :type="convertIcon(activity, 'type')"
              :size="convertIcon(activity,'size')"
              :timestamp="activity.finishTime"
            >{{activity.name}} 指令描述 : {{ activity.remark }}</el-timeline-item>
          </el-timeline>
        </div>
      </el-form-item>
      <el-form-item style="width:30vw" label="状态：" label-width="120px">
        <el-input v-model="state" readonly></el-input>
      </el-form-item>

      <el-form-item style="width:30vw" label="相关描述:" label-width="120px">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="remark"
          readonly
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="allBox">
      <div class="selfBox">
        <h3>发起指令</h3>
        <div class="content">
          <el-tabs type="border-card" v-model="tabPosition">
            <el-tab-pane label="影像资料" name="first">
              <div class="imgContation">
                <ul>
                  <li v-for="(item,index) in objlist" :key="index" @click="commPicture(item,index)">
                    <img :src="item.picture" alt style="width:100%;height:100%">
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="所在位置" name="second">
              <div v-show="!flag">
                <div id="selfMap" ref="selfMap"></div>
              </div>
              <div style="height:30vh" v-show="flag">暂无地图</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="realBox">
        <h3>接收指令</h3>
        <div class="content">
          <el-tabs type="border-card" v-model="tabShow">
            <el-tab-pane label="影像资料" name="three">
              <div class="imgContation">
                <ul>
                  <li v-for="(item,index) in imgRealList" :key="index" @click="commPictures(item,index)">
                    <img :src="item.picture" alt style="width:100%;height:100%">
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="所在位置" name="four">
              <div id="realMap" v-show="!flags" ref="realMap"></div>
              <div style="height:30vh" v-show="flags">暂无地图</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 图片预览  发起 -->
    <el-dialog title="图片预览" :visible.sync="dialogcomm"  fullscreen append-to-body >
      <viewer :photo="commPictureList" :imgList="objlist"></viewer>
    </el-dialog>
     <!-- 图片预览 接收-->
    <el-dialog title="图片预览" :visible.sync="dialogcomms"  fullscreen append-to-body >
      <viewer :photo="commPictureList" :imgList="imgRealList"></viewer>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import viewer from "@/components/viewer";
export default {
  inject: ["reload"],
  props: ["commandId"],
  components: {
    viewer
  },
  data() {
    return {
      reverse: true,
      activities: [
        // 时间线
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
      // 参考图标
      activities2: [
        {
          content: "发出指令",
          timestamp: "",
          type: "primary",
          icon: "el-icon-location-outline"
        },
        {
          content: "转发指令",
          timestamp: "",
          type: "info",
          icon: "el-icon-refresh"
        },
        {
          content: "处理指令",
          timestamp: "",
          type: "primary",
          icon: "el-icon-loading"
        },
        {
          content: "完成指令",
          timestamp: "",
          type: "success",
          icon: "el-icon-check"
        }
      ],
      commList: [], // 接口返回数据
      tabPosition: "first", // 切换
      tabShow: "three",
      imgRealList: [], // 指令完成图片详细信息
      objlist: [], // 发送指令信息
      objOne: [], // 发qi第一张图片信息
      imgListOne: [], //  wancheng第一张图片信息
      form: {
        projectItem: "", // 工程名
        createTime: "" // 时间
      },
      state: "", // 状态
      remark: "", // 描述
      dialogcomm: false,          // 发起
      dialogcomms:false,          // 接收
      commPictureList: [],
      flag: false,
      flags: false,
      map: null,
      map1: null
    };
  },
  watch: {
    commandId(val) {
      console.log(val)
      this.flag = true;
      this.flags = true;
      this.$nextTick(() => {
        this.commInit();
        this.flag = false;
        this.flags = false;
      });
    },

  },
  created() {
    this.commInit();
  },
  mounted() {

  },
  methods: {
    commInit() {
      request
        .post("/rest/command/searchOne", {
          id: this.commandId
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.commList = res.data.data;
            console.log(res.data.data,"this.commList")
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
            if (
              formData.photoLocation == null ||
              formData.photoLocation == ""
            ) {
              this.flag = true;
            }
            this.map = new BMap.Map("selfMap"); //创建地图实例
            var point = new BMap.Point(formData.lgt, formData.lat); //经纬度坐标
            this.map.centerAndZoom(point, 14); //初始化地图,设置中心点坐标和地图级别
            this.map.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
            this.map.addControl(new BMap.ScaleControl()); // 比例尺
            this.map.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
            this.map.addControl(new BMap.MapTypeControl()); //地图类型
            this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            this.map.enableDoubleClickZoom(true);
            var traffic = new BMap.TrafficLayer(); // 创建交通流量图层实例
            this.map.addTileLayer(traffic); // 将图层添加到地图上
            var marker = new BMap.Marker(point); //创建标注
            this.map.addOverlay(marker);
            this.map.centerAndZoom(point, 15);
            var stCtrl = new BMap.PanoramaControl();
            stCtrl.setOffset(new BMap.Size(0, 40));
            this.map.addControl(stCtrl);
            var opts = {
              width: 180, // 信息窗口宽度
              height: 50, // 信息窗口高度
              title: formData.photoLocation // 信息窗口标题
            };
            var infoWindow = new BMap.InfoWindow("", opts); // 创建信息窗口对象
            this.map.openInfoWindow(infoWindow, this.map.getCenter()); // 打开信息窗口
          }

          //   接收人定位
          if (this.imgRealList.length > 0) {
            let contentData = this.imgRealList[0];
            if (
              contentData.photoLocation == null ||
              contentData.photoLocation == ""
            ) {
              this.flags = true;
            }
            this.map1 = new BMap.Map("realMap"); //创建地图实例
            var point1 = new BMap.Point(contentData.lgt, contentData.lat); //经纬度坐标
            this.map1.centerAndZoom(point1, 14); //初始化地图,设置中心点坐标和地图级别
            this.map1.addControl(new BMap.NavigationControl()); //PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
            this.map1.addControl(new BMap.ScaleControl()); // 比例尺
            this.map1.addControl(new BMap.OverviewMapControl()); //默认位于地图右下方，是一个可折叠的缩略地图
            this.map1.addControl(new BMap.MapTypeControl()); //地图类型
            this.map1.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            this.map1.enableDoubleClickZoom(true);
            var traffic1 = new BMap.TrafficLayer(); // 创建交通流量图层实例
            this.map1.addTileLayer(traffic1); // 将图层添加到地图上
            var marker1 = new BMap.Marker(point1); //创建标注
            this.map1.addOverlay(marker1);
            this.map1.centerAndZoom(point1, 15);
            var stCtrl1 = new BMap.PanoramaControl();
            stCtrl1.setOffset(new BMap.Size(0, 40));
            this.map1.addControl(stCtrl1);
            var opts1 = {
              width: 180, // 信息窗口宽度
              height: 50, // 信息窗口高度
              title: contentData.photoLocation // 信息窗口标题
            };
            var infoWindow1 = new BMap.InfoWindow("", opts1); // 创建信息窗口对象
            this.map1.openInfoWindow(infoWindow1, this.map1.getCenter()); // 打开信息窗口
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
    },
    destoryed() {
      this.reload();
      this.map = null;
      this.map1 = null;
    },

    // 图片预览(发起人)
    commPicture(item,index) {
      let array = [];
      array.push(item);
      this.commPictureList = array;
      this.dialogcomm = true;
      this.objlist.splice(index,1)
      this.objlist.unshift(item)
    },
     // 图片预览(接收人)
    commPictures(item,index) {
      let array = [];
      array.push(item);
      this.commPictureLists = array;
      this.dialogcomms = true;

      this.imgRealList.splice(index,1)
      this.imgRealList.unshift(item)
    }
  }
};
</script>
<style lang="scss" scoped>
.diaMAP {
  max-height: 60vh;
  overflow-x: hidden;
}
.imgBox {
  width: 100%;
}
#selfMap,
#realMap {
  width: 100%;
  height: 30vh;
}
.content {
  padding: 1vh;
  .imgContation {
    min-height: 30vh;
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style: none;
        float: left;
        width: 33%;
        height: 15vh;
        padding: 1%;
        img {
          width: 100%;
          height: 100%;
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
      font-size: 16px;
      font-weight: normal;
      text-align: center;
    }
  }
  .realBox {
    width: 50%;
    float: right;
    h3 {
      font-size: 16px;
      font-weight: normal;
      text-align: center;
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
    border-left: 0;
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
  overflow-y: auto;
}
.accomplish {
  display: block;
  text-align: center;
  font-size: 1vw;
}
.reference {
  width: 100%;
  .el-timeline {
    margin-left: -2vw;
    font-size: 0.7vw;
    list-style: none;
  }
  .el-timeline-item {
    float: left;
    padding-bottom: 0;
    height: 3vh;
    // padding-right: 1vw;
  }
  /deep/.el-timeline-item__node--normal {
    width: 0.7vw;
    height: 0.7vw;
  }
  /deep/.el-timeline-item__timestamp {
    font-size: 0.8vw;
  }
  /deep/.el-timeline-item__tail {
    position: absolute;
    left: 0vw;
    width: 0vw;
    height: 3vh;
    border-left: 0.1vw solid rgba(31, 68, 143, 0);
  }
  /deep/.el-timeline-item__node--normal {
    left: 0.5vw;
  }
  /deep/.el-timeline-item__wrapper {
    position: relative;
    padding-left: 1.2vw;
    top: -0.5vh;
  }
}
/deep/ .dialogBox {
  .el-dialog {
    width: 40%;
  }
  .el-dialog__header {
    text-align: center;
  }
}
</style>


