<template>
  <div class="engineeringLayout">
    <!-- 选择区域 -->
    <div class="">
      <el-button type="primary" @click="action('add', true)">新增</el-button>
    </div>
    <!-- 操作列表 -->
    <div class="">
      <tree-table :data="dataList" border height="60vh">
        <el-table-column label="工程分布分项">
          <template slot-scope="scope">
            <span style="">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型">
          <template slot-scope="scope">
            <span style="">{{ scope.row.projectType1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属组织机构">
          <template slot-scope="scope">
            <span style="">{{ scope.row.departname }}</span>
          </template>
        </el-table-column>

        <el-table-column label="起始桩号">
          <template slot-scope="scope">
            <span style="">{{ scope.row.startStation }}</span>
          </template>
        </el-table-column>

        <el-table-column label="终止桩号">
          <template slot-scope="scope">
            <span style="">{{ scope.row.endStation }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span style="">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-plus" circle @click="action('add')"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <!-- 新增弹框 -->
    <el-dialog :title="nowItem=='add'?'新增':'修改'" :visible.sync="dialogFormVisible">
      <Xcadd :nopId="nopId" :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_projectList"></Xcadd>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import Xcadd from "./popUp/Xcadd";
import api from "@/api/project.js";
export default {
  components: {
    treeTable,
    Xcadd
  },
  name: "TreeTable",
  data() {
    return {
      dataList: [],
      nowItem: "",
      dialogFormVisible: false,
      total: 0,
      nopId: ""
    };
  },
  created() {
    this._projectList();
  },
  methods: {
    action(val, nopId) {
      this.nopId = nopId;
      val == "add" && (this.nowItem = val);
      val != "add" &&
        (this.nowItem = {
          userGroupId: val.userGroupId,
          startStation: val.startStation,
          endStation: val.endStation,
          lgt: val.lgt,
          lat: val.lat,
          name: val.name,
          value: val.value,
          projectType: val.projectType,
          id: val.id,
          pId: val.pId
        });
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
          v.children.forEach(v => {
            v.projectType == 1 && (v.projectType1 = "单位工程");
            v.projectType == 2 && (v.projectType1 = "子单位工程");
            v.projectType == 3 && (v.projectType1 = "分部工程");
            v.projectType == 4 && (v.projectType1 = "子分部工程");
            v.projectType == 5 && (v.projectType1 = "分项工程");
            v.projectType == 6 && (v.projectType1 = "子分项工程");
            v.children.forEach(v => {
              v.projectType == 1 && (v.projectType1 = "单位工程");
              v.projectType == 2 && (v.projectType1 = "子单位工程");
              v.projectType == 3 && (v.projectType1 = "分部工程");
              v.projectType == 4 && (v.projectType1 = "子分部工程");
              v.projectType == 5 && (v.projectType1 = "分项工程");
              v.projectType == 6 && (v.projectType1 = "子分项工程");
              v.children.forEach(v => {
                v.projectType == 1 && (v.projectType1 = "单位工程");
                v.projectType == 2 && (v.projectType1 = "子单位工程");
                v.projectType == 3 && (v.projectType1 = "分部工程");
                v.projectType == 4 && (v.projectType1 = "子分部工程");
                v.projectType == 5 && (v.projectType1 = "分项工程");
                v.projectType == 6 && (v.projectType1 = "子分项工程");
              });
              v.children.forEach(v => {
                v.projectType == 1 && (v.projectType1 = "单位工程");
                v.projectType == 2 && (v.projectType1 = "子单位工程");
                v.projectType == 3 && (v.projectType1 = "分部工程");
                v.projectType == 4 && (v.projectType1 = "子分部工程");
                v.projectType == 5 && (v.projectType1 = "分项工程");
                v.projectType == 6 && (v.projectType1 = "子分项工程");
              });
            });
          });
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
      !val && (this.nopId = "");
    }
  }
};
</script>

<style lang="scss" scoped>
.engineeringLayout {
  padding: 20px;
  .selectArea {
    height: 6vh;
    // border: 1px solid #ccc;
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
.content {
  width: 98%;
}
</style>
