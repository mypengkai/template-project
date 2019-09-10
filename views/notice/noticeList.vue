<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>标题名称:</span>
      <el-input v-model="noticeData.title" placeholder="请输入标题名称" />
      <span>发送时间:</span>

      <el-date-picker
        v-model="noticeData.starttime"
        type="date"
        placeholder="选择日期"
        size="small"
        style="min-width:180px"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      ></el-date-picker>-
      <el-date-picker
        v-model="noticeData.endtime"
        type="date"
        placeholder="选择日期"
        size="small"
        style="min-width:180px"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      ></el-date-picker>
      <div class="rl">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="pan-btn light-blue-btn"
          @click="_searchList"
        >查询</el-button>
        <el-button
          type="primary"
          class="pan-btn light-blue-btn"
          icon="el-icon-refresh"
          @click="reset()"
        >重置</el-button>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="pan-btn light-blue-btn"
          @click="action()"
        >新增</el-button>
      </div>
    </div>

    <!-- 查询列表 -->
    <div>
      <el-table border class="textList" :data="getList" style="width: 100%" height="72vh">
        <el-table-column prop="title" label="通知标题"></el-table-column>
        <el-table-column prop="createName" label="发起人" align="center" width="150"></el-table-column>
        <el-table-column prop="realnames" label="接收人" align="center" width="450"></el-table-column>
        <el-table-column prop="createTime" label="发送时间" align="center" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
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
      :current-page.sync="noticeData.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="10"
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
    >
      <el-form class="reverseBox" ref="noticeData" :model="addNoticeData" label-width="120px">
        <el-form-item label="通知标题:">
          <el-input placeholder="请输入通知标题" v-model="addNoticeData.title" />
        </el-form-item>
        <el-form-item label="接收人:" prop="userkey">
          <el-input v-model="addNoticeData.users" v-show="false"></el-input>
          <el-input :readonly="true" v-model="userNames">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="alertAcceptUserDialog()"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="通知内容:">
          <el-input type="textarea" placeholder="请输入通知内容" v-model="addNoticeData.content" />
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">发 送</el-button>
      </div>
    </el-dialog>


<!-- 查看 -->
    <el-dialog
      width="50%"
      class="dialogBox"
      :title="checkTitle"
      :visible.sync="dialogFormVisibleC"
      id="checkDialog"
    >
      <el-form
        id="checkBox"
        class="reverseBox"
        ref="noticeDataC"
        :model="noticeDataC"
        label-width="120px"
      >
        <el-form-item label="通知标题:">
          <el-input style="border: none;" readonly="true" placeholder v-model="noticeDataC.title" />
        </el-form-item>
        <el-form-item label="发起人:">
          <el-input
            style="border: none;"
            :readonly="true"
            placeholder
            v-model="noticeDataC.createName"
          />
        </el-form-item>
         <el-form-item label="发起时间:">
          <el-input
            style="border: none;"
            :readonly="true"
            placeholder
            v-model="noticeDataC.createTime"
          />
        </el-form-item>
        <el-form-item label="接收人:">
          <el-input
            type="textarea"
            style="border: none;"
            :readonly="true"
            placeholder="请选择"
            v-model="noticeDataC.realnames"
          />
        </el-form-item>
        <el-form-item label="通知内容:">
          <el-input
            type="textarea"
            style="border: none;"
            :readonly="true"
            placeholder
            v-model="noticeDataC.content"
          />
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button type="primary" @click="dialogFormVisibleC = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 用户弹框 -->
    <el-dialog
      class="dialogBox"
      width="50%"
      title="选择用户"
      :visible.sync="acceptUserDialog"
      append-to-body
    >
        <div class="topBar">
        <span>组织机构：</span>
        <el-select
          v-model="receiveData.userGroupId"
          placeholder="请选择"
         
        >
          <el-option
            v-for="item in userGroupTreeOptions"
            :key="item.id"
            :label="item.departname"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>用户名：</span>
        <el-input v-model="receiveData.realname" placeholder="请输入用户名"></el-input>
         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="query">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="resetdepart">重置
              </el-button>
            </div>
      </div>
      <el-table
        border
        :data="receiveUsersList"
        highlight-current-row
        style="width: 100%"
        height="50vh"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职务"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <el-pagination
        background
        style="margin-top:5px;"
        :current-page.sync="receiveData.pageNo"
        :page-sizes="[10,20,30]"
        :page-size="receiveData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="receiveUserList()"
        :total="total"
      ></el-pagination>
      <div style="margin-left:70%;margin-top:10px;">
      <el-button @click="acceptUserDialog = false">取消</el-button>
      <el-button type="primary" @click="toggleSelection()">确定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/notice.js";
import processInfo from "@/api/process.js";
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree.vue";

