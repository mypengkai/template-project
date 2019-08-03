<template>
  <div class="printerCheck">
    <div class="printCheckConent">
      <p>凭证预览</p>
      <el-table :data="formData" style="width: 100%" max-height="400" border>
        <el-table-column prop="projectName" label="分部分项"></el-table-column>
        <el-table-column prop="processname" label="工序名称" width="200"></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间" width="200"></el-table-column>
        <el-table-column prop="realname" label="验收人" width="120"></el-table-column>
        <el-table-column prop="Station" label="桩号" width="120"></el-table-column>
        <el-table-column prop="checkdescribe" label="描述" width="120"></el-table-column>
      </el-table>
    </div>
    <div class="printerCheckfooter">
      <el-button type="info" @click="close">取消</el-button>
      <el-button type="primary" @click="previewShur">确定</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  props: {
    formData: {
      type: Array
    }
  },
  data() {
    return {
      processids: "" // 打印数据的id
    };
  },
  created() {
    this.formData.forEach(element => {
      this.processids += element.processid + ",";
    });
  },
  methods: {
    previewShur() {
      request
        .post("/rest/processCheck/processPrintingSave", {
            processids:this.processids
        })
        .then(res => {
          if (res.data.respCode == 0) {
            this.$message({
              message: "恭喜你，打印凭证成功",
              type: "success"
            });
            this.close();
          }
        });
    },
    // 关闭弹框
    close() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.printerCheck {
   .printCheckConent{
      p{
        font-size: 16px;
        font-weight: bold;
      }
   }
  .printerCheckfooter {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

