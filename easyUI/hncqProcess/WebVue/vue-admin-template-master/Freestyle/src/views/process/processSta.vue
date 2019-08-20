<!--
<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <select-tree
            :options="userGroupTreeOption"
            :props="userGroupDefaultProp"
            v-on:noDe="userGroupOnClick"
          />
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
        <el-col :span="4">
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="getList()"
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
    <el-table class="textList" border :data="tableData" style="width: 100%;margin-bottom:20px"
              @cell-click="handleGoods">
      <el-table-column prop="bidSection" label="标段" min-width="180"></el-table-column>
      <el-table-column prop="alreadyCheck" label="已验收" min-width="180">
        <template scope="scope">
          <span v-if="scope.row.alreadyCheck==0">{{scope.row.alreadyCheck}}</span>
          <span v-else style="color: blue">{{scope.row.alreadyCheck}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alreadySelfCheck" label="已自检" min-width="180">
        <template scope="scope">
          <span v-if="scope.row.alreadySelfCheck==0">{{scope.row.alreadySelfCheck}}</span>
          <span v-else style="color: blue">{{scope.row.alreadySelfCheck}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notSelfCheck" label="未自检" min-width="180">
        <template scope="scope">
          <span v-if="scope.row.notSelfCheck==0">{{scope.row.notSelfCheck}}</span>
          <span v-else style="color: blue">{{scope.row.notSelfCheck}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table class="textList" border :data="footerTable" border style="width: 100%" height="60vh">
      <el-table-column prop="projectitemname" label="分部分项" min-width="90"></el-table-column>
      <el-table-column prop="processname" label="工序名称" min-width="90"></el-table-column>
      <el-table-column prop="realitySelfCheckTime" label="自检时间" min-width="90"></el-table-column>
      <el-table-column prop="realitySelfCheckPerson" label="自检人" min-width="90"></el-table-column>
      <el-table-column prop="realityCheckTime" label="验收时间" min-width="90"></el-table-column>
      <el-table-column prop="realityCheckPerson" label="验收人" min-width="90"></el-table-column>
      <el-table-column prop="state" label="状态" min-width="90">
        <template scope="scope">
          <span v-if="scope.row.state== 1&&scope.row.adopt==null">未自检</span>
          <span v-if="scope.row.state== 2&&scope.row.adopt==null">未验收</span>
          <span v-if="scope.row.state== 3&&scope.row.adopt==1">已验收</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="查看" min-width="90">
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
    &lt;!&ndash;    分页&ndash;&gt;
    <el-pagination
      class="pageList mt1"
      @size-change="handleSizeChange"
      @current-change="query()"
      :current-page="queryData.pageNo"
      :page-sizes="[10,20,30,40]"
      :page-size="queryData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    &lt;!&ndash;    查看弹框&ndash;&gt;
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" fullscreen class="dialogBox">
      <processCheck :realList="chakanData" :processInfoId="processInfoId"></processCheck>
    </el-dialog>
  </div>
</template>
<script>
  import SelectTree from '@/components/SelectTree/selectTree.vue'
  import request from '@/utils/request'
  import processCheck from '@/views/process/components/processCheck'

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
        userGroupTreeOption: [], //查询条件中的组织机构树
        projectItemTreeOption: [], //查询条件中的统计类型树
        dialogTableVisible: false,
        processInfoId: '', //用于查询详情的id
        total: 0,
        chakanData: [],
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
        //自建验收下拉框
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          }
        ],
        //选中的数据
        value: '',

        tableData: [],
        footerTable: []
      }
    },
    mounted() {
      this.initUserGroup()
    },
    created() {
      this.getList()
    },
    methods: {
      initUserGroup() {
        // 初始化组织机构input框数据
        request.get('/rest/organizate/depart').then(res => {
          this.userGroupTreeOption = res.data.data
        })
      },
      userGroupOnClick(data) {
        // 点击组织机构节点展示分部分项
        this.projectItemTreeOption = []
        this.queryData.orgId = data.id
        request
          .post('/rest/projectItemInfo/getList', { orgId: data.id })
          .then(res => {
            this.projectItemTreeOption = res.data.data
          })
      },
      projectItemOnClick(data) {
        // 获取统计类型id
        this.queryData.projectItemId = data.id
      },
      //获取按条件查询列表数据
      getList() {
        request
          .post('/rest/processCheck/processCompleteStatistics', {
            departid: this.queryData.orgId,
            startTime: this.queryData.starttime,
            endTime: this.queryData.endtime
          })
          .then(res => {
            console.log(res.data.data[0])
            this.tableData = res.data.data
          })
      },
      handleGoods(row, column, cell, event) {
        console.log(row, column, cell, event)

        request
          .post('/rest/processCheck/statisticsDetails', {
            departid: row.usergroupid,
            starttime: this.queryData.starttime,
            endTime: this.queryData.endtime,
            pageNo: this.queryData.pageNo,
            pageSize: this.queryData.pageSize,
            type: column.label == '已验收' ? 3 : column.label == '已自检' ? 2 : 1
          })
          .then(res => {
            console.log(res.data.data)
            this.footerTable = res.data.data.data
            this.total = res.data.data.totalCount
          })
      },
      // 查看工程接口
      handleClick(row) {
        this.dialogTableVisible = true

        request
          .post('/rest/processCheck/getProcessDetail', { id: row.id })
          .then(res => {
            console.log(res.data.data)
            this.chakanData = res.data.data
          })
      },
      reset() {
        //重置
        this.reload()
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val
        this.getList()
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
  /deep/ .el-table thead {
    color: #000;
  }

  /deep/ .el-table {
    font-size: 0.7vw;
  }

  /deep/ .el-table th {
    text-align: center;
  }

  /deep/ .el-table td {
    text-align: center;
  }
</style>

-->
