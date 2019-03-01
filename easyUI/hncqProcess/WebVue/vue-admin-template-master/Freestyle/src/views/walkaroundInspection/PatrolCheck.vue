<template>
  <div class="p20">
    <!-- 头部选择栏 -->
    <div class="navBar topBar">
      <div>
        <!-- 用户类型 -->
        <div>
          <span>用户类型:</span>
          <el-select v-model="sendData.rolename" @change="changeUserType" clearable placeholder="请选择">
            <el-option v-for="(item,index) in roleList" :key="index" :label="item.rolename" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!-- 姓名选择 -->
        <div>
          <span>姓名选择:</span>
          <el-select v-model="sendData.userName" clearable placeholder="请选择">
            <el-option v-for="(item,index) in userList" :key="index" :label="item.userName" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div>
        <!-- 时间段 -->
        <el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="timeRange" @change="changeDataRange">
        </el-date-picker>
      </div>

      <div>
        <el-button type="primary" icon="el-icon-search" @click="_chackList()">查询</el-button>
        <el-button type="primary" @click="action('add')">上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
    </div>

    <!-- 查询列表 -->
    <el-table :data="everyDayLogPageList" style="width: 100%">
      <el-table-column prop="realname" label="角色名">
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>

      <el-table-column prop="describe" label="巡视说明">
      </el-table-column>

      <el-table-column fixed="right" label="照片">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="action(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination class="" background :page-sizes="[8]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="_chackList()">
    </el-pagination>

    <!-- 查看照片弹框 -->
    <el-dialog :title="nowItem=='add'?'上传':'巡视查看'" :visible.sync="dialogFormVisible">
      <CheckPicture :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></CheckPicture>
    </el-dialog>
  </div>
</template>

<script>
import CheckPicture from "./components/CheckPicture";
import api from "../../api/processInfoLog.js";
import api1 from "@/api/role.js";
import user from "@/api/user";
// import { async } from "q";
export default {
  components: {
    CheckPicture
  },
  data() {
    return {
      nowItem: "",
      roleList: [], // 角色列表
      userList: [], // 用户列表
      everyDayLogPageList: [], // 当前列表
      total: 0,
      timeRange: "", // 时间日期范围
      sendData: {
        rolename: "", // 用户角色
        userName: "", // 用户名参数
        pageNo: 1, //当前页
        pageSize: 8, // 每页条数
        startTime: "", // 开始时间
        endTime: "" // 结束时间
      },
      dialogFormVisible: false
    };
  },
  created() {
    this._chackList();
    this.getRoleList();
  },
  methods: {
    // 获取当前列表信息
    _chackList() {
      api.everyDayLogPageList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.everyDayLogPageList = res.data.data.data;
      });
    },
    // 获取角色信息
    async getRoleList(id) {
      let { data } = await api1.roleList(id);
      this.roleList = data.data;
    },
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    changeUserType(val) {
      this.getUserNameList(val);
    },
    // 获取用户列表数据
    async getUserNameList(id) {
      let { data } = await user.sysuserList({ id });
      this.userList = data.data.data;
    },
    changeDataRange(val) {
      [this.sendData.startTime, this.sendData.endTime] = val; // 给开始和结束时间赋值
      console.log(this.sendData);
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = ""); // 监听弹窗是否关闭 清空数据 防止回填
    }
  }
};
</script>

<style lang="scss" scoped>
.navBar {
  display: flex;
  justify-content: space-between;
}
</style>
