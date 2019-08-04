<template>
  <div>
    <el-form class="reverseBox" ref="myApplyChangeForm" :model="myApplyChangeForm" label-width="130px" :rules="rules">
      <el-form-item label="变更名称:" prop="changeName">
        <el-input v-model="myApplyChangeForm.changeName" placeholder="请输入变更名称" clearable/>
      </el-form-item>
      <el-form-item label="变更金额:" prop="amountMoney">
        <el-input v-model="myApplyChangeForm.amountMoney" placeholder="请输入变更金额" clearable/>
      </el-form-item>
      <el-form-item label="组织机构:">
        <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleUserGroupOnClick"/>
      </el-form-item>
      <el-form-item label="分部分项:">
        <select-tree clearable :options="projectItemTree" :props="projectItemDefaultProps" v-on:noDe="handleProjectItemChange"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始桩号:">
            <el-input v-model="showFormValue.startStation" placeholder="请输入开始桩号" clearable :readonly="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束桩号:">
            <el-input v-model="showFormValue.endStation" placeholder="请输入结束桩号" clearable :readonly="true"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核人:">
        <el-input placeholder="请选择审核人" v-model="showFormValue.handleUserName" :readonly="true" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handlePersonOnclick"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="抄送人:">
        <el-input placeholder="请选择抄送人" v-model="showFormValue.copyUserName" :readonly="true" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="copyPersonOnclick"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="会议时间:">
        <el-date-picker v-model="myApplyChangeForm.meetingTime" type="datetime" placeholder="选择会议时间" size="small" style="min-width:200px"
                        value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="会议地点:" prop="meetingPlace">
        <el-input v-model="myApplyChangeForm.meetingPlace" placeholder="请输入会议地点" clearable/>
      </el-form-item>
      <el-form-item label="备注:" prop="remarks">
        <el-input :rows="4" v-model="myApplyChangeForm.remarks" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('myApplyChangeForm')">申 请</el-button>
        <el-button @click="$emit('cancel')">取 消</el-button>
      </el-form-item>

    </el-form>


    <!-- 选择处理人弹框 -->
    <el-dialog width="70%" title="选择处理人" :visible.sync="dialogHandleFormVisible" class="dialogBox" append-to-body>
      <el-table ref="changeSingleTable" :data="handlePersonData" border highlight-current-row height="40vh" class="textList" @current-change="handlePersonCurrentChange">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="realname" label="用户名"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination class="pageList mt1" background :page-sizes="[15,30,60,100]" :page-size="handleQueryParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="handlerPersonTotal" :current-page.sync="handleQueryParam.pageNo" @size-change="handleNextJobSizeChange" @current-change="loadNextJobUserList()"></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subimtHandlerPerson">确 认</el-button>
        <el-button @click="dialogHandleFormVisible=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择抄送人弹框 -->
    <el-dialog width="70%" title="选择抄送人" :visible.sync="dialogCopyPersonFormVisible" class="dialogBox" append-to-body>
      <div class="topBar">
        <span>组织机构: </span>
        <select-tree ref="copyPersonSelectTree" :options="copyUserGroupTree" :props="userGroupDefaultProps" @noDe="copyUserGroupOnClick"/>
      </div>
      <el-table ref="multipleTable" :data="copyPersonData" tooltip-effect="dark" height="40vh" class="textList" @selection-change="handleCopySelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="zhiwei" label="职位" align="center"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination class="pageList mt1" background :page-sizes="[15,30,60,100]" :page-size="copyQueryParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="copyPersonTotal" :current-page.sync="copyQueryParam.pageNo" @size-change="handleCopyPersonSizeChange" @current-change="initCopyUsersList()"></el-pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subimtCopyPerson">确 认</el-button>
        <el-button @click="dialogCopyPersonFormVisible=false">取 消</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
