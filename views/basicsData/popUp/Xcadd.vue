<template>
    <div>
        <el-form :model="form" :rules="rules">
            <el-form-item label="所属机构" :label-width="formLabelWidth" prop="org">
                <el-input v-model="form.org"></el-input>
            </el-form-item>

            <el-form-item label="工程分部分项" :label-width="formLabelWidth" prop="region">
                <el-select v-model="form.region" placeholder="请选择">
                    <el-option label="是" value=1></el-option>
                    <el-option label="否" value=0></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="起始桩号" :label-width="formLabelWidth" prop="start">
                <el-input v-model="form.start"></el-input>
            </el-form-item>

            <el-form-item label="终止桩号" :label-width="formLabelWidth">
                <el-input v-model="form.termination"></el-input>
            </el-form-item>

            <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input v-model="form.longitude"></el-input>
            </el-form-item>

            <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input v-model="form.latitude"></el-input>
            </el-form-item>

            <el-form-item label="工程类型" :label-width="formLabelWidth">
                <el-select v-model="form.project" placeholder="请选择">
                    <el-option label="单位工程" value="unit"></el-option>
                    <el-option label="子单位工程" value="childUnit"></el-option>
                    <el-option label="分部工程" value="separate"></el-option>
                    <el-option label="子分部工程" value="childSeparate"></el-option>
                    <el-option label="分项工程" value="itemize"></el-option>
                    <el-option label="子分项工程" value="childItemize"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="Xcadd">保 存</el-button>
        </div>
    </div>
</template>

<script>
import api from "../../../api/project.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        org: "",
        start: "",
        termination: "",
        longitude: "",
        latitude: "",
        region: "",
        value: "",
        project: "",
        delivery: false,
        type: []
      },
      rules: {
        org: [{ required: true, message: "请输入所属机构", trigger: "blur" }],
        region: [{ required: true, message: "请选择", trigger: "change" }],
        start: [{ required: true, message: "请输入起始桩号", trigger: "blur" }]
      },
      formLabelWidth: "150px",
      dialogFormVisible: true
    };
  },
  created() {
    this.userx();
  },
  methods: {
    userx() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem);
    },
    async Xcadd() {
      await api.projectAdd(this.form);
    }
  }
};
</script>

<style>
</style>
