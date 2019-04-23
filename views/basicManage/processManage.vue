<!--suppress ALL -->
<template>
  <div class="engineer p20">
    <div class="processType">
      <div class="processHeader">
        <el-row>
          <el-col :span="18">
            <div class="searchinfo">
              <span style="font-size:.8vw">工序类型:</span>
              <el-input v-model="searchText" size="small" placeholder="请输入工序类型"/>
            </div>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              class="pan-btn light-blue-btn"
              @click="initTable()"
            >查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-refresh"
              @click="reset()"
            >重置</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              class="pan-btn light-blue-btn"
              type="primary"
              size="small"
              icon="el-icon-circle-plus-outline"
              @click="addType"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <!--列表-->
      <div class="processtable">
        <el-table
          class="textList"
          :data="tableData"
          height="62vh"
          :row-style="{height: '0'}"
          stripe
          highlight-current-row
          border
          @selection-change="selectChange(selection)"
        >
          <el-table-column min-width="180px" prop="processType" fixed label="工序类型" align="center"/>
          <!-- <el-table-column min-width="120px" prop="seq" label="序号" sortable width="120px"/> -->
          <el-table-column prop="createName" min-width="120px" label="创建人" align="center"/>
          <el-table-column prop="createTime" min-width="160px" label="创建时间" align="center"/>
          <el-table-column min-width="150px" fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  circle
                  @click="editType(scope.row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  circle
                  @click="deleteProcessType(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="查询" placement="top">
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-search"
                  circle
                  @click="viewMore(scope.row, $event)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->

      <el-pagination
        class="pageList mt1"
        :current-page="currentPage"
        :page-sizes="[7,15,20,30]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
      

      <!--新增、修改弹框-->
      <el-dialog
        :visible.sync="dialogVisible"
        :title="type + '工序类型'"
        width="30%"
        append-to-body
      
      >
        <el-form :model="form" label-width="80px" :rules="rules">
          <el-form-item label="工序类型:" prop="processType">
            <el-input v-model="form.processType" />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNew(form)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- //查询工序 -->
    <el-dialog title="工序信息" :visible.sync="dialogVisibleProcess" width="60%" class="dialogBox">
      <process :process-type-id="processTypeId" :process-type-name="processTypeName"/>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import process from "./processInfo";
import $ from "jquery";
export default {
  inject: ["reload"],
  components: {
    process
  },
  data() {
    return {
      tableData: null,
      form: {
        processType: "",
        remark: "",
        seq: ""
      },
      dialogVisible: false,
      dialogVisibleProcess: false,
      searchText: "",
      currentPage: 1, // 当前页
      pageSize: 7, // 每页显示数
      total: 0, // 总数
      processTypeId: "",
      processTypeName: "",
      // show: false,
      lastRow: null,
      type: "新增",
      rules: {
        processType: [
          { required: true, message: "请输入工序", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initTable();
  },
  methods: {
    initTable() {
      let postObj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        processType: this.searchText
      };
      return request.post("/rest/processType/getList", postObj).then(res => {
        this.tableData = res.data.data.data;
        this.total = res.data.data.totalCount || 0;
        if (this.tableData != null) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].view = false;
          }
        }
      });
    },
    addNew(form) {
      if (this.form.processType == "" || this.form.processType == undefined) {
        this.$message({
          showClose: true,
          message: "请输入工序类型",
          type: "warning"
        });
        return false;
      }
      request.post("/rest/processType/projectTypeAdd", form).then(res => {
        if (res.data.respCode === "0") {
          // this.$message({
          //   showClose: true,
          //   message: "恭喜你，添加成功",
          //   type: "warning"
          // });
          this.dialogVisible = false;
          this.initTable();
        }
      });
    },
    viewMore(processType, event) {
      this.dialogVisibleProcess = true;
      this.processTypeId = processType.id;
      this.processTypeName = processType.processType;
    },
    deleteProcessType(processTypeId) {
      console.log("id", processTypeId);
      this.$confirm("确定删除该工序类型?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() =>
        request.get(`/rest/processType/delete/${processTypeId}`).then(res => {
          res.data.respCode === "0" && this.initTable();
        })
      );
    },
    addType() {
      this.dialogVisible = true;
      this.type = "新增";
      this.form = {};
    },
    editType(row) {
      this.dialogVisible = true;
      this.type = "修改";
      this.form = Object.assign({}, row);
      console.log("getbyrow", row);
      request
        .get(`/rest/processType/getProcessTypeById/${row.id}`)
        .then(res => {
          if (res.data.respCode == "0") {
            // this.$message({
            //   showClose: true,
            //   message: "恭喜你，修改成功",
            //   type: "warning"
            // });
          }
        });
    },
    handleSizeChange(size) {
      // console.log(`每页 ${size} 条`)
      this.pageSize = size;
      this.initTable();
    },
    handleCurrentChange(curPage) {
      // console.log(`第 ${curPage} 页`)
      this.currentPage = curPage;
      this.initTable();
    },
    // 重置按钮
    reset() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
body,
html,
.engineer {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
.processType {
  margin-bottom: 10px;
  overflow: hidden;
  .searchinfo {
    //  float: left;
    .el-input {
      width: 200px;
    }
  }
  .processHeader {
    margin: 1vw 0;
  }
}

.el-table thead {
  background-color: #ccc;
}
/deep/.el-form-item__label{
  padding-right: 5px;
  width: auto;
}
// .processtable{
//     margin: 10px 0;
// }
</style>
