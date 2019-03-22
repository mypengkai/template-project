<template>
  <div class="logCheck">
    <el-form :model="form" label-width="200px">
      <div style="width:50%">
        <el-form-item label="时间">
          <el-input v-model="form.createTime" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="桩号">
          <el-input v-model="form.zhuanghao" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="具体位置">
          <el-input v-model="form.photoLocation" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="资料表述">
          <el-input v-model="form.projectItem" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="照片表述">
          <el-input v-model="form.describe" :disabled="true"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="照片">
        <el-carousel :interval="3000" arrow="always" height="30vh">
          <el-carousel-item v-for="(item,index) in imgList" :key="index">
            <img :src="item.filePath" alt>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["logList"],
  data() {
    return {
      imgList: [],
      form: {
        createTime: "",
        zhuanghao: "",
        photoLocation: "",
        projectItem: "",
        describe: ""
      }
    };
  },
  watch: {
    watch: {
      logList() {
        console.log(this.logList, "this.logList");
        let conents = this.logList;
        this.form.createTime = this.logList[0].createTime;
        this.form.photoLocation = this.logList[0].photoLocation;
        this.form.describe = this.logList[0].describe;

        let list = [];
        for (var key in conents) {
          if (conents[0] != conents[key]) {
            list.push(conents[key]);
          }

        }
        console.log(list,"list")
        this.imgList = list;
        console.log(this.imgList,"this.imgList")
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
