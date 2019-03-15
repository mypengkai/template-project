<template>
  <div>
    <el-form :model="form" :rules="rules" ref="addForm">
      <div style="width:50%">
        <el-form-item label="所属机构" :label-width="formLabelWidth">
          <el-input v-model="form.name">
            <el-button slot="append" icon="el-icon-edit" @click="innerVisible = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="工程分部分项" :label-width="formLabelWidth" prop="projectItem">
          <el-input v-model="form.projectItem"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem!=='add'" label="父工程分部分项" :label-width="formLabelWidth">
          <el-input v-model="form.pName">
            <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="起始桩号" :label-width="formLabelWidth" prop="startStation">
          <el-input v-model="form.startStation"></el-input>
        </el-form-item>

        <el-form-item label="终止桩号" :label-width="formLabelWidth" prop="endStation">
          <el-input v-model="form.endStation"></el-input>
        </el-form-item>

        <el-form-item label="经度" :label-width="formLabelWidth">
          <el-input v-model="form.lgt"></el-input>
        </el-form-item>

        <el-form-item label="纬度" :label-width="formLabelWidth">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="工程类型" :label-width="formLabelWidth">
          <el-select v-model="form.projectType" placeholder="请选择">
            <el-option label="单位工程" value=1></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="nowItem!=='add'" label="工程类型" :label-width="formLabelWidth">
          <el-select v-model="form.projectType" placeholder="请选择">
            <el-option label="单位工程" value=1></el-option>
            <el-option label="子单位工程" value=2></el-option>
            <el-option label="分部工程" value=3></el-option>
            <el-option label="子分部工程" value=4></el-option>
            <el-option label="分项工程" value=5></el-option>
            <el-option label="子分项工程" value=6></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm('addForm')">保 存</el-button>
    </div>

    <!-- 树形表单提交 -->
    <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>
    <!-- 分部分项树形表单 -->
    <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/project.js";
import Organization from "@/api/Organization.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      //组织机构树
      defaultProps: {
        children: "children",
        label: "name"
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "projectItem"
      },
      form: {
        userGroupId: "",
        startStation: "",
        endStation: "",
        name: "",
        fuid: "",
        lgt: "",
        lat: "",
        projectItem: "",
        projectType: "",
        pName: ""
      },
      rules: {
        userGroupId: {
          required: true,
          message: "请输入所属机构",
          trigger: "blur"
        },
        projectItem: { required: true, message: "请选择", trigger: "blur" },
        startStation: {
          required: true,
          message: "请输入起始桩号",
          trigger: "blur"
        },
        endStation: {
          required: true,
          message: "请输入终止桩号",
          trigger: "blur"
        }
      },
      formLabelWidth: "150px",
      dialogFormVisible: true,
      innerVisible: false,
      projectVisible: false // 工程分项弹框
    };
  },
  created() {
    this.initForm();
    this._orgTree();
  },
  methods: {
    initForm() {
      if (this.nowItem != "add") this.form = this.$tool.ObCopy(this.nowItem);
    },
    _comfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新增
          this.nowItem == "add" &&
            api.projectAdd(this.form).then(res => {
              this.$emit("comfirm");
              this.$message({
                type: "success",
                message: "新增成功!"
              });
            });
          // 查看单个 修改
          this.nowItem != "add" &&
            api.projectAdd(this.form).then(res => {
              this.$emit("comfirm");
              this.$message({
                type: "success",
                message: "已完成!"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 组织机构树
    _orgTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
      // 分部分项树
      api.projectList().then(res => {
        this.projectList = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.form.userGroupId = data.id;
      this.form.name = data.name;
      this.innerVisible = false;
    },
    // 分部分项选择后的数据
    projectChange(data, checked, indeterminate) {
      this.form.fuid = data.id;
      this.form.pName = data.projectItem;
      this.projectVisible = false;
    }
  }
};
</script>

<style>
</style>
