<template>
  <div class="p20">
    <!-- <el-row>
      <el-col :span="21">&nbsp;</el-col>
      <el-col :span="3">
        <el-button style="margin-bottom:10px" type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="fromMaterialsUser()">从物质平台同步</el-button>
      </el-col>
    </el-row>-->
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <el-select v-model="sendData.userGroupId" placeholder="请选择" @change="checkDepart()">
            <el-option
              v-for="item in userGroupTree"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>姓名:</span>
          <el-input placeholder="请输入" v-model="sendData.userName"></el-input>
        </el-col>
        <el-col :span="5">
          <span>职位:</span>
          <el-input placeholder="请输入" v-model="sendData.job"></el-input>
        </el-col>

        <el-col :span="5">
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="query()"
          >查询</el-button>
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-refresh"
            @click="reset()"
          >重置</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            style="margin-bottom:10px"
            type="primary"
            icon="el-icon-refresh"
            class="pan-btn light-blue-btn"
            @click="fromMaterialsUser()"
          >从物质平台同步</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="userData" style="width: 100%" border height="72vh" class="textList">
      <el-table-column label="姓名" align="center" width="200">
        <template slot-scope="scope">
          <span style>{{scope.row.realname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="200">
        <template slot-scope="scope">
          <span style>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构" align="center">
        <template slot-scope="scope">
          <span style>{{scope.row.departname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步状态" align="center" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.sid==='' || scope.row.sid===null">
            <i class="el-icon-close"></i>
          </template>
          <template v-else>
            <i class="el-icon-check"></i>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            circle
            @click="synchronizationUser(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="mt1"
      background
      :page-sizes="[10,20,30]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page.sync="sendData.pageNo"
      @size-change="handleSizeChange"
      @current-change="getUserList()"
    ></el-pagination>
  </div>
</template>

<script>
import api from "../../api/tongUser";
import Organization from '@/api/Organization.js'
export default {
  name: "TreeTableDemo",
  describe: "用户同步",
  inject:['reload'],
  data() {
    return {
      userData: [],
      total: 0,
      sendData: {
        pageNo: 1,
        pageSize: 10,
        userGroupId:'',
        userName:'',
        job:'',
      },
      userGroupTree:[],
    };
  },
  created() {
    this.getUserList();
    this.initUserGrouptTree();
  },
  methods: {
    fromMaterialsUser() {
      //从物资平台系统用户同步
      //同步用户到用户中间件
      api.user().then(res => {
        if (res.data.ok) {
          this.$message({
            type: "success",
            message: "同步成功"
          });
          this.getUserList();
        }
      });
    },
   initUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    query(){
        this.getUserList();
    },
    reset(){
       this.reload();
    },
    getUserList() {
      //数据列表
      //展示用户中间表信息
      api.userData(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userData = res.data.data.data;
      });
    },
    handleSizeChange(val) {
      //分页的方法
      this.sendData.pageSize = val;
      this.getUserList();
    },
    synchronizationUser(data) {
      //同步用户
      var sid = data.sid;
      // 同步用户到用户表
      api.updateUserData({ id: data.id }).then(res => {
        if (sid !== null) {
          this.$message("该用户名已经存在,不能录入重复的信息");
        } else {
          this.$message("同步成功");
        }
        this.getUserList();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.pan-btn {
  font-size: 0.2vw;
}
</style>