import changeSelectPerson from "@/components/HuixinComponents/changeSelectPerson"
import project from "@/api/project";
import user from '@/api/user'
import change from '@/api/change'
export default {
  name: "createChange",
  data(){
    const checkAmountMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("变更金额不能为空"));
      } else {
        const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的变更金额"));
        }
      }
    };
    return {
      myApplyChangeForm: {
        moneyLevel: "",  //预估金额
        amountMoney: "",  //金额
        changeName: "",  //变更名称
        departId: "",  //组织机构id
        projectItemId: "",  //工程分部分项id
        changeId: "",  //变更id
        changeNumber: "",
        userId: "",   //下一个审核人
        makeCopy: "",   //抄送人
        changeToken: "1",
        meetingTime: "",  //会议时间
        meetingPlace: "", //会议地点
        remarks: "",  //备注
      },
      rules: {
        changeName: [{ required: true, message: "请输入预估金额", trigger: "blur" }],
        amountMoney: [{ required: true, trigger: "blur", validate: checkAmountMoney }]
      }, //表单校验规则
      userGroupDefaultProps: {   // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {  // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      dialogHandleFormVisible: false,   //是否弹出选择备案或者审核人
      dialogCopyPersonFormVisible: false,   //选择抄送人弹框
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      showFormValue: {   //显示form值
        startStation: "",  //开始桩号
        endStation: "", //结束桩号
        handleUserName: "",   //选择处理人
        copyUserName: ""   //抄送人
      },
      selectedHandlerPersonRow: null,  //当前选中的处理人
      handlePersonData: [],   //处理人集合
      handlerPersonTotal: 0,  //集合长度
      handleQueryParam: {
        username: "",  //用户名
        pageNo: 1,
        pageSize: 15,
        moneyLevel: ""
      },
      copyUserGroupTree: [],  //处理人组织机构Tree
      copyPersonData: [],  //处理人数据列表
      copyQueryParam: {
        userGroupId: "",  //组织机构
        realname: "",  //姓名
        position: "",  //职位
        pageNo: 1,
        pageSize: 15
      },
      copyPersonTotal: 0,  //抄送人集合长度
      multipleSelectionCopy: []  //多选抄送人
    }
  },
  components: {
    SelectTree,
    changeSelectPerson
  },
  props: {
    nowItem: {
      type: String,
      required: true
    }
  },
  watch: {
    nowItem(newVal, oldVal){

    },
    myApplyChangeForm: {
      handler(newVal, oldVal){
        if(this.$tool.isNotEmptyStr(newVal.amountMoney)){
          this.convertMoneyToLevel(newVal.amountMoney);
        }
      },
      deep: true
    }
  },
  created(){
    this.initUserGrouptTree();
  },
  methods: {
    initUserGrouptTree() {  // 组织机构树
      Organization.organizateTree().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    handleUserGroupOnClick(data) {  // 组织机构树点击事件
      this.projectItemTree=[];  //清空数据
      if (data.children.length === 0) {
        this.myApplyChangeForm.departId = data.id
        project.projectList({orgId: data.id}).then(res => {
          this.projectItemTree = res.data.data
        });
      } else {
        this.$message({
          message: '施工单位下才有工程分部分项'
        })
        return false
      }
    },
    handleProjectItemChange(data) {   // 工程分部分项id
      this.myApplyChangeForm.projectItemId = data.id;
      this.getStationByProjectItemId(data.id);
    },
    getStationByProjectItemId(id){
      project.projectCheck(id).then(res=>{
        if(res.data.data.startStation!==null && res.data.data.startStation!=="" && res.data.data.startStation!==undefined &&
           res.data.data.endStation!==null && res.data.data.endStation!=="" && res.data.data.endStation!==undefined){
          this.showFormValue.endStation=res.data.data.endStation
          this.showFormValue.startStation=res.data.data.startStation
        }
      });
    },
    handlePersonOnclick(){   //选择处理人弹框
      this.dialogHandleFormVisible=true;
      this.loadNextJobUserList();
    },
    loadNextJobUserList(){  //返回所有的处理人
      user.getNextJobUserByCurrentId(this.handleQueryParam).then(res=>{
        this.handlerPersonTotal = res.data.data.totalCount;
        this.handlePersonData = res.data.data.data;
      })
    },
    handleNextJobSizeChange(val){
      this.handleQueryParam.pageSize=val;
      this.loadNextJobUserList();
    },
    handlePersonCurrentChange(val){
      this.selectedHandlerPersonRow=val;
    },
    subimtHandlerPerson(){  //返回处理人对象
      this.showFormValue.handleUserName=this.selectedHandlerPersonRow.realname;
      this.myApplyChangeForm.userId=this.selectedHandlerPersonRow.id;
      this.dialogHandleFormVisible=false;  //弹框消失
    },
    copyPersonOnclick(){   //选择抄送人弹框
      this.dialogCopyPersonFormVisible=true;
      this.initCopyUserGrouptTree();
    },
    initCopyUserGrouptTree() {  // 组织机构树
      Organization.organizateTree().then(res => {
        this.copyUserGroupTree = res.data.data;
        //默认选择第一个
        this.copyQueryParam.userGroupId=res.data.data[0].id;
        this.$refs.copyPersonSelectTree.labelModel=res.data.data[0].name;
        this.initCopyUsersList();
      });
    },
    copyUserGroupOnClick(item){  //组织机构筛选框
      this.copyQueryParam.userGroupId=item.id;
      this.initCopyUsersList();
    },
    initCopyUsersList(){  //初始化抄送人列表
      user.getUserListByDepartId(this.copyQueryParam).then(res=>{
        this.copyPersonData=res.data.data.data
        this.copyPersonTotal=res.data.data.totalCount;
      })
    },
    handleCopyPersonSizeChange(val){
      this.copyQueryParam.pageSize=val;
      this.initCopyUsersList()
    },
    handleCopySelectionChange(item){
      this.multipleSelectionCopy=item;
    },
    subimtCopyPerson(){  //确认抄送人
      let ids="", names="";
      for(let i=0;i<this.multipleSelectionCopy.length;i++){
        if(ids.length > 0) {
          ids += ','
        }
        ids += this.multipleSelectionCopy[i].id

        if(names.length > 0) {
          names += ','
        }
        names += this.multipleSelectionCopy[i].username
      }
      this.showFormValue.copyUserName=names;
      this.myApplyChangeForm.makeCopy=ids;
      this.dialogCopyPersonFormVisible=false;
    },
    convertMoneyToLevel(money){  // 更改申请等级
      if(Number(money)>0 && Number(money)<5){
        this.myApplyChangeForm.moneyLevel="one_level";
      }else if(Number(money)>=5 && Number(money)<20){
        this.myApplyChangeForm.moneyLevel="two_level";
      }else if(Number(money)>=20 && Number(money)<50){
        this.myApplyChangeForm.moneyLevel="three_level";
      }else if(Number(money)>=50){
        this.myApplyChangeForm.moneyLevel="four_level";
      }
      this.handleQueryParam.moneyLevel=this.myApplyChangeForm.moneyLevel;
    },
    submitForm(form){  //提交
      this.$refs[form].validate((valid) => {
        if(valid){
          if(!this.$tool.isNotEmptyStr(this.myApplyChangeForm.departId)){
            this.$message({
              message: "组织机构必须选择",
              type: "warn"
            });
            return false;
          }
          if(!this.$tool.isNotEmptyStr(this.myApplyChangeForm.projectItemId)){
            this.$message({
              message: "分部分项必须选择",
              type: "warn"
            });
            return false;
          }
          if(!this.$tool.isNotEmptyStr(this.myApplyChangeForm.userId)){
            this.$message({
              message: "审核人必须选择",
              type: "warn"
            });
            return false;
          }
          if(!this.$tool.isNotEmptyStr(this.myApplyChangeForm.makeCopy)){
            this.$message({
              message: "抄送人必须选择",
              type: "warn"
            });
            return false;
          }
          change.createChangeApply(this.myApplyChangeForm).then(res=>{
            this.$message({
              message: "申请成功",
              type: "success"
            });
            this.$emit("cancel");   //关闭弹框
            this.$emit("comfirm");   //确认
          })

        }
      });
    }
  }
}
</script>

<style scoped>

</style>
