<template>
  <div class="printerCheck">
    <!-- startprint -->
    <div class="printCheckConent">
      <p>湖南长祁高速验收凭证</p>
      <el-table :data="formData" style="width: 100%" max-height="400" border>
        <el-table-column prop="projectName" label="分部分项"></el-table-column>
        <el-table-column prop="Station" label="桩号" ></el-table-column>
        <el-table-column prop="processname" label="工序名称" ></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间" ></el-table-column>
        <el-table-column prop="realname" label="验收人"></el-table-column>
        <el-table-column prop="checkdescribe" label="验收说明" ></el-table-column>
      </el-table>
    </div>
    <!-- endprint -->
    <div class="printerCheckfooter">
      <el-button type="info" @click="close">取消</el-button>
      <el-button type="primary" @click="drPrint">打印</el-button>
      <!-- <el-button type="primary" @click="previewShur">确定</el-button> -->
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
          }
        });
    },
    // 关闭弹框
    close() {
      this.$emit("closeDialog");
    },
    // 打印
    drPrint(){
      // 1.设置要打印的区域 div的class
      var newstr = document.querySelector('.printCheckConent').innerHTML;
      // 2. 复制给body，并执行window.print打印功能
      document.body.innerHTML = newstr;
      // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
      var oldstr = document.body.innerHTML;
      window.print();       
      this.previewShur();     // 改变打印数据之后的状态
      window.location.reload();
      document.body.innerHTML = oldstr;
      return false
    },
  
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

