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

        <el-form-item label="父ID">
          <el-input v-model="form.pId"></el-input>
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
  </div>
</template>

<script>
import api from "@/api/resource.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        pId: "", //父菜单id
        childcount: "", // 子集数量
        functionLevel: "", // 菜单等级
        functionName: "", // 菜单名称
        functionOrder: "", // 菜单顺序
        functionUrl: "" // 菜单地址
      },
      rules: {
        functionName: [{ required: true, message: "必填项", trigger: "blur" }],
        functionOrder: { required: true, message: "必填项", trigger: "blur" },
        functionUrl: [{ required: true, message: "必填项", trigger: "blur" }]
      } //表单校验规则
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
    },
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.menuAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个 修改
      this.nowItem != "add" &&
        api.menuAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
    }
  }
};
</script>

<style>
</style>
