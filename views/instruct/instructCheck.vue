<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>单位:</span>
      <el-input v-model="departName" clearable placeholder="请选择单位">
        <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
      </el-input>

      <span>工程选择:</span>
      <el-input v-model="input">
        <el-button slot="append" icon="el-icon-edit"></el-button>
      </el-input>

      <span>时间:</span>
      <el-date-picker v-model="value4" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>

      <div class="rl">
        <el-button type="primary" icon="el-icon-search" @click="_searchList">搜索</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table :data="getList" style="width: 100%">
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
            <el-button type="text" size="small" @click="action(scope.row)">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <div>
      <el-pagination background :current-page.sync="sendData.pageNo" :page-sizes="1" :page-size="[8]" layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible"></checkBox>
    </el-dialog>
    <!-- 组织机构树形表单 -->
    <el-dialog width="30%" title="所属单位" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import checkBox from "./components/checkBox";
import api from "@/api/instruct.js";
import Organization from "../../api/Organization.js";
export default {
  components: {
    checkBox
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "一标"
        },
        {
          value: "选项2",
          label: "二标"
        }
      ],
      getList: [], // 当前列表
      defaultProps: {
        children: "children",
        label: "departName"
      },
      orgTree: [],
      total: 0,
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        pageNo: 1, // 当前页
        pageSize: 8 // 每页条数
      },
      nowItem: "",
      departName: "",
      value: "",
      input: "",
      value4: "",
      dialogFormVisible: false,
      innerVisible: false
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
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.sendData.departId = data.id;
      this.departName = data.departName;
      this.innerVisible = false;
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
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
</style>
