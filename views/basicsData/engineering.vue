<template>
  <div class="engineeringLayout">
    <!-- 选择区域 -->
    <div class="selectArea scrollY">
      <div class="framework">
        组织机构:
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 上传 -->
      <div class="dataUp">
        <span style="padding-top: 1vw;">导入工程数据:</span>
        <span style="padding-top: 0.7vw;">
          <el-button size="small" type="primary" @click="action('add')">新增</el-button>
        </span>
      </div>
    </div>
    <!-- 操作列表 -->
    <div class="app-container">
      <el-table :data="dataList" height="60vh">
        <el-table-column prop="projectItem" label="工程分布分项">
        </el-table-column>
        <el-table-column prop="projectType1" label="类型">
        </el-table-column>
        <el-table-column prop="userGroupIdName" label="所属组织机构">
        </el-table-column>
        <el-table-column prop="startStation" label="起始桩号">
        </el-table-column>
        <el-table-column prop="endStation" label="终止桩号">
        </el-table-column>
        <el-table-column prop="useridName" label="创建人">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <Xcadd :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_projectList"></Xcadd>
    </el-dialog>

  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import Xcadd from "./popUp/Xcadd";
import api from "@/api/project.js";
export default {
  name: "TreeTableDemo",
  components: {
    treeTable,
    Xcadd
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "上海同望"
        },
        {
          value: "选项2",
          label: "研发部"
        },
        {
          value: "选项3",
          label: "工程部"
        },
        {
          value: "选项4",
          label: "一分部"
        },
        {
          value: "选项5",
          label: "二分部"
        }
      ],
      dataList: [],
      nowItem: "",
      dialogFormVisible: false,
      value: "",
      input: ""
    };
  },
  created() {
    this._projectList();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    _projectList() {
      api.projectList().then(res => {
        this.dataList = res.data.data;
        let dataList = this.dataList;
        dataList.forEach(v => {
          v.projectType == 1 && (v.projectType1 = "单位工程");
          v.projectType == 2 && (v.projectType1 = "子单位工程");
          v.projectType == 3 && (v.projectType1 = "分部工程");
          v.projectType == 4 && (v.projectType1 = "子分部工程");
          v.projectType == 5 && (v.projectType1 = "分项工程");
          v.projectType == 6 && (v.projectType1 = "子分项工程");
        });
      });
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this._projectDelete(data));
    },
    // 删除请求
    _projectDelete(data) {
      api.projectDelete(data.id).then(res => {
        this._projectList();
      });
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    }
  }
};
</script>

<style lang="scss" scoped >
.engineeringLayout {
  padding: 20px;
  .selectArea {
    height: 6vh;
    border: 1px solid #ccc;
    border-radius: 10px;
    .framework {
      padding-left: 20px;
      padding-top: 0.4vw;
      width: 29vw;
      height: 100%;
      float: left;
    }
    .dataUp {
      width: 35vw;
      height: 100%;
      float: left;
      margin-left: 15vw;
      span {
        display: block;
        float: left;
        padding-left: 20px;
        padding-top: 0.4vw;
      }
    }
  }
  .treeList {
    height: 70vh;
    margin-top: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
}
</style>
