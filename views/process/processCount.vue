<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
            <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="15">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemTreeOption" ref="getSelectData" :props="projectItemDefaultProp"
                       v-on:noDe="projectItemOnClick"/>

        </el-col>
        <el-col :span="4">
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="query()"
          >查询
          </el-button>
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-refresh"
            @click="reset()"
          >重置
          </el-button>
        </el-col>

      </el-row>
    </div>

    <el-table border class="textList" :data="tableData" height="70vh">
      <el-table-column prop="projectitem" label="分部分项" width=""></el-table-column>
      <el-table-column prop="allnumber" label="总数量" width="" align="center"></el-table-column>
      <el-table-column prop="completenumber" label="完成数量" width="" align="center"></el-table-column>
      <el-table-column prop="notcompletenumber" label="未完成数量" width="" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            content="查看"
            circle
            @click="loadAppointProcessList(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pageList mt1"
      @size-change="handleSizeChange"
      @current-change="query"
      :current-page="queryData.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="queryData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--    <div v-if="dialogTableVisible" class="Cztab">-->
    <el-dialog :visible.sync="dialogTableVisible" title="查看工序" width="80%">
      <el-table border :data="chakanData" height="60vh" class="textList">
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="processName" label="工序名称" align="center"/>
        <el-table-column prop="planSelfCheckName" label="自检人" align="center"/>
        <el-table-column prop="planCheckName" label="验收人" align="center"/>
        <el-table-column prop="planSelfCheckTime" label="自检时间" align="center"/>
        <el-table-column prop="planCheckTime" label="验收时间" align="center"/>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined">
              <template v-if="scope.row.state1===0">已指定工序,待指定计划</template>
              <template v-else-if="scope.row.state1===1">已指定计划,待自检</template>
              <template v-else-if="scope.row.state1===2">已自检,待验收</template>
            </template>
            <template v-else>
              <template v-if="scope.row.state1===2 && scope.row.adopt==='0'">不通过,待自检</template>
              <template v-else-if="scope.row.state1===3 && scope.row.adopt==='1'">已验收,通过</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="创建类型" align="center" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.checktype==4">补录</template>
            <template v-else>新增</template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <!-- 指定验收 -->
            <!-- <el-tooltip v-if="scope.row.adopt===null && scope.row.state1===0" class="item" effect="dark"
                         content="指定验收计划" placement="top">
               <el-button :id="scope.$index" type="success" size="small" icon="el-icon-edit-outline" circle
                          @click="appointCheckPlan(scope)"/>

             </el-tooltip>
             <el-tooltip v-if="scope.row.adopt===null && scope.row.state1===1" class="item" effect="dark"
                         content="修改验收计划" placement="top">
               <el-button :id="scope.$index" type="warning" size="small" icon="el-icon-edit" circle
                          @click="appointCheckPlan(scope)"/>
             </el-tooltip>-->
            <!-- 查看按钮 -->
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
              <el-button type="primary" size="small" icon="el-icon-search" circle @click="handleClick(scope.row)"/>
            </el-tooltip>
            <!-- 删除按钮 -->
            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
               <el-button v-ltx="'acceptDelete'" v-if="scope.row.state1===0" type="danger" icon="el-icon-delete" circle
                          size="small" @click="deleteMainProcess(scope)"/>
             </el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
      <!--  分页 -->
      <el-pagination :page-sizes="[10,20,30]" :page-size="10" :total="querydataDialog.total"
                     :current-page.sync="querydataDialog.pageNo" background
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleAppointProcessSizeChange" @current-change="loadAppointProcessList"/>
    </el-dialog>

    <!-- 查看弹框 -->
    <el-dialog :visible.sync="dialogDetils" title="查看详情" fullscreen>
      <processCheck :real-list="chakanDetils" :processInfoId="processInfoId"/>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import processCheck from '@/views/process/components/processCheck'
  import Organization from '@/api/Organization.js'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      processCheck
    },
    data() {
      return {
        userGroupDefaultProp: {
          children: 'children',
          label: 'name'
        },
        projectItemDefaultProp: {
          children: 'children',
          label: 'projectItem'
        },
        queryData: {
          //查询条件
          starttime: '', // 开始时间
          endtime: '', // 结束时间
          userName: '', // 姓名
          total: '',
          pageNo: 1, // 当前页
          pageSize: 10, // 每页条数
          checkType: '', //验收类型
          checkState: '', //验收状态
          orgId: '', //组织机构id
          projectItemId: '' //工程分部分项id
        },
        querydataDialog: {   //指定工序列表
          projectItemId: '',
          pageNo: 1,
          pageSize: 10,
          total: 0   //总条数
        },
        total: 0,
        dialogTableVisible: false,
        userGroupOption: [], //查询条件中的组织机构树
        projectItemTreeOption: [], //查询条件中的工程分部分项树
        tableData: [],
        tableDataDialog: [],
        chakanData: [],
        processInfoId: '', //用于查询详情的id
        userGroupId: '',
        tableData: [],  // 操作列表table值

        processInfoId: '',  //当前操作的工序id
        dialogDetils: false,
        chakanDetils: ''

      }
    },
    created() {
      this.query()
    },
    mounted() {
      this.initUserGroup()
    },
    methods: {
      initUserGroup() {
        // 初始化组织机构
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      userGroupOnChange(data) {   //选择标段改动
        this.queryData.orgId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemTreeOption = res.data.data
          this.$refs.getSelectData.labelModel = ''
        })
      },
      loadNextNode(node, resolve) {  //异步获取下一级节点数据
        if (node.level > 0) {
          project.getProjectItemFromLayer({ userGroupId: this.selectedUserGroup, pId: node.data.id }).then(res => {
            resolve(res.data.data)
          })
        }
      },
      projectItemOnClick(data) {
        // 获取分部分项id
        this.queryData.projectItemId = data.id
      },
      reset() {
        //重置
        this.reload()
      },
      query() {
        // 查询接口
        this.tableData = []
        let formData = {
          // orgId: this.queryData.orgId,
          pageNo: this.queryData.pageNo,
          pageSize: this.queryData.pageSize,
          // starttime: this.queryData.starttime,
          // endtime: this.queryData.endtime,
          codeid: this.queryData.projectItemId
        }
        request.post('/rest/processCheck/processStatistics', formData).then(res => {
          console.log(res)
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.data
        })
      },
      // 每页条数
      handleSizeChange(val) {
        this.queryData.pageSize = val
        this.query()
      },
      loadAppointProcessList(row) {  // 查看接口
        this.dialogTableVisible = true
        this.querydataDialog.projectItemId = row
        request.post('/rest/processCheck/getProject_ProcessPage', this.querydataDialog).then(res => {
          this.querydataDialog.total = res.data.data.totalCount
          this.chakanData = res.data.data.data

        })
      },
      /*
            loadAppointProcessList() {   //加载指定工序列表
              request.post('/rest/processCheck/getProject_ProcessPage', this.querydataDialog).then(res => {
                this.querydata.total = res.data.data.totalCount
                this.tableData = res.data.data.data
              })
            },*/
      handleAppointProcessSizeChange(val) {   //分页时使用
        this.querydataDialog.pageSize = val
        this.loadAppointProcessList()
      },
      handleClick(row) {  // 查看详情接口
        this.dialogDetils = true
        this.processInfoId = row.id
        request.post('/rest/processCheck/getProcessDetail', { id: row.id }).then(res => {
          this.chakanDetils = res.data.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .acceptzh {
    padding: 20px;
    height: 100%;

  /deep/ .el-input__inner {
    line-height: 30px !important;
  }

  }
</style>
