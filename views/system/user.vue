<template>
  <div class="p20">
    <!-- 查询 -->
    <div class="topBar">
      <span>用户帐号:</span>
      <el-input v-model="sendData.SQLusername" size="small" clearable placeholder="请输入账号" />
      <span>姓名:</span>
      <el-input v-model="sendData.SQLrealname" size="small" clearable placeholder="请输入名称" />
      <span>部门:</span>
      <select-tree :options="orgTree" :props="defaultProps" clearable @noDe="handleCheckChange" />
      <div class="rl">
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="_userList">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button v-ltx="'userAdd'" type="primary" class="pan-btn light-blue-btn" icon="el-icon-circle-plus-outline" @click="action('add')">新增</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div>
      <el-table border :data="userList" class="textList" style="width: 100%" height="70vh">
        <el-table-column prop="userName" label="用户账号" />
        <el-table-column prop="realName" label="姓名" align="center"/>
        <el-table-column prop="departName" label="组织机构" align="center"/>
        <el-table-column prop="userKey" label="角色" align="center"/>
        <el-table-column prop="zhiwei" label="职位" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-ltx="'userUpdate'" type="warning" icon="el-icon-edit" circle size="small" @click="actionItem(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-ltx="'userDelete'" type="danger" icon="el-icon-delete" size="small" circle @click="Delete(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination :page-sizes="[10,20,30]" :page-size="10" :total="total" :current-page.sync="sendData.pageNo" class="pageList pt20 mt1" background
      layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="_userList()"
    />
    <!-- 弹框 -->
    <el-dialog :title="nowItem=='add'?'新增':'修改'" :visible.sync="dialogFormVisible" class="dialogBox">
      <userAdd v-if="nowItem" :now-item="nowItem" :conent-list="conentList" @cancel="dialogFormVisible=false" @execute="_userList" @comfirm="_userList"/>
    </el-dialog>
  </div>
</template>

<script>
import userAdd from "./components/userAdd";
import api from "@/api/user";
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    userAdd
  },
  data() {
    return {
      userList: [], // 用户列表数组
      orgTree: [], // 组织机构数组
      defaultProps: {
        // 组织机构树
        children: "children",
        label: "name"
      },
      conentList: [], // 修改单个信息
      nowItem: "",
      dialogFormVisible: false,
      total: 0,
      sendData: {
        SQLusername: "", //	用户账号username
        SQLrealname: "", // 用户真实姓名
        SQLorgid: "", // 部门id
        pageNo: 1,
        pageSize: 10
      }
    };
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = ""); // 监听弹框是否关闭 清空数据 阻止数据回填
    }
  },
  created() {
    this._userList();
    this.userGroupTree();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      console.log('this.nowItem',this.nowItem)
      this.dialogFormVisible = true;
    },
    // 查询单个请求
    async actionItem(row) {
      this.nowItem = row;
      this.dialogFormVisible = true;
    },
    _userList() {
      // 获取查询列表
      api.sysuserList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userList = res.data.data.data;
      });
    },
    handleSizeChange(val) {
      //分页
      this.sendData.pageSize = val;
      this._userList();
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.sysuserDelete(data.id).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this._userList();
        });
      });
    },
    // 组织机构树
    userGroupTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data) {
      this.sendData.SQLorgid = data.id;
      this.labelModel = data.name;
    },
    // 重置按钮
    reset() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
