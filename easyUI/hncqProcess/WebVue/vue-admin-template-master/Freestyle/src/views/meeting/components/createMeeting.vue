<template>
  <div class="crestedBox">
    <el-form
      class="reverseBox"
      ref="myApplyChangeForm"
      :model="myApplyChangeForm"
      label-width="130px"
      :rules="rules"
    >
      <el-form-item label="会议编号:" prop="meetingSummaryNumber">
        <el-input v-model="myApplyChangeForm.meetingSummaryNumber" :disabled="true" />
      </el-form-item>
      <el-form-item label="会议主题:" prop="meetingTheme">
        <el-input v-model="myApplyChangeForm.meetingTheme" placeholder="请输入会议主题" />
      </el-form-item>

      <el-form-item label="会议地点:" prop="meetingAddress">
        <el-input v-model="myApplyChangeForm.meetingAddress" placeholder="请输入会议地点" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="增减金额(万元):" prop="addDecreaseMoney">
            <el-input
              type="number"
              v-model="myApplyChangeForm.addDecreaseMoney"
              placeholder="请输入增减金额"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额计算式:" prop="formulaCalculatingAmount">
            <el-input
              type="text"
              v-model="myApplyChangeForm.formulaCalculatingAmount"
              placeholder="请输入增减计算式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="增减数量" prop="addDecreaseNumber">
            <el-input
              type="number"
              v-model="myApplyChangeForm.addDecreaseNumber"
              placeholder="请输入增减数量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量计算式" prop="quantitativeFormulas">
            <el-input
              type="text"
              v-model="myApplyChangeForm.quantitativeFormulas"
              placeholder="请输入数量计算式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="组织机构:" prop="departId">
            <el-select
              v-model="myApplyChangeForm.departId"
              placeholder="请选择"
              @change="checkDepart()"
            >
              <el-option
                v-for="item in userGroupTree"
                :key="item.id"
                :label="item.departname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分部分项:" prop="projectItemId">
            <select-tree
              clearable
              :options="projectItemTreeOption"
              :props="projectItemDefaultProps"
              v-on:noDe="handleProjectItemChange"
              ref="getSelectData"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开始桩号:">
            <el-input
              v-model="myApplyChangeForm.startStation"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束桩号:">
            <el-input
              v-model="myApplyChangeForm.endStation"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会议主持人:" prop="meetingName">
            <el-input
              placeholder="请选择会议主持人"
              v-model="myApplyChangeForm.meetingName"
              :readonly="true"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="handleUserOnclick()"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议记录人:" prop="meetingNoteName">
            <el-input
              placeholder="请选择会议记录人"
              v-model="myApplyChangeForm.meetingNoteName"
              :readonly="true"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="handleNoteUserOnclick()"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="处理人:" prop="handleUserName">
        <el-input
          placeholder="请选择审核人"
          v-model="myApplyChangeForm.handleUserName"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="handlePersonOnclick"></el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="抄送人:" prop="copyUserName">
        <el-input
          placeholder="请选择抄送人"
          v-model="myApplyChangeForm.copyUserName"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="copyPersonOnclick"></el-button>
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开会时间:" prop="meetingDatetime">
            <el-date-picker
              v-model="myApplyChangeForm.meetingDatetime"
              type="datetime"
              placeholder="选择开会时间"
              size="small"
              style="min-width:180px"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完成时间:" prop="plancompletionTime">
            <el-date-picker
              v-model="myApplyChangeForm.plancompletionTime"
              type="date"
              placeholder="选择计划时间"
              size="small"
              style="min-width:180px"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="变更理由:" prop="changeReason">
        <el-input
          :rows="4"
          type="textarea"
          v-model="myApplyChangeForm.changeReason"
          placeholder="请输入变更理由"
        />
      </el-form-item>

      <el-form-item label="现场纪要内容:" prop="sceneSummaryContent">
        <el-input
          :rows="4"
          type="textarea"
          v-model="myApplyChangeForm.sceneSummaryContent"
          placeholder="请输入纪要内容"
        />
      </el-form-item>

      <el-form-item label="备注:" prop="remarks">
        <el-input
          :rows="4"
          v-model="myApplyChangeForm.remarks"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <div style="display: flex;justify-content:flex-end">
          <el-button @click="$emit('cancel')">取 消</el-button>
          <el-button type="primary" @click="submitForm('myApplyChangeForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 选择会议记录人 -->
    <el-dialog
      width="70%"
      title="会议主持人"
      :visible.sync="dialogusersVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.realname" placeholder="请输入用户名" @change="checkRealname"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请输入职位" @change="checkPosition"></el-input>
        <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="query">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>

      </div>
      <el-table
        ref="changeSingleTable"
        :data="usersData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handeUserCheck"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="zhiwei" label="职位"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeUsersChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogusersVisible=false">取 消</el-button>
        <el-button type="primary" @click="checkUser">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 会议记录人 -->
    <el-dialog
      width="70%"
      title="会议记录人"
      :visible.sync="dialogNoteNameVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.realname" placeholder="请输入用户名" @change="checkRealname"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请输入职位" @change="checkPosition"></el-input>
         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="query">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="changeSingleTable"
        :data="noteNameData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handeNoteNameCheck"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="zhiwei" label="职位"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="noteNameTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeNoteNameChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogNoteNameVisible=false">取 消</el-button>
        <el-button type="primary" @click="checkNoteName">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 选择处理人弹框 -->
    <el-dialog
      width="70%"
      title="选择处理人"
      :visible.sync="dialogHandleFormVisible"
      class="dialogBox"
      append-to-body
    >
       <div class="topBar">
        <span>组织机构：</span>
        <el-select
          v-model="copyQueryParam.userGroupId"
          placeholder="请选择"
          @change="copyUserGroupOnClick()"
        >
          <el-option
            v-for="item in copyUserGroupTree"
            :key="item.id"
            :label="item.departname"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>用户名：</span>
        <el-input v-model="copyQueryParam.username" placeholder="请输入用户名"></el-input>

         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="queryCopy">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="resetCopy()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="changeSingleTable"
        :data="handlePersonData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handlePersonCurrentChange"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="realname" label="用户名"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="handleQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="handlerPersonTotal"
        :current-page.sync="handleQueryParam.pageNo"
        @size-change="handleNextJobSizeChange"
        @current-change="loadNextJobUserList()"
      ></el-pagination>
      <div style="margin-left:80%">
         <el-button @click="dialogHandleFormVisible=false">取 消</el-button>
         <el-button type="primary" @click="subimtHandlerPerson">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 选择抄送人弹框 -->
    <el-dialog
      width="70%"
      title="选择抄送人"
      :visible.sync="dialogCopyPersonFormVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>组织机构：</span>
        <el-select
          v-model="copyQueryParam.userGroupId"
          placeholder="请选择"
          @change="copyUserGroupOnClick()"
        >
          <el-option
            v-for="item in copyUserGroupTree"
            :key="item.id"
            :label="item.departname"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>用户名：</span>
        <el-input v-model="copyQueryParam.realname" placeholder="请输入用户名"></el-input>

         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="queryCopy">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="resetCopy()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="copyPersonData"
        tooltip-effect="dark"
        height="40vh"
        class="textList"
        @selection-change="handleCopySelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="zhiwei" label="职位" align="center"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="copyQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="copyPersonTotal"
        :current-page.sync="copyQueryParam.pageNo"
        @size-change="handleCopyPersonSizeChange"
        @current-change="initCopyUsersList()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogCopyPersonFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="subimtCopyPerson">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import changeSelectPerson from "@/components/HuixinComponents/changeSelectPerson";