export default {
  inject: ["reload"],
  components: {
    // checkBox
    SelectTree
  },
  data() {
    return {
      flag: false,
      input: "",
      value: "",
      value1: "",
      orgId: "",
      getList: [], // 当前列表
      total: 0,
      noticeData: {
        title: "",
        startTime: "",
        endTime: "",
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      addNoticeData: {
        title: "",
        users: "",
        content: ""
      },
      noticeDataC: {
        title: "",
        createName: "",
        realnames: "",
        content: "",
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      userData: {
        userGroupId: "",
        realname: "",
        position: "",
        // type: '0',
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      userList: [],
      nowItem: "新增",
      addTitle: "新增",
      checkTitle: "查看",

      timeRange: "", // 时间日期范围
      name: "", // 组织机构回填显示
      projectItem: "", // 分部分项回填显示
      dialogFormVisible: false, // 查看编辑弹框
      dialogFormVisibleC: false, // 查看编辑弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false, // 工程分项弹框

      acceptUserDialog: false,
      userGroupTreeOptions: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      receiveUsersList: [], // 接收人列表
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      receiveData: {
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        type:0,
        userGroupId: "",
        projectItemId: "", // 分部分项id
        realname: "", //用户真实名字
        position: "" //职位
      },
      userNames: "",
      form: {
        remark: "", // 指令内容
        userGroupName: "", //组织机构名称
        processMDictId: "", //工序类型id
        processDictId: "", // 工序字典的工序id 非必传
        projectItemId: "", // 分部分项id
        projectItemName: "", //分部分项名称
        ReceiveUserid: "", // 接收人id
        receiveUserName: "", //接收人名称
        planCheckTime: "", // 计划检查时间
        commandType: "", // 指令类型
        batchNo: "",
        patrolId: "" //巡视id
      }
    };
  },
  created() {
    this._searchList();
    this.getUserList();
    this.receiveUserList();
  },
  methods: {
    query(){
        this.receiveUserList();
    },
    resetdepart(){
       this.receiveData.userGroupId="";
       this.receiveData.realname="";
       this.receiveUserList();
    },
    action() {
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      this.noticeData.pageSize = val;
      this._searchList();
    },
    getUserList() {
      api.getUserList(this.userData).then(res => {
        this.userList = res.data.data.data;
      });
    },
    // 新增接口
    add() {
      api.createNotice(this.addNoticeData).then(res => {
        if (res.data.respCode == "0") {
          this.$message({
            message: "恭喜你，发送成功",
            type: "success"
          });
        }
        this.addNoticeData="";
        this.userNames="";
        this._searchList();
        this.dialogFormVisible = false;
      });
    },
    // 查询单个请求
    async actionItem(id) {
      let { data } = await api.getNoticeDetail({ id });
      this.nowItem = data.data;
      this.noticeDataC = data.data;
      this.dialogFormVisibleC = true;
    },

    _searchList() {
      // 列表请求
      api.getList(this.noticeData).then(res => {
        if (res.data.data) {
          this.total = res.data.data.totalCount;
          this.getList = res.data.data.data;
        }
      });
    },
    //提交数据新增
    onSubmit() {
      let that = this;
      this.$refs["noticeData"].validate(valid => {
        if (valid) {
          api.projectAdd(that.projectForm).then(res => {
            this.$message({
              type: "success",
              message: that.dialogFormTitle + "完成!"
            });
            //刷新列表
            that.initProjectList();
            that.dialogFormVisible = false; //关闭弹框
          });
        }
      });
    },

    // 重置按钮
    reset() {
      this.reload();
    },
    initUserGroupTree() {
      //初始化组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTreeOptions = res.data.data;
      });
    },
    receiveUserList() {
      //接收人列表
      processInfo.getUsersByDepartId(this.receiveData).then(res => {
        this.total = res.data.data.totalCount;
        console.log(res.data.data)
        this.receiveUsersList = res.data.data.data;
      });
    },
    // userGroupOnChange(data) {
    //   //选择标段改动
    //   this.receiveData.userGroupId = data;
    //   processInfo.getUsersByDepartId(this.receiveData).then(res => {
    //     this.total = res.data.data.totalCount;
    //     this.receiveUsersList = res.data.data.data;
    //   });
    // },
    handleProjectItemOnClick(data) {
      // 分部分项选择后的数据
      this.form.projectItemId = data.id;
      this.form.projectItemName = data.name;
    },
    alertAcceptUserDialog() {
      this.acceptUserDialog = true;
      this.receiveUserList();
      this.initUserGroupTree();
    },
    //获取选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.form.receiveUserName = val.username;
    },
    toggleSelection() {
      this.formData = this.multipleSelection;
      this.acceptUserDialog = false;
      let items = this.multipleSelection;
      for (let i = 0; i < items.length; i++) {
        let that = this;
        this.addNoticeData.users += items[i].id + ",";
        this.phoneNumbers += items[i].mobilePhone + ",";
        this.userNames += items[i].username + ",";
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    }
  }
};
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

/deep/ #checkDialog .el-input .el-input__inner {
  border: none !important;
}

/deep/ #checkBox .el-textarea__inner {
  resize: none;
  border: none;
}
</style>
