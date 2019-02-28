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
        <!-- 单位小组分组 -->
        <!-- <div>
                    <span>单位:</span>
                    <el-select v-model="value4" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>小组:</span>
                    <el-select v-model="value4" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>分组:</span>
                    <el-select v-model="value4" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->
        <!-- 时间段 -->
        <div>
          <el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="timeRange" @change="changeDataRange">
          </el-date-picker>
        </div>
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
    <el-dialog title="查看" :visible.sync="dialogFormVisible">
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
      roleList: [],
      userList: [],
      everyDayLogPageList: [],

      total: 0,
      timeRange: "",
      sendData: {
        rolename: "",
        userName: "", // 用户名参数
        pageNo: 1,
        pageSize: 8,
        startTime: "",
        endTime: ""
      },
      dialogFormVisible: false
    };
  },
  created() {
    this._chackList();
    this.getRoleList();
  },
  methods: {
    _chackList() {
      api.everyDayLogPageList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.everyDayLogPageList = res.data.data.data;
      });
    },
    async getRoleList(id) {
      let { data } = await api1.roleList(id);
      this.roleList = data.data;
    },
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    changeUserType(val) {
      this.getUserNameList(val);
    },
    async getUserNameList(id) {
      let { data } = await user.sysuserList({ id });
      this.userList = data.data.data;
    },
    changeDataRange(val) {
      [this.sendData.startTime, this.sendData.endTime] = val;
      console.log(this.sendData);
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
.navBar {
  display: flex;
  justify-content: space-between;
  div {
    // background-color: rgb(82, 33, 33);
  }
}
</style>