import project from "@/api/project";
import user from "@/api/user";
import change from "@/api/change";
import tool from "@/utils/common.js";
export default {
  name: "createChange",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();   //这里就是设置当天后的日期不能被点击
        },
      },
      myApplyChangeForm: {
        moneyLevel: "", //金额等级
        addDecreaseMoney: "", //金额
        meetingTheme: "", //变更名称
        meetingSummaryNumber: "", // 变更编号
        departId: "", //组织机构id
        projectItemId: "", //工程分部分项i
        projectItem: "",
        userId: "", //下一个审核人id
        makeCopy: "", //抄送人id
        changeToken: "1", // 申请
        meetingDatetime: "", //会议时间
        plancompletionTime: "", // 计划完成时间
        changePosition: "", //变更位置
        meetingAddress: "", // 会议位置
        meetingHostId: "", // 会议主持人id
        meetingName: "", // 会议主持人
        meetingNoteTakerId: "", // 会议记录人id
        meetingNoteName: "", // 会议记录人
        addDecreaseNumber: "", //增减数量
        quantitativeFormulas: "", // 数量计算式
        formulaCalculatingAmount: "", // 金额计算式
        sceneSummaryContent: "", // 记要内容
        remarks: "", //备注
        startStation: "", //开始桩号
        endStation: "", //结束桩号
        handleUserName: "", //选择处理人
        copyUserName: "", //抄送人
        formulaCalculatingAmount: "", //金额计算式
        quantitativeFormulas: "", // 数量计算式
        changeReason: "" // 变更理由
      },
      type: "", // 弹框类型
      rules: {
        addDecreaseMoney: [{ required: true, message: "请输入增减金额", trigger: "blur" } ],
        meetingTheme: [ { required: true, message: "请输入会议主题", trigger: "blur" } ],
        meetingAddress: [{ required: true, message: "请输入会议地点", trigger: "change" } ],
        addDecreaseNumber: [{ required: true, message: "请输入增减数量", trigger: "blur" } ],
        departId: [{ required: true, message: "请选择组织机构", trigger: "change" }  ],
        projectItemId: [ { required: true, message: "请选择分部分项", trigger: "change" } ],
        meetingName: [{ required: true, message: "请选择会议主持人", trigger: "change" }  ],
        meetingNoteName: [ { required: true, message: "请选择会议记录人", trigger: "change" } ],
        handleUserName: [{ required: true, message: "请选择审核人", trigger: "change" } ],
        copyUserName: [{ required: true, message: "请选择抄送人", trigger: "change" } ],
        meetingDatetime: [ { required: true, message: "请选择开会时间", trigger: "change" }  ],
        plancompletionTime: [ { required: true, message: "请选择计划完成时间", trigger: "change" }  ]  
      }, //表单校验规则
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      dialogHandleFormVisible: false, //是否弹出选择备案或者审核人
      dialogCopyPersonFormVisible: false, //选择抄送人弹框
      dialogusersVisible: false, // 会议记录人
      dialogNoteNameVisible: false,
      userGroupTree: [], // 组织机构树
      projectItemTreeOption: [], // 分部分项树
      // 会议记录人
      users: {
        userGroupId: "", // 组织机构id
        realname: "", // 姓名
        position: "", // 职位
        pageNo: 1,
        pageSize: 10
      },
      usersTotal: 0,
      usersData: [], // 组织机构下的人员（主持人）
      noteNameData: [], // 记录人
      noteNameTotal: 0,
      handeNoteName: null,
      selectedHandlerPersonRow: null, //当前选中的处理人
      handleUser: null, // 当前选中的会议人
      handlePersonData: [], //处理人集合
      handlerPersonTotal: 0, //集合长度
      // 审核人
      handleQueryParam: {
        username: "", //用户名
        pageNo: 1,
        pageSize: 10,
        moneyLevel: ""
      },
      copyUserGroupTree: [], //处理人组织机构Tree
      copyPersonData: [], //处理人数据列表
      // 抄送人
      copyQueryParam: {
        userGroupId: "", //组织机构
        realname: "", //姓名
        position: "", //职位
        pageNo: 1,
        pageSize: 10
      },
      copyPersonTotal: 0, //抄送人集合长度
      multipleSelectionCopy: [] //多选抄送人
    };
  },
  components: {
    SelectTree,
    changeSelectPerson
  },
  watch: {
    myApplyChangeForm: {
      handler(newVal, oldVal) {
        if (this.$tool.isNotEmptyStr(newVal.addDecreaseMoney)) {
          this.convertMoneyToLevel(newVal.addDecreaseMoney);
        }
      },
      deep: true
    }
  },
  created() {
    this.initUserGrouptTree();
    this.getChangeName();
    this.today();
    this.nowDate();
  },
  methods: {
    queryCopy(){
        this.initCopyUsersList();
    },
     nowDate(){
          let curDate = new Date()
          const year = curDate.getFullYear()
          const month = (curDate.getMonth() + 1) > 9 ? `${curDate.getMonth() + 1}` : `0${curDate.getMonth() + 1}`
          const day = curDate.getDate() > 9 ? curDate.getDate() : `0${curDate.getDate()}`
          const hour = curDate.getHours() > 9 ? curDate.getHours() : `0${curDate.getHours()}`
          const min = curDate.getMinutes() > 9 ? curDate.getMinutes() : `0${curDate.getMinutes()}`
          const sec = curDate.getSeconds() > 9 ? curDate.getSeconds() : `0${curDate.getSeconds()}`
          // return  `${year}-${month}-${day} ${hour}:${min}:${sec}`
          let time = `${year}-${month}-${day} ${hour}:${min}:${sec}`
          console.log(time);
          this.myApplyChangeForm.meetingDatetime = time
     },


    resetCopy(){
        this.copyQueryParam.userGroupId = '';
        this.copyQueryParam.realname = '';
        this.copyQueryParam.username = '';
        this.initCopyUsersList();
    },
    query(){
        this.initDparentUser();
    },
    reset(){
        this.users.realname = "";
        this.users.position ="";
        this.initDparentUser();
    },
    today(){
         let nowTime = new Date();
        //  this.myApplyChangeForm.meetingDatetime = nowTime.toLocaleDateString().replace(/\//g, "-");
         this.myApplyChangeForm.plancompletionTime = nowTime.toLocaleDateString().replace(/\//g, "-");
         
    },
    //记要名称
    getChangeName() {
      let currentDate = tool.formatDate(new Date(), "yyyyMMddHHmmss");
      this.myApplyChangeForm.meetingSummaryNumber = "BGHYJY-" + currentDate;
    },
    initUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    // 获取组织机构id
    checkDepart() {
      let orgId = this.myApplyChangeForm.departId;
      this.users.userGroupId = this.myApplyChangeForm.departId;
      // 分部分项数据
      Organization.getProjectItemFromLayer({
        userGroupId: orgId,
        pId: "0"
      }).then(res => {
        this.projectItemTreeOption = res.data.data;
        this.$refs.getSelectData.labelModel = "";
      });
      //
    },
    handleProjectItemChange(data) {
      // 工程分部分项id
      this.myApplyChangeForm.projectItemId = data.id;
      this.myApplyChangeForm.projectItem = data.name;
      this.getStationByProjectItemId(data.id);
    },
    getStationByProjectItemId(id) {
      project.projectCheck(id).then(res => {
        if (
          res.data.data.startStation !== null &&
          res.data.data.startStation !== "" &&
          res.data.data.startStation !== undefined &&
          res.data.data.endStation !== null &&
          res.data.data.endStation !== "" &&
          res.data.data.endStation !== undefined
        ) {
          this.myApplyChangeForm.endStation = res.data.data.endStation;
          this.myApplyChangeForm.startStation = res.data.data.startStation;
        }
      });
    },
    //获取标段下的人员（会议记录人，主持人）
    initDparentUser() {
      Organization.getUserName(this.users).then(res => {
        this.usersData = res.data.data.data;
        this.usersTotal = res.data.data.totalCount;
        this.noteNameData = res.data.data.data;
        this.noteNameTotal = res.data.data.totalCount;
      });
    },
    checkRealname() {
      this.initDparentUser();
    },
    checkPosition() {
      this.initDparentUser();
    },
    handleUserOnclick() {
      this.dialogusersVisible = true;
      this.initDparentUser();
    },
    handeUsersChange(val) {
      this.users.pageSize = val;
      this.initDparentUser();
    },
    handeUserCheck(val) {
      this.handleUser = val;
    },
    checkUser() {
      this.myApplyChangeForm.meetingName = this.handleUser.username;
      this.myApplyChangeForm.meetingHostId = this.handleUser.id;
      this.dialogusersVisible = false; //弹框消失
    },
    // 会议记录人
    handleNoteUserOnclick() {
      this.dialogNoteNameVisible = true;
      this.initDparentUser();
    },
    checkNoteName() {
      this.myApplyChangeForm.meetingNoteName = this.handeNoteName.username;
      this.myApplyChangeForm.meetingNoteTakerId = this.handeNoteName.id;
      this.dialogNoteNameVisible = false;
    },
    handeNoteNameCheck(val) {
      this.handeNoteName = val;
    },
    handeNoteNameChange(val) {
      this.users.pageSize = val;
      this.initDparentUser();
    },

    handlePersonOnclick() {
      //选择处理人弹框
      this.dialogHandleFormVisible = true;
      this.loadNextJobUserList();
      this.initCopyUserGrouptTree();
    },
    loadNextJobUserList() {
      //返回所有的处理人
      user.getNextJobUserByCurrentId(this.handleQueryParam).then(res => {
        this.handlerPersonTotal = res.data.data.totalCount;
        this.handlePersonData = res.data.data.data;
        console.log(this.handlePersonData)
      });
    },
    handleNextJobSizeChange(val) {
      this.handleQueryParam.pageSize = val;
      this.loadNextJobUserList();
    },
    handlePersonCurrentChange(val) {
      this.selectedHandlerPersonRow = val;
    },
    subimtHandlerPerson() {
      //返回处理人对象
     
      this.myApplyChangeForm.handleUserName = this.selectedHandlerPersonRow.realname;
      this.myApplyChangeForm.userId = this.selectedHandlerPersonRow.id;
      this.dialogHandleFormVisible = false; //弹框消失
    },
    copyPersonOnclick() {
      //选择抄送人弹框
      this.dialogCopyPersonFormVisible = true;
      this.initCopyUserGrouptTree();
    },
    initCopyUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.copyUserGroupTree = res.data.data;
        //默认选择第一个
        this.copyQueryParam.userGroupId = res.data.data[0].id;
        this.initCopyUsersList();
      });
    },
    copyUserGroupOnClick() {
      //组织机构筛选框
      this.initCopyUsersList();
      this.initDparentUser();
    },
    initCopyUsersList() {
      //初始化抄送人列表
      user.getUserListByDepartId(this.copyQueryParam).then(res => {
        this.copyPersonData = res.data.data.data;
        this.copyPersonTotal = res.data.data.totalCount;
      });
    },
    handleCopyPersonSizeChange(val) {
      this.copyQueryParam.pageSize = val;
      this.initCopyUsersList();
    },
    handleCopySelectionChange(item) {
      this.multipleSelectionCopy = item;
    },
    subimtCopyPerson() {
      //确认抄送人
      let ids = "",
        names = "";
      for (let i = 0; i < this.multipleSelectionCopy.length; i++) {
        if (ids.length > 0) {
          ids += ",";
        }
        ids += this.multipleSelectionCopy[i].id;

        if (names.length > 0) {
          names += ",";
        }
        names += this.multipleSelectionCopy[i].username;
      }
      this.myApplyChangeForm.copyUserName = names;
      this.myApplyChangeForm.makeCopy = ids;
      this.dialogCopyPersonFormVisible = false;
    },
    convertMoneyToLevel(money) {
      // 更改申请等级
      if (Number(money) > 0 && Number(money) < 5) {
        this.myApplyChangeForm.moneyLevel = "one_level";
      } else if (Number(money) >= 5 && Number(money) < 20) {
        this.myApplyChangeForm.moneyLevel = "two_level";
      } else if (Number(money) >= 20 && Number(money) < 50) {
        this.myApplyChangeForm.moneyLevel = "three_level";
      } else if (Number(money) >= 50) {
        this.myApplyChangeForm.moneyLevel = "four_level";
      }
      this.handleQueryParam.moneyLevel = this.myApplyChangeForm.moneyLevel;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          change.applyAddList(this.myApplyChangeForm).then(res => {
            this.$message({
              message: "创建成功",
              type: "success"
            });
            localStorage.setItem("orgId",this.myApplyChangeForm.departId);
            this.myApplyChangeForm = "";
            this.$emit("cancel"); //关闭弹框
            this.$emit("comfirm"); //确认
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.crestedBox {
  height: 60vh;
  padding-right: 30px;
  overflow-x: hidden;
}
/deep/.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    margin-top: 10px;
}
</style>
