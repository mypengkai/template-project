<template>
  <div class="p20">
    <div class="search">
      <el-row>
        <el-col :span="10" v-if="tabPosition == 'first'">
          <div class="grid-content">
            <el-form inline>
              <el-form-item label="组织机构：">
                <select-tree :options="options" v-on:noDe="noDe" :props="defaultProp"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="10" v-if="tabPosition == 'first'">
          <div class="grid-content">
            <el-form inline>
              <el-form-item label="分部分项：">
                <select-tree
                  :options="unitsTree"
                  v-on:noDe="handleCheckChangeUnit"
                  :props="defaultPropsProject"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!-- ========================================== -->
        <!-- 人员查询 -->
        <el-col :span="20" v-if="tabPosition == 'second'">
          <div class="grid-content">
            <!-- <el-form inline>
              <el-form-item label="姓名：">
                <select-tree :options="unitsTree"  v-on:noDe="handleCheckChangeUnit" :props="defaultPropsProject"/>
              </el-form-item>
            </el-form>-->
            <span>姓名：</span>
            <input type="text" v-model="username" placeholder="输入姓名" class="inputName">
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
        <div class="grid-content" id="gridAdd">
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
          <el-date-picker v-model="dateFrom" type="date"  size="small"/>
          <span>至</span>
          <el-date-picker v-model="dateTo" type="date"  size="small"  />
        </div>
      </el-row>
    </div>

    <!-- <div class="serchCheck" style="margin-top:20px">
      <ul>
        <li
          v-for="(item,index) in serckCheck"
          :key="index"
          :class="{'color':index == active}"
          @click="checkActive(index)"
        >{{item}}</li>
      </ul>
    </div> -->
    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="工程痕迹管理" name="first">
          <div class="conent-one">
            <list :trace-type="1" :conentOptions="conentOptions"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员痕迹管理" name="second">
          <div class="conent-one">
            <list :trace-type="2" :userOptions="userOptions"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import list from "./detailList";
import { getToken } from "@/utils/auth";
import request from "@/utils/request";
import SelectTree from "@/components/SelectTree/selectTree.vue";
let token = localStorage.getItem("myToken");

export default {
  name: "TraceManage",
  components: {
    list,
    SelectTree
  },
  data() {
    return {
      department: "",
      departmentProject: "",
      searchType: "",
      tabPosition: "first",
      dateFrom: "", //日期
      dateTo: "",
      active: "", // 自定义属性
      options: [], //工程列表
      unitsTree: [], // 工程分项
      username: "", //用户名
      conentOptions: [], // 展示数据
      userOptions: [], // 人员数据
      defaultProp: {
        // 组织机构
        children: "children",
        label: "name"
      },
      defaultPropsProject: {
        //分部分项
        children: "children",
        label: "projectItem"
      },
      serckCheck: ["时间", "人员", "类型"],
      from: {
        projectName: "", //单位
        projectId: "", //单位id
        unitsName: "", //单位工程
        unitsId: "" //工程ID
      },
      headers: {
        "X-AUTH-TOKEN": getToken()
      }
    };
  },
  watch: {},
  created() {
    this.projectInit();
    this.querySelected();
  },
  mounted() {},
  methods: {
    //  单位查询
    projectInit() {
      request.get("/rest/organizate/depart").then(res => {
        if (res.data) {
          this.options = res.data.data;
        }
      });
    },

    //选中的数据(tree)
    noDe(data, checked, indeterminate) {
      this.from.projectName = data.name;
      this.from.projectId = data.id;
      // 工程查询
      request
        .post("/rest/projectItemInfo/getList", {
          orgId: this.from.projectId,
          "X-AUTH-TOKEN": token
        })
        .then(res => {
          this.unitsTree = res.data.data;
        });
    },
    handleCheckChangeUnit(data) {
      this.from.unitsName = data.projectItem;
      this.from.unitsId = data.id;
    },
    // 整体查询(工程痕迹)
    querySelected() {
      if (this.tabPosition == "first") {
        request
          .post("/rest/mark/chakan", {
            "X-AUTH-TOKEN": token,
            pageNo: 1,
            pageSize: 15,
            startTime: this.dateFrom, // 起始时间
            endTime: this.dateTo, // 结束时间
            projectid: this.from.unitsId, //工程ID
            orderby: this.active + 1, // 筛选(时间，类型，人员)
            type: this.searchType // 工程   人员
          })
          .then(res => {
            this.conentOptions = res.data.data.data;
            // console.log(this.conentOptions);
          });
      } else if (this.tabPosition == "second") {
        //人员痕迹查询
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
            // console.log(this.userOptions, "this.userOptions");
          });
      }
    },
    // checkActive(index) {
    //   // 筛选
    //   this.active = index;
    //   this.querySelected();
    // }
  }
};
</script>

<style lang="scss" scoped>
.p20 {
  height: 100%;
  width:  100%;
  font-size: 0.8vw;
}
.inputName {
  width: 20%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-indent: 10px;
}
.grid-content {
  height: 40px;
  line-height: 40px;
  width: 100%;
  font-size: 0.8vw;
  font-weight: normal;
}
.content {
  margin-top: 10px;
  .conent-one{
      overflow-y: auto;
      height: 28vw;
  }
}
// .serchCheck {
//   ul {
//     overflow: hidden;
//     padding: 0;
//     margin: 0;
//     li {
//       list-style: none;
//       float: left;
//       padding: 10px 40px;
//       text-align: center;
//       font-size: 16px;
//       font-weight: normal;
//       border: 1px solid #ccc;
//     }
//   }
// }
// .color {
//   background: skyblue;
// }
</style>
