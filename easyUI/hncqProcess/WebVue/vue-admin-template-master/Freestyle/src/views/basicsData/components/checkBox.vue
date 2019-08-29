<template>
  <div class=" checkBox">
    <el-form :model="form" ref="formName" :rules="rules" label-width="120px">
      <!-- 新增 -->
      <div :class="{reverseAddBox:nowItem=='add'}">
        <el-row>
          <el-col :span="8">

            <el-col :span="24">
              <el-form-item style="width:20vw" label="组名：" v-if="nowItem =='add'">
                <el-input v-model="groupName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="width:20vw" label="组织机构：" v-if="nowItem =='add'">
                <el-select  v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange" style="width:14vw;">
                  <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="width:20vw" label="分部分项：" v-if="nowItem =='add'">

                <select-tree :isCheckbox="true" :isCheckOtherNode="false" clearable :options="projectItemTreeOptions" ref="getSelectData"
                             :props="projectItemDefaultProp"
                             v-on:noDe="projectItemOnClick"/>

                <!--                <select-tree :options="projectItemTree" :props="projectTree" v-on:noDe="handleProjectItemOnClick"/>-->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-show="true" style="width:20vw" label="组员：">
                <el-input v-model="userNames">
                  <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('receive')"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-show="false" style="width:20vw" label="手机号：">
                <el-input type="textarea" v-model="phoneNumbers">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-show="false" style="width:20vw" label="id：">
                <el-input v-model="groupUserIds">
                </el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="14">
            <el-col :span="24">
              <el-table :data="formData" style="width:100%;" border height="55vh">
                <el-table-column label="">
                  <el-table-column prop="username" label="用户名姓名"></el-table-column>
                  <el-table-column prop="zhiwei" label="职位"></el-table-column>
                  <el-table-column prop="mobilePhone" label="手机号码"></el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <div class="tar">
            <el-button @click="clock()">取 消</el-button>
            <el-button type="primary" v-if="nowItem=='add'" @click="addProcessFunction('formName')">确 定</el-button>
          </div>
        </el-row>
      </div>
    </el-form>

    <!-- 用户弹框 -->
    <el-dialog class="dialogBox" width="45%" title="选择用户" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>组织机构:</span>

        <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps"
                     v-on:noDe="handleReceiveUserGroupCheckChange"/>
      </div>
      <el-table border :data="receiveUsersList" highlight-current-row style="width: 100%" height="50vh"
                @selection-change="handleSelectionChange">
        <!--        @current-change="handleCurrentChange"-->
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职务"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <div class="tar" style="margin: 10px">
        <el-button @click="acceptUserDialog = false">取消</el-button>
        <el-button type="primary" @click="toggleSelection()">确定</el-button>
      </div>

      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[10,20,30]"
                     :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()"
                     :total="total"></el-pagination>
    </el-dialog>

  </div>
</template>

