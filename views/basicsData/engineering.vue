<template>
  <div class="engineeringLayout">
    <!-- 选择区域 -->
    <div class="selectArea">
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
      <el-table :data="dataList" style="width: 100%">
        <el-table-column label="工程分部分项">
          <template slot-scope="scope">
            <span>{{ scope.row.projectItem }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属组织机构">
          <template slot-scope="scope">
            <span>{{ scope.row.userGroupIdName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.projectType1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="起始桩号">
          <template slot-scope="scope">
            <span>{{ scope.row.startStation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止桩号">
          <template slot-scope="scope">
            <span>{{ scope.row.endStation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.useridName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <Xcadd :nowItem="nowItem" v-if="nowItem"></Xcadd>
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
      // columns: [
      //   {
      //     text: "组织机构",
      //     value: "org",
      //     width: 200
      //   },
      //   {
      //     text: "起始桩号",
      //     value: "start"
      //   },
      //   {
      //     text: "结束桩号",
      //     value: "termination"
      //   },
      //   {
      //     text: "工程类型",
      //     value: "project"
      //   }
      // ],
      dataList: "",
      nowItem: "",
      dialogFormVisible: false,
      value: "",
      input: ""
    };
  },
  created() {
    this.getprojectList();
    this._getItem();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    getprojectList() {
      api.projectList().then(res => {
        let dataList = res.data.data;
        this.dataList = dataList;
        dataList.forEach(v => {
          v.projectType == 1 && (v.projectType1 = "单位工程");
          v.projectType == 2 && (v.projectType1 = "子单位工程");
          v.projectType == 3 && (v.projectType1 = "分部工程");
          v.projectType == 4 && (v.projectType1 = "子分部工程");
          v.projectType == 5 && (v.projectType1 = "分项工程");
          v.projectType == 6 && (v.projectType1 = "子分项工程");
        });
        console.log(dataList);
      });
    },
    _getItem() {
      this.$tool._vue.$on("getItem", val => {
        this.data = val;
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
      width: 20vw;
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
