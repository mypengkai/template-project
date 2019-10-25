<template>
  <div class="printerCheck">
    <div class="printCheckConent">
      <el-table :data="formData" style="width:100%;" border>
        <el-table-column label="湖南常祁高速验收凭证">
          <el-table-column prop="projectName" label="分部分项" align="center"></el-table-column>
          <el-table-column prop="Station" label="桩号" align="center"></el-table-column>
          <el-table-column prop="processname" label="工序名称" align="center"></el-table-column>
          <el-table-column prop="realitychecktime" label="验收时间" align="center"></el-table-column>
          <el-table-column prop="realname" label="验收人" align="center"></el-table-column>
          <el-table-column prop="checkdescribe" label="验收说明" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="printerCheckfooter">
      <el-button  @click="close">取消</el-button>
      <el-button type="primary" @click="drPrint">打印</el-button>
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
      console.log(element,'el')
      this.processids += element.processid + ",";
    });
  },
  methods: {
    previewShur() {
      request
        .post("/rest/processCheck/processPrintingSave", {
          processids: this.processids
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
    drPrint() {
      var printBox = document.querySelector(".printCheckConent");
      //拿到打印的区域的html内容
      var newContent = printBox.innerHTML;
      //将旧的页面储存起来，当打印完成后返给给页面。
      var oldContent = document.body.innerHTML;
      //赋值给body
      document.body.innerHTML = newContent;
      //执行window.print打印功能
      window.print();
      this.previewShur();      // 改变打印数据的状态（已打印，未打印）
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      document.body.innerHTML = oldContent;
      window.location.reload();
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.printerCheck {
  .printerCheckfooter {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