<script>
  import request from '../../../utils/request'
  import { getToken } from '@/utils/auth'
  import processInfo from '@/api/process.js'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import viewer from '@/components/viewer'
  import Organization from '@/api/Organization.js'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      viewer
    },
    props: ['nowItem'],
    data() {
      return {
        userNames: '',
        phoneNumbers: '',
        groupUserIds: '',
        dialogcommcheck: false,
        dialogFormVisible: false,
        tabPosition: 'first',
        activities: [
          {
            name: '',
            finishTime: '',
            remark: ''
          }
        ],
        nowType: 0,
        activeIndex: '1',
        activeIndex2: '1',
        newnowType: 0,
        newactiveIndex: '1',
        newactiveIndex2: '1',
        uploadUrl: process.env.BASE_API + '/rest/command/addCommand',
        dialogImageUrl: '',
        commcheckList: [], // 预览图片信息
        planTime: '',
        headers: {
          'X-AUTH-TOKEN': getToken()
        },
        form: {
          remark: '', // 指令内容
          userGroupName: '',   //组织机构名称
          processMDictId: '',  //工序类型id
          processDictId: '', // 工序字典的工序id 非必传
          projectItemId: '', // 分部分项id
          projectItemName: '',  //分部分项名称
          ReceiveUserid: '', // 接收人id
          receiveUserName: '',   //接收人名称
          planCheckTime: '', // 计划检查时间
          commandType: '', // 指令类型
          batchNo: '',
          patrolId: ''  //巡视id
        }, //表单校验规则
        rules: {},
        userGroupDefaultProps: {  // 组织机构树显示
          children: 'children',
          label: 'name'
        },
        // 工程分项树显示
        projectTree: {
          children: 'children',
          label: 'projectItem'
        },
        receiveData: {
          pageNo: 1, // 当前页
          pageSize: 10, // 每页条数
          userGroupId: '',
          projectItemId: '', // 分部分项id

          realname: '', //用户真实名字
          position: ''   //职位
        },
        total: 0,
        pictureOfCommand: [], // 发送指令时的图片
        imgData: [], // 下一层图片数组
        userGroupTree: [], // 组织机构树
        projectItemTree: [], // 分部分项树
        receiveUsersList: [], // 接收人列表
        name: '', // 组织机构回填显示
        username: '', // 用户名回填
        projectItem: '', // 分部分项回填显示
        innerVisible: false, // 组织机构弹框
        projectVisible: false, // 工程分项弹框
        acceptUserDialog: false,
        innerTranspondDialog: false, // 转发指令信息
        dialogVisible: false, // 上传图片
        formData: [],
        multipleSelection: [], // 勾选中数据
        groupName: '',
        organizationId: '',
        groupId: '',
        selectedUserGroup: '',  //选中的用户组织机构
        orgId: '',
        projectItemTreeOptions: [],
        userGroupId: '',
        userGroupOption: [],
        projectItemDefaultProp: {  // 工程分项树显示
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        }

      }
    },
    created() {
      this.initForm()
      this.receiveUserList()
      this.initUserGroupTree()
    },
    methods: {
      clock() {
        this.$emit('cancel')
      },
      toggleSelection() {

        this.formData = this.multipleSelection
        this.acceptUserDialog = false
        // this.user = res.data.data;
        let items = this.multipleSelection
        for (let i = 0; i < items.length; i++) {
          let that = this
          this.groupUserIds += items[i].id + ','
          this.phoneNumbers += items[i].mobilePhone + ','
          this.userNames += items[i].username + ','
          console.log('this.groupUserIds', this.groupUserIds)
        }
        console.log('fata', this.formData)
      },
      //获取选中
      handleSelectionChange(val) {
        this.multipleSelection = val

        this.form.receiveUserName = val.username
      },
      initForm() {
        if (this.nowItem == 'add') {
          this.initUserGroupTree()  //初始化组织机构
          return
        }
        let ObCopyData = this.$tool.ObCopy(this.nowItem)
        this.form = ObCopyData
        this.activities = ObCopyData.commandUser
      },
      /*    initUserGroupTree() {   // 初始化组织机构树
            Organization.organizateTree().then(res => {
              this.userGroupTree = res.data.data
            })
          },*/
      initUserGroupTree() {  //初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupOption = res.data.data
        })
      },
      receiveUserList() {  //接收人列表
        processInfo.getUsersByDepartId(this.receiveData).then(res => {
          this.total = res.data.data.totalCount
          this.receiveUsersList = res.data.data.data
        })
      },
      userGroupOnChange(data) {   //选择标段改动
        this.orgId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {

          this.projectItemTreeOptions = res.data.data
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
      projectItemOnClick(data) {  // 分部分项选择后的数据
        this.form.projectItemId = data.id
      },
      handleProjectItemOnClick(data) { // 分部分项选择后的数据
        this.form.projectItemId = data.id
        this.form.projectItemName = data.name
      },
      alertAcceptUserDialog(state) {
        this.receiveUserList()
        this.acceptUserDialog = true
      },
      handleReceiveUserGroupCheckChange(data) {
        this.receiveData.userGroupId = data.id
        this.receiveUserList()
      },
      addProcessFunction(formName) {
        const fromData = {
          organizationId: this.form.userGroupId,
          groupId: this.form.projectItemId,
          groupName: this.groupName,
          groupUserId: this.groupUserIds,
          groupUser: this.userNames,
          phoneNumber: this.phoneNumbers
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/rest/NumberGroup/addgroup', fromData).then(res => {
              if (res.data.respCode == 0) {
                this.$message({
                  message: '恭喜你，新增成功',
                  type: 'success'
                })
                // this.loadAppointProcessList()
                this.dialogFormVisible = false
              }
            })
          }
          this.$emit('cancel')

        })
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      beforeUpload: function(file) {
        this.commandFormData.append('files', file)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkBox {
    height: 60vh;
    overflow-x: hidden;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-carousel__item {

  img {
    width: 100%;
    height: 100%;
  }

  }
  .TimeAndType {
    height: 7vh;

  span {
    display: block;
  }

  }
  .timelineBox {
    height: 9vh;

  .el-timeline-item {
    float: left;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 15px;
    width: 8vw;
    border-top: 2px solid #e4e7ed !important;
  }

  }
  .navb {
    width: 50%;
    height: 7%;
    margin-left: 30px;
  }

  .navbc {
    width: 70%;
    height: 7%;
    margin-left: 30px;
  }

  .intervalBox {

  element.style {
    margin-left: transparent;
  }

  }
  .reverseBox {
    position: relative;

  /deep/ .el-form-item__label {
    font-size: 14px;
  }

  /deep/ .el-input {
    font-size: 0.7vw;
  }

  /deep/ .el-textarea {
    margin-bottom: 5px;
  }

  /deep/ .el-input__inner {
    font-size: 14px;
  }

  /deep/ .el-timeline {

    line-height: 30px;
  }

  /deep/ .reference .el-timeline-item {
    font-size: 12px;
  }

  /deep/ .el-textarea__inner {
    height: 30px;
  }

  }
  .reference {
    width: 100%;

  .el-timeline {
    margin-left: -2vw;
    font-size: 0.7vw;
    list-style: none;
  }

  .el-timeline-item {
    float: left;
    padding-bottom: 0;
    height: 3vh;
  }

  /deep/ .el-timeline-item__node--normal {
    width: 0.7vw;
    height: 0.7vw;
  }

  /deep/ .el-timeline-item__timestamp {
    font-size: 0.8vw;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 0vw;
    width: 0vw;
    height: 3vh;
    border-left: 0.1vw solid rgba(31, 68, 143, 0);
  }

  /deep/ .el-timeline-item__node--normal {
    left: 0.4vw;
  }

  /deep/ .el-timeline-item__wrapper {
    position: relative;
    padding-left: 1.2vw;
    top: -0.5vh;
  }

  }
  .accomplish {
    display: block;
    text-align: center;
    font-size: 1.2vw;
    color: #00000b;
  }

  .reverseAddBox {
    width: 100%;

  /deep/ .el-form-item__label {
    font-size: 0.7vw;
  }

  /deep/ .el-input {
    font-size: 0.7vw;
  }

  }
  .faqi,
  .wanchen {
    width: 50%;
    padding: 10px;

  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;

  li {
    list-style: none;
    float: left;
    width: 15vh;
    height: 15vh;
    padding: 1%;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  }
  }
  }
  .pictureContent {
    padding: 10px;

  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;

  li {
    list-style: none;
    float: left;
    width: 20vh;
    height: 20vh;
    padding: 1%;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  }
  }
  }
  .elhr {
    position: absolute;
    width: 1px;
    height: 50vh;
    bottom: 0;
    left: 50%;
    background: #ccc;
  }
</style>
