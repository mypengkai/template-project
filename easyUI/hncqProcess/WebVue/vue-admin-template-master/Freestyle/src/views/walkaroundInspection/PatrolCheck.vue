<template>
  <div class="p20">
    <!-- 头部选择栏 -->
    <div class="navBar topBar">
      <div>
        <!-- 姓名选择 -->
        <span>姓名选择:</span>
        <el-select v-model="sendData.userId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in getListByUser" :key="index" :label="item.realname" :value="item.id">
          </el-option>
        </el-select>
        <!-- 工程分部分项 -->
        <span>工程选择:</span>
        <el-input v-model="projectItem" clearable placeholder="请选择分部分项">
          <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
        </el-input>
        <!-- 时间段 -->
        <el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="timeRange" @change="changeDataRange">
        </el-date-picker>
      </div>

      <div>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="_chackList()">查询</el-button>
      </div>
    </div>

    <!-- 查询列表 -->
    <el-table :data="everyDayLogPageList" style="width: 100%" height="68vh">
      <el-table-column prop="realname" label="巡视人姓名">
      </el-table-column>

      <el-table-column prop="projectItem" label="工程分部分项">
      </el-table-column>

      <el-table-column prop="zhuanghao" label="桩号">
      </el-table-column>

      <el-table-column prop="describe" label="巡视说明">
      </el-table-column>

      <el-table-column prop="photoLocation" label="拍照地点">
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>

      <el-table-column fixed="right" label="照片">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-picture" circle @click="action(scope.row)"></el-button>
          <!-- <el-button type="text" size="small" @click="action(scope.row)">查看</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination class="" background :page-sizes="[6]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="_chackList()">
    </el-pagination>

    <!-- 查看照片弹框 -->
    <el-dialog :title="nowItem=='add'?'上传':'巡视查看'" :visible.sync="dialogFormVisible" class="dialogBox">
      <CheckPicture :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></CheckPicture>
    </el-dialog>

    <!-- 分部分项树形表单 -->
    <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import CheckPicture from "./components/CheckPicture";
import api from "@/api/Patrol.js";
import user from "@/api/user";
import project from "@/api/project.js";
export default {
  components: {
    CheckPicture
  },
  data() {
    return {
      nowItem: "",
      getListByUser: [], // 用户列表
      everyDayLogPageList: [], // 当前列表
      total: 0,
      timeRange: "", // 时间日期范围
      sendData: {
        userId: "", // 用户名参数
        projectCode: "", // 分部分项Code
        pageNo: 1, //当前页
        pageSize: 6, // 每页条数
        startTime: "", // 开始时间
        endTime: "" // 结束时间
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "projectItem"
      },
      projectItem: "", // 分部分项回填显示
      projectList: [], // 分部分项树
      dialogFormVisible: false,
      projectVisible: false // 工程分项弹框
    };
  },
  created() {
    this._chackList();
    this._getListByUser();
  },
  methods: {
    // 获取当前列表信息
    _chackList() {
      api.PatrolList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.everyDayLogPageList = res.data.data.data;
      });
    },

    // action(val) {
    //   this.nowItem = val;
    //   this.dialogFormVisible = true;
    // },
    // 查询单个请求
    async action(val) {
      let { data } = await api.chakanList(val.id); //异步执行取id
      this.nowItem = data.data;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },

    // 获取用户列表数据
    _getListByUser() {
      user.getListByUser().then(res => {
        this.getListByUser = res.data.data;
      });
      // 分部分项树
      project.projectList().then(res => {
        this.projectList = res.data.data;
      });
    },
    // 分部分项选择后的数据
    projectChange(data, checked, indeterminate) {
      this.sendData.projectCode = data.projectCode;
      this.projectItem = data.projectItem;
      this.projectVisible = false;
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
