<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>标题名称:</span>
      <el-input v-model="input" placeholder="请输入内容"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">查询
        </el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
       <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn"
                   @click="action('add')">新增
        </el-button>-->
      </div>
    </div>

    <!-- 查询列表 -->
    <div>
      <el-table border class="textList" :data="getList" style="width: 100%" height="68vh">
        <el-table-column prop="title" label="通知标题"></el-table-column>
        <el-table-column prop="launchName" label="发起人" align="center" width="150"></el-table-column>
        <el-table-column prop="createTime" label="发起时间" align="center" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="actionItem(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination
      class="pageList mt1"
      background
      :current-page.sync="noticeData.pageNo"
      :page-sizes="[5,10,15,30]"
      :page-size="1"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="_searchList()"
      :total="total"
      @size-change="handleSizeChange"
    ></el-pagination>

    <!-- 新增弹框 -->
    <el-dialog
      width="40%"
      class="dialogBox"
      :title="addTitle"
      :visible.sync="dialogFormVisible"
      :before-close="clearFrom">
      <el-form class="reverseBox" ref="noticeData" :model="noticeData" label-width="120px">
        <el-form-item label="通知标题:">
          <el-input placeholder="请输入通知标题" v-model="noticeData.title"/>
        </el-form-item>
        <el-form-item label="接收人:" prop="userkey">
          <el-select v-model="noticeData.users" multiple placeholder="请选择人员" style="width: 608px">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
          <!--          <el-input placeholder="请输入接收人" v-model="noticeData.users"/>-->
        </el-form-item>
        <el-form-item label="通知内容:">
          <el-input placeholder="请输入通知内容" v-model="noticeData.content"/>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">保 存</el-button>
      </div>
    </el-dialog>


<!--//Check-->
    <el-dialog
      width="40%"
      class="dialogBox"
      :title="checkTitle"
      :visible.sync="dialogFormVisibleC"
    >
      <el-form class="reverseBox" ref="noticeDataC" :model="noticeDataC" label-width="120px">
        <el-form-item label="通知标题:">
          <el-input style="border: none;" readonly="true" placeholder="" v-model="noticeDataC.title"/>
        </el-form-item>
        <el-form-item label="发起人:">
          <el-input style="border: none;" readonly="true" placeholder="" v-model="noticeDataC.createName"/>
        </el-form-item>
        <el-form-item label="接收人:" >
          <el-input style="border: none;" readonly="true" placeholder="" v-model="noticeDataC.realnames"/>
        </el-form-item>
        <el-form-item label="通知内容:">
          <el-input style="border: none;" readonly="true" placeholder="" v-model="noticeDataC.content"/>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="dialogFormVisibleC = false">取 消</el-button>
        <el-button type="primary" @click="add()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import checkBox from "../components/checkBox";
  import api from '@/api/notice.js'
  // import SelectTree from "@/components/SelectTree/selectTree.vue";
  export default {
    inject: ['reload'],
    components: {
      // checkBox
    },
    data() {
      return {
        input: '',
        value: '',
        value1: '',
        getList: [], // 当前列表
        total: 0,
        noticeData: {
          title: '',
          users: '',
          content: '',
          // type: '0',
          pageNo: 1, // 当前页
          pageSize: 6 // 每页条数
        },
        noticeDataC: {
          title: '',
          createName: '',
          realnames: '',
          content: '',
          pageNo: 1, // 当前页
          pageSize: 6 // 每页条数
        },
        userData: {
          userGroupId: '',
          realname: '',
          position: '',
          // type: '0',
          pageNo: 1, // 当前页
          pageSize: 99 // 每页条数
        },
        userList: [],
        nowItem: '新增',
        addTitle: '新增',
        timeRange: '', // 时间日期范围
        name: '', // 组织机构回填显示
        projectItem: '', // 分部分项回填显示
        dialogFormVisible: false, // 查看编辑弹框
        dialogFormVisibleC: false, // 查看编辑弹框
        innerVisible: false, // 组织机构弹框
        projectVisible: false // 工程分项弹框
      }
    },
    created() {
      this._searchList()
      this.getListByUser()
      this.getUserList()

    },
    methods: {
      action(val) {
        this.nowItem = ''
        this.dialogFormVisible = true
      },
      handleSizeChange(val) {
        this.noticeData.pageSize = val
        this._searchList()
      },
      getUserList() {
        api.getUserList(this.userData).then(res => {
          this.userList = res.data.data.data;
        })
      },
      // 新增接口
      add() {
        api.createNotice(this.noticeData).then(res => {
          if (res.data.respCode == '0') {
            this.$message({
              message: '恭喜你，新增成功',
              type: 'success'
            })
            this.dialogFormVisible = false
          }
        })
      },
      // 查询单个请求
      async actionItem(id) {
        let { data } = await api.getNoticeDetail({ id })
        this.nowItem = data.data
        this.noticeDataC = data.data
        this.dialogFormVisibleC = true
      },

      _searchList() {
        // 列表请求
        api.getListReceive(this.noticeData).then(res => {
          if (res.data.data) {
            this.total = res.data.data.totalCount
            this.getList = res.data.data.data
            let getList = this.getList
          }

        })
      },
      getListByUser() {
        // 用户列表
        api.getListByUser().then(res => {
          console.log('res', res)
        })
      },
      //提交数据新增
      onSubmit() {
        let that = this
        this.$refs['noticeData'].validate((valid) => {
          if (valid) {
            console.log(that.noticeData)
            api.projectAdd(that.projectForm).then(res => {
              this.$message({
                type: 'success',
                message: that.dialogFormTitle + '完成!'
              })
              //刷新列表
              that.initProjectList()
              that.dialogFormVisible = false  //关闭弹框
            })
          }
        })
      },

      // 重置按钮
      reset() {
        this.reload()
      },
      // 清空
      clearFrom(data) {
        this.noticeData = {
          id: '',
          title: '',
          realnames: '',
          content: '',
          orgId: ''
        }
        this.dialogFormVisible = false
      }
    },
    watch: {
      dialogFormVisible(val) {
        !val && (this.nowItem = '')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .dialogBox {
    margin-top: -7vh;
  }

  .mybox {

  /deep/ .el-range-editor.el-input__inner {
    padding: 3px 0px;
  }

  /deep/ .el-date-editor {
    width: 148px;
  }

  }
</style>
