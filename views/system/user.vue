<template>
  <div class="p20">
    <!-- 查询 -->
    <div class="topBar">
      <span>用户账号:</span>
      <el-input size="small" v-model="sendData.search" placeholder="请输入账号"></el-input>
      <span>用户名称:</span>
      <el-input size="small" v-model="input" placeholder="请输入名称"></el-input>
      <span>选择部门:</span>
      <el-input size="small" v-model="input" placeholder="请输入部门"></el-input>
      <div class="rl">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="action('add')">新增</el-button>
        <el-button type="primary" icon="el-icon-search" @click="_userList">搜索</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="userList">
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="userName" label="用户账号">
        </el-table-column>

        <el-table-column prop="realName" label="名称">
        </el-table-column>

        <el-table-column prop="departname" label="组织机构">
        </el-table-column>

        <el-table-column prop="userKey" label="角色">
        </el-table-column>

        <el-table-column prop="createDate" label="创建时间">
        </el-table-column>

        <el-table-column prop="status1" label="状态">
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-pagination class="tac" background layout="prev, pager, next" :total="total" :current-page.sync="sendData.pageNo" @current-change="_userList()">
    </el-pagination>
    <!-- 弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <userAdd :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_userList"></userAdd>
    </el-dialog>
  </div>
</template>

<script>
import userAdd from "./components/userAdd";
import api from "@/api/user.js";
export default {
  components: {
    userAdd
  },
  data() {
    return {
      userList: [],
      input: "",
      search: "",
      nowItem: "",
      dialogFormVisible: false,
      total: 0,
      sendData: {
        search: "",
        pageNo: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this._userList();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    _userList() {
      api.sysuserList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userList = res.data.data.data;
        let userList = this.userList;
        userList.forEach(v => {
          v.status == 0 && (v.status1 = "未激活");
          v.status == 1 && (v.status1 = "激活");
        });
      });
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this._sysuserDelete(data));
    },
    // 删除请求
    _sysuserDelete(data) {
      api.sysuserDelete(data.id).then(res => {
        this._userList();
      });
    }
    // 搜素
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    }
  }
};
</script>

<style lang="scss" scoped>
.checkBox {
  height: 6vh;
  div {
    width: 25%;
    span {
      font-size: 0.8vw;
      display: block;
    }
  }
}
</style>
