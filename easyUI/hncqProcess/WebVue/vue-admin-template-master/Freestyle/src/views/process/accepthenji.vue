<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <!-- <select-tree
             :options="userGroupOption"
             :props="userGroupDefaultProp"
             v-on:noDe="userGroupOnClick"
           />-->
          <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
            <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>分部分项:</span>
          <select-tree clearable :options="projectItemTreeOption" ref="getSelectData" :props="projectItemDefaultProp"
                       v-on:noDe="projectItemOnClick"/>

          <!-- <select-tree
             :options="projectItemTreeOption"
             :props="projectItemDefaultProp"
             v-on:noDe="projectItemOnClick"
           />-->

        </el-col>


        <el-col :span="12">
          <span>创建日期:</span>
          <el-date-picker
            v-model="queryData.starttime"
            type="datetime"
            placeholder="选择开始日期时间"
            size="small"
            style="min-width:180px"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="queryData.endtime"
            type="datetime"
            placeholder="选择结束日期时间"
            size="small"
            style="min-width:180px"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>


      </el-row>
    </div>

    <div class="topBar">
      <el-row>
        <el-col :span="5">
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

        <el-col :span="13">
          <span>验收类型:</span>
          <el-select v-model="queryData.checkType" placeholder="请选择" size="small">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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

    <el-table border class="textList" :data="tableData" height="68vh" fit>
      <el-table-column prop="name1" label="分部分项" width="400"></el-table-column>
      <el-table-column prop="zhuanghao" label="桩号" width="150" align="center"></el-table-column>
      <el-table-column prop="processName" label="工序名称" width="200" align="center"></el-table-column>
      <el-table-column prop="shijizijianren" label="自检人" width="70" align="center"></el-table-column>
      <el-table-column prop="planSelfCheckTime" label="计划自检时间" width="110" align="center"></el-table-column>
      <el-table-column prop="realitySelfCheckTime" label="实际自检时间" width="150" align="center"></el-table-column>
      <el-table-column prop="shijiyanshouren" label="验收人" width="70" align="center"></el-table-column>
      <el-table-column prop="planCheckTime" label="计划验收时间" width="110" align="center"></el-table-column>
      <el-table-column prop="realityCheckTime" label="实际验收时间" width="150" align="center"></el-table-column>

      <el-table-column label="状态" align="center" width="160">
        <template slot-scope="scope">
          <template
            v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined"
          >
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
            <el-button
              @click="handleClick(scope.row)"
              type="primary"
              circle
              size="small"
              icon="el-icon-search"
              v-if="tableData.length!=0"
            ></el-button>
          </el-tooltip>
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

    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" fullscreen class="dialogBox">
      <processCheck :realList="chakanData" :processInfoId="processInfoId"></processCheck>
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
          pageNo: 1, // 当前页
          pageSize: 10, // 每页条数
          checkType: '', //验收类型
          checkState: '', //验收状态
          orgId: '', //组织机构id
          projectItemId: '' //工程分部分项id
        },
        total: 0,
        checkTypeOptions: [
          {
            //验收类型
            value: '0',
            label: '任务验收'
          },
          {
            value: '1',
            label: '自主验收'
          }
        ],
        checkStateOption: [
          {
            //验收状态
            value: '0',
            label: '已指定工序'
          },
          {
            value: '1',
            label: '已指定计划'
          },
          {
            value: '2',
            label: '已自检'
          },
          {
            value: '3',
            label: '已验收'
          }
        ],
        dialogTableVisible: false,
        userGroupOption: [], //查询条件中的组织机构树
        projectItemTreeOption: [], //查询条件中的工程分部分项树
        tableData: [],
        chakanData: [],
        processInfoId: '', //用于查询详情的id
        userGroupId: ''
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
   /*   userGroupOnClick(data) {
        // 点击组织机构节点展示分部分项
        this.projectItemTreeOption = []
        this.queryData.orgId = data.id
        request.post('/rest/projectItemInfo/getList', { orgId: data.id }).then(res => {
          this.projectItemTreeOption = res.data.data
        })
      },*/
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
        request.post('/rest/processCheck/searchHenJi', formData).then(res => {
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.data
        })
      },
      // 每页条数
      handleSizeChange(val) {
        this.queryData.pageSize = val
        this.query()
      },
      // 查看工程接口
      handleClick(row) {
        this.dialogTableVisible = true
        this.processInfoId = row.gongxuid
        request
          .post('/rest/processCheck/getProcessDetail', { id: row.gongxuid })
          .then(res => {
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
  }

  /deep/ .el-input__inner {
    line-height: 30px !important;
  }

  }
</style>
