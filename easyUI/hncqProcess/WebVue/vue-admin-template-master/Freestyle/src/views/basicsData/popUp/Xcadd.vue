<template>
  <div>
    <el-form :model="form" :rules="rules">
      <div style="width:50%">
        <el-form-item label="所属机构" :label-width="formLabelWidth" prop="userGroupId">
          <el-input v-model="departName">
            <el-button slot="append" icon="el-icon-edit" @click="innerVisible = true"></el-button>
          </el-input>
          <!-- <el-button type="primary" plain @click="innerVisible = true">点击输入</el-button> -->
        </el-form-item>

        <el-form-item label="工程分部分项" :label-width="formLabelWidth" prop="projectItem">

          <el-input v-model="form.projectItem"></el-input>
          <!-- <el-select v-model="form.projectItem" placeholder="请选择">
            <el-option label="是" value=1></el-option>
            <el-option label="否" value=0></el-option>
          </el-select> -->
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

        <el-form-item label="工程类型" :label-width="formLabelWidth">
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
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>

    <!-- 树形表单提交 -->
    <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/project.js";
import api1 from "@/api/Organization.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      orgTree: [],
      departName: "",
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
        label: "departName"
      },
      form: {
        userGroupId: "",
        startStation: "",
        endStation: "",
        lgt: "",
        lat: "",
        projectItem: "",
        value: "",
        projectType: "",
        delivery: false,
        type: []
      },

      rules: {
        userGroupId: [
          { required: true, message: "请输入所属机构", trigger: "blur" }
        ],
        projectItem: [{ required: true, message: "请选择", trigger: "blur" }],
        startStation: [
          { required: true, message: "请输入起始桩号", trigger: "blur" }
        ],
        endStation: [
          { required: true, message: "请输入终止桩号", trigger: "blur" }
        ]
      },
      formLabelWidth: "150px",
      dialogFormVisible: true,
      innerVisible: false
    };
  },
  created() {
    this.initForm();
    this._orgTree();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      console.log(this.form);
    },
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个 修改
      this.nowItem != "add" &&
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 文件上传
      //  this.nowItem != "add" &&
      // api.projectaddbyList(this.form).then(res => {
      //   this.$emit("comfirm");
      // });
    },
    // 组织机构树
    _orgTree() {
      api1.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.form.userGroupId = data.id;
      this.departName = data.departName;
      this.innerVisible = false;
    }
  }
};
</script>

<style>
</style>
