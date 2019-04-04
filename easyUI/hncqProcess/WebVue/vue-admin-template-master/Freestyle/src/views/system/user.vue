<template>
 <div class="p20">
      <!-- 查询 -->
      <div class="topBar">
        <span>用户账号:</span>
        <el-input size="small" v-model="sendData.SQLusername" clearable placeholder="请输入账号"></el-input>
        <span>用户名称:</span>
        <el-input size="small" v-model="sendData.SQLrealname" clearable placeholder="请输入名称"></el-input>
        <span>选择部门:</span>
        <select-tree clearable :options="orgTree" :props="defaultProps" v-on:noDe="handleCheckChange" v-model="value" />
        <!-- <el-input size="small" v-model="name" clearable placeholder="请输入部门">
        <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
      </el-input> -->
        <div class="rl">
          <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="_userList">搜索</el-button>
          <el-button type="primary" class="pan-btn blue-btn" icon="el-icon-circle-plus-outline" @click="action('add')">新增</el-button>
        </div>
      </div>
      <!-- 列表 -->
      <div>
        <el-table class="textList" :data="userList" style="width: 100%" height="66vh">
          <el-table-column prop="userName" label="用户账号">
          </el-table-column>

          <el-table-column prop="realName" label="名称">
          </el-table-column>

          <el-table-column prop="departName" label="组织机构">
          </el-table-column>

          <el-table-column prop="userKey" label="角色">
          </el-table-column>

          <el-table-column prop="zhiwei" label="职位">
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
                <el-tooltip content="修改" placement="top">
                    <el-button type="primary" icon="el-icon-edit" circle @click="actionItem(scope.row)"></el-button>
              </el-tooltip>
               <el-tooltip content="删除" placement="top">
                   <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
              </el-tooltip>
              <!-- <el-button type="primary" icon="el-icon-edit" circle @click="actionItem(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button> -->
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination class="pageList pt20" background :page-sizes="[8]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="_userList()">
      </el-pagination>
      <!-- 弹框 -->
      <el-dialog :title="nowItem=='add'?'新增':'修改'" :visible.sync="dialogFormVisible">
        <userAdd :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @execute="_userList" @comfirm="_userList"></userAdd>
      </el-dialog>

      <!-- 组织机构树形表单搜素 -->
      <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
        <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
        </el-tree>
      </el-dialog>
    </div>
</template>

<script>
import userAdd from "./components/userAdd";
import api from "@/api/user.js";
import Organization from "@/api/Organization.js";
import SelectTree from "@/components/SelectTree/selectTree.vue";
export default {
  components: {
    SelectTree,
    userAdd
  },
  data() {
    return {
      value: "",
      userList: [], // 用户列表数组
      orgTree: [], //组织机构数组
      defaultProps: {
        // 组织机构树
        children: "children",
        label: "name"
      },
      nowItem: "",
      SQLorgid: "",
      name: "",
      dialogFormVisible: false,
      innerVisible: false,
      total: 0,
      sendData: {
        SQLusername: "", //	用户账号username
        SQLrealname: "", //用户真实姓名
        SQLorgid: "", //部门id
        pageNo: 1,
        pageSize: 8
      }
    };
  },
  created() {
    this._userList();
    this._orgTree();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    // 查询单个请求
    async actionItem(val) {
      this.nowItem = val;
      let { data } = await api.sysuserCheck(val.id); //异步执行取id
      this.nowItem.mobilePhone = data.data.mobilePhone; // 拿手机
      this.nowItem.picture = data.data.picture; // 拿图片
      this.nowItem.userKey = data.data.userKey; // 拿角色
      this.dialogFormVisible = true;
    },
    _userList() {
      // 获取查询列表
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
    handleSizeChange(val) {},
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._sysuserDelete(data);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    // 删除请求
    _sysuserDelete(data) {
      api.sysuserDelete(data.id).then(res => {
        this._userList();
      });
    },
    // 组织机构树
    _orgTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data) {
      this.sendData.SQLorgid = data.id;
      this.name = data.name;
      this.innerVisible = false;
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = ""); // 监听弹框是否关闭 清空数据 阻止数据回填
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
