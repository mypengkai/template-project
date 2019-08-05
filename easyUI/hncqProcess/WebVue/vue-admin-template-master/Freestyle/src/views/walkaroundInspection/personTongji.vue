<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <select-tree
            :options="userGroupTreeOption"
            :props="userGroupDefaultProp"
            v-on:noDe="userGroupOnClick"
          />
        </el-col>
        <el-col :span="6">
          <span>用户类型:</span>
          <el-select v-model="queryData.personType" placeholder="请选择">
            <el-option
              v-for="item in jobTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="6">
          <span>小组:</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>分组:</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="6">
          <span>姓名:</span>
          <el-select v-model="queryData.userId" placeholder="请选择">
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="18">
          <span>日期:</span>
          <el-date-picker
            v-model="queryData.startTime"
            type="datetime"
            placeholder="选择开始日期时间"
            size="small"
            style="min-width:200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>-
          <el-date-picker
            v-model="queryData.endTime"
            type="datetime"
            placeholder="选择结束日期时间"
            size="small"
            style="min-width:200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="query()"
          >查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-refresh"
            @click="reset()"
          >重置</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" border class="textList" style="width: 100%;margin-top:20px" height="52vh">
        <el-table-column prop="departname" label="单位" min-width="80"></el-table-column>
        <el-table-column prop="job_name_cn" label="职务" min-width="80"></el-table-column>
        <el-table-column prop="realname" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="CheckNumber" label="验收" min-width="80"></el-table-column>
        <!-- <el-table-column prop="date" label="日志" min-width="80"></el-table-column> -->
        <el-table-column prop="ReceivedInstructNumber" label="收到指令" min-width="80"></el-table-column>
        <el-table-column prop="IssueInstructNumber" label="发出指令" min-width="80"></el-table-column>
        <el-table-column prop="CompleteInstructNumber" label="完成指令" min-width="80"></el-table-column>
        <el-table-column prop="PatrolNumber" label="巡视统计" min-width="80"></el-table-column>
        <!-- <el-table-column prop="date" label="在岗天数" min-width="80"></el-table-column>
        <el-table-column prop="name" label="缺勤天数" min-width="80"></el-table-column>-->
        <el-table-column prop="PhotoNumber" label="照片" min-width="80"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        :page-sizes="[7,14,28,56]"
        :page-size="1"
        :total="total"
        :current-page.sync="queryData.pageNo"
         class="pageList pt20 mt1"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="query()"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import SelectTree from "@/components/SelectTree/selectTree.vue";
import request from "@/utils/request";
import api from "@/api/Patrol.js";
import { all } from 'q';
export default {
   inject: ["reload"],
  components: {
    SelectTree
  },
  data() {
    return {
      userGroupDefaultProp: {
        children: "children",
        label: "sondepartname"
      },
      userGroupTreeOption: [], //查询条件中的组织机构树
      input: "", //人员名称
      personList: [],
      total:0,
      queryData: {
        //查询条件
        personType: "", // 人员类型
        usergroupId: "", // 组织id
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        userId: "", //用户Id
        pageNo: 1, // 当前页
        pageSize: 7 // 每页条数
      },
      jobTypeList: [
        {
          id: "2",
          value: "监理"
        },
        {
          id: "3",
          value: "施工单位"
        }
      ],
      tableData: [],
       processInfoId: ''   //用于查询详情的id
    };
  },
  mounted() {
    this.initUserGroup();
  },
  created() {
    this.query();
  },
  methods: {
    initUserGroup() {
      // 初始化组织机构input框数据
      request.post("/rest/processCheck/searchGrouplowestLevel").then(res => {
        this.userGroupTreeOption = res.data.data;
      });
    },
    handleSizeChange(val) {
 
      this.queryData.pageSize = val;
      this.query();
    },
    userGroupOnClick(data) {
      // 点击组织机构节点展示分部分项
      this.projectItemTreeOption = [];
      this.queryData.usergroupId = data.id;
      console.log(data.id);
      request
        .post("/rest/processCheck/notDeletedUser", {
          userGroupId: this.queryData.usergroupId,
          pageNo: 1,
          pageSize: 1000,
          realname: "",
          position: ""
        })
        .then(res => {
       
          this.personList = res.data.data.data;
        });
    },
    query() {
    
      request
        .post("/rest/Patrol/userStatistics", {
          personType: this.queryData.personType || "",
          usergroupId: this.queryData.usergroupId || "",
          startTime: this.queryData.startTime || "",
          endTime: this.queryData.endTime || "",
          userId: this.queryData.userId || "",
          pageNo: this.queryData.pageNo,
          pageSize: this.queryData.pageSize
        })
        .then(res => {        
          this.total=res.data.data.totalCount
          this.tableData = res.data.data.data;

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
    // float: right;
  }
  /deep/.el-input__inner {
    line-height: 30px !important;
    // height: 4vh;
  }
}
/deep/.el-table thead {
  color: #000;
}
/deep/.el-table {
  font-size: 0.7vw;
}
/deep/.el-table th {
  text-align: center;
}
/deep/.el-table td {
  text-align: center;
}
</style>
