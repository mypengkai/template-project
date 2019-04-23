<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="菜单名称：" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="类型：" >
        <el-radio v-model="ruleForm.type" label="menu">菜单</el-radio>
        <el-radio v-model="ruleForm.type" label="button">按钮</el-radio>
    </el-form-item>
    <el-form-item label="父菜单名称：" prop="ID" v-if="this.flag">
      <el-input :disabled="this.flag" :placeholder="this.parent"></el-input>
    </el-form-item>
    <el-form-item label="菜单标题：" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="icon图标：" prop="icon">
      <el-input v-model="ruleForm.icon"></el-input>
    </el-form-item>
    <el-form-item label="菜单分支：" prop="component">
      <el-input v-model="ruleForm.component"></el-input>
    </el-form-item>
    <el-form-item label="菜单路径：" prop="path">
      <el-input v-model="ruleForm.path"></el-input>
    </el-form-item>
    <el-form-item label="设备类型：" prop="Mark">
      <el-radio-group v-model="ruleForm.Mark">
        <el-radio label="1">电脑端</el-radio>
        <el-radio label="2">移动端</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import api from "@/api/resource.js";
export default {
  props: ["nowItem", "flag"],
  data() {
    return {
      
      ruleForm: {
       
        name: "", // 菜单名称
        pId: "", //父菜单id
        title: "", //菜单标题
        icon: "", //icon图标
        component: "", //组件
        path: "", //菜单路径
        Mark: "", //设备标识
        id: "",
        type: "",
        pName: ""
      },
      parent: "",
      // 菜单树显示
      menuTree: {
        children: "children",
        label: "functionName"
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        ID: [{ required: false, message: "请输入父级菜单ID", trigger: "blur" }],
        title: [{ required: true, message: "请输入菜单标题", trigger: "blur" }],
        icon: [{ required: true, message: "请输入icon图标", trigger: "blur" }],
        component: [
          { required: true, message: "请输入菜单分支", trigger: "blur" }
        ],
        Mark: [{ required: true, message: "请选择设备类型", trigger: "blur" }],
        path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }]
      },
      dialogFormVisible: false,
      projectVisible: false // 菜单弹框
    };
  },
  methods: {

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.resourceTree();
          // 新增
          this.nowItem == "add" &&
            api.menuAdd(this.ruleForm).then(res => {
              this.$emit("comfirm");
              this.$message({
                type: "success",
                message: "已完成!"
              });
              this.$emit("cancel");
            });
          // 查看单个 修改
          this.nowItem != "add" &&
            api.menuAdd(this.ruleForm).then(res => {
              this.$emit("comfirm");
              this.$message({
                type: "success",
                message: "已完成!"
              });
              this.$emit("cancel");
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    initForm() {
      if (this.nowItem == "add") {
        this.pId && (this.form.pId = this.pId || 0);
        return;
      }
      this.ruleForm = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      console.log(this.ruleForm)

      // 树形列表
      this.parent = this.ruleForm.pName;
    },
    resourceTree() {
      api.menuList(this.ruleForm.type).then(res => {
        // console.log(res.data.data,111)
        this.menuTreeList = res.data.data;
      });
    },
    // 菜单树显示
    menuChange(data, checked, indeterminate) {
      this.form.pId = data.id;
      this.form.pName = data.functionName;
      this.projectVisible = false;
    }
  },
  created() {
    this.initForm();
  },
  destroyed() {}
};
</script>
<style>
</style>
