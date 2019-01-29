<template>
    <div>
        <el-form :model="form">
            <el-form-item label="所属机构" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

             <el-form-item label="所属机构是否分项" :label-width="formLabelWidths">
                <el-select v-model="form.region" placeholder="请选择">
                    <el-option label="是" value="data1"></el-option>
                    <el-option label="否" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="起始桩号" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="终止桩号" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="工程类型" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择">
                    <el-option label="单位工程" value="data1"></el-option>
                    <el-option label="子单位工程" value="beijing"></el-option>
                    <el-option label="分部工程" value="beijing"></el-option>
                    <el-option label="子分部工程" value="shanghai"></el-option>
                    <el-option label="分项工程" value="beijing"></el-option>
                    <el-option label="子分项工程" value="beijing"></el-option>
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
        name: "",
        region: "",
        value: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "150px",
      formLabelWidths: "150px",
      dialogFormVisible: false
    };
  },
  created() {
    this.userx();
  },
  methods: {
    userx() {
      if (this.nowItem == "add");
      this.form = this.$tool.ObCopy(this.nowItem);
    },
    Xcadd() {
      api.projectAdd(this.form.id).then(res => {
        let data = res.data;
        Object.assign(this.form, data);
      });
    }
    // confirm() {
    //   this.nowItem != "add" &&
    //     api.update(this.form).then(res => {
    //       this.$emit("diaslogConfirm");
    //     });
    // },
    // open2() {
    //   this.$Xcadd("是否保存该文件", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "已保存!"
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消"
    //       });
    //     });
    // }
  }
};
</script>

<style>
</style>
