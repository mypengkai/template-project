<template>
  <div class="printerCheck">
    <div class="printerCheckTop">
      <span>
        <el-form label-width="80px" :inline="true">
          <el-form-item label="打印编码:">
            <el-input v-model="form.processNumber" placeholder="请输入打印编码"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span>
        <el-button
          type="primary"
          class="pan-btn light-blue-btn"
          icon="el-icon-search"
          @click="queryPrint"
        >查询</el-button>
      </span>
    </div>
    <div class="printCheckConent" v-if="isShow">
      <p>湖南长祁高速验收凭证</p>
      <div class="tabletop">
           <span>承包单位: 湖南路桥建设集团公司(第一合同段)</span>
           <span>监理单位：湖南省交通建设工程监理有限公司</span>
      </div>
      <el-table :data="tableData" style="width: 100%" max-height="600" border class="textList">
        <el-table-column prop="projectName" label="分部分项"></el-table-column>
        <el-table-column prop="processNumber" label="打印编码" width="120"></el-table-column>
        <el-table-column prop="Station" label="桩号" width="120"></el-table-column>
        <el-table-column prop="processname" label="工序名称" width="300"></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间" width="200"></el-table-column>
        <el-table-column prop="realname" label="验收人" width="120"></el-table-column>
        <el-table-column prop="checkdescribe" label="验收说明" width="120"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="pageList pt20 mt1"
      @size-change="handleSizeChange"
      @current-change="queryPrint"
      :current-page="form.pageNo"
      :page-sizes="[15,30,60,100]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      isShow: false, // 没有查询隐藏
      form: {
        processNumber: "", // 验收编码
        pageNo: 1, // 当前页
        pageSize: 15 // 每页条数
      },
      total: 0,
      tableData: []
    };
  },
  methods: {
    // 凭证查询
    queryPrint() {
      if (
        this.form.processNumber == "" ||
        this.form.processNumber == undefined ||
        this.form.processNumber == null
      ) {
        this.$message({
          message: "请输入打印编码",
          type: "warning"
        });
        return false;
      }
      request
        .post("/rest/processCheck/searchProcessNumber", this.form)
        .then(res => {
          if (res.data.respCode == 0) {
            this.isShow = true
            this.tableData = res.data.data.data;
            this.total = res.data.data.totalCount;
          }
        });
    },
    // 分页
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.queryPrint();
    }
  }
};
</script>
<style lang="scss" scoped>
.printerCheck {
  padding: 20px;
  .printerCheckTop {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .printCheckConent {
    p {
      font-size: 18px;
      font-weight: 700;
    }
    .tabletop{
       border: 1px solid #EBEEF5;
       span{
          display: inline-block;
          padding: 15px 0;
          &:nth-child(2){
              width:740px;
              float: right;
              border-left: 1px solid #EBEEF5;
          }
       }
    }
  }
}
</style>
