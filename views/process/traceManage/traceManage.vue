<template>
  <div class="p20">
    <div class="search">
      <el-row>
        <el-col :span="10" v-if="tabPosition == 'first'">
          <div class="grid-content">
            <span>组织机构：</span>
            <el-select
              v-model="from.projectName"
              filterable
              placeholder="请选择"
              @focus="innerVisible=true"
            ></el-select>
          </div>
        </el-col>
        <el-col :span="10" v-if="tabPosition == 'first'">
          <div class="grid-content">
            <span>单位分部分项：</span>
            <el-select v-model="from.unitsName" filterable placeholder="请选择" @focus="innerVisible1=true"></el-select>
          </div>
        </el-col>
        <!-- ========================================== -->
        <el-col :span="20" v-if="tabPosition == 'second'">
          <div class="grid-content">
            <span>姓名：</span>
            <input type="text" v-model="username" placeholder="输入姓名">
          </div>
        </el-col>
        <!-- ===================================== -->
        <el-col :span="2">
          <div class="grid-content">
            <span>
              <el-button type="primary" icon="el-icon-search" @click="querySelected">查询</el-button>
            </span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <span>
              <el-button type="primary" icon="el-icon-search">导出</el-button>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="grid-content">
          <span>类型：</span>
          <el-radio-group v-model="searchType">
            <el-radio label>全部</el-radio>
            <el-radio label="log">日志</el-radio>
            <el-radio label="selfcheck">自检</el-radio>
            <el-radio label="realcheck">验收</el-radio>
            <el-radio label="polling">巡视</el-radio>
            <el-radio label="command">指令</el-radio>
          </el-radio-group>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <span>日期：</span>
          <el-date-picker v-model="dateFrom" type="date"/>
          <span>至</span>
          <el-date-picker v-model="dateTo" type="date"/>
        </div>
      </el-row>
    </div>

    <div class="serchCheck" style="margin-top:20px">
      <ul>
        <li
          v-for="(item,index) in serckCheck"
          :key="index"
          :class="{'color':index == active}"
          @click="checkActive(index)"
        >{{item}}</li>
      </ul>
    </div>
    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="工程痕迹管理" name="first">
          <div style="min-height:200px">
            <list :trace-type="1" :conentOptions="conentOptions"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员痕迹管理" name="second">
          <div style="height: 200px;">
            <list :trace-type="2" :userOptions="userOptions"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 工程列表弹框 -->
    <el-dialog width="30%" title="组织机构" :visible.sync="innerVisible" append-to-body>
      <el-tree
        :data="projectTree"
        :highlight-current="true"
        :render-after-expand="false"
        node-key="id"
        @node-click="handleCheckChange"
        :props="defaultProps"
      ></el-tree>
    </el-dialog>

    <!-- danweigongcheng单位工程 -->
    <el-dialog width="30%" title="工程分部分项" :visible.sync="innerVisible1" append-to-body>
      <el-tree
        :data="unitsTree"
        :highlight-current="true"
        :render-after-expand="false"
        node-key="id"
        @node-click="handleCheckChange1"
        :props="defaultProps1"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import list from "./detailList";
import { getToken } from "@/utils/auth";
import request from "@/utils/request";
let token = localStorage.getItem("myToken");

export default {
  name: "TraceManage",
  components: {
    list
  },
  data() {
    return {
      department: "",
      departmentProject: "",
      searchType: "",
      tabPosition: "first",
      dateFrom: "", //日期
      dateTo: "",
      active: "",
      projectTree: [], //工程列表
      unitsTree: [],
      username: "", //用户名
      conentOptions: [], // 展示数据
      userOptions: [], // 人员数据
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultProps1: {
        //单位分部分项
        children: "children",
        label: "projectItem"
      },
      serckCheck: ["时间", "人员", "类型"],
      innerVisible: false,
      innerVisible1: false,
      from: {
        projectName: "", //单位
        projectId: "", //单位id
        unitsName: "", //单位工程
        unitsId: "" //gongchengID
      },
      headers: {
        "X-AUTH-TOKEN": getToken()
      }
    };
  },
  created() {
    this.projectInit();
  },
  watch: {
    tabPosition() {
      console.log(this.tabPosition, "this.tabPosition");
    }
  },
  methods: {
    //  单位查询
    projectInit() {
      request.get("/rest/organizate/depart").then(res => {
        this.projectTree = res.data.data;
      });
    },
    //选中的数据(tree)
    handleCheckChange(data, checked, indeterminate) {
      this.from.projectName = data.name;
      this.innerVisible = false;
      this.innerVisible1 = true;
       //单位工程查询
      request
        .post("/rest/projectItemInfo/getList", {
          orgId: data.id,
          "X-AUTH-TOKEN": token
        })
        .then(res => {
          this.unitsTree = res.data.data;
        });
      
    },
    handleCheckChange1(data) {
      this.from.unitsName = data.projectItem;
      this.from.unitsId = data.id;
      this.innerVisible1 = false;
    },
   
  
    // 整体查询(工程痕迹)
    querySelected() {
      if (this.tabPosition == "first") {        
        request
          .post("/rest/mark/chakan", {
            "X-AUTH-TOKEN": token,
            pageNo: 1,
            pageSize: 15,
            startTime: this.dateFrom,
            endTime: this.dateTo,
            projectid: this.from.unitsId, //工程ID
            orderby: this.active + 1,
            type: this.searchType
          })
          .then(res => {
            this.conentOptions = res.data.data.data;
          });
      }else if(this.tabPosition == "second"){              //人员痕迹查询
             request
          .post("/rest/mark/chakan", {
            "X-AUTH-TOKEN": token,
            pageNo: 1,
            pageSize: 15,
            startTime: this.dateFrom,
            endTime: this.dateTo,
            searchname: this.username,
            orderby: this.active + 1,
            type: this.searchType
          })
          .then(res => {
            this.userOptions = res.data.data.data;
            console.log(this.userOptions, "this.userOptions");
          });
      }
    },

    checkActive(index) {
      this.active = index;
      this.querySelected();
    }
  }
};
</script>

<style lang="scss" scoped>
el-select {
  width: 80%;
}
input[type="text"] {
  width: 20%;
  height: 100%;
}
.grid-content {
  height: 40px;
  line-height: 40px;
}
.content {
  margin-top: 10px;
}
.serchCheck {
  ul {
    overflow: hidden;
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      float: left;
      padding: 10px 40px;
      text-align: center;

      font-size: 20px;
      border: 1px solid #ccc;
    }
  }
}
.color {
  background: skyblue;
}
</style>
