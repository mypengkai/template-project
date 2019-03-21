<template>
  <div>
    <el-form :model="form" label-width="120px" :rules="rules">
      <div style="widht:40%">
        <el-form-item label="菜单名称" prop="functionName">
          <el-input v-model="form.functionName"></el-input>
        </el-form-item>

        <el-form-item label="菜单顺序" prop="functionOrder">
          <el-input type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' v-model="form.functionOrder"></el-input>
        </el-form-item>

        <el-form-item label="菜单等级">
          <el-input v-model="form.functionLevel"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem!=='add'" label="父ID">
          <el-input v-model="form.pName" :disabled="true">
            <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="子集数量">
          <el-input v-model="form.childcount"></el-input>
        </el-form-item>

        <el-form-item label="菜单地址" prop="functionUrl">
          <el-input v-model="form.functionUrl"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>
    <!-- 菜单树形表单 -->
    <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="menuTreeList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="menuChange" :props="menuTree">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/resource.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        pName: "", // 回填父ID名字
        pId: "", //父菜单id
        childcount: "", // 子集数量
        functionLevel: "", // 菜单等级
        functionName: "", // 菜单名称
        functionOrder: "", // 菜单顺序
        functionUrl: "" // 菜单地址
      },
      menuTreeList: [],
      // 菜单树显示
      menuTree: {
        children: "children",
        label: "functionName"
      },
      rules: {
        functionName: [{ required: true, message: "必填项", trigger: "blur" }],
        functionOrder: { required: true, message: "必填项", trigger: "blur" },
        functionUrl: [{ required: true, message: "必填项", trigger: "blur" }]
      }, //表单校验规则
      dialogFormVisible: false,
      projectVisible: false // 菜单弹框
    };
  },
  created() {
    this.initForm();
    this.resourceTree();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") {
        this.pId && (this.form.pId = this.pId || 0);
        return;
      }
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      // 树形列表
    },
    resourceTree() {
      api.menuList().then(res => {
        this.menuTreeList = res.data.data;
      });
    },
    // 菜单树显示
    menuChange(data, checked, indeterminate) {
      this.form.pId = data.id;
      this.form.pName = data.functionName;
      this.projectVisible = false;
    },
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.menuAdd(this.form).then(res => {
          this.$emit("comfirm");
          this.$message({
            type: "success",
            message: "已完成!"
          });
          this.$emit("cancel");
        });
      // 查看单个 修改
      this.nowItem != "add" &&
        api.menuAdd(this.form).then(res => {
          this.$emit("comfirm");
          this.$message({
            type: "success",
            message: "已完成!"
          });
          this.$emit("cancel");
        });
    }
  }
};
</script>

<style>
</style>
