<template>
  <div class="reverseBox">
    <div style="width: 50%;float: left;">
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">分部分项:</span>
            <span>{{nowItem.projectItem}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">桩号:</span>
            <span>{{nowItem.zhuanghao===null ? '&nbsp;' : nowItem.zhuanghao}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">巡视人:</span>
            <span>{{nowItem.createName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">巡视时间:</span>
            <span>{{nowItem.createTime}}</span>
          </div>
        </el-col>
      </el-row>
      <template v-if="nowItem.type==='polling'">
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">巡视范围:</span>
              <span>{{nowItem.pollingRange}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">主要施工:</span>
              <span>{{nowItem.constructionSituation}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">质量/安全:</span>
              <span>{{nowItem.qualitySafety}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">处理意见:</span>
              <span>{{nowItem.questionResultIdea}}</span>
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="nowItem.type==='sideStation'">
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">旁站项目:</span>
              <span>{{nowItem.sideStationProject}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">施工过程:</span>
              <span>{{nowItem.sideStationSketch}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">旁站工作:</span>
              <span>{{nowItem.constructionSituation}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">主要数据:</span>
              <span>{{nowItem.sideStationDataRecord}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 35px;height: 35px;">
              <span style="font-size: 14px; font-weight: bold;float: left;">处理结果:</span>
              <span>{{nowItem.questionResultIdea}}</span>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">巡视描述:</span>
            <span>{{nowItem.remark}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">拍照地点:</span>
            <span>{{nowItem.pictureOfCommand[0].photoLocation}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="line-height: 35px;height: 35px;">
            <span style="font-size: 14px; font-weight: bold;float: left;">拍照描述:</span>
            <span>{{nowItem.photoDescribe===null ? '&nbsp;': nowItem.photoDescribe}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="width: 50%;float: left;">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="影像资料" name="image">
          <div class="condition" >
            <ul>
              <li v-for="(item,index) in nowItem.pictureOfCommand" :key="index" @click="pictureShow(item)">
                <img :src="item.filePath" alt>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所在位置" name="place">
          <div style="height: 330px;">
            <Map :nowItem="nowItem"></Map>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 照片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogpicture"  fullscreen append-to-body >
      <viewer :imgList="nowItem.pictureOfCommand"></viewer>
    </el-dialog>
  </div>
</template>

<script>
import viewer from "@/components/viewer";
import Map from "./Map";
export default {
  components: {
    Map,
    viewer
  },
  props: ["nowItem"],
  data() {
    return {
      activeName: 'image',
      dialogpicture:false
    };
  },
  methods: {
    pictureShow(item){ //图片预览
      this.dialogpicture = true
    }
  }
};
</script>

<style lang="scss" scoped>
.reverseBox {
  height: 68vh;
  overflow-y: scroll;
  /deep/.el-input__inner {
    padding: 0 0.5vw;
    font-size: 14px;
  }
  .el-form-item {
    margin-bottom: 4vh;
  }
  /deep/.el-form-item__label {
    font-size: 14px;
  }

  /deep/.el-textarea__inner{
     font-size: 14px;
  }
}
.condition {
  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      float: left;
      width: 15vh;
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
</style>
