<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <!--          <select-tree :options="userGroupOptions" :props="userGroupDefaultProps" v-on:noDe="userGroupOnclick"/>-->
          <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
            <el-option v-for="item in userGroupOptions" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>

        </el-col>
        <el-col :span="5">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemOptions" ref="getSelectData" :props="projectItemDefaultProp"
                       v-on:noDe="projectItemOnClick"/>
          <!--          <select-tree :options="projectItemOptions" :props="projectItemDefaultProps" v-on:noDe="projectItemOnClick"/>-->
        </el-col>
        <!--  <el-col :span="6">
            <span>姓名:</span>
            <el-input v-model="queryData.userName" placeholder="请输入内容" size="small"></el-input>
          </el-col>-->

        <el-col :span="12">
          <span>创建日期:</span>
          <el-date-picker
            v-model="queryData.starttime"
            type="date"
            placeholder="选择开始日期"
            size="small"
            style="min-width:180px"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="queryData.endtime"
            type="date"
            placeholder="选择结束日期"
            size="small"
            style="min-width:180px"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>

      </el-row>
    </div>

    <div class="topBar">
      <el-row>
        <el-col :span="19">
          <span>工序状态:</span>
          <el-select v-model="queryData.checkState" placeholder="请选择" size="small">
            <el-option
              v-for="item in checkStateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <!--<el-col :span="14">
          <span>验收类型:</span>
          <el-select v-model="queryData.checkType" placeholder="请选择" size="small">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>-->

        <el-col :span="4">
          <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
          <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table border class="textList" :data="tableData" style="width: 100%;" height="66vh">
      <el-table-column prop="name1" label="分部分项" ></el-table-column>
      <el-table-column prop="Station" label="桩号" align="center" width="100"></el-table-column>
      <el-table-column prop="processName" label="工序名称" align="center" width="100"></el-table-column>
     <el-table-column prop="createTime" label="创建时间" align="center" width="100"></el-table-column>
      <el-table-column prop="jihuazijianren" label="自检人" width="100" align="center"></el-table-column>
      <el-table-column prop="planSelfCheckTime" label="自检时间" width="100" align="center"></el-table-column>
      <el-table-column prop="jihuayanshouren" label="验收人" width="100" align="center"></el-table-column>
      <el-table-column prop="planCheckTime" label="验收时间" width="100" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined">
            <template v-if="scope.row.state===0">已指定工序,待指定计划</template>
            <template v-else-if="scope.row.state===1">已指定计划,待自检</template>
            <template v-else-if="scope.row.state===2">已自检,待验收</template>
          </template>
          <template v-else>
            <template v-if="scope.row.state===2 && scope.row.adopt==='0'">不通过,待自检</template>
            <template v-else-if="scope.row.state===3 && scope.row.adopt==='1'">已验收,通过</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
            <el-button @click="handleClick(scope.row)" type="primary" size="small" circle
                       icon="el-icon-search"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pageList pt20 mt1" @size-change="handleSizeChange" @current-change="query"
                   :current-page="queryData.pageNo" :page-sizes="[10,20,30]" :page-size="queryData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" fullscreen class="dialogBox">
      <processCheck :realList="chakanData" :processInfoId="processInfoId"></processCheck>
    </el-dialog>
  </div>
</template>

<script>
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import processCheck from '@/views/process/components/processCheck'
  import request from '@/utils/request'
  import Organization from '@/api/Organization'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      processCheck
    },
    data() {
      return {
        userGroupDefaultProps: {  //组织机构tree props
          children: 'children',
          label: 'name'
        },
        projectItemDefaultProp: {  //工程分部分项tree    props
          children: 'children',
          label: 'projectItem'
        },
        queryData: {
          starttime: '',      // 开始时间
          endtime: '',       // 结束时间
          userName: '',      // 姓名
          pageNo: 1,        // 当前页
          pageSize: 10,   // 每页条数
          orgId: '',    // 组织机构id
          projectItemId: '',   //工程分部分项id
          checkType: '',   //验收类型
          checkState: ''  //验收状态
        },
        total: 0,
        checkTypeOptions: [{  //验收类型
          value: '0',
          label: '任务验收'
        }, {
          value: '1',
          label: '自主验收'
        }],
        checkStateOption: [{
            value: '1',
            label: '已指定计划,待自检'
          },
          {
            value: '2',
            label: '已自检,待验收'
          },
          {
            value: '3',
            label: '验收不通过'
          }
        ],
        dialogTableVisible: false,
        userGroupOptions: [],  //  组织机构List     条件选择
        projectItemOptions: [],   //   工程分部分项List   条件选择
        tableData: [],  //数据列表
        chakanData: [],  //查看数据
        processInfoId: '',  //用于查询详情的id
        userGroupId: '',  //从下拉列表中选中的usergroupid
        selectedUserGroup: ''  //选中的用户组织机构
      }
    },
    created() {
      this.query()
    },
    mounted() {
      this.initUserGroup()
    },
    methods: {
      handleSizeChange(val) {
        this.queryData.pageSize = val
        this.chaxun()
      },
      initUserGroup() {  // 初始化组织机构input框数据
        Organization.userGroupSelect().then(res => {
          this.userGroupOptions = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.queryData.orgId = data
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
      /*  projectItemOnClick(data) {  // 分部分项选择后的数据
          this.sendData.projectCode = data.projectCode;
        },
        */
      // 获取分部分项id
      projectItemOnClick(data) {
        this.queryData.projectItemId = data.id
      },

      reset() {
        this.reload()
      },
      query() {  // 查询接口
        let formData = {
          orgId: this.queryData.orgId,
          pageNo: this.queryData.pageNo,
          pageSize: this.queryData.pageSize,
          starttime: this.queryData.starttime,
          endtime: this.queryData.endtime,
          projectId: this.queryData.projectItemId,
          personid: this.queryData.userName,
          checkType: this.queryData.checkType,
          state: this.queryData.checkState
        }
        request.post('/rest/processCheck/searchCheakDeatil', formData).then(res => {
          this.tableData = res.data.data.data
          this.total = res.data.data.totalCount
        })
      },
      // 每页条数
      handleSizeChange(val) {
        this.queryData.pageSize = val
        this.query()
      },
      handleClick(row) {  // 查看工程接口
        this.dialogTableVisible = true
        this.processInfoId = row.gongxuid
        request.post('/rest/processCheck/getProcessDetail', { id: row.gongxuid }).then(res => {
          this.chakanData = res.data.data
        })
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
</style>
