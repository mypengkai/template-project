<template>
  <div class="p20">
    <!-- 新增 -->
    <div class="btncalss">
       <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn blue-btn" @click="action('add')">新增</el-button>
    </div>
   
    <!-- 列表 -->
    <div class="pt20">
      <el-scrollbar style="height: 68vh;overflow-x: none;">
        <tree-table class="textList" :data="menuList" border row-key="id">
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
      </el-scrollbar>

    </div>
    <!-- 弹框 -->
    <el-dialog :title="newTitle" :visible.sync="dialogFormVisible">
      <resourceAdd :nopId="nopId" :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="resourceList"></resourceAdd>
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
  name: "TreeTable",
  data() {
    return {
      nowItem: "",
      newTitle: "",
      pId: "",
      nopId: "",
      dialogFormVisible: false,
      menuList: []
    };
  },
  created() {
    this.resourceList();
  },
  methods: {
    action(val, son) {
      if (val == "add") this.nowItem = val;
      if (val != "add") {
        son &&
          (this.nowItem = {
            childcount: "",
            functionLevel: "",
            functionName: "",
            functionOrder: "",
            functionUrl: "",
            pId: val.id,
            pName: val.functionName
          });
        !son &&
          (this.nowItem = {
            childcount: val.childcount,
            functionLevel: val.functionLevel,
            functionName: val.functionName,
            functionOrder: val.functionOrder,
            functionUrl: val.functionUrl,
            pName: val.pname,
            id: val.id,
            pId: val.pId
          });
      }

      this.dialogFormVisible = true;
      if (this.nowItem != "add" && !son) {
        this.newTitle = "修改";
      } else {
        this.newTitle = "新增";
      }
    },
    // 树形列表
    resourceList() {
      api.menuList().then(res => {
        this.menuList = res.data.data;
      });
    },
    // 删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._menuDelete(data);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
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
      !val && (this.pId = "");
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
  overflow-y: scroll;
}

/* for Chrome */
.inner-container::-webkit-scrollbar {
  display: none;
}
.btncalss{
  position: absolute;
  top: 0.1vw;
  right: 0;
}
</style>
