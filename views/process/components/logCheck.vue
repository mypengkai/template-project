<template>
  <div class="logCheck elInputBox">
    <el-form :inline="true" :model="form" label-width="100px" class="elInputBox">
      <el-form-item label="姓名">
        <el-input v-model="form.createname" readonly style="min-width:30vh"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="form.createTime" readonly style="min-width:30vh"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form" label-width="100px">
      <div style="width:88%">
        <el-form-item label="日志描述">
          <el-input type="textarea" v-model="form.describe" readonly ></el-input>
        </el-form-item>
        <el-form-item label="所在位置">
          <el-input  type="textarea"   v-model="form.photoLocation" readonly ></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="影像资料" name="first">
          <div class="imgContation">
              <ul>
                <li v-for="(item,index) in imgList" :key="index" @click="picturePreve(item)">
                    <img :src="item.filePath" alt style="width:100%;height:100%">
                </li>
              </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所在位置" name="second">
          <div id="logmap" v-show="!flag"></div>
           <div style="height:30vh" v-show="flag">
                    暂无地图
              </div>    
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- //图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogTableVisible" fullscreen append-to-body>
          <viewer :photo="photo" :imgList="imgList"></viewer>
    </el-dialog>
        
          

  </div>
</template>

<script>
import request from "@/utils/request";
import viewer from "@/components/viewer";
export default {
  props: ["targetID"],
  components: {
    viewer
  },
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
      tabPosition: "first",
      logList: [], // 数据
      imgListOne: [], //  第一组图片信息
      dialogTableVisible: false,
      photo: [] ,//点击图片信息
      flag:false
    };
  },
  created() {},
  mounted() {
    this.logInit();
  },
  watch: {
    targetID() {
      this.logInit();
    }
  },
  methods: {
    // 日志初始化数据
    logInit() {
      request
        .post("/rest/mark/getPictureDetail", {
          processLogId: this.targetID
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.logList = res.data.data;
          }
          console.log(this.logList, "this.logList");
          this.form.createname = this.logList.createname;
          this.form.createTime = this.logList.createTime;
          this.form.photoLocation = this.logList.picMessage[0].photoLocation; // 默认第一次拍照的位置
          this.form.photoDescribe = this.logList.photoDescribe;
          this.form.describe = this.logList.describe;
          this.imgList = this.logList.picMessage;
          this.imgListOne = this.logList.picMessage[0];
          // ========================  地图    ============================
          if (this.logList.picMessage.length > 0) {
            let formData = this.logList.picMessage[0];
            if(formData.photoLocation=="" || formData.photoLocation==null){
                 this.flag = true
            }
            var map = new BMap.Map("logmap"); //创建地图实例
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
        });
    },
    //图片预览
    picturePreve(item) {
      let array = [];
      array.push(item)
      this.photo = array;
      this.dialogTableVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.logCheck {
  height: 60vh;
  overflow-y: scroll;
}
.imgBox {
  width: 100%;
}
#logmap {
  width: 100%;
  height: 30vh;
}
.content {
  padding: 0 4vh;
  .imgContation {
    min-height: 30vh;
    overflow-x: hidden;
     ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      float: left;
      width: 33%;
      height: 25vh;
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

</style>
