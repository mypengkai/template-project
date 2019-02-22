<template>
  <div class="p20">
    <!-- 新增 -->
    <el-button type="primary" @click="action('add')">新增</el-button>
    <!-- 列表 -->
    <div class="pt20">
      <!-- 头部 -->
      <div class="treeTop">
        <span style="left: 2vw;">菜单名称</span>
        <span style="left: 18vw;">菜单排序</span>
        <span style="left: 37vw;">菜单地址</span>
        <span style="left: 71vw;">操作</span>
      </div>
      <!-- 树 -->
      <div class="treeBox">
        <el-tree :data="menuList" node-key="id" accordion :expand-on-click-node="false" :highlight-current="true">
          <div class="treeOrg" slot-scope="{ node, data }">
            <span>{{ data.functionName }}</span>
            <span>{{ data.functionOrder }}</span>
            <span style="width: 40%;">{{ data.functionUrl }}</span>
            <span>
              <el-button type="text" @click="action(data)">编辑</el-button>
              <el-button type="text" @click="Delete(node, data)">删除</el-button>
            </span>
          </div>
        </el-tree>
      </div>

    </div>
    <!-- 弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <resourceAdd :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible=false" @comfirm="resourceList"></resourceAdd>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/resource.js";
import resourceAdd from "./components/resourceAdd";
export default {
  components: {
    resourceAdd
  },
  name: "CustomTreeTableDemo",
  data() {
    return {
      nowItem: "",
      dialogFormVisible: false,
      menuList: []
    };
  },
  created() {
    this.resourceList();
  },
  methods: {
    action(val) {
      this.nowItem = val;
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
    Delete(node, data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this._menuDelete(node, data));
    },
    // 删除请求
    _menuDelete(node, data) {
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
.treeBox {
  margin-top: 4vh;
  height: 65vh;
}
.treeOrg {
  width: 100%;
  display: flex;
  justify-content: space-around;
  span {
    padding-top: 2vh;
    display: block;
    width: 20%;
  }
}
</style>
