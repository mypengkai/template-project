<template>
  <div class="p20">
    <!-- 选项栏 -->
    <div class="topBar">
      <span>组织机构:</span>
      <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
        <el-option
          v-for="item in userGroupOption"
          :key="item.id"
          :label="item.departname"
          :value="item.id"
        ></el-option>
      </el-select>
      <span>分部分项:</span>
      <select-tree
        clearable
        :options="projectItemOptions"
        ref="getSelectData"
        :props="projectItemDefaultProp"
        v-on:noDe="projectItemOnClick"
      />
      <span>创建日期:</span>
      <el-date-picker
        v-model="sendData.starttime"
        type="date"
        placeholder="选择日期"
        size="small"
        style="min-width:180px"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      ></el-date-picker>-
      <el-date-picker
        v-model="sendData.endtime"
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
          @click="_searchList()"
        >查询</el-button>
        <el-button
          type="primary"
          class="pan-btn light-blue-btn"
          icon="el-icon-refresh"
          @click="reset()"
        >重置</el-button>
      </div>
    </div>
    <!-- 查询列表 -->
    <el-table border class="textList" :data="sendCommandList" style="width: 100%" height="72vh">
      <el-table-column prop="projectitem" label="分部分项"></el-table-column>
      <el-table-column prop="station" label="桩号" align="center" width="150"></el-table-column>
      <el-table-column prop="launchPerson" label="发起人" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="发起时间" width="150" align="center"></el-table-column>
      <el-table-column prop="nowUser" label="处理人" width="100" align="center"></el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.state=='-1'">已发起,待处理</template>
          <template v-else-if="scope.row.state=='-2'">已修改,待处理</template>
          <template v-else-if="scope.row.state=='0'">已转发</template>
          <template v-else-if="scope.row.state=='1'">已复核</template>
          <template v-else-if="scope.row.state=='2'">已完成,待复核</template>
          <template v-else-if="scope.row.state=='3'">已退回,待修改</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            content="查看"
            circle
            @click="actionItem(scope.row.commandId)"
          ></el-button>
          <!-- <el-button type="success" icon="el-icon-edit" size="small" content="处理" circle @click="editItem(scope.row.commandId)" v-if="scope.row.state !='3'"></el-button>  -->
        <el-tooltip class="item" effect="dark" content="退回" placement="top-start">
          <el-button
            type="danger"
            icon="el-icon-edit"
            size="small"
            circle
            @click="returnItem(scope.row.commandId)"
            v-if="(scope.row.state =='-1'|| scope.row.state =='0' || scope.row.state =='-2')"
          ></el-button>
        </el-tooltip>
        
        <el-tooltip class="item" effect="dark" content="转发" placement="top-start">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            circle
            @click="transpoandItem(scope.row.commandId)"
            v-if="(scope.row.state =='-1'|| scope.row.state =='0' || scope.row.state =='-2')"
          ></el-button>
        </el-tooltip>

       <el-tooltip class="item" effect="dark" content="完成" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            circle
            @click="doneItem(scope.row.commandId)"
            v-if="(scope.row.state =='-1'|| scope.row.state =='0' || scope.row.state =='-2')"
          ></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="复核" placement="top-start">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            circle
            @click="officerItem(scope.row.commandId)"
            v-if="scope.row.state =='2' "
          ></el-button>
        </el-tooltip> 
         
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      class="pageList mt1"
      background
      :current-page.sync="sendData.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="sendData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="_searchList()"
      :total="total"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 编辑弹框 -->
    <el-dialog width="70%" class="dialogBox" title="指令查看" :visible.sync="dialogHandVisible">
      <orderInstruct :nowItem="nowItem"></orderInstruct>
    </el-dialog>
    <!-- 指令处理 -->
    <!-- <el-dialog width="70%" class="dialogBox" title="指令处理" :visible.sync="dialogFormVisible">
         <handInstruct :nowItem="nowItem" @cancel="dialogFormVisible=false" @comfirm="reset()"></handInstruct>
    </el-dialog> -->

    <!-- 指令退回 -->
    <el-dialog width="50%" class="dialogBox" title="指令退回" :visible.sync="dialogRenterVisible">
       <returnInstuct :nowItem="nowItem" @cancel="dialogRenterVisible=false" @comfirm="_searchList()" v-if="flag"></returnInstuct> 
    </el-dialog>
    <!-- 指令转发 -->
    <el-dialog width="50%" class="dialogBox" title="指令转发" :visible.sync="dialogTranspondVisible">
      <transpondInstruct :nowItem="nowItem" @cancel="dialogTranspondVisible=false" @comfirm="_searchList()" v-if="flag"></transpondInstruct>
    </el-dialog>
    <!-- 指令完成 -->
    <el-dialog width="50%" class="dialogBox" title="指令完成" :visible.sync="dialogDoneVisible">
      <doneInstrcut :nowItem="nowItem" @cancel="dialogDoneVisible=false" @comfirm="_searchList()" v-if="flag"></doneInstrcut>
    </el-dialog>
    <!-- 指令复核 -->
    <el-dialog width="50%" class="dialogBox" title="指令复核" :visible.sync="dialogOfficerVisible">
       <officeInstruct :nowItem="nowItem" @cancel="dialogOfficerVisible=false" @comfirm="_searchList()" v-if="flag"></officeInstruct>
    </el-dialog>
  </div>
