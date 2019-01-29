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
      <tree-table :data="data" :columns="columns" border>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </tree-table>
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
import api from "../../api/project.js";
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
      columns: [
        {
          text: "组织机构",
          value: "event",
          width: 200
        },
        {
          text: "代码",
          value: "id"
        },
        {
          text: "桩号",
          value: "timeLine"
        },
        {
          text: "工程类型",
          value: "comment"
        }
      ],
      data: [
        {
          id: "J",
          event: "上海同望",
          timeLine: "K0+503-K13+900",
          comment: "单位工程"
        }
      ],
    
       nowItem: "",
      dialogFormVisible: false,
      value: "",
      input: ""
    };
  },
 
  methods: {
     action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
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
