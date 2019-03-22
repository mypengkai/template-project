<template>
  <div class="selfcheck">
    <el-form :model="FormList" label-width="200px">
      <div style="width:50%">
        <el-form-item label="自检描述:">
          <el-input v-model="FormList.describe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="拍照时间:">
          <el-input v-model="FormList.createTime" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-input v-model="FormList.createTime" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="路基工程:">
          <el-input v-model="FormList.photoLocation" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="图片说明:">
          <el-input v-model="FormList.photoDescribe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="纬度:">
          <el-input v-model="FormList.lgt" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="经度:">
          <el-input v-model="FormList.lat" :disabled = 'true'></el-input>
        </el-form-item>
      </div>
      <el-form-item label="图片展示:">
        <el-carousel height="400px" :interval="5000" class="imgBox">
          <el-carousel-item v-for="(value,index) in objlist" :key="index">
            <img :src="value.filePath" alt style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props:['selfcheckList'],
  
  data() {
    return {
      FormList: {
        describe: "",
        createTime: "",
        // createTime: "",
        photoLocation: "",
        photoDescribe: "",
        lgt: "",
        lat: "",
        filePath: ""
      },
      objlist: {},         //图片专用
      // textList:[],

    };
  },
  watch:{
      selfcheckList() {                      //监听传递数据的变化
                console.log(this.selfcheckList, "this.selfcheckList");
                let conents = this.selfcheckList;
                let object = {};
                let list = [];
                this.FormList.describe = this.selfcheckList[0].describe;
                this.FormList.createTime = this.selfcheckList[0].createTime;
                this.FormList.photoLocation = this.selfcheckList[0].photoLocation;
                this.FormList.photoDescribe = this.selfcheckList[0].photoDescribe
                this.FormList.lgt = this.selfcheckList[0].lgt;
                this.FormList.lat = this.selfcheckList[0].lat;
                // 合并图片项
                for (var key in conents) {
                    if (conents[0] != conents[key]) {
                    list.push(conents[key]);
                    }
                }
                for (var key in list) {
                    object[key] = list[key];
                }
                this.objlist = object;
        }
  },     
}
</script>

<style lang="scss" scoped>
</style>

