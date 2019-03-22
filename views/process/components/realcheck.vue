<template>
  <div class="realcheck">
    <el-form :model="initList" label-width="200px">
      <div style="width:50%">
        <el-form-item label="验收描述:">
          <el-input v-model="initList.describe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="拍照时间:">
          <el-input v-model="initList.createTime" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-input v-model="initList.createTime" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="路基工程:">
          <el-input v-model="initList.photoLocation" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="图片说明:">
          <el-input v-model="initList.photoDescribe" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="纬度:">
          <el-input v-model="initList.lgt" :disabled = 'true'></el-input>
        </el-form-item>
        <el-form-item label="经度:">
          <el-input v-model="initList.lat" :disabled = 'true'></el-input>
        </el-form-item>
      </div>
      <el-form-item label="图片展示:">
        <el-carousel height="400px" :interval="5000" class="imgBox">
          <el-carousel-item v-for="(value,index) in object" :key="index">
            <img :src="value.filePath" alt style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["realList"],
 
  data() {
    return {
      initList: {
        describe: "",
        createTime: "",
        // createTime: "",
        photoLocation: "",
        photoDescribe: "",
        lgt: "",
        lat: "",
        filePath: ""
      },
      object: {}
    };
  },
  watch: {
    //监听父组件传递的数据
    realList() {
      // console.log(this.realList, "this.realList");
      let conent = this.realList;
      let object = {};
      let list = [];
      this.initList.describe = this.realList[0].describe;
     
      this.initList.createTime = this.realList[0].createTime;
      this.initList.photoLocation = this.realList[0].photoLocation;
      this.initList.lgt = this.realList[0].lgt;
      this.initList.lat = this.realList[0].lat;
      // 合并图片项(2 3项图片合并)
      for (var key in conent) {
        if (conent[0] != conent[key]) {
          list.push(conent[key]);
        }
      }
      for (var key in list) {
        object[key] = list[key];
      }
      this.object = object;
    }
  },
};
</script>
<style lang="scss" scoped>
.imgBox {
  width: 400px;
  height: 1000px;
}
</style>
