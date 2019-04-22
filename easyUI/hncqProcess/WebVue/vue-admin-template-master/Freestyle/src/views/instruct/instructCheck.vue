<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>组织机构:</span>
      <select-tree
        clearable
        :options="orgTree"
        :props="defaultProps"
        v-on:noDe="handleCheckChange"
        v-model="value"
      />

      <span>分部分项:</span>
      <select-tree
        :options="projectList"
        :props="projectTree"
        v-on:noDe="projectChange"
        v-model="value1"
      />

      <span>创建日期:</span>
      <el-date-picker
        v-model="sendData.starttime"
        type="datetime"
        placeholder="选择日期时间"
        size="small"
        style="min-width:200px"
      ></el-date-picker>-
      <!-- <span>至</span>    -->
      <el-date-picker
        v-model="sendData.endtime"
        type="datetime"
        placeholder="选择日期时间"
        size="small"
        style="min-width:200px"
      ></el-date-picker>

      <div class="rl">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="pan-btn light-blue-btn"
          @click="_searchList"
        >查询</el-button>
        <el-button
          type="primary"
          class="pan-btn light-blue-btn"
          icon="el-icon-refresh"
          @click="reset()"
        >重置</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table class="textList" :data="getList" style="width: 100%" height="62.5vh">
        <el-table-column prop="initiator" label="发起人"></el-table-column>
        <el-table-column prop="project" label="分部分项"></el-table-column>
        <el-table-column prop="commandUserNow" label="完成人" align="center"></el-table-column>

        <!-- <el-table-column prop="createTime" label="发起时间">
        </el-table-column>-->

        <el-table-column prop="planTime" label="创建时间"></el-table-column>

        <el-table-column prop="commandType1" label="指令类型" align="center"></el-table-column>

        <el-table-column prop="issolve1" label="能否处理" align="center"></el-table-column>

        <el-table-column prop="status1" label="状态"></el-table-column>

        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="actionItem(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination
      class="pageList mt1"
      background
      :current-page.sync="sendData.pageNo"
      :page-sizes="[15,30,60,100]"
      :page-size="1"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="_searchList()"
      :total="total"
    ></el-pagination>
    <!-- 编辑弹框 -->
    <el-dialog
      width="70%"
      class="dialogBox"
      :title="nowItem=='add'?'新增':'查看'"
      :visible.sync="dialogFormVisible"
    >
      <checkBox
        :nowItem="nowItem"
        v-if="nowItem"
        @cancel="dialogFormVisible=false"
        @comfirm="_searchList"
      ></checkBox>
    </el-dialog>
  </div>
</template>

<script>
import checkBox from "./components/checkBox";
import api from "@/api/instruct.js";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import Organization from "@/api/Organization.js";
import project from "@/api/project.js";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    checkBox
  },
  data() {
    return {
      getList: [], // 当前列表
      // 组织机构树显示
      defaultProps: {
        children: "children",
        label: "name"
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "projectItem"
      },
      value: "",
      value1: "",
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      total: 0,
      //点击搜素传递的传输
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        orgId: "",
        pageNo: 1, // 当前页
        pageSize: 15 // 每页条数
      },

      nowItem: "",
      timeRange: "", // 时间日期范围
      name: "", // 组织机构回填显示
      departname: "", // 分部分项回填显示
      dialogFormVisible: false, // 查看编辑弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false // 工程分项弹框
    };
  },
  created() {
    this.instructList();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },

    // 查询单个请求
    async actionItem(id) {
      let { data } = await api.searchOne({ id });
      this.nowItem = data;
      this.dialogFormVisible = true;
    },

    _searchList() {
      // 列表请求
      api.getList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.getList = res.data.data.data;
        let getList = this.getList;
        getList.forEach(v => {
          v.status == 0 && (v.status1 = "未处理");
          v.status == 1 && (v.status1 = "已处理");
          v.issolve == 0 && (v.issolve1 = "是");
          v.issolve == 1 && (v.issolve1 = "否");
          v.commandType == 1 && (v.commandType1 = "安全指令");
          v.commandType == 2 && (v.commandType1 = "口头指令");
          v.commandType == 3 && (v.commandType1 = "纸质指令");
        });
      });
    },

    instructList() {
      // 组织机构树
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
        this.sendData.departId = this.orgTree[0].id;
        //默认请求
        api.getList(this.sendData).then(res => {
          this.total = res.data.data.totalCount;
          this.getList = res.data.data.data;
          let getList = this.getList;
          getList.forEach(v => {
            v.status == 0 && (v.status1 = "未处理");
            v.status == 1 && (v.status1 = "已处理");
            v.issolve == 0 && (v.issolve1 = "是");
            v.issolve == 1 && (v.issolve1 = "否");
            v.commandType == 1 && (v.commandType1 = "安全指令");
            v.commandType == 2 && (v.commandType1 = "口头指令");
            v.commandType == 3 && (v.commandType1 = "纸质指令");
          });
        });
      });
    },
    // 组织机构下拉树
    handleCheckChange(data) {
      this.projectList = [];
      this.sendData.orgId = data.id;
      this.sendData.departId = data.id;
      project.projectList(this.sendData).then(res => {
        if (res.data.data == null) {
          res.data.data = [];
        }
        this.projectList = res.data.data;
      });
    },
    // 工程分部分项树
    projectChange(data) {
      this.sendData.projectItemId = data.id;
    },

    // 给开始和结束时间赋值
    changeDataRange(val) {
      if (!val) {
        return ([this.sendData.starttime, this.sendData.endtime] = []);
      }
      [this.sendData.starttime, this.sendData.endtime] = val;
    },
    // 重置按钮
    reset() {
      this.reload();
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    },
    sendData(val) {
      !val && (this.sendData = "");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.dialogBox {
  margin-top: -7vh;
}
</style>
