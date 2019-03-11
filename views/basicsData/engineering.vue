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
          <el-upload action="https://jsonplaceholder.typicode.com/posts/">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </span>

        <span style="padding-top: 0.5vw;padding-left: 15vw;">
          <el-button type="primary" @click="action('add')">新增</el-button>
        </span>
      </div>
    </div>
    <!-- 操作列表 -->
    <div class="app-container">
      <el-table :data="dataList" height="60vh">
        <el-table-column label="工程分布分项">
          <template slot-scope="scope">
            <span style="">{{ scope.row.projectItem }}</span>
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

        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span style="">{{ scope.row.useridName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span style="">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="projectItem" label="工程分布分项">
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
        </el-table-column> -->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            <el-button type="text" @click="action('add',scope.row.id)">新增</el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="tac" background layout="prev, pager, next" :total="total" :current-page.sync="sendData.pageNo" @current-change="_projectList()">
    </el-pagination>
    <!-- 新增弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <Xcadd :nowItem="nowItem" :pId="pId" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="_projectList"></Xcadd>
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
      pId: "",
      dialogFormVisible: false,
      total: 0,
      value: "",
      input: "",
      sendData: {
        search: "",
        pageNo: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this._projectList();
  },
  methods: {
    action(val, pId) {
      pId && (this.pId = pId);
      val == "add" && (this.nowItem = val);
      val != "add" &&
        (this.nowItem = {
          userGroupId: val.userGroupId,
          startStation: val.startStation,
          endStation: val.endStation,
          lgt: val.lgt,
          lat: val.lat,
          projectItem: val.projectItem,
          value: val.value,
          projectType: val.projectType,
          id: val.id,
          pId: val.pId
        });
      this.dialogFormVisible = true;
    },
    _projectList() {
      api.projectList().then(res => {
        this.total = res.data.totalCount;
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
      !val && (this.pId = "");
    }
  }
};
</script>

<style lang="scss" scoped>
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
