<template>
  <div class="p20">
    <!-- 头部选择栏 -->
    <div class="navBar topBar">
      <div>
        <!-- 姓名选择 -->
        <span>组织机构:</span>
       <select-tree clearable :options="orgTree" :props="defaultProps" v-on:noDe="handleCheckChange" v-model="value1" />
        <!-- 工程分部分项 -->
        <span>工程选择:</span>
        <select-tree clearable :options="projectList" :props="projectTree" v-on:noDe="projectChange" v-model="value" />

        <span>创建日期:</span>
        <el-date-picker v-model="sendData.startTime" type="date" placeholder="选择日期时间" size="small" style="min-width:200px"></el-date-picker>-
        <!-- <span>至</span>    -->
        <el-date-picker v-model="sendData.endTime" type="date" placeholder="选择日期时间" size="small" style="min-width:200px"></el-date-picker>
      </div>

      <div>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="_chackList()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
    </div>

    <!-- 查询列表 -->
    <el-table class="textList" :data="everyDayLogPageList" style="width: 100%" height="72vh">
      <el-table-column prop="realname" label="巡视人" width="100"></el-table-column>

      <el-table-column prop="projectItem" label="分部分项"></el-table-column>

      <el-table-column prop="zhuanghao" label="桩号"></el-table-column>

      <el-table-column prop="describe" label="巡视说明"></el-table-column>

      <el-table-column prop="photoLocation" label="拍照地点"></el-table-column>

      <el-table-column prop="createTime" label="创建时间"></el-table-column>

      <el-table-column fixed="right" label="照片" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
            <el-button type="primary" icon="el-icon-search" circle @click="action(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :page-sizes="[15,30,60,100]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="_chackList()"></el-pagination>
    <!-- 查看照片弹框 -->
    <el-dialog width="70%" :title="nowItem=='add'?'上传':'巡视查看'" :visible.sync="dialogFormVisible" class="dialogBox">
      <CheckPicture :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></CheckPicture>
    </el-dialog>
  </div>
</template>

<script>
import CheckPicture from "./components/CheckPicture";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import api from "@/api/Patrol.js";
import user from "@/api/user";
import Organization from "@/api/Organization.js";
import project from "@/api/project.js";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    CheckPicture
  },
  data() {
    return {
      nowItem: "",
      value: "",
      value1:"",
      orgTree:[],
      getListByUser: [], // 用户列表
      everyDayLogPageList: [], // 当前列表
      total: 0,
      timeRange: "", // 时间日期范围
      sendData: {
         departId: "", //部门id
        userId: "", // 用户名参数
        projectCode: "", // 分部分项Code
        orgId:"",
        pageNo: 1, //当前页
        pageSize: 15, // 每页条数
        startTime: "", // 开始时间
        endTime: "" // 结束时间
      },
       // 组织机构树显示
      defaultProps: {
        children: "children",
        label: "name"
      },
      // 工程分项树显示
      projectTree: {
        label: "projectItem",
        value: "projectCode",
        children: "children"
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
      // 组织机构
      Organization.organizateTree().then(res => {
         this.orgTree = res.data.data;
      })
    },

     // 组织机构下拉树
    handleCheckChange(data) {
      this.projectList = [];
      this.sendData.orgId = data.id;
      this.sendData.departId = data.id;
      project.projectList(this.sendData).then(res => {
        if (res.data.data == null) {
          res.data.data = [];
        }
        this.projectList = res.data.data;
      });
    },

    // 分部分项选择后的数据
    projectChange(data) {
      this.sendData.projectCode = data.projectCode;
    },
    // 分部分项选择后的数据
    // projectChange(data) {
    //   this.sendData.projectCode = data[data.length - 1];
    // },
    changeDataRange(val) {
      [this.sendData.startTime, this.sendData.endTime] = val; // 给开始和结束时间赋值
    },
    // 重置按钮
   reset() {
      this.reload();
    },
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
.dialogBox {
  margin-top: -9vh;
}
</style>
