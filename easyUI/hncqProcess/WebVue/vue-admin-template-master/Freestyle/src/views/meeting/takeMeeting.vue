<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <el-select v-model="sendData.departId" placeholder="请选择" @change="checkDepart()">
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
            ref="getSelectData"
          />
        </el-col>
        <el-col :span="6">
          <span>会议编号:</span>
          <el-input placeholder="请输入会议编号" v-model="sendData.meetingSummaryNumber"></el-input>
        </el-col>

        <el-col :span="6">
          <span>会议主题:</span>
          <el-input placeholder="请输入会议主题" v-model="sendData.meetingTheme"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>变更等级:</span>
          <el-select v-model="sendData.moneyLevel" placeholder="请选择变更等级">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="6" style="margin-left:50%">
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

    <!-- 查询列表 -->
    <el-table
      class="textList"
      border
      :data="myApplyChangePageList"
      style="width: 100%"
      height="66vh"
    >
      <el-table-column prop="meetingSummaryNumber" label="会议编号" align="center"></el-table-column>
      <el-table-column prop="meetingTheme" label="会议主题" align="center"></el-table-column>
      <el-table-column prop="meetingAddress" label="会议地址" align="center"></el-table-column>
      <el-table-column prop="addDecreaseMoney" label="增减金额(万元)" align="center"></el-table-column>
      <el-table-column label="变更等级" align="center"> 
       <template slot-scope="scope">
            <span v-if="scope.row.moneyLevel==='one_level'" style="color：#909399">一级</span>  
           <span v-else-if="scope.row.moneyLevel==='two_level'" style="color:#85CE61">二级</span>  
           <span v-else-if="scope.row.moneyLevel==='three_level'" style="color:#EBB563">三级</span>  
           <span v-else-if="scope.row.moneyLevel==='four_level'" style="color:#F789D2">四级</span>  
        </template>
      </el-table-column>
      <el-table-column prop="shenqingrename" label="申请人" align="center"></el-table-column>
      <el-table-column prop="userName" label="审核人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.changeToken==='1'">申请</template>
          <template v-else-if="scope.row.changeToken==='2'">审核</template>
          <template v-else-if="scope.row.changeToken==='3'">备案</template>
          <template v-else-if="scope.row.changeToken==='7'">已完成</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              circle
              @click="findApplyDetail(scope.row.meetingId)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      class="pageList mt1"
      background
      :page-sizes="[10,20,30]"
      :page-size="sendData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page.sync="sendData.pageNo"
      @size-change="handleSizeChange"
      @current-change="query()"
    ></el-pagination>

    <!-- 查看弹框 -->
    <el-dialog :visible.sync="dialogChangeDetailVisible" title="查看详情" fullscreen>
      <changeDetail :changeId="changeId" v-if="flag" />
    </el-dialog>
  </div>
</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import project from "@/api/project";
import change from "@/api/change";
import changeDetail from "./meetingDetail";
export default {
  inject: ["reload"],
  name: "takeMeeting",
  data() {
    return {
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      // 会议等级
      options: [
        {
          value: "one_level",
          label: "一级"
        },
        {
          value: "two_level",
          label: "二级"
        },
        {
          value: "three_level",
          label: "三级"
        },
        {
          value: "four_level",
          label: "四级"
        }
      ],

      userGroupTree: [], // 组织机构树
      projectItemTreeOption: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectCode: "", // 分部分项id
        isAwaitExamine: "", // 待审核，已审核
        meetingTheme: "", // 会议记要名称
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        moneyLevel: "", // 金额等级
        meetingSummaryNumber: "" // 会议编码
      },
      myApplyChangePageList: [], //我申请的变更
      dialogFormVisible: false, //默认弹框不显示
      nowItem: "", //当前对象
      dialogChangeDetailVisible: false, //查看详情弹框
      changeId: "", //详情id
      flag: false
    };
  },
  components: {
    SelectTree,
    changeDetail
  },
  created() {
    this.query();
    this.initUserGrouptTree();
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
        this.$refs.getSelectData.labelModel = "";
      });
    },
  
    handleProjectItemChange(data) {
      // 工程分部分项id
      this.sendData.projectCode = data.id;
    },
    query() {
      //查询
      change.applyMyList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.myApplyChangePageList = res.data.data.data;
        
      });
    },
    handleSizeChange(val) {
      //翻页
      this.sendData.pageSize = val;
      this.query();
    },
    reset() {
      // 重置按钮
      this.reload();
    },
    apply(item) {
      //申请
      this.nowItem = item;
      this.dialogFormVisible = true; //显示弹框
    },
    findApplyDetail(item) {
      //查看详情
      this.changeId = item;
      this.dialogChangeDetailVisible = true;
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
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
.navBar {
  display: flex;
  justify-content: space-between;
}
.dialogBox {
  margin-top: -9vh;
}
</style>
