<template>
  <div class="p20">
    <!-- 新增 -->
    <el-button type="primary" @click="action('add')">新增</el-button>
    <!-- 列表 -->
    <div class="pt20">
      <div class="outer-container">
        <div class="inner-container">
          <div class="content">
            <tree-table :data="menuList" border height="65vh">
              <el-table-column label="菜单名称">
                <template slot-scope="scope">
                  <span style="">{{ scope.row.functionName }}</span>
                </template>
              </el-table-column>

              <el-table-column label="菜单排序">
                <template slot-scope="scope">
                  <span style="">{{ scope.row.functionOrder }}</span>
                </template>
              </el-table-column>

              <el-table-column label="菜单地址">
                <template slot-scope="scope">
                  <span style="">{{ scope.row.functionUrl }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" @click="action(scope.row)">编辑</el-button>
                  <el-button type="text" @click="action('add',scope.row.pId)">新增</el-button>
                  <el-button type="text" @click="Delete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </tree-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="nowItem=='add'?'新增':'修改'" :visible.sync="dialogFormVisible">
      <resourceAdd :nowItem="nowItem" :pId="pId" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="resourceList"></resourceAdd>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import api from "@/api/resource.js";
import resourceAdd from "./components/resourceAdd";
export default {
  components: {
    treeTable,
    resourceAdd
  },
  name: "TreeTableDemo",
  data() {
    return {
      nowItem: "",
      pId: "",
      dialogFormVisible: false,
      menuList: []
    };
  },
  created() {
    this.resourceList();
  },
  methods: {
    action(val, pId) {
      pId && (this.pId = pId);
      val == "add" && (this.nowItem = val);
      val != "add" &&
        (this.nowItem = {
          childcount: val.childcount,
          functionLevel: val.functionLevel,
          functionName: val.functionName,
          functionOrder: val.functionOrder,
          functionUrl: val.functionUrl,
          id: val.id,
          pId: val.pId
        });
         this.dialogFormVisible = true;
    },
    // 树形列表
    resourceList() {
      api.menuList().then(res => {
        console.log(res.data.data);
        this.menuList = res.data.data;
      });
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this._menuDelete(data));
    },
    // 删除请求
    _menuDelete(data) {
      api.menuDelete(data.id).then(res => {
        this.resourceList();
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
.outer-container,
.content {
  width: 90vw;
  height: 65vh;
}
.outer-container {
  position: relative;
  overflow: hidden;
}
.inner-container {
  position: absolute;
  left: 0;
  // overflow-x: hidden;
  overflow-y: scroll;
}

/* for Chrome */
.inner-container::-webkit-scrollbar {
  display: none;
}
</style>
