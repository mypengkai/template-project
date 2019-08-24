<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="5">
          <span>组织机构:</span>
          <!--    <select-tree
                :options="userGroupTreeOption"
                :props="userGroupDefaultProp"
                v-on:noDe="userGroupOnClick"
              />-->
          <el-select v-model="queryData.orgId" placeholder="请选择" @change="userGroupOnChange">
            <el-option v-for="item in userGroupTreeOption" :key="item.id" :label="item.departname"
                       :value="item.id"></el-option>
          </el-select>

        </el-col>
        <el-col :span="5">
          <span>姓名:</span>
          <!--<el-input v-model="queryData.userId" placeholder="请输入姓名"></el-input>-->
          <el-select v-model="queryData.userId" placeholder="请选择">
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!--       <el-col :span="10">
                 <span>创建日期:</span>
                 <el-date-picker
                   v-model="queryData.starttime"
                   type="datetime"
                   placeholder="选择开始日期时间"
                   size="small"
                   style="min-width:180px"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   format="yyyy-MM-dd HH:mm:ss"
                 ></el-date-picker>-
                 <el-date-picker
                   v-model="queryData.endtime"
                   type="datetime"
                   placeholder="选择结束日期时间"
                   size="small"
                   style="min-width:180px"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   format="yyyy-MM-dd HH:mm:ss"
                 ></el-date-picker>
               </el-col>-->
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
      <el-table class="textList" :data="tableData" border style="width: 100%;margin-top:20px" height="70vh" fit>
        <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="pollingNumber" label="巡视次数" align="center" width="300"></el-table-column>
        <el-table-column prop="sideStationNumber" label="旁站次数" align="center" width="300"></el-table-column>
        <el-table-column prop="commandpollingrangeNumber" label="巡视发起指令次数" align="center" width="300"></el-table-column>
        <el-table-column prop="commandsideStationNumber" label="旁站发起指令次数" align="center" width="300"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="queryData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="queryData.pageNo"
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
        personList: [],
        total: 0,
        queryData: {
          //查询条件
          userGroupId: '',
          userId: '',
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
        tableData: []
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
      /*  userGroupOnChange(data) {  // 组织机构下拉树
          this.queryData.orgId = data;
          Organization.getProjectItemFromLayer({userGroupId: data, pId: '0'}).then(res => {
            this.projectItemTreeOptions = res.data.data;
          });
        },*/

      userGroupOnChange(data) {
        // 点击组织机构节点展示分部分项
        console.log('data', data)
        this.queryData.usergroupId = data

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
            this.queryData.usergroupId = ''
            this.queryData.userId = ''
          })
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val
        // this.query()
      },
      query() {
        request
          .post('/rest/Patrol/patrolStatistics', {
            userid: this.queryData.userId,
            pageNo: this.queryData.pageNo,
            pageSize: this.queryData.pageSize
          })
          .then(res => {
            console.log(res.data.data)
            this.tableData = res.data.data.data
            this.total = res.data.data.totalCount
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

  /deep/ .el-input__inner {
    line-height: 30px;
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
