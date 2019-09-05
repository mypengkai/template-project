<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <el-select v-model="sendData.orgId" placeholder="请选择" @change="userGroupOnChange">
            <el-option v-for="item in userGroupTreeOptions" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemTreeOptions" ref="getSelectData" :props="projectItemDefaultProp"
                       v-on:noDe="projectItemOnClick"/>
        </el-col>
        <el-col :span="10">
          <span>巡视日期:</span>
          <el-date-picker v-model="sendData.startTime" type="date" placeholder="选择日期" size="small"
                          style="min-width:180px"
                          value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          -
          <el-date-picker v-model="sendData.endTime" type="date" placeholder="选择日期" size="small"
                          style="min-width:180px"
                          value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
          <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 查询列表 -->
    <el-table class="textList" border :data="pollingPageList" style="width: 100%" height="72vh">
      <el-table-column prop="realname" label="巡视人" align="center" width="100"></el-table-column>
      <el-table-column prop="departname" label="组织机构"></el-table-column>
      <el-table-column prop="projectItem" label="分部分项"></el-table-column>
      <el-table-column prop="job_name_cn" label="职位" width="100"></el-table-column>
      <el-table-column prop="zhuanghao" label="桩号" width="100"></el-table-column>
      <el-table-column prop="describe" label="巡视描述" width="150"></el-table-column>
      <el-table-column prop="photoLocation" label="拍照地点" width="150"></el-table-column>
      <el-table-column prop="createTime" label="巡视时间" align="center" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="primary" size="small" icon="el-icon-search" circle @click="action(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :page-sizes="[10,20,30]" :page-size="sendData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange"
                   @current-change="query()"></el-pagination>
    <!-- 查看照片弹框 -->
    <el-dialog width="70%" title="巡视查看" :visible.sync="dialogFormVisible" class="dialogBox">
      <CheckPicture :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false"></CheckPicture>
    </el-dialog>
  </div>
</template>

<script>
  import CheckPicture from './components/CheckPicture'
  // import SelectTree from "./components/syncSelectTree";
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import api from '@/api/Patrol'
  import Organization from '@/api/Organization'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      CheckPicture
    },
    data() {
      return {
        userGroupTreeOptions: [],  //组织机构树
        projectItemTreeOptions: [], // 分部分项树
        pollingPageList: [], // 巡视列表
        total: 0,
        sendData: {
          departId: '', //部门id
          userId: '', // 用户名参数
          projectId: '', // 分部分项Code
          orgId: '',   //组织机构id
          pageNo: 1, //当前页
          pageSize: 10, // 每页条数
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          type: 'polling'
        },
        projectItemDefaultProp: {  // 工程分项树显示
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        },
        dialogFormVisible: false,
        nowItem: ''  //当前查看的内容
      }
    },
    created() {
      this.query()
      this.initUserGroupTree()
    },
    methods: {
      query() {  //查询数据列表
        api.PatrolList(this.sendData).then(res => {
          this.total = res.data.data.totalCount
          this.pollingPageList = res.data.data.data
        })
      },
      async action(val) {  // 查询单个请求
        let { data } = await api.chakanList(val.id) //异步执行取id
        this.nowItem = data.data
        this.dialogFormVisible = true
      },
      handleSizeChange(val) {
        this.sendData.pageSize = val
        this.query()
      },
      initUserGroupTree() {   // 初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupTreeOptions = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.sendData.orgId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemTreeOptions = res.data.data
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
      reset() {  // 重置按钮
        this.reload()
      }
    },
    watch: {
      dialogFormVisible(val) {
        !val && (this.nowItem = '') // 监听弹窗是否关闭 清空数据 防止回填
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
