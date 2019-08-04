<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleUserGroupOnClick" v-model="sendData.departId"/>
        </el-col>
        <el-col :span="5">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemTree" :props="projectItemDefaultProps" v-on:noDe="handleProjectItemChange" v-model="sendData.projectItemId"/>
        </el-col>
        <el-col :span="8">
          <span>创建日期:</span>
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
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="apply('add')">申请</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 查询列表 -->
    <el-table class="textList" border :data="myApplyChangePageList" style="width: 100%" height="68vh">
      <el-table-column prop="changeName" label="变更名称" align="center"></el-table-column>
      <el-table-column prop="amountMoney" label="变更金额(万元)" align="center"></el-table-column>
      <el-table-column label="变更等级" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.moneyLevel==='one_level'">一级</template>
          <template v-else-if="scope.row.moneyLevel==='two_level'">二级</template>
          <template v-else-if="scope.row.moneyLevel==='three_level'">三级</template>
          <template v-else-if="scope.row.moneyLevel==='four_level'">四级</template>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="申请人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.changeToken==='1'">申请</template>
          <template v-else-if="scope.row.changeToken==='2'">审核</template>
          <template v-else-if="scope.row.changeToken==='3'">备案</template>
          <template v-else-if="scope.row.changeToken==='4'">生效</template>
          <template v-else-if="scope.row.changeToken==='5'">监理</template>
          <template v-else-if="scope.row.changeToken==='6'">业主</template>
          <template v-else-if="scope.row.changeToken==='7'">已完成</template>
          <template v-else-if="scope.row.changeToken==='8'">终止</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="详情" align="center" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看申请" placement="top">
            <el-button type="primary" size="small" icon="el-icon-search" circle @click="findApplyDetail(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :page-sizes="[15,30,60,100]" :page-size="sendData.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="query()"></el-pagination>

    <!-- 弹框 -->
    <el-dialog :title="nowItem=='add' ? '申请变更' : '修改变更' " :visible.sync="dialogFormVisible" class="dialogBox">
      <createChange :nowItem="nowItem" @cancel="dialogFormVisible=false" @comfirm="query"/>
    </el-dialog>

    <!-- 查看弹框 -->
    <el-dialog :visible.sync="dialogChangeDetailVisible" title="查看详情" fullscreen>
      <changeDetail :changeId="changeId"/>
    </el-dialog>
  </div>
</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
import project from "@/api/project";
import change from "@/api/change";
import createChange from './components/createChange'
import changeDetail from './changeDetail'
export default {
  inject: ["reload"],
  name: "sendChange",
  data(){
    return{
      userGroupDefaultProps: {   // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {  // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 15 // 每页条数
      },
      myApplyChangePageList: [],  //我申请的变更
      dialogFormVisible: false,   //默认弹框不显示
      nowItem: "",  //当前对象
      dialogChangeDetailVisible: false,  //查看详情弹框
      changeId: ""   //详情id
    }
  },
  components:{
    SelectTree,
    createChange,
    changeDetail
  },
  created() {
    this.query();
    this.initUserGrouptTree();
  },
  methods:{
    initUserGrouptTree() {  // 组织机构树
      Organization.organizateTree().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    handleUserGroupOnClick(data) {  // 组织机构树点击事件
      this.projectItemTree=[];  //清空数据
      if (data.children.length === 0) {
        this.sendData.departId = data.id
        project.projectList({orgId: data.id}).then(res => {
          this.projectItemTree = res.data.data
        });
      } else {
        this.$message({
          message: '施工单位下才有工程分部分项'
        })
        return false
      }
    },
    handleProjectItemChange(data) {   // 工程分部分项id
      this.sendData.projectItemId = data.id;
    },
    query(){   //查询
      change.myApplyChangeList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.myApplyChangePageList = res.data.data.data;
      });
    },
    handleSizeChange(val){  //翻页
      this.sendData.pageSize=val;
      this.query();
    },
    reset() {  // 重置按钮
      this.reload();
    },
    apply(item){  //申请
      this.nowItem=item;
      this.dialogFormVisible=true;  //显示弹框
    },
    findApplyDetail(item){  //查看详情
      this.changeId=item;
      this.dialogChangeDetailVisible=true;
    }
  }
}
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