</template>

<script>
import checkBox from "./components/checkBox";
import api from "@/api/instruct.js";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import project from "@/api/project.js";
import Organization from "@/api/Organization.js";
import orderInstruct from "./components/orderInstruct";
import handInstruct from "./components/handInstruct";

import returnInstuct from "./components/returnInstruct";
import transpondInstruct from "./components/transpondInstruct";
import doneInstrcut from "./components/doneInstruct"
import officeInstruct from "./components/officeInstruct"

export default {
  inject: ["reload"],
  components: {
    checkBox,
    SelectTree,
    orderInstruct,
    handInstruct,
    returnInstuct,
    transpondInstruct,
    doneInstrcut,
    officeInstruct
  },
  data() {
    return {
      sendCommandList: [], // 当前列表
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProp: {
        //工程分部分项tree    props
        children: "children",
        label: "projectItem"
      },
      userGroupOption: [], // 组织机构树
      projectItemOptions: [], //   工程分部分项List   条件选择
      projectItemTreeOption: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        orgId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
        // Mark: 2 //  标记：1：发送、2：接收
      },
      modifyData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        starttime: "", // 开始时间
        endtime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      nowItem: "",
      nowUserId: "",
      flag: false,
      commandId: "",
      userGroupId: "",
      dialogHandVisible: false,
      dialogFormVisible: false, // 查看编辑弹框
      dialogRenterVisible:false, // 退回
      dialogTranspondVisible:false,  // 转发
      dialogDoneVisible:false,      // 完成
      dialogOfficerVisible:false,   // 复核
    };
  },
  created() {
    this.initUserGroup();
    this.getinit();
    this.nowUserId = localStorage.getItem("userId");
  },
  methods: {
    // 退回
    returnItem(id){
         api.searchOne({ id:id }).then(res=>{
              this.nowItem = res.data.data;
              this.dialogRenterVisible = true
          })
          this.flag = false;
          this.$nextTick(()=>{
              this.flag = true;
          })
        
    },
    //转发
    transpoandItem(id){
       api.searchOne({ id:id }).then(res=>{
              this.nowItem = res.data.data;
              this.dialogTranspondVisible = true
          })
          this.flag = false;
          this.$nextTick(()=>{
              this.flag = true;
          })
    },
    // 完成
    doneItem(id){
        api.searchOne({ id:id }).then(res=>{
              this.nowItem = res.data.data;
              this.dialogDoneVisible = true
          })
          this.flag = false;
          this.$nextTick(()=>{
              this.flag = true;
          })
    },
    // 复核
    officerItem(id){
        api.searchOne({ id:id }).then(res=>{
              this.nowItem = res.data.data;
               this.dialogOfficerVisible = true
          })
         this.flag = false;
          this.$nextTick(()=>{
              this.flag = true;
          })
    },

    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this.getinit();
    },
    actionItem(id) {
      api.searchOne({ id: id }).then(res => {
        this.nowItem = res.data.data;
        this.dialogHandVisible = true;
      });
    },
    // editItem(id) {
    //   api.searchOne({ id: id }).then(res => {
    //     this.nowItem = res.data.data;
    //     this.dialogFormVisible = true;
    //   });
    // },
    getinit() {
      api.myCommandReceive(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.sendCommandList = res.data.data.data;
      });
    },
    _searchList() {
      // 列表请求
      this.getinit();
    },
    initUserGroup() {
      //初始化组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupOption = res.data.data;
      });
    },
    userGroupOnChange(data) {
      // 组织机构下拉树
      this.sendData.orgId = data;
      this.sendData.departId = data;
      Organization.getProjectItemFromLayer({
        userGroupId: data,
        pId: "0"
      }).then(res => {
        this.projectItemOptions = res.data.data;
        this.$refs.getSelectData.labelModel = "";
      });
    },
    loadNextNode(node, resolve) {
      //异步获取下一级节点数据
      if (node.level > 0) {
        Organization.getProjectItemFromLayer({
          userGroupId: this.selectedUserGroup,
          pId: node.data.id
        }).then(res => {
          resolve(res.data.data);
        });
      }
    },
    projectItemOnClick(data) {
      // 分部分项选择后的数据
      this.sendData.projectItemId = data.id;
    },

    handleUserGroupClickChange(data) {
      // 组织机构下拉树
      this.sendData.departId = data.id;
      project.projectList(this.sendData).then(res => {
        this.projectItemTreeOption = res.data.data;
      });
    },
    handleProjectItemClickChange(data) {
      // 工程分部分项树
      this.sendData.projectItemId = data.id;
    },
    reset() {
      // 重置按钮
      this.reload();
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

.rowBox {
  float: left;
}
</style>
