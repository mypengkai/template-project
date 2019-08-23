<template>
  <div class="p20">
    <div class="search">
      <el-row>
        <el-col :span="5" v-if="tabPosition == 'first'">
          <div>
            <el-form :inline="true" class="grid-content" style="font-size:.8vw">

              <el-form-item label="组织机构：">

                <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
                  <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="5" v-if="tabPosition == 'first'">
          <div>
            <el-form :inline="true" class="grid-content">
              <el-form-item label="分部分项：">
                <!--     <select-tree
                       :options="projectItemOptions"
                       v-on:noDe="handleCheckChangeUnit"
                       :props="defaultPropsProject"
                     />projectItemOptions
                   </el-form-item>-->
                <select-tree clearable :options="projectItemOptions" ref="getSelectData"
                             :props="projectItemDefaultProp"
                             v-on:noDe="projectItemOnClick"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!-- ========================================== -->
        <!-- 人员查询 -->
        <el-col :span="6" v-if="tabPosition == 'second'">
          <div class="grid-content">
            <!-- <el-form inline>
              <el-form-item label="姓名：">
                <select-tree :options="projectItemOptions"  v-on:noDe="handleCheckChangeUnit" :props="defaultPropsProject"/>
              </el-form-item>
            </el-form>-->
            <span>姓名：</span>
            <el-input
              size="small"
              class="inputName"
              placeholder="请输入姓名"
              v-model="username"
              clearable
              style="width: 200px"
            ></el-input>
          </div>
        </el-col>
        <!-- ===================================== -->
        <el-col :span="12">
          <el-row>
            <div class="grid-content">
              <span>日期：</span>
              <el-date-picker v-model="dateFrom" type="date" size="small"/>
              -
              <el-date-picker v-model="dateTo" type="date" size="small"/>
            </div>
          </el-row>
        </el-col>

        <!-- <el-col :span="2">
          <div class="grid-content">
            <span>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-zoom-out">导出</el-button>
            </span>
          </div>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content" id="gridAdd">
            <span>类型：</span>
            <el-radio-group v-model="searchType">
              <el-radio label>全部</el-radio>
              <el-radio label="notice">通知</el-radio>
              <el-radio label="command">指令</el-radio>
              <el-radio label="polling">巡视</el-radio>
              <el-radio label="sideStation">旁站</el-radio>
              <el-radio label="realcheck">验收</el-radio>
              <el-radio label="meeting">会议纪要</el-radio>
              <!-- <el-radio label="selfcheck">自检</el-radio>-->
            </el-radio-group>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="grid-content">
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-search"
                @click="querySelected"
              >查询</el-button>
            </span>
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-refresh"
                @click="reset()"
              >重置</el-button>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane label="工程痕迹管理" name="first">
          <div class="conent-one">
            <list :trace-type="1" :conentOptions="conentOptions"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员痕迹管理" name="second">
          <div class="conent-one">
            <list :trace-type="2" :userOptions="userOptions"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import list from './detailList'
  import { getToken } from '@/utils/auth'
  import request from '@/utils/request'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import Organization from '@/api/Organization'

  let token = localStorage.getItem('myToken')
  export default {
    name: 'TraceManage',
    inject: ['reload'],
    components: {
      list,
      SelectTree
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
        department: '',
        departmentProject: '',
        searchType: '',
        tabPosition: 'first',
        dateFrom: '', //日期
        dateTo: '',
        active: '', // 自定义属性
        userGroupOption: [], //工程列表
        userGroupId: '',
        projectItemOptions: [], // 工程分项
        username: '', //用户名
        conentOptions: [], // 展示数据
        userOptions: [], // 人员数据
        defaultProp: {
          // 组织机构
          children: 'children',
          label: 'name'
        },
        defaultPropsProject: {
          //分部分项
          children: 'children',
          label: 'projectItem'
        },
        serckCheck: ['时间', '人员', '类型'],
        from: {
          projectName: '', //单位
          projectId: '', //单位id
          unitsName: '', //单位工程
          unitsId: '' //工程ID
        },
        headers: {
          'X-AUTH-TOKEN': getToken()
        }
      }
    },
    watch: {},
    created() {
      this.initUserGroup()
      this.projecQuery()
      this.peopleQuery()
    },
    mounted() {
    },
    methods: {
      //  单位查询
      initUserGroup() {
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.userGroupId = data
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
      // 获取分部分项id
      projectItemOnClick(data) {
        this.form.projectId = data.id
      },
/*

      //选中的数据(tree)
      noDe(data, checked, indeterminate) {
        if (data.children.length > 0) {
          this.from.projectName == ''
          this.$message({
            message: '组织机构只能选择标段'
          })
          return false
        }
        if (data.children.length = 0) {
          this.from.projectName = data.name
          this.from.projectId = data.id
        }
        // 工程查询
        request
          .post('/rest/projectItemInfo/getList', {
            orgId: this.from.projectId,
            'X-AUTH-TOKEN': token
          })
          .then(res => {
            this.projectItemOptions = res.data.data
          })
      },
*/

      handleCheckChangeUnit(data) {
        this.from.unitsName = data.projectItem
        this.from.unitsId = data.id
      },
      // 查询按钮查询
      querySelected() {
        if (this.tabPosition == 'first') {
          this.projecQuery()
        }
        if (this.tabPosition == 'second') {
          this.peopleQuery()
        }
      },
      projecQuery() {
        // 工程查询
        request
          .post('/rest/mark/chakan', {
            'X-AUTH-TOKEN': token,
            pageNo: 1,
            pageSize: 10,
            startTime: this.dateFrom, // 起始时间
            endTime: this.dateTo, // 结束时间
            projectid: this.from.unitsId, //工程ID
            orderby: this.active + 1, // 筛选(时间，类型，人员)
            type: this.searchType // 工程   人员
          })
          .then(res => {
            this.conentOptions = res.data.data.data

          })
      },
      peopleQuery() {
        // 人员查询
        request
          .post('/rest/mark/chakan', {
            'X-AUTH-TOKEN': token,
            pageNo: 1,
            pageSize: 10,
            startTime: this.dateFrom,
            endTime: this.dateTo,
            searchname: this.username,
            orderby: this.active + 1,
            type: this.searchType
          })
          .then(res => {
            this.userOptions = res.data.data.data
            // console.log(this.userOptions, "this.userOptions");
          })
      },

      //数据重置
      reset() {
        this.reload()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .p20 {
    height: 100%;
    width: 100%;
    font-size: 0.8vw;
  }

  .inputName {
    width: 20%;
    height: 100%;
    text-indent: 10px;
  }

  .grid-content {
    height: 40px;
    line-height: 40px;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    color: #606266;
  }

  .content {
    margin-top: 10px;
    height: 65vh;
  }

  .conent-one {
    overflow-y: auto;
    height: 32vw;
  }

  /deep/ .el-form-item__label {
    font-size: 14px;
    font-weight: 400;
    color: #000;
  }

  /deep/ .grid-content {
    font-size: 14px;
    font-weight: 400;
    color: #000;
  }

  /deep/ .pan-btn {
    font-size: .8vw;
  }
</style>
