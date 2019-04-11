<template>
  <div class="commandCheck">
    <el-form :model="form" label-width="150px">
      <div style="width:50%">
        <el-form-item label="工程分部分项：">
          <el-input v-model="form.projectItem" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="桩号：">
          <el-input v-model="form.startStation" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="巡视人：">
          <el-input v-model="form.createname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="巡视时间：">
          <el-input v-model="form.createTime" :disabled="true"></el-input>
        </el-form-item>
      </div>
       <el-form-item label="巡视描述：">
          <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" v-model="form.describe" max-width="50vh" :disabled="true"></el-input>
        </el-form-item>
    </el-form>
    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="影像资料" name="first">
          <div class="imgContation" >
              <ul>
                <li v-for="(item,index) in imgList" :key="index" @click="showBigPicture(item)">
                  <img :src="item.filePath" alt style="width:100%;height:100%">
                </li>
              </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所在位置" name="second">
          <div id="pollmap"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 图片详情弹出层 -->
    <el-dialog title="图片详情" width="80%" :visible.sync="dialogImg" append-to-body >
           <viewer :photo="photo"></viewer>
    </el-dialog>
  </div>
</template>


<script>
import request from "@/utils/request";
import viewer from "@/components/viewer"; 
export default {
  props: ["targetID"],
  components:{
      viewer
  },
  data() {
    return {
      form: {
        photoDescribe: "", //图片描述
        describe: "", // 巡视描述
        createname: "", // 巡视人
        createTime: "", // 巡视时间
        projectItem: "", // 工程分项
        photoLocation: "", // 具体位置
        startStation: "" // 桩号
      },
      imgList: [],
      imgListOne:[],
      tabPosition: "first",
      dialogImg: false,
      imgFile: "", // 图片路径
      imgName: "", // 图片名称
      imgType: "", // 图片格式
      pollingList: [],
      photo:[],
    };
  },
  watch:{
      targetID(val){
          this.pollInit();
      }
  },
  created() {
  },
  mounted() {
    this.pollInit();
  },
  methods: {
    pollInit() {
      request
        .post("/rest/mark/getPictureDetail ", {
          processLogId: this.targetID
        })
        .then(res => {
          if (res.data.respCode == "0") {
            this.pollingList = res.data.data;
          }
          console.log(this.pollingList, "this.pollingList");
          this.form.createTime = this.pollingList.createTime;
          this.form.startStation = this.pollingList.startStation;
          this.form.projectItem = this.pollingList.projectItem;
          this.form.photoDescribe = this.pollingList.photoDescribe;
          this.form.createname = this.pollingList.createname;
          this.form.describe = this.pollingList.describe;
          this.imgList = this.pollingList.picMessage;
          this.imgListOne = this.pollingList.picMessage[0]
          if (this.pollingList.picMessage.length > 0) {
            let formData = this.pollingList.picMessage[0];
            // console.log(formData.lgt, formData.lat);
            // if (formData.lgt == "" || formData.lgt == null) {
            //   formData.lgt = 112.376609;
            // }
            // if (formData.lat == "" || formData.lat == null) {
            //   formData.lat = 26.405528;
            // }
            // if (formData.photoLocation == "" || formData.photoLocation == null) {
            //   formData.photoLocation = "湖南常祁";
            // }
            var map = new BMap.Map("pollmap"); //创建地图实例
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
    //点击图片显示大图片及图片信息
    showBigPicture(item) {
      console.log( item);
      let arr = []
      arr.push(item)
      this.photo = arr
      // console.log(this.photo,'this.photo')
      this.dialogImg = true;
     
    }
  }
};
</script>
<style lang="scss" scoped>
.commandCheck {
  max-height: 60vh;
  overflow-x: hidden;
}
.imgBox {
  width: 100%;
}
#pollmap {
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
.bigPict {
  width: 100%;
  height: 500px;
  background: pink;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .imgContition {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    p {
      color: blue;
    }
  }
}
/deep/ .dialogBox{
    .el-dialog{
        width: 60%;
    }
    .el-dialog__header{
        text-align: center;
    }
  }
</style>
