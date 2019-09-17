<template>
  <div class="p20">
    <div class="topBar" v-if="activeName=='first'">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <el-select v-model="sendData.departId" placeholder="请选择组织机构">
            <el-option
              v-for="item in userGroupTree"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>工序:</span>
          <el-input v-model="sendData.process" placeholder="请输入工序"></el-input>
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
      <el-tab-pane label="不通过详细信息" name="first">
        <div class="instruct">
          <el-table :data="tableData" border style="width: 100%" class="textList" height="66vh">
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="number" label="数量">
              <template slot-scope="scope">
                <div v-if="scope.row.number==0">{{scope.row.number}}</div>
                <div @click="routerGo(scope.row)" v-else>{{scope.row.number}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            class="pageList pt20"
            @size-change="handleSizeChange"
            @current-change="querySelected"
            :current-page="sendData.pageNo"
            :page-sizes="[10,20,30]"
            :page-size="sendData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="不通过统计图表" name="second">
        <div class="meeting">
          <meetingBox></meetingBox>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
//import instructBox from "@/components/statisticsBox/instructBox.vue";
import meetingBox from "@/components/statisticsBox/meetingBox.vue";
import Organization from "@/api/Organization";
export default {
  inject: ["reload"],
  components: { meetingBox },
  data() {
    return {
      sendData: {
        departId: "", // 组织机构id
        process: "", // 工序名称
        pageNo: 1,
        pageSize: 10
      },
      activeName: "second",
      total: 0,
      userGroupTree: [], // 组织机构数据
      tableData: [
        {
          date: "2016-05-02",
          name: "王小二",
          number: 0,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          number: 1,
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小龙",
          number: 0,
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小三",
          number: 3,
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
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
    // 重置
    reset() {
        this.sendData.departId = '';
        this.sendData.process = "";
        this.query();
    },
    // 查询
    query() {},
    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this.querySelected();
    },
    //初始化列表数据
    querySelected() {},
    routerGo(data) {
      alert(1);
      console.log(data, "data");
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
</style>