<template>
  <div class="acceptzh">
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
          <span>会议主题:</span>
          <el-input placeholder="请输入会议主题" v-model="sendData.meetingTheme"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>变更等级:</span>
          <el-input placeholder="请输入变更等级" v-model="sendData.moneyLevel"></el-input>
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

    <!-- 查询列表 -->
    <el-table
      class="textList"
      border
      :data="myApplyChangePageList"
      style="width: 100%"
      height="70vh"
    >
      <el-table-column prop="meeting_summary_number" label="会议编码" align="center"></el-table-column>
      <el-table-column prop="meeting_theme" label="会议主题" align="center"></el-table-column>
      <el-table-column prop="meeting_address" label="会议地址" align="center"></el-table-column>
      <el-table-column prop="add_decrease_money" label="变更金额(万元)" align="center"></el-table-column>
      <el-table-column label="变更等级" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.money_level==='one_level'">一级</template>
          <template v-else-if="scope.row.money_level==='two_level'">二级</template>
          <template v-else-if="scope.row.money_level==='three_level'">三级</template>
          <template v-else-if="scope.row.money_level==='four_level'">四级</template>
        </template>
      </el-table-column>
      <el-table-column prop="shenqingrenname" label="申请人" align="center"></el-table-column>
      <el-table-column prop="realname" label="审核人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.change_token==='1'">申请</template>
          <template v-else-if="scope.row.change_token==='2'">审核</template>
          <template v-else-if="scope.row.change_token==='3'">备案</template>
          <template v-else-if="scope.row.change_token==='7'">已完成</template>
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
              @click="findApplyDetail(scope.row.meetingSummaryId)"
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

    <!-- 弹框 -->
    <el-dialog
      :title="nowItem=='add' ? '创建会议记要' : '修改变更' "
      :visible.sync="dialogFormVisible"
      class="dialogBox"
    >
      <createChange :nowItem="nowItem" @cancel="dialogFormVisible=false" @comfirm="query" />
    </el-dialog>

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
import createChange from "./components/createMeeting";
import changeDetail from "./meetingDetail";
export default {
  inject: ["reload"],
  name: "meetSearch",
  data() {
    return {
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      userGroupTree: [], // 组织机构树
      projectItemTreeOption: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectCode: "", // 分部分项id
        meetingTheme: "", // 会议记要名称
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        moneyLevel: "", // 金额等级
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
    createChange,
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
    handleUserGroupOnClick(data) {
      // 组织机构树点击事件
      this.projectItemTree = []; //清空数据
      if (data.children.length === 0) {
        this.sendData.departId = data.id;
        project.projectList({ orgId: data.id }).then(res => {
          this.projectItemTree = res.data.data;
        });
      } else {
        this.$message({
          message: "施工单位下才有工程分部分项"
        });
        return false;
      }
    },
    handleProjectItemChange(data) {
      // 工程分部分项id
      this.sendData.projectItemId = data.id;
    },
    query() {
      //查询
      change.getChangeApplyList(this.sendData).then(res => {
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
