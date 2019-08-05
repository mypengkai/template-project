<template>
  <div class="printerCheck">
    <!-- startprint -->
    <div class="printCheckConent">
      <p>湖南长祁高速验收凭证</p>
      <el-table :data="formData" style="width:100%;" max-height="400" border>
        <el-table-column prop="projectName" label="分部分项"></el-table-column>
        <el-table-column prop="Station" label="桩号"></el-table-column>
        <el-table-column prop="processname" label="工序名称"></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间"></el-table-column>
        <el-table-column prop="realname" label="验收人"></el-table-column>
        <el-table-column prop="checkdescribe" label="验收说明"></el-table-column>
      </el-table>
    </div>
    <!-- endprint -->
    <div class="printerCheckfooter">
      <el-button type="info" @click="close">取消</el-button>
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
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      //window.location.reload();
      document.body.innerHTML = oldContent;
      return false;

      // let newWindow = window.open("_blank"); //  打开新窗口
      // let codestr = document.querySelector(".printCheckConent").innerHTML; //  获取需要生成pdf页面的div代码
      // newWindow.document.write(codestr); //  向文档写入HTML表达式或者JavaScript代码
      // newWindow.document.close(); //  关闭document的输出流, 显示选定的数据
      // newWindow.print(); //  打印当前窗口
      // return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.printerCheck {
  .printCheckConent {
    p {
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

