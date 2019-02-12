<template>
  <div>
    <el-form :model="form" :rules="rules">
      <div style="width:50%">
        <el-form-item label="所属机构" :label-width="formLabelWidth" prop="org">
        <el-input v-model="form.org">
          <el-button slot="append" icon="el-icon-edit" @click="innerVisible = true"></el-button>
        </el-input>

        <!-- <el-button type="primary" plain @click="innerVisible = true">点击输入</el-button> -->
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
          <el-option label="单位工程" value="单位工程"></el-option>
          <el-option label="子单位工程" value="子单位工程"></el-option>
          <el-option label="分部工程" value="分部工程"></el-option>
          <el-option label="子分部工程" value="子分部工程"></el-option>
          <el-option label="分项工程" value="分项工程"></el-option>
          <el-option label="子分项工程" value="子分项工程"></el-option>
        </el-select>
      </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>

    <!-- 树形表单提交 -->
    <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="data2" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/project.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      data2: [
        {
          id: 1,
          label: "路基工程",
          children: [
            {
              id: 4,
              label: "基石土方工程",
              children: [
                {
                  id: 9,
                  label: "排水工程"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
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
      formTree: {
        father: "",
        fatherId: "",
        son: "",
        sonId: ""
      },
      rules: {
        org: [{ required: true, message: "请输入所属机构", trigger: "blur" }],
        region: [{ required: true, message: "请选择", trigger: "change" }],
        start: [{ required: true, message: "请输入起始桩号", trigger: "blur" }]
      },
      formLabelWidth: "150px",
      dialogFormVisible: true,
      innerVisible: false
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      console.log(this.form);
    },
    _comfirm() {
      this.nowItem == "add" &&
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
      this.nowItem != "add" &&
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
    }
  }
};
</script>

<style>
</style>
