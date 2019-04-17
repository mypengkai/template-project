<template>
  <div>
    <el-form class="reverseBox" :model="form" :rules="rules" ref="addForm">
      <div style="width:50%">
        <el-form-item label="所属机构" :label-width="formLabelWidth">
          <select-tree :options="orgTree" v-on:noDe="handleCheckChange" :props="defaultProps"/>
        </el-form-item>
         <!-- 父级 -->
        <el-form-item  label="工程分部分项" :label-width="formLabelWidth" prop="projectItem">
          <select-tree :options="projectList" v-on:noDe="projectChange" :props="projectTree"/>
        </el-form-item>
        <el-form-item v-if="nowItem!=='add'" label="父工程分部分项" :label-width="formLabelWidth">
          <el-input v-model="form.pName" :disabled="true" size="small">
            <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="起始桩号" :label-width="formLabelWidth" prop="startStation">
          <el-input v-model="form.startStation" size="small"></el-input>
        </el-form-item>

        <el-form-item label="终止桩号" :label-width="formLabelWidth" prop="endStation">
          <el-input v-model="form.endStation" size="small"></el-input>
        </el-form-item>

        <el-form-item label="经度" :label-width="formLabelWidth">
          <el-input v-model="form.lgt" size="small"></el-input>
        </el-form-item>

        <el-form-item label="纬度" :label-width="formLabelWidth">
          <el-input v-model="form.lat" size="small"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="工程类型" :label-width="formLabelWidth">
          <el-select v-model="form.projectType" placeholder="请选择" size="small">
            <el-option label="单位工程" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="nowItem!=='add'" label="工程类型" :label-width="formLabelWidth">
          <el-select v-model="form.projectType" placeholder="请选择" size="small">
            <el-option label="单位工程" value="1"></el-option>
            <el-option label="子单位工程" value="2"></el-option>
            <el-option label="分部工程" value="3"></el-option>
            <el-option label="子分部工程" value="4"></el-option>
            <el-option label="分项工程" value="5"></el-option>
            <el-option label="子分项工程" value="6"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm()">保 存</el-button>
    </div>

    <!-- 树形表单提交 -->
    <!-- <el-dialog width="30%" title="所属机构" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog>-->
    <!-- 分部分项树形表单 -->
    <!-- <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
      </el-tree>
    </el-dialog>-->
  </div>
</template>

<script>
import api from "@/api/project.js";
import Organization from "@/api/Organization.js";
import SelectTree from "@/components/SelectTree/selectTree.vue";
export default {
  props: ["nowItem"],
  components: {
    SelectTree
  },
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
    _comfirm() {
      if (this.nowItem == "add") {
        this.form.fuid = ''
        console.log(this.form, "this.form");
        if (this.form.name == "") {
          this.$message({
            message: "请选择组织机构"
          });
          return false;
        }
        if (this.form.projectItem == "") {
          this.$message({
            message: "请选择分部分项"
          });
          return false;
        }
        if (this.form.startStation == "") {
          this.$message({
            message: "请输入起始桩号"
          });
          return false;
        }
        if (this.form.endStation == "") {
          this.$message({
            message: "请输入结束桩号"
          });
          return false;
        }
         if (this.form.projectType == "") {
          this.$message({
            message: "请选择工程类型"
          });
          return false;
        }
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
          this.$message({
            type: "success",
            message: "新增成功!"
          });
          this.$emit("cancel");
        });
      }

      // 查看单个 修改
      if (this.nowItem != "add") {
        console.log(this.form.fuid,'fuid')
        if (this.form.name == "") {
          this.$message({
            message: "请选择组织机构"
          });
          return false;
        }
         if (this.form.projectItem == "") {
          this.$message({
            message: "请选择分部分项"
          });
          return false;
        }
         if (this.form.startStation == "") {
          this.$message({
            message: "请输入起始桩号"
          });
          return false;
        }
        if (this.form.endStation == "") {
          this.$message({
            message: "请输入结束桩号"
          });
          return false;
        }
          if (this.form.projectType == "") {
          this.$message({
            message: "请选择工程类型"
          });
          return false;
        }
        api.projectAdd(this.form).then(res => {
          this.$emit("comfirm");
          this.$message({
            type: "success",
            message: "已完成!"
          });
          this.$emit("cancel");
        });
      }
    },
    // 组织机构树
    _orgTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
     
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      if (data.children.length > 0) {
        this.$message({
          message: "组织机构只能选标段"
        });
        return false;
      }
      this.form.userGroupId = data.id;
      this.form.name = data.name;
       // 分部分项树
      api.projectList({orgId: this.form.userGroupId}).then(res => {
        this.projectList = res.data.data;
      });
    },
    // 分部分项选择后的数据
    projectChange(data, checked, indeterminate) {
      this.form.fuid = data.id;
      this.form.projectItem = data.projectItem;     //父级
    }
  }
};
</script>

<style lang="scss" scoped>
.reverseBox {
  height: 60vh;
  overflow-y: scroll;
  /deep/.el-form-item__label {
    font-size: 0.6vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
</style>
