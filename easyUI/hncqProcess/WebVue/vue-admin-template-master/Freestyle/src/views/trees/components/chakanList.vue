<template>
    <div class="chakan">
        <el-form :model="formList" label-width="100px">
        <div>
           <el-row>
            <el-col :span="12"><span>&nbsp;&nbsp;&nbsp;&nbsp;创建人：</span><el-input v-model="formList.realname" placeholder="请输入内容" style="width:65%;margin-bottom:30px"></el-input></el-col>
            <el-col :span="12"><span>创建时间：</span><el-input v-model="formList.createTime" placeholder="请输入内容" style="width:65%"></el-input></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span>日志描述：</span><el-input v-model="formList.describe" placeholder="请输入内容" style="width:65%"></el-input></el-col>
            <!-- <el-col :span="12"><span>所在位置：</span><el-input v-model="formList.photoLocation" placeholder="请输入内容" style="width:65%"></el-input></el-col> -->
          </el-row>
        </div>

        <!-- 导航切换 -->
        <div class="navb">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" text-color="#ccc" active-text-color="#409EFF">
            <el-menu-item index="1" >影像资料</el-menu-item>
            <el-menu-item index="2" >所在位置</el-menu-item>
          </el-menu>
        </div>
        
        <!-- 轮播信息 -->
        <div style="height:20vh" v-if="nowType==1">
          <el-form-item label="">
            <el-carousel :interval="3000" arrow="always" height="20vh">
              <el-carousel-item v-for="(item,index) in formList.pictures[0]" :key="index">
                <img :src="item.filePath" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
        </div>
        <!-- 地图 -->
          <div id="allmap"  v-show="nowType==2"></div>
      </el-form>
    </div>
</template>

<script>
export default {
    props:['formList'],
    data(){
        return{
        nowType: '1',
        activeIndex: "1",
        innerVisible: false
        }
    },
    methods:{
        handleSelect(key, keyPath) {
          if(key==1){
            this.nowType=key
          }
          if(key==2){
            this.nowType=key
            this.initData();
          }
        },
        initData() {
        var map = new BMap.Map("allmap");
          var point = new BMap.Point(120.382029,30.312903);
          map.centerAndZoom(point,9);
          var marker = new BMap.Marker(point);
          var mapPoints = [
              {x:30.312903,y:120.382029,title:"A",con:"我是A",branch:"老大"},
              {x:30.215855,y:120.024568,title:"B",con:"我是B",branch:"老二"},
              {x:30.18015,y:120.174968,title:"C",con:"我是C",branch:"老三"},
              {x:30.324994,y:120.164399,title:"D",con:"我是D",branch:"老四"},
              {x:30.24884,y:120.305074,title:"E",con:"我是E",branch:"老五"}
          ];
          map.addOverlay(marker);
          map.enableScrollWheelZoom(true);
          // 函数 创建多个标注
          function markerFun (points,label,infoWindows) {
            console.log(points)
              var markers = new BMap.Marker(points);
              map.addOverlay(markers);
              markers.setLabel(label);
              markers.addEventListener("click",function (event) {
                  // console.log("0001");
                  map.openInfoWindow(infoWindows,points);//参数：窗口、点  根据点击的点出现对应的窗口
              });
          }
          for (let i = 0;i<mapPoints.length;i++) {
            var points = new BMap.Point(mapPoints[i].y,mapPoints[i].x);//创建坐标点
            var opts = {
              width:250,
              height: 100,
              title:mapPoints[i].title
          };
          var label = new BMap.Label(mapPoints[i].branch,{
              offset:new BMap.Size(25,5)
          });
          var infoWindows = new BMap.InfoWindow(mapPoints[i].con,opts);
          markerFun(points,label,infoWindows);
        }
      }
    }
}
</script>

<style lang="scss" scoped>
  .chakan{
    #allmap{
      width: 100%;
      height: 20vh;
    }
    .navb {
      width: 30%;
      height: 7%;
      margin-left: 11px;
    }
  }
</style>
