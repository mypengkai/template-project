<template>
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
      <select-tree clearable :options="projectItemTree" :props="projectItemDefaultProps" v-on:noDe="handleUserGroupOnClick"/>
    </el-form-item>
  </el-form>
</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
import project from "@/api/project";
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
        amountMoney: [{ required: true, trigger: "blur", validate: checkAmountMoney }],
        departId: [{ required: true, message: "请选择组织机构id", trigger: "change" }]
      }, //表单校验规则
      userGroupDefaultProps: {   // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {  // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
    }
  },
  components: {
    SelectTree
  },
  props: {
    nowItem: {
      type: String,
      required: true
    }
  },
  watch: {
    nowItem(newVal, oldVal){

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
    },
  }
}
</script>

<style scoped>

</style>
