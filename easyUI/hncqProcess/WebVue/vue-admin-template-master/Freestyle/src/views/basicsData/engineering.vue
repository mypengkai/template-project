<template>
  <div class="p20">
    <!-- 选择区域 -->
    <div class="elButton">
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn"  @click="action('add')">新增</el-button>
    </div>
    <!-- 操作列表 -->
    <!-- <el-scrollbar> -->    
      <!-- :eval-func="func" :eval-args="args" :expand-all="expandAll" -->
      <tree-table class="textList"  :data="dataList" row-key  ref="projectItemTreeTable" border >
        <el-table-column label="工程分部分项">
          <template slot-scope="scope">
            <span style>{{ scope.row.projectItem }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属组织机构">
          <template slot-scope="scope">
            <span style>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型">
          <template slot-scope="scope">
            <template v-if="scope.row.projectType==='1'">单位工程</template>
            <template v-else-if="scope.row.projectType==='2'">子单位工程</template>
            <template v-else-if="scope.row.projectType==='3'">分部工程</template>
            <template v-else-if="scope.row.projectType==='4'">子分部工程</template>
            <template v-else-if="scope.row.projectType==='5'">分项工程</template>
            <template v-else-if="scope.row.projectType==='6'">子分项工程</template>
          </template>
        </el-table-column>

        <el-table-column label="起始桩号">
          <template slot-scope="scope">
            <span style>{{ scope.row.startStation }}</span>
          </template>
        </el-table-column>

        <el-table-column label="终止桩号">
          <template slot-scope="scope">
            <span style>{{ scope.row.endStation }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span style>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">

          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="新增" placement="top">
              <el-button type="primary" icon="el-icon-plus" circle @click="action(scope.row,true)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </tree-table>
    <!-- </el-scrollbar> -->

    <!-- 新增弹框 -->
    <el-dialog :title="newTitle" :visible.sync="dialogFormVisible" class="dialogBox">
      <Xcadd :nopId="nopId" :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_projectList"></Xcadd>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import treeToArray from "./customEval.js";
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
      func: treeToArray,
      expandAll: false,
      dataList: [],
      newTitle: "", // 弹框标题变量
      answer: "", // 删除的响应变量
      nowItem: "",
      dialogFormVisible: false,
      total: 0,
      nopId: "",
      args: [null, null, "timeLine"],

    };
  },
  mounted() {
    // this.$refs.projectItemTreeTable.$el.classList.add("el-table--scrollable-x");
  },
  created() {
    this._projectList();
  },
  methods: {
    action(val, son) {
      if (val == "add") this.nowItem = val;
      if (val != "add") {
        son &&
          (this.nowItem = {
            userGroupId: "",
            startStation: "",
            endStation: "",
            name: "",
            fuid: val.id,
            lgt: "",
            lat: "",
            projectItem: "",
            projectType: "",
            pName: val.projectItem
          });
        !son &&
          (this.nowItem = {
            userGroupId: val.userGroupId,
            startStation: val.startStation,
            endStation: val.endStation,
            name: val.name,
            lgt: val.lgt,
            lat: val.lat,
            projectItem: val.projectItem,
            projectType: val.projectType,
            pName: val.pname,
            fuid: val.pId,
            id: val.id
          });
      }
      this.dialogFormVisible = true;
      if (this.nowItem != "add" && !son) {
        this.newTitle = "修改";
      } else {
        this.newTitle = "新增";
      }
    },
    _projectList() {
      api.projectList().then(res => {
        this.dataList = res.data.data;
        console.log(this.dataList,'this.dataList')
        let dataList = this.dataList;
      });
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("即将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._projectDelete(data);
      });
    },
    // 删除请求
    _projectDelete(data) {
      api.projectDelete(data.id).then(res => {
        let _message = res.data.message;
        if (_message == "成功") {
          this.answer = "success";
        } else {
          this.answer = "error";
        }
        this._projectList();
        this.$message({
          type: this.answer,
          message: _message
        });
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

<style lang="scss" scoped>

.Treebox {
  // height: 60vh;
  overflow-x: hidden;
  overflow-y: scroll;
  line-height: 30px;
  text-align: center;
}
.Treebox::-webkit-scrollbar {
  // display: none;
}
.elButton {
  overflow: hidden;
  .pan-btn {
    float: right;
  }
}
</style>
