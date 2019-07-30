<template>
  <div class="p20">
    <div class="topBar">
      <span>组织机构:</span>
      <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleUserGroupChange"/>
      <span>分部分项:</span>
      <select-tree :options="projectItemTree" :props="projectItemDefaultProps" v-on:noDe="projectItemOnClick"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="action('add')">新增</el-button>
      </div>
    </div>

    <div class="topBar">
      <span>创建日期:</span>
      <el-date-picker v-model="sendData.starttime" type="datetime" placeholder="选择日期时间" size="small"
                      style="min-width:200px" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>-
      <el-date-picker v-model="sendData.endtime" type="datetime" placeholder="选择日期时间" size="small"
                      style="min-width:200px" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table class="textList" :data="sendCommandList" style="width: 100%" height="68vh">
        <el-table-column prop="initiator" label="发起人" width="100"></el-table-column>
        <el-table-column prop="project" label="分部分项" ></el-table-column>
        <el-table-column prop="commandUserNow" label="处理人"  align="center" width="100px"></el-table-column>
        <el-table-column prop="planTime" label="创建时间"  align="center" width="110px"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.issolve==='1'">
              <template v-if="scope.row.status==='0'">待处理</template>
            </template>
            <template v-else-if="scope.row.issolve==='0'">
              <template v-if="scope.row.status==='0'">待处理</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" circle @click="actionItem(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :current-page.sync="sendData.pageNo" :page-sizes="[5,10,15,30]" :page-size="sendData.pageSize"
      layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" :total="total" @size-change="handleSizeChange"></el-pagination>

    <!-- 编辑弹框 -->
    <el-dialog width="70%" class="dialogBox" :title="nowItem=='add'?'新增':'查看'" :visible.sync="dialogFormVisible">
      <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_searchList"></checkBox>
    </el-dialog>
  </div>
</template>

<script>
import checkBox from "./components/checkBox";
import api from "@/api/instruct";
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
import project from "@/api/project";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    checkBox
  },
  data() {
    return {
      sendCommandList: [], //  发送指令集合
      userGroupDefaultProps: {   // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {  // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 15, // 每页条数
        Mark: 1 //  标记：1：发送、2：接收
      },

      nowItem: "",
      timeRange: "", // 时间日期范围
      name: "", // 组织机构回填显示
      projectItem: "", // 分部分项回填显示
      dialogFormVisible: false, // 查看编辑弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false // 工程分项弹框
    };
  },
  created() {
    this._searchList();
    this.initUserGrouptTree();
  },
  methods: {
    initUserGrouptTree() {  // 组织机构树
      Organization.organizateTree().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    async actionItem(id) {  // 查询单个请求
      let { data } = await api.searchOne({ id });
      this.nowItem = data.data;
      this.dialogFormVisible = true;
    },
    _searchList() {  // 列表请求
      api.getList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.sendCommandList = res.data.data.data;
      });
    },
    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this._searchList();
    },
    handleUserGroupChange(data) {  // 组织机构树点击事件
      this.projectItemTree=[];  //清空数据
      if (data.children.length === 0) {
        this.sendData.departId = data.id
        project.projectList({orgId: data.id}).then(res => {
          this.projectItemTree = res.data.data
        });
      } else {
        this.$message({
          message: '施工单位下才有工程分部分项'
        })
        return false
      }
    },
    projectItemOnClick(data) {   // 工程分部分项id
      this.sendData.projectItemId = data.id;
    },
    reset() {  // 重置按钮
      this.reload();
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
.dialogBox {
  margin-top: -7vh;
}

.mybox {
  /deep/.el-range-editor.el-input__inner {
    padding: 3px 0px;
  }
  /deep/.el-date-editor {
    width: 148px;
  }
}
</style>
