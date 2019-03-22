<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>组织机构:</span>
      <el-input v-model="name" clearable placeholder="请选择单位">
        <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
      </el-input>

      <span>工程选择:</span>
      <el-input v-model="departname" clearable placeholder="请选择分部分项">
        <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
      </el-input>

      <span>时间:</span>
      <el-date-picker v-model="timeRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" @change="changeDataRange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>

      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">搜索</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table :data="getList" style="width: 100%" height="68vh">
        <el-table-column prop="project" label="相关工程">
        </el-table-column>

        <el-table-column prop="initiator" label="发起人">
        </el-table-column>

        <el-table-column prop="createTime" label="发起时间">
        </el-table-column>

        <el-table-column prop="planTime" label="计划时间">
        </el-table-column>

        <el-table-column prop="remark" label="指令内容">
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="actionItem(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <div>
      <el-pagination background :current-page.sync="sendData.pageNo" :page-sizes="[8]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑弹框 -->
    <el-dialog width="50%" class="dialogBox" :title="nowItem=='add'?'新增':'查看'" :visible.sync="dialogFormVisible">
      <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_searchList"></checkBox>
    </el-dialog>
    <!-- 组织机构树形表单 -->
    <el-dialog width="30%" title="所属单位" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>
    <!-- 分部分项树形表单 -->
    <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import checkBox from "./components/checkBox";
import api from "@/api/instruct.js";
import Organization from "@/api/Organization.js";
import project from "@/api/project.js";
export default {
  components: {
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
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 8 // 每页条数
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
      });
    },

    instructList() {
      // 组织机构树
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
      // 分部分项树
      project.projectList().then(res => {
        this.projectList = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.sendData.departId = data.id;
      this.name = data.name;
      this.innerVisible = false;
    },
    // 分部分项选择后的数据
    projectChange(data, checked, indeterminate) {
      this.sendData.projectItemId = data.id;
      this.departname = data.projectItem;
      this.projectVisible = false;
    },
    // 给开始和结束时间赋值
    changeDataRange(val) {
      [this.sendData.starttime, this.sendData.endtime] = val;
      console.log(this.sendData);
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
