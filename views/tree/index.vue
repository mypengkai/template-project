<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="content">
        <tree-table :data="menuList" border>
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
              <el-button type="text">删除</el-button>
              <el-button type="text">编辑</el-button>
            </template>
          </el-table-column>
        </tree-table>
      </div>
    </div>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import api from "@/api/resource.js";
export default {
  name: "TreeTableDemo",
  components: { treeTable },
  data() {
    return {
      menuList: []
    };
  },
  created() {
    this.resourceList();
  },
  methods: {
    resourceList() {
      api.menuList().then(res => {
        console.log(res.data.data);
        this.menuList = res.data.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.outer-container,
.content {
  width: 90vw;
  height: 75vh;
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
