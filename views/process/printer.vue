<template>
  <div class="p20">
     <div class="topBar">
      <el-row>
        <el-col :span="6">
         <el-form :inline="true" class="grid-content">
            <el-form-item label="组织机构：">
              <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange" size="small">
                <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
         <el-form :inline="true" class="grid-content">
            <el-form-item label="分部分项：">
              <select-tree clearable :options="projectItemOptions" ref="getSelectData" :props="projectItemDefaultProp"
                           v-on:noDe="projectItemOnClick" size="small"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <span>创建日期：</span>
            <el-date-picker
              v-model="form.startTime"
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
            />
            -
            <el-date-picker
              v-model="form.endTime"
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="topBar">
      <el-row>
        <el-col :span="6">
         <el-form label-width="80px" :model="form">
            <el-form-item label="打印状态:">
              <el-select v-model="form.type" placeholder="请选择" size="small">
                <el-option 
                  v-for="item in options"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- <el-col :span="6" >
          <el-form label-width="80px" :model="form">
            <el-form-item label="桩号:">
              <el-input  v-model="form.station" placeholder="请输入桩号" size="small"></el-input>
            </el-form-item>
          </el-form>
        </el-col> -->
        <el-col :span="6" style="margin-left:25%">
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
            <span>
              <el-button
                type="primary"
                class="pan-btn light-blue-btn"
                icon="el-icon-printer"
                @click="printClick"
                v-if="form.type ==0 && tableData.length>0"
              >打印验收凭证</el-button>
            </span>
        </el-col>
      </el-row>
    </div>
    <div class="printerTable">
      <el-table
        class="textList"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="66vh"
        border
        @selection-change="handleSelectionChange"
      >
        
        <el-table-column type="selection" width="50" align="center" v-if="form.type==0"></el-table-column>
        <el-table-column prop="processNumber" label="打印编码" width="100" v-if="form.type==1"></el-table-column>
        <el-table-column prop="projectName" label="分部分项" ></el-table-column>
        <el-table-column prop="Station" label="桩号" width="120" align="center"></el-table-column>
        <el-table-column prop="processname" label="工序名称" width="120"></el-table-column>
        <el-table-column prop="realitychecktime" label="验收时间" width="150" align="center"></el-table-column>
        <el-table-column prop="realname" label="验收人" width="100" align="center"></el-table-column>
        <el-table-column prop="checkdescribe" label="验收说明" width="150"></el-table-column>
        <!-- <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button  @click="handleClick(scope.row)"
              type="primary"
              circle
              align="center"
              size="small"
              icon="el-icon-search"
             ></el-button>
        </template>
      </el-table-column> -->
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="pageList pt20 mt1"
      @size-change="handleSizeChange"
      @current-change="querySelected"
      :current-page="form.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 打印凭证弹框 -->
    <el-dialog title="凭证打印" :visible.sync="dialogVisible" width="1100px">
      <proofProve @closeDialog="dialogVisible =false" :formData="dataList" v-if="flag"></proofProve>
    </el-dialog>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import proofProve from './components/proofProve.vue'
  import Organization from '@/api/Organization'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      proofProve
    },
    data() {
      return {
        form: {
          departName: '', // 组织机构名称
          userGroupId: '', // 组织机构ID
          orgId: '', // 组织机构ID
          startTime: '', // 起始时间
          endTime: '', // 结束时间
          station: '', // 桩号
          projectName: '', // 分部分项名称
          projectCode: '', // 分部分项Code
          projectItemId: '', // 分部分项id
          type: 0, // 打印状态
          pageNo: 1, // 当前页
          pageSize: 10 // 每页条数
        },
        total: 0,
        flag: false,
        options: [
          {
            type: 0,
            label: '未打印'
          },
          {
            type: 1,
            label: '已打印'
          }
        ],
        dialogVisible: false, // 弹框
        tableData: [], // table 数据
        multipleSelection: [], // 勾选中数据
        userGroupOption: [], // 组织机构数据
        userGroupId: '', // 从下拉列表中选中的组织机构
        projectItemOptions: [],   //   工程分部分项List   条件选择
        projectItemDefaultProp: {  //工程分部分项tree    props
          children: 'children',
          label: 'projectItem'
        },
        projectItem: {
          children: 'children',
          label: 'name'
        },
        partialData: [], // 分部分项
        partialItem: {
          children: 'children',
          label: 'projectItem'
        },
        dataList: [] // 选中打印
      }
    },
    created() {
      this.initUserGroup()
    },
    mounted() {
      // 默认搜未打印数据
      this.querySelected()
    },
    methods: {
      //  handleClick(id){

      //  },

      initUserGroup() {  //初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      userGroupOnChange(data) {  // 组织机构下拉树
        this.form.orgId = data
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
      projectItemOnClick(data) {
        this.form.projectItemId = data.id
      },
      // 查询数据
      querySelected() {
        request
          .post('/rest/processCheck/processPrinting', this.form)
          .then(res => {
            if (res.data.respCode == 0) {
              this.tableData = res.data.data.data
              this.total = res.data.data.totalCount
            }
          })
      },
      // 分页
      handleSizeChange(val) {
        this.form.pageSize = val
        this.querySelected()
      },
      // table
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 打印凭证
      printClick() {
        this.dialogVisible = true
        this.dataList = this.multipleSelection
        this.flag = false
        this.$nextTick(() => {
          this.flag = true
        })
      },

      //重置
      reset() {
        this.reload()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .printer {
    padding: 10px;
  }
 /deep/ .el-input--suffix .el-input__inner{
    height: 30px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
 /deep/.topBar .el-input {
    width: 11vw;
    margin-right: 0.8vw;
    margin-bottom: 0;
}
</style>
