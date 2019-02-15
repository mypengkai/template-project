<template>
    <div class="p20">
        <!-- 查询 -->
        <div class="checkBox">
            <div class="fl">
                <span>用户账号:
                    <el-input size="mini" v-model="input" placeholder="请输入内容"></el-input>
                </span>
            </div>
            <div class="fl">
                <span>用户名称:
                    <el-input size="mini" v-model="input" placeholder="请输入内容"></el-input>
                </span>
            </div>
            <div class="fl">
                <span>选择部门:
                    <el-input size="mini" v-model="input" placeholder="请输入内容"></el-input>
                </span>
            </div>
            <div class="rl">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="action('add')">新增</el-button>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="userList">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="account" label="用户账号">
                </el-table-column>
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="userType" label="用户类型">
                </el-table-column>
                <el-table-column prop="org" label="组织机构">
                </el-table-column>
                <el-table-column prop="role" label="角色">
                </el-table-column>
                <el-table-column prop="creationTime" label="创建时间">
                </el-table-column>
                <el-table-column prop="Condition" label="状态">
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹框 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisible">
            <userAdd :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></userAdd>
        </el-dialog>
    </div>
</template>

<script>
import userAdd from "./components/userAdd";
export default {
  components: {
    userAdd
  },
  data() {
    return {
      tableData: [
        {
          account: "demo",
          name: "李四",
          userType: "系统用户",
          org: "部门经理",
          role: "普通用户",
          creationTime: "2015-05-21",
          Condition: "激活"
        },
        {
          account: "demo",
          name: "李四",
          userType: "系统用户",
          org: "部门经理",
          role: "普通用户",
          creationTime: "2015-05-21",
          Condition: "激活"
        },
        {
          account: "demo",
          name: "李四",
          userType: "系统用户",
          org: "部门经理",
          role: "普通用户",
          creationTime: "2015-05-21",
          Condition: "激活"
        },
        {
          account: "demo",
          name: "李四",
          userType: "系统用户",
          org: "部门经理",
          role: "普通用户",
          creationTime: "2015-05-21",
          Condition: "激活"
        }
      ],
      input: "",
      nowItem: "",
      dialogFormVisible: false
    };
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
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
.checkBox {
  height: 6vh;
  // background-color: rgb(71, 21, 21);
  div {
    width: 25%;
    span {
      font-size: 0.8vw;
    }
  }
}
</style>
