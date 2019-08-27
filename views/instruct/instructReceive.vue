<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>组织机构:</span>
      <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
        <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                   :value="item.id"></el-option>
      </el-select>
      <!--      <select-tree clearable :options="userGroupOption" :props="userGroupDefaultProps" v-on:noDe="handleUserGroupClickChange"/>-->
      <span>分部分项:</span>
      <select-tree clearable :options="projectItemOptions" ref="getSelectData" :props="projectItemDefaultProp"
                   v-on:noDe="projectItemOnClick"/>
      <span>创建日期:</span>
      <el-date-picker v-model="sendData.starttime" type="date" placeholder="选择日期" size="small"
                      style="min-width:180px" value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"></el-date-picker>
      -
      <el-date-picker v-model="sendData.endtime" type="date" placeholder="选择日期" size="small"
                      style="min-width:180px" value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"></el-date-picker>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">查询
        </el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table border class="textList" :data="getList" style="width: 100%" height="72vh">
        <el-table-column prop="projectitem" label="分部分项" width="500"></el-table-column>
        <el-table-column prop="station" label="桩号"  align="center"></el-table-column>
        <!--<el-table-column label="指令类型" width="110" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.commandType==='1'">安全</template>
            <template v-else-if="scope.row.commandType==='2'">纸质</template>
            <template v-else-if="scope.row.commandType==='3'">口头</template>
          </template>
        </el-table-column>-->
        <el-table-column prop="launchPerson" label="发起人" width="100" align="center"></el-table-column>
        <el-table-column prop="createTime" label="发起时间" width="150" align="center"></el-table-column>
        <el-table-column prop="nowUser" label="处理人" width="100" align="center"></el-table-column>
        <!--        <el-table-column prop="planTime" label="处理时间" width="110" align="center"></el-table-column>-->
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
              <template v-if="scope.row.state=='-1'">待处理</template>
              <template v-else-if="scope.row.state=='0'">转发</template>
              <template v-else-if="scope.row.state=='1'">已完成</template>
              <template v-else-if="scope.row.state=='2'">待复核</template>
              <template v-else-if="scope.row.state=='3'">退回</template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              circle
              @click="actionItem(scope.row.commandId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :current-page.sync="sendData.pageNo" :page-sizes="[10,20,30]"
                   :page-size="sendData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" @current-change="_searchList()" :total="total"
                   @size-change="handleSizeChange"></el-pagination>

    <!-- 编辑弹框 -->
    <el-dialog width="70%" class="dialogBox" :title="nowItem=='add'?'新增':'查看'" :visible.sync="dialogFormVisible">
      <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_searchList"></checkBox>
    </el-dialog>

  </div>
</template>

<script>
  import checkBox from './components/checkBox'
  import api from '@/api/instruct.js'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import project from '@/api/project.js'
  import Organization from '@/api/Organization.js'

  export default {
    inject: ['reload'],
    components: {
      checkBox,
      SelectTree
    },
    data() {
      return {
        getList: [], // 当前列表
        userGroupDefaultProps: {  // 组织机构树显示
          children: 'children',
          label: 'name'
        },
        projectItemDefaultProp: {  //工程分部分项tree    props
          children: 'children',
          label: 'projectItem'
        },
        userGroupOption: [], // 组织机构树
        projectItemOptions: [],   //   工程分部分项List   条件选择
        projectItemTreeOption: [], // 分部分项树
        total: 0,
        sendData: {
          departId: '', //部门id
          orgId: '', //部门id
          projectItemId: '', // 分部分项id
          starttime: '', // 开始时间
          endtime: '', // 结束时间
          pageNo: 1, // 当前页
          pageSize: 6, // 每页条数
          Mark: 2 //  标记：1：发送、2：接收
        },
        nowItem: '',
        userGroupId: '',
        dialogFormVisible: false// 查看编辑弹框
      }
    },
    created() {
      this.initUserGroup()
      this._searchList()
    },
    methods: {
      handleSizeChange(val) {
        this.sendData.pageSize = val
        this._searchList()
      },
      async actionItem(id) {  // 查询单个请求
        let { data } = await api.searchOne({ id })
        this.nowItem = data.data
        console.log(this.nowItem)
        this.dialogFormVisible = true

      },
      _searchList() {  //查询列表
        api.myCommandReceive(this.sendData).then(res => {
          this.total = res.data.data.totalCount
          this.getList = res.data.data.data
        })
      },
      initUserGroup() {   //初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.sendData.orgId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemOptions = res.data.data
          this.$refs.getSelectData.labelModel = ''
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
        this.sendData.projectId = data.id
      },

      handleUserGroupClickChange(data) {  // 组织机构下拉树
        this.sendData.departId = data.id
        project.projectList(this.sendData).then(res => {
          this.projectItemTreeOption = res.data.data
        })
      },
      handleProjectItemClickChange(data) {  // 工程分部分项树
        this.sendData.projectItemId = data.id
      },
      reset() {  // 重置按钮
        this.reload()
      }
    },
    watch: {
      dialogFormVisible(val) {
        !val && (this.nowItem = '')
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

  .rowBox {
    float: left;
  }
</style>
