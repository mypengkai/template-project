<template>
    <div class="imgez">
        <el-table :data="chakanData" border>
            <el-row>
                <el-col :span="5">
                    <el-table-column property="projectCode" label="代码"></el-table-column>
                </el-col>
                <el-col :span="5">
                    <el-table-column property="projectItem" label="工程名称"></el-table-column>
                </el-col>
                <el-col :span="4">
                    <el-table-column property="projectType" label="工程类型"></el-table-column>
                </el-col>
                <el-col :span="5">
                    <el-table-column property="zhuanghao" label="桩号"></el-table-column>
                </el-col>
            </el-row>
        </el-table>
        <el-row>
            <el-col :span="12">
                <div class="zj">自检资料</div>
            </el-col>
            <el-col :span="12">
                <div class="ys">验收资料</div>
            </el-col>
        </el-row>
        <el-table :data="chakanData" border>
            <el-table-column property="processName" label="工序名"></el-table-column>
            <el-table-column property="planSelfCheckTime" label="计划验收时间"></el-table-column>
            <el-table-column property="planSelfCheckPerson" label="计划自检人"></el-table-column>
            <el-table-column property="realitySelfCheckTime" label="自检时间"></el-table-column>
            <el-table-column property="realitySelfCheckPerson" label="自检人"></el-table-column>
            <el-table-column property="planCheckTime" width="151" label="计划验收时间"></el-table-column>
            <el-table-column property="planCheckPerson" label="计划验收人"></el-table-column>
            <el-table-column property="realityCheckTime" label="验收时间"></el-table-column>
            <el-table-column property="realityCheckPerson" label="验收人"></el-table-column>
            <el-table-column property="state2" label="状态"></el-table-column>
        </el-table>
        <el-row>
            <el-col :span="12">
                <div class="zjm">自检描述:
                    <span>{{zijian}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="ysm">验收描述:
                    <span>{{yanshou}}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12" v-if="imgData!=null">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="(item,index) in imgData" :key="index">
                        <img :src="item.filePath" alt="" @click="$emit('imgLeft',0,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="12" v-else>
                <div class="zjimg">没有初验图片</div>
            </el-col>
            <el-col :span="12" v-if="imgData2!=null">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="(item,index) in imgData2" :key="index">
                        <img :src="item.filePath" alt="" @click="$emit('imgLeft',1,imginnerVisible=true)" style="width:100%;height:100%;cursor:pointer">
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="12" v-else>
                <div class="ysimg">没有验收图片</div>
            </el-col>
        </el-row>
        <!-- 照片详情信息查看 -->
        <el-dialog width="60%" top="5vh" :title="imgForm.state" :visible.sync="imginnerVisible" append-to-body class="dialogBox">
            <el-form class="reverseBox" :model="imgForm" label-width="100px">
                <div style="width:50%">
                    <el-form-item label="验收描述:">
                        <el-input v-model="imgForm.describe"></el-input>
                    </el-form-item>
                    <el-form-item label="拍照时间:">
                        <el-input v-model="imgForm.createTime"></el-input>
                    </el-form-item>
                    <el-form-item label="路基工程:">
                        <el-input v-model="imgForm.photoLocation"></el-input>
                    </el-form-item> 
                </div>
                <el-form-item label="图片展示:">
                    <el-carousel :interval="3000" arrow="always" height="30vh">
                        <el-carousel-item v-for="item in imgData3" :key="item.index">
                            <img :src="item.filePath" alt="" style="width:100%;height:100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import request from "@/utils/request";
export default {
  props: {
    chakanData: Array,
    imgData: Array,
    imgData2: Array,
    imgId: String,
    zijian: String,
    yanshou: String,
    imgForm: Object,
    imgData3: Array
  },
  data() {
    return {
      imginnerVisible: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.imgez {
  height: 60vh;
  overflow-y: scroll;
  .zj,
  .ys {
    text-align: center;
    font-weight: 800;
    color: #666;
    border: 1px solid #ebeef5;
    height: 30px;
    line-height: 30px;
  }
  .zjm,
  .ysm {
    text-align: center;
    color: #666;
    border: 1px solid #ebeef5;
    height: 30px;
    line-height: 30px;
  }
  .zjimg,
  .ysimg {
    text-align: center;
    height: 300px;
    line-height: 300px;
  }
}
.reverseBox {
  height: 68vh;
  overflow-y: scroll;
  /deep/.el-input__inner {
    padding: 0 0.5vw;
}
  .el-form-item {
    margin-bottom: 4vh;
  }
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
</style>
