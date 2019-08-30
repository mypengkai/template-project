<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <el-select v-model="queryData.orgId" placeholder="请选择" @change="userGroupOnClick">
            <el-option v-for="item in userGroupTreeOption" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span>用户姓名:</span>
          <el-input style="width: 150px;" v-model="queryData.realName" placeholder="请输入用户姓名" size="small"></el-input>
          <!-- <span>姓名:</span>
           <el-select v-model="queryData.userId" placeholder="请选择">
             <el-option
               v-for="item in personList"
               :key="item.id"
               :label="item.username"
               :value="item.id"
             ></el-option>
           </el-select>-->
        </el-col>
        <el-col :span="8">
          <span>日期:</span>
          <el-date-picker
            v-model="queryData.startTime"
            type="date"
            placeholder="选择开始日期"
            size="small"
            style="min-width:120px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="queryData.endTime"
            type="date"
            placeholder="选择结束日期"
            size="small"
            style="min-width:120px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>

        <!--<el-col :span="8">
          <span>用户类型:</span>
          <el-select v-model="queryData.personType" placeholder="请选择">
            <el-option
              v-for="item in jobTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="6">
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
    <el-table :data="tableData" border class="textList" style="width: 100%;margin-top:10px" height="70vh">
      <el-table-column prop="departname" label="组织机构" min-width="80"></el-table-column>
      <el-table-column prop="realname" label="用户姓名" min-width="80"></el-table-column>
      <el-table-column prop="job_name_cn" label="职务" min-width="80"></el-table-column>
      <el-table-column prop="CheckNumber" label="验收" min-width="80"></el-table-column>
      <!-- <el-table-column prop="date" label="日志" min-width="80"></el-table-column> -->
      <el-table-column prop="ReceivedInstructNumber" label="收到指令" min-width="80"></el-table-column>
      <el-table-column prop="IssueInstructNumber" label="发出指令" min-width="80"></el-table-column>
      <el-table-column prop="CompleteInstructNumber" label="完成指令" min-width="80"></el-table-column>
      <el-table-column prop="PatrolNumber" label="巡视统计" min-width="80"></el-table-column>
      <!-- <el-table-column prop="date" label="在岗天数" min-width="80"></el-table-column>
      <el-table-column prop="name" label="缺勤天数" min-width="80"></el-table-column>-->
      <el-table-column prop="PhotoNumber" label="照片" min-width="80"></el-table-column>
    </el-table>
    <!-- 分页条 -->

    <el-pagination
      :page-sizes="[10,20,30]"
      :page-size="10"
      :total="total"
      :current-page.sync="queryData.pageNo"
      class="pageList mt1"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="query()"
    ></el-pagination>

  </div>
</template>
<script>
  import SelectTree from '@/components/SelectTree/selectTree.vue'
  import request from '@/utils/request'

  export default {
    inject: ['reload'],
    components: {
      SelectTree
    },
    data() {
      return {
        userGroupDefaultProp: {
          children: 'children',
          label: 'sondepartname'
        },
        userGroupTreeOption: [], //查询条件中的组织机构树
        input: '', //人员名称
        personList: [],
        total: 0,
        queryData: {
          //查询条件
          realName: '', // 组织id*/
          usergroupId: '', // 组织id
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          orgId: '', //组织机构
          pageNo: 1, // 当前页
          pageSize: 10 // 每页条数
        },
        jobTypeList: [
          {
            id: '1',
            value: '业主'
          },
          {
            id: '2',
            value: '监理'
          },
          {
            id: '3',
            value: '施工单位'
          }
        ],
        tableData: [],
        processInfoId: ''   //用于查询详情的id
      }
    },
    mounted() {
      this.initUserGroup()
    },
    created() {
      this.query()
    },
    methods: {
      initUserGroup() {
        // 初始化组织机构input框数据
        request.post('/rest/processCheck/groupEqualRank').then(res => {
          this.userGroupTreeOption = res.data.data
        })
      },
      handleSizeChange(val) {

        this.queryData.pageSize = val
        this.query()
      },
      userGroupOnClick(data) {
        // 点击组织机构节点展示分部分项
        this.projectItemTreeOption = []
        this.queryData.usergroupId = data
        console.log(data)
        request
          .post('/rest/processCheck/notDeletedUser', {
            userGroupId: this.queryData.usergroupId,
            pageNo: 1,
            pageSize: 1000,
            realname: '',
            position: ''
          })
          .then(res => {

            this.personList = res.data.data.data
            // this.queryData.userId ='';

          })
      },
      query() {
        request.post('/rest/Patrol/userStatistics', {
          // personType: this.queryData.personType || '',
          // usergroupId: this.queryData.usergroupId || '',
          /* startTime: this.queryData.startTime || '',
           endTime: this.queryData.endTime || '',*/
          // userId: this.queryData.userId || '',

          usergroupId: this.queryData.usergroupId ||'',
          realName: this.queryData.realName,
          startTime: this.queryData.startTime || '',
          endTime: this.queryData.endTime || '',
          pageNo: this.queryData.pageNo,
          pageSize: this.queryData.pageSize
        })
          .then(res => {
            this.total = res.data.data.totalCount
            this.tableData = res.data.data.data

          })
      },
      reset() {  // 重置按钮
        this.reload()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .acceptzh {
    padding: 20px;
    height: 100%;
  }

  /*

    .el-input__inner {
      line-height: 30px !important;
      height: 4vh;
    }
  */

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

  .el-input__inner {
    width: 40px;
    text-align: center;
  }
</style>
