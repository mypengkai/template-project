<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <select-tree clearable :options="userGroupTreeOptions" :props="userGroupDefaultProps" v-on:noDe="userGroupOnClick" v-model="sendData.orgId"/>
        </el-col>
        <el-col :span="5">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemTreeOptions" :props="projectItemDefaultProp" v-on:noDe="projectItemOnClick" v-model="sendData.projectCode"/>
        </el-col>
   <!--   </el-row>
    </div>
    <div class="topBar">
      <el-row>-->
        <el-col :span="8">
          <span>巡视日期:</span>
          <el-date-picker v-model="sendData.startTime" type="datetime" placeholder="选择日期时间" size="small" style="min-width:200px"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>-
          <el-date-picker v-model="sendData.endTime" type="datetime" placeholder="选择日期时间" size="small" style="min-width:200px"
                          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 查询列表 -->
    <el-table class="textList" border :data="pollingPageList" style="width: 100%" height="68vh">
      <el-table-column prop="realname" label="巡视人" align="center" width="100"></el-table-column>
      <el-table-column prop="projectItem" label="分部分项"></el-table-column>
      <el-table-column prop="zhuanghao" label="桩号"></el-table-column>
      <el-table-column prop="describe" label="巡视说明"></el-table-column>
      <el-table-column prop="photoLocation" label="拍照地点" ></el-table-column>
      <el-table-column prop="createTime" label="巡视时间" align="center" width="150"></el-table-column>
      <el-table-column fixed="right" label="详情" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
            <el-button type="primary" icon="el-icon-search" circle @click="action(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :page-sizes="[15,30,60,100]" :page-size="sendData.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="query()"></el-pagination>
    <!-- 查看照片弹框 -->
    <el-dialog width="70%" title="巡视查看" :visible.sync="dialogFormVisible" class="dialogBox">
      <CheckPicture :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></CheckPicture>
    </el-dialog>
  </div>
</template>

<script>
import CheckPicture from "./components/CheckPicture";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import api from "@/api/Patrol.js";
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
      userGroupTreeOptions: [],  //组织机构树
      projectItemTreeOptions: [], // 分部分项树
      pollingPageList: [], // 巡视列表
      total: 0,
      sendData: {
        departId: "", //部门id
        userId: "", // 用户名参数
        projectCode: "", // 分部分项Code
        orgId: "",   //组织机构id
        pageNo: 1, //当前页
        pageSize: 15, // 每页条数
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        type: "polling",
      },
      userGroupDefaultProps: {  // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProp: {  // 工程分项树显示
        label: "projectItem",
        value: "projectCode",
        children: "children"
      },
      dialogFormVisible: false,
      nowItem: ''  //当前查看的内容
    };
  },
  created() {
    this.query();
    this.initUserGroupTree();
  },
  methods: {
    query() {  //查询数据列表
      api.PatrolList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.pollingPageList = res.data.data.data;
      });
    },
    async action(val) {  // 查询单个请求
      let { data } = await api.chakanList(val.id); //异步执行取id
      this.nowItem = data.data;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      this.sendData.pageSize=val;
      this.query();
    },
    initUserGroupTree() {   // 初始化组织机构树
      Organization.organizateTree().then(res => {
        this.userGroupTreeOptions = res.data.data;
      });
    },
    userGroupOnClick(data) {  // 组织机构下拉树
      this.sendData.orgId = data.id;
      project.projectList(this.data.id).then(res => {
        this.projectItemTreeOptions = res.data.data;
      });
    },
    projectItemOnClick(data) {  // 分部分项选择后的数据
      this.sendData.projectCode = data.projectCode;
    },
    reset() {  // 重置按钮
      this.reload();
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
.acceptzh {
  padding: 20px;
  height: 100%;
  .elBoutton {
    float: right;
  }
}
.navBar {
  display: flex;
  justify-content: space-between;
}
.dialogBox {
  margin-top: -9vh;
}
</style>
