<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <el-select v-model="sendData.departId" placeholder="请选择组织机构" @change="checkDepart()">
            <el-option
              v-for="item in userGroupTree"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>分部分项:</span>
          <select-tree
            clearable
            :options="projectItemTreeOption"
            :props="projectItemDefaultProps"
            v-on:noDe="handleProjectItemChange"
          />
        </el-col>
        <el-col :span="6">
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
      </el-row>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="不通过记录" name="first">
        <div class="instruct">
          <el-table :data="tableData" border style="width: 100%;" class="textList" height="64vh">
            <el-table-column prop="projectItem" label="分部分项"></el-table-column>
            <el-table-column prop="commandNumber" label="指令" width="100" align="center">
                   <template slot-scope="scope">
                      <div v-if="scope.row.commandNumber==0">{{scope.row.commandNumber}}</div>
                      <div v-else-if="scope.row.commandNumber !=0" @click="routerInstruct">{{scope.row.commandNumber}}</div>
                   </template>
            </el-table-column>
            <el-table-column prop="meetingNumber" label="变更纪要"  width="100" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.meetingNumber==0">{{scope.row.meetingNumber}}</div>
                      <div v-else-if="scope.row.meetingNumber !=0" @click="routermeeting">{{scope.row.meetingNumber}}</div>
                   </template>
            </el-table-column>
            <el-table-column prop="processNumber" label="工序"  width="100" align="center">
                  <template slot-scope="scope">
                      <div v-if="scope.row.processNumber==0">{{scope.row.processNumber}}</div>
                      <div v-else-if="scope.row.processNumber !=0" @click="routerprocess">{{scope.row.processNumber}}</div>
                   </template>
            </el-table-column>
          </el-table>
        
        </div>
      </el-tab-pane>
      <el-tab-pane label="不通过统计" name="second">
        <div class="meeting">
          <meetingBox :formData="tableData"></meetingBox>
        </div>
      </el-tab-pane>
    </el-tabs>
      <!-- 分页 -->
          <el-pagination
            class="pageList pt20 mt1"
            @size-change="handleSizeChange"
            @current-change="querySelected"
            :current-page="sendData.pageNo"
            :page-sizes="[10,20,30]"
            :page-size="sendData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
  </div>
</template>
<script>
//import instructBox from "@/components/statisticsBox/instructBox.vue";
import meetingBox from "@/components/statisticsBox/meetingBox.vue";
import Organization from "@/api/Organization";
import request from "@/utils/request";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
export default {
  inject: ["reload"],
  components: { meetingBox, SelectTree },
  data() {
    return {
      sendData: {
        departId: "", // 组织机构id
        itemInfoId: "", // 分部分项
        startTime: "",
        endTime: "",
        pageSize:10,
        pageNo:1
      },
      activeName: "second",
      total: 0,
      seletList: [],
      projectItemTreeOption: [], // 分部分项树
      userGroupTree: [], // 组织机构数据
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      tableData: []
    };
  },
  created() {
    this.initUserGrouptTree();
    this.querySelected();
  },
  methods: {
    initUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    checkDepart() {
      let orgId = this.sendData.departId;
      // 分部分项数据
      Organization.getProjectItemFromLayer({
        userGroupId: orgId,
        pId: "0"
      }).then(res => {
        this.projectItemTreeOption = res.data.data;
      });
    },
    // 重置
    reset() {
      this.sendData.departId = "";
      this.sendData.itemInfoId = "";
      this.query();
    },
    // 查询
    query() {
        this.querySelected();
    },
    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this.querySelected();
    },
    //初始化列表数据
    querySelected() {
      request
        .post("/rest/projectItemInfo/notPassStatistics", this.sendData)
        .then(res => {
          if (res.data.ok) {
            this.tableData = res.data.data.data;
            this.total = res.data.data.totalCount
          }
        });
    },
    handleProjectItemChange(data) {
      // 工程分部分项id
      this.sendData.itemInfoId = data.id;
    },
    // 指令
    routerInstruct(){
       this.$router.push({path:'/instruct/instructCheck'})
    },
    //变更纪要
    routermeeting(){
       this.$router.push({path:'/meeting/meetingSearch'})
    },
    //工序
    routerprocess(){
       this.$router.push({path:"/accept/accepthj"})
    }
  }
};
</script>
<style lang="scss" scoped>
.p20 {
  .instruct {
    width: 100%;
  }
  .meeting {
    width: 100%;
    height: 100%;
  }
  
}
/deep/.el-tabs__content {
    overflow: hidden;
    /* position: relative; */
}
</style>