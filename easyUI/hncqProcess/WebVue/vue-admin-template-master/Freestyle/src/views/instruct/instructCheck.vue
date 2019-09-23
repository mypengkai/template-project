<template>
  <div class="p20">
    <div class="topBar">
      <span>组织机构:</span>
      <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
        <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname" :value="item.id"></el-option>
      </el-select>
      <span>分部分项:</span>
      <select-tree clearable :options="projectItemTreeOptions" ref="getSelectData" :props="projectItemDefaultProp" v-on:noDe="projectItemOnClick"/>
      <span>创建日期:</span>
      <el-date-picker v-model="sendData.starttime" type="date" placeholder="选择日期" size="small" style="min-width:180px"
                      value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>-
      <el-date-picker v-model="sendData.endtime" type="date" placeholder="选择日期" size="small" style="min-width:180px"
                      value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <el-table border class="textList" :data="sendCommandList" style="width: 100%" height="72vh">
      <el-table-column prop="project" label="分部分项"></el-table-column>
      <el-table-column prop="Station" label="桩号" align="center" width="150"></el-table-column>
      <el-table-column prop="initiator" label="发起人" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="发起时间" width="150" align="center"></el-table-column>
      <el-table-column prop="commandUserNow" label="处理人" width="100" align="center"></el-table-column>
      <el-table-column prop="planTime" label="处理时间" width="110" align="center"></el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.state=='-1'">已发起,待处理</template>
           <template v-else-if="scope.row.state=='-2'">已修改,待处理</template>
          <template v-else-if="scope.row.state=='0'">已转发</template>
          <template v-else-if="scope.row.state=='1'">已复核</template>
          <template v-else-if="scope.row.state=='2'">已完成,待复核</template>
          <template v-else-if="scope.row.state=='3'">已退回,待修改</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-search" circle @click="actionItem(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :current-page="sendData.pageNo" :page-sizes="[10,20,30]" :page-size="sendData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" @size-change="handleSizeChange" :total="total"></el-pagination>
    <!-- 指令查看 -->
    <el-dialog width="70%" class="dialogBox" title="指令查看" :visible.sync="dialogFormVisible">
      <orderInstruct :nowItem="nowItem"></orderInstruct>
    </el-dialog>
  </div>
</template>
<script>
  import checkBox from './components/checkBox'
  import api from '@/api/instruct.js'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import Organization from '@/api/Organization.js'
  import orderInstruct from "./components/orderInstruct"
  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      checkBox,
      orderInstruct
    },
    data() {
      return {
        sendCommandList: [], // 当前列表
        // 组织机构树显示
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 工程分项树显示
        projectTree: {
          children: 'children',
          label: 'projectItem'
        },
        projectItemDefaultProp: {  // 工程分项树显示
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        },
        userGroupOption: [], // 组织机构树
        projectItemTreeOptions: [], // 分部分项树
        total: 0,
        //点击搜素传递的传输
        sendData: {
          departId: '', //部门id
          orgId: '',   //组织机构id
          projectItemId: '', // 分部分项id
          starttime: '', // 开始时间
          endtime: '', // 结束时间
          pageNo: 1, // 当前页
          pageSize: 10 // 每页条数
        },
        nowItem: {},
        userGroupId: '',
        dialogFormVisible: false // 查看编辑弹框
      }
    },
    created() {
      this.initUserGroup()
      this.getinit()
    },
    methods: {
      async actionItem(id) {  // 查询单个请求
        let { data } = await api.searchOne({ id })
        this.nowItem = data.data
        this.dialogFormVisible = true
      },
      handleSizeChange(val) {
        this.sendData.pageSize = val
        this.getinit()
      },
      getinit(){
        api.getList(this.sendData).then(res => {
          this.total = res.data.data.totalCount
          this.sendCommandList = res.data.data.data;
        })
      },
      _searchList() {  // 列表请求
         this.getinit();
      },

      initUserGroup() {   // 初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.sendData.orgId = data;
        this.sendData.departId = data;
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemTreeOptions = res.data.data
        })
      },
      loadNextNode(node, resolve) {  //异步获取下一级节点数据
        if (node.level > 0) {
          Organization.getProjectItemFromLayer({ userGroupId: this.selectedUserGroup, pId: node.data.id }).then(res => {
            resolve(res.data.data)
          })
        }
      },
      projectItemOnClick(data) {  // 分部分项选择后的数据
        this.sendData.projectItemId = data.id
      },
      projectChange(data) { // 工程分部分项树
        this.sendData.projectItemId = data.id
      },
      reset() {  // 重置按钮
        this.reload()
      }
    },
    watch: {
      dialogFormVisible(val) {
        !val && (this.nowItem = '')
      },
      sendData(val) {
        !val && (this.sendData = '')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .dialogBox {
    margin-top: -7vh;
  }
</style>
