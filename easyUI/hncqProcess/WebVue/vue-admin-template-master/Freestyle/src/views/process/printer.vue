<template>
  <div class="printer">
    <div class="printerHeader">
      <el-row>
        <el-col :span="5">
          <el-form :inline="true" class="grid-content" style="font-size:.8vw">
            <el-form-item label="组织机构：">
              <select-tree :options="projectData" v-on:noDe="projectOnClick" :props="projectItem" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5">
          <el-form :inline="true" class="grid-content">
            <el-form-item label="分部分项：">
              <select-tree :options="partialData" v-on:noDe="partialClick" :props="partialItem" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
              <span>日期：</span>
              <el-date-picker
                v-model="form.startTime"
                type="date"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                 placeholder="选择开始日期时间"
              />-
              <el-date-picker
                v-model="form.endTime"
                type="date"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                 placeholder="选择结束日期时间"
              />
          </div>
        </el-col>
        <el-col :span="5">
          <el-form label-width="80px" :model="form">
            <el-form-item label="桩号:">
              <el-input v-model="form.station" placeholder="请输入桩号" size="small"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form label-width="80px" :model="form">
            <el-form-item label="打印状态:">
              <el-select v-model="form.type" placeholder="请选择" size="small">
                <el-option
                  v-for="item in options"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-search"
                @click="querySelected"
              >查询</el-button>
            </span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-refresh"
                @click="reset()"
              >重置</el-button>
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-loading"
                @click="printClick"
                v-if="form.type ==0 && tableData.length>0"
              >打印验收凭证</el-button>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="printerTable">
      <el-table
        class="textList"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="500"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" v-if="form.type==0"></el-table-column>
        <el-table-column prop="projectName" label="分部分项"></el-table-column>
        <el-table-column prop="Station" label="桩号" width="120"></el-table-column>
        <el-table-column prop="processname" label="工序名称" width="200"></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间" width="150" align="center"></el-table-column>
        <el-table-column prop="realname" label="验收人" width="100" align="center"></el-table-column>
        <el-table-column prop="checkdescribe" label="验收说明" width="120"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="pageList pt20 mt1"
      @size-change="handleSizeChange"
      @current-change="querySelected"
      :current-page="form.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 打印凭证弹框 -->
    <el-dialog title="凭证打印" :visible.sync="dialogVisible" width="1100px">
      <proofProve @closeDialog="dialogVisible =false" :formData="dataList" v-if="flag"></proofProve>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import proofProve from "./components/proofProve.vue";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    proofProve
  },
  data() {
    return {
      form: {
        departName: "", // 组织机构名称
        departid: "", // 组织机构ID
        startTime: "", // 起始时间
        endTime: "", // 结束时间
        station: "", // 桩号
        projectName: "", // 分部分项名称
        projectCode: "", // 分部分项Code
        type: 0, // 打印状态
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      total: 0,
      flag: false,
      options: [
        {
          type: 0,
          label: "未打印"
        },
        {
          type: 1,
          label: "已打印"
        }
      ],
      dialogVisible: false, // 弹框
      tableData: [], // table 数据
      multipleSelection: [], // 勾选中数据
      projectData: [], // 组织机构数据
      // 组织树配置
      projectItem: {
        children: "children",
        label: "name"
      },
      partialData: [], // 分部分项
      partialItem: {
        children: "children",
        label: "projectItem"
      },
      dataList: [] // 选中打印
    };
  },
  // 监听查询参数变化重新获取数据渲染页面
  watch: {
    form: {
      handler: function(val) {
        this.querySelected();
      },
      deep: true
    }
  },
  created() {
    this.initProjectGroup();
  },
  mounted() {
    // 默认搜未打印数据
    this.querySelected();
  },
  methods: {
    // 初始化组织机构input框数据
    initProjectGroup() {
      request.get("/rest/organizate/depart").then(res => {
        if (res.status == 200) {
          this.projectData = res.data.data;
        }
      });
    },
    // 点击组织机构
    projectOnClick(data) {
      this.form.departid = data.id;
      this.form.departName = data.name;
      request
        .post("/rest/projectItemInfo/getList", {
          orgId: this.form.departid
        })
        .then(res => {
          if (res.status == 200) {
            this.partialData = res.data.data;
          }
        });
    },
    // 分部分项
    partialClick(data) {
      this.form.projectName = data.projectItem;
      this.form.projectCode = data.projectCode;
    },
    // 查询数据
    querySelected() {
      request
        .post("/rest/processCheck/processPrinting", this.form)
        .then(res => {
          if (res.data.respCode == 0) {
            this.tableData = res.data.data.data;
            this.total = res.data.data.totalCount;
          }
        });
    },
    // 分页
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.querySelected();
    },
    // table
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 打印凭证
    printClick() {
      this.dialogVisible = true;
      this.dataList = this.multipleSelection;
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
    },

    //重置
    reset() {
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.printer {
  padding: 20px;
}
</style>
