<!--suppress ALL -->
<template>
  <div class="engineer p20">
    <div class="processType">
      <!--查询 新增-->
      <!-- <div class="query-add">
        <div class="searchinfo">
          <span>工序类型:</span>
          <el-input v-model="searchText" size="small" placeholder="请输入工序类型" />
        </div>
        <div class="operator">
          <el-button type="primary" size="small" icon="el-icon-search" @click="initTable()">查询</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addType">新增</el-button>
        </div>
      </div>-->
      <el-row>
        <el-col :span="20">
          <div class="searchinfo">
            <span>工序类型:</span>
            <el-input v-model="searchText" size="small" placeholder="请输入工序类型"/>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" icon="el-icon-search" @click="initTable()" v-if="!show">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
             v-if="!show"
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="addType"
          >新增</el-button>
        </el-col>
      </el-row>
      <!--列表-->
      <div class="processtable">
        <el-table
          :data="tableData"
          height="62vh"
          :row-style="{height: '0'}"
          stripe
          highlight-current-row
          border
          @selection-change="selectChange(selection)"
        >
          <el-table-column min-width="180px" prop="processType" fixed label="工序类型"/>
          <!-- <el-table-column min-width="120px" prop="seq" label="序号" sortable width="120px"/> -->
          <el-table-column prop="createName" min-width="120px" label="创建人"/>
          <el-table-column prop="createTime" min-width="160px" label="创建时间"/>
          <el-table-column min-width="150px" fixed="right" label="操作">
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
                  v-if="!show"
                  type="success"
                  size="small"
                  icon="el-icon-arrow-right"
                  circle
                  @click="viewMore(scope.row, $event)"
                ></el-button>
                <el-button
                  v-if="show"
                  type="success"
                  size="small"
                  icon="el-icon-arrow-left"
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
        :page-sizes="[15, 30, 60]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <!--新增、修改弹框-->
      <el-dialog :visible.sync="dialogVisible" :title="type + '工序类型'" width="30%">
        <el-form :model="form" label-width="80px">
          <el-form-item label="工序类型">
            <el-input v-model="form.processType"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark"/>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model.number="form.seq"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNew(form)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="processItem">
      <transition name="el-zoom-in-top">
        <process
          v-show="show"
          :process-type-id="processTypeId"
          :process-type-name="processTypeName"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import process from "./processInfo";
import $ from "jquery";
export default {
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
      searchText: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示数
      total: 0, // 总数
      processTypeId: "",
      processTypeName: "",
      show: false,
      lastRow: null,
      type: "新增"
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
        console.log("typelist", res.data.data);
      });
    },
    addNew(obj) {
      console.log("add", obj);
      return request.post("/rest/processType/projectTypeAdd", obj).then(res => {
        if (res.data.respCode === "0") {
          this.dialogVisible = false;
          this.initTable();
        }
      });
    },
    viewMore(processType, event) {
      if (this.lastRow === processType) {
        this.lastRow.view = false;
        this.processFold();
        this.lastRow = null;
      } else {
        if (this.lastRow != null) {
          this.lastRow.view = false;
        }
        processType.view = true;
        this.processUnfold();
        this.lastRow = processType;
      }
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
          console.log("getbyid", res.data);
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
    // 折叠process侧边栏
    processFold() {
      this.show = false;
      $(".processType").css("width", "90%");
    },
    // 展开process侧边栏
    processUnfold() {
      this.show = true;
      $(".processType").css("width", "50%");
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
  width: 90%;
  float: left;
  transition: width 0.3s;
  margin-bottom: 10px;
  overflow: hidden;
  .searchinfo {
    float: left;
    height: 4.5vh;
    .el-input {
      width: 200px;
    }
  }
  .operator {
    width: 20%;
    float: left;
  }
}

.processItem {
  float: right;
  width: 50%;
  margin-top: 40px;
}
.el-table thead {
    background-color: #ccc;
}
</style>
