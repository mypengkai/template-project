<template>
  <div class="acceptzh">
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

        <!--<el-col :span="8">
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

    <el-table border class="textList" :data="tableData" height="70vh">
      <el-table-column prop="projectitem" label="分部分项" width=""></el-table-column>
      <el-table-column prop="allnumber" label="总数量" width="" align="center"></el-table-column>
      <el-table-column prop="completenumber" label="完成数量" width="" align="center"></el-table-column>
      <el-table-column prop="notcompletenumber" label="未完成数量" width="" align="center"></el-table-column>
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
