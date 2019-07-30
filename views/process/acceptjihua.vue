<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <select-tree :options="userGroupOptions" :props="userGroupDefaultProps" v-on:noDe="userGroupOnclick"/>
        </el-col>
        <el-col :span="6">
          <span>分部分项:</span>
          <select-tree :options="projectItemOptions" :props="projectItemDefaultProps" v-on:noDe="projectItemOnClick"/>
        </el-col>
        <el-col :span="6">
          <span>姓名:</span>
          <el-input v-model="queryData.userName" placeholder="请输入内容" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <span>验收类型:</span>
          <el-select v-model="queryData.checkType" placeholder="请选择" size="small">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>工序状态</span>
          <el-select v-model="queryData.checkState" placeholder="请选择" size="small">
            <el-option
              v-for="item in checkStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <span>创建日期:</span>
          <el-date-picker
            v-model="queryData.starttime"
            type="datetime"
            placeholder="选择开始日期时间"
            size="small"
            style="min-width:200px"
            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>-
          <el-date-picker
            v-model="queryData.endtime"
            type="datetime"
            placeholder="选择结束日期时间"
            size="small"
            style="min-width:200px"
            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table class="textList" :data="tableData" border style="width: 100%;" height="68vh" v-if="tableData.length!=0">
      <el-table-column prop="name1" label="分部分项" ></el-table-column>
      <el-table-column prop="processName" label="工序名" align="center"  width="200"></el-table-column>
      <el-table-column prop="planCheckTime" label="创建时间"  width="150" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined">
            <template v-if="scope.row.state===0">已指定工序,待指定计划</template>
            <template v-else-if="scope.row.state===1">已指定计划,待自检</template>
            <template v-else-if="scope.row.state===2">已自检,待验收</template>
          </template>
          <template v-else>
            <template v-if="scope.row.state===2 && scope.row.adopt==='0'">不通过,待自检</template>
            <template v-else-if="scope.row.state===3 && scope.row.adopt==='1'">已验收,通过</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
            <el-button @click="handleClick(scope.row)" type="primary" circle icon="el-icon-search" v-if="tableData.length!=0"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pageList pt20 mt1" @size-change="handleSizeChange" @current-change="query"
                   :current-page="queryData.pageNo" :page-sizes="[15,30,60,100]" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" fullscreen class="dialogBox">
      <processCheck :realList="chakanData" :processInfoId="processInfoId"></processCheck>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from "@/components/SelectTree/selectTree.vue";
import processCheck from "@/views/process/components/processCheck";
import request from "@/utils/request";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    processCheck
  },
  data() {
    return {
      userGroupDefaultProps: {  //组织机构tree props
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {  //工程分部分项tree    props
        children: "children",
        label: "projectItem"
      },
      queryData: {
        starttime: "",      // 开始时间
        endtime: "",       // 结束时间
        userName: "",      // 姓名
        pageNo: 1,        // 当前页
        pageSize: 15,   // 每页条数
        orgId: '',    // 组织机构id
        projectItemId: '',   //工程分部分项id
        checkType: '',   //验收类型
        checkState: ''  //验收状态
      },
      total: 0,
      checkTypeOptions: [{  //验收类型
        value: "0",
        label: "任务验收"
      }, {
        value: "1",
        label: "自主验收"
      }],
      checkStateOptions: [{   //验收状态
        value: "0",
        label: "已指定工序"
      }, {
        value: "1",
        label: "已指定计划"
      }, {
        value: "2",
        label: "已自检"
      }, {
        value: "3",
        label: "已验收"
      }],
      dialogTableVisible: false,
      userGroupOptions: [],  //  组织机构List     条件选择
      projectItemOptions: [],   //   工程分部分项List   条件选择
      tableData: [],  //数据列表
      chakanData: [],  //查看数据
      processInfoId: ''   //用于查询详情的id
    };
  },
  created() {
    this.query();
  },
  mounted() {
    this.initUserGroupTree();
  },
  methods: {
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.chaxun();
    },
    initUserGroupTree() {  // 初始化组织机构input框数据
      request.get("/rest/organizate/depart").then(res => {
        this.userGroupOptions = res.data.data;
      });
    },
    reset() {
      this.reload();
    },
    userGroupOnclick(data) {  // 点击组织机构节点展示分部分项
      this.queryData.orgId = data.id;
      this.projectItemOptions=[];
      request.post("/rest/projectItemInfo/getList", { orgId: data.id }).then(res => {
        this.projectItemOptions = res.data.data;
      });
    },
    // 获取分部分项id
    projectItemOnClick(data) {
      this.queryData.projectItemId=data.id;
    },
    query() {  // 查询接口
      let formData = {
        orgId: this.queryData.orgId,
        pageNo: this.queryData.pageNo,
        pageSize: this.queryData.pageSize,
        starttime: this.queryData.starttime,
        endtime: this.queryData.endtime,
        projectId: this.queryData.projectItemId,
        personid: this.queryData.userName,
        checkType: this.queryData.checkType,
        state: this.queryData.checkState
      };
      request.post("/rest/processCheck/searchCheakDeatil", formData).then(res => {
        this.tableData = res.data.data.data;
        this.total = res.data.data.totalCount;
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.query();
    },
    handleClick(row) {  // 查看工程接口
      this.dialogTableVisible = true;
      this.processInfoId=row.gongxuid;
      request.post("/rest/processCheck/getProcessDetail", { id: row.gongxuid }).then(res => {
        this.chakanData = res.data.data
      });
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
</style>
