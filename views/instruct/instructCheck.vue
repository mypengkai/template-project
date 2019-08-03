<template>
  <div class="p20">
    <div class="topBar">
      <span>组织机构:</span>
      <select-tree clearable :options="orgTree" :props="defaultProps" v-on:noDe="handleCheckChange"/>
      <span>分部分项:</span>
      <select-tree :options="projectList" :props="projectTree" v-on:noDe="projectChange"/>
      <span>创建日期:</span>
      <el-date-picker v-model="sendData.starttime" type="datetime" placeholder="选择日期时间" size="small"
                      style="min-width:200px" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>-
      <el-date-picker v-model="sendData.endtime" type="datetime" placeholder="选择日期时间" size="small"
        style="min-width:200px" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table border  class="textList" :data="getList" style="width: 100%" height="72vh">
        <el-table-column prop="project" label="分部分项"></el-table-column>
        <el-table-column prop="Station" label="桩号" width="180" align="center"></el-table-column>
        <el-table-column label="指令类型" width="110" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.commandType==='1'">安全</template>
            <template v-else-if="scope.row.commandType==='2'">纸质</template>
            <template v-else-if="scope.row.commandType==='3'">口头</template>
          </template>
        </el-table-column>
        <el-table-column prop="initiator" label="发起人" width="100" align="center"></el-table-column>
        <el-table-column prop="planTime" label="发起时间" width="110" align="center"></el-table-column>
        <el-table-column prop="commandUserNow" label="处理人" width="100" align="center"></el-table-column>
        <el-table-column prop="planTime" label="处理时间" width="110" align="center"></el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.issolve==='1'">
              <template v-if="scope.row.status==='0'">待处理</template>
              <template v-if="scope.row.status==='1'">完成</template>
            </template>
            <template v-else-if="scope.row.issolve==='0'">
              <template v-if="scope.row.status==='0'">待处理</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" circle @click="actionItem(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :current-page="sendData.pageNo" :page-sizes="[6,10,15,30]" :page-size="sendData.pageSize"
      layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" @size-change="handleSizeChange" :total="total"></el-pagination>
    <!-- 编辑弹框 -->
    <el-dialog width="70%" class="dialogBox" :title="nowItem=='add'?'新增':'查看'" :visible.sync="dialogFormVisible">
      <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_searchList"></checkBox>
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
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      total: 0,
      //点击搜素传递的传输
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 6 // 每页条数
      },
      nowItem: "",
      dialogFormVisible: false // 查看编辑弹框
    };
  },
  created() {
    this.initUserGroupTree();
    this._searchList();
  },
  methods: {
    async actionItem(id) {  // 查询单个请求
      let { data } = await api.searchOne({ id });
      this.nowItem = data.data;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val){
      this.sendData.pageSize=val
      this._searchList()
    },
    _searchList() {  // 列表请求
      api.getList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.getList = res.data.data.data;
      });
    },
    initUserGroupTree() {  // 组织机构树
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    handleCheckChange(data) {  // 组织机构下拉树
      this.sendData.departId = data.id;
      project.projectList(this.sendData).then(res => {
        this.projectList = res.data.data;
      });
    },
    projectChange(data) { // 工程分部分项树
      this.sendData.projectItemId = data.id;
    },
    reset() {  // 重置按钮
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
