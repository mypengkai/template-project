<template>
  <div class="p20">
    <!-- 新增 -->
    <div class="btncalss">
      <el-button type="primary" plain @click="resourceList(2)" class="pan-btn light-blue-btn">移动端</el-button>
      <el-button type="primary" plain @click="resourceList(1)" class="pan-btn light-blue-btn">PC端</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        class="pan-btn light-blue-btn"
        @click="action('add')"
      >新增</el-button>
    </div>

    <!-- 列表 -->
    <div class="pt20">
      <!-- <el-scrollbar style="height: 68vh;overflow-y: none;"> -->
      <tree-table class="textList" :data="menuList" border row-key>
        <el-table-column label="菜单名称" height="250" align="center">
          <template slot-scope="scope">
            <span style>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="分支名称" align="center">
          <template slot-scope="scope">
            <span style>{{ scope.row.component }}</span>
          </template>
        </el-table-column>

        <el-table-column label="菜单地址" align="center">
          <template slot-scope="scope">
            <span style>{{ scope.row.path }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope" type="scope.row">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="action(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="新增" placement="top">
              <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click="action(scope.row,true)"
                :disabled="scope.row.type==='button'?true:false"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="Delete(scope.row)"
                :disabled="scope.row.children.length>0?true:false"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </tree-table>
      <!-- </el-scrollbar> -->
    </div>
    <!-- 弹框 -->
    <el-dialog class="dialogBox" :title="newTitle" :visible.sync="dialogFormVisible">
      <resourceAdd
        :flag="flag"
        :nopId="nopId"
        :nowItem="nowItem"
        v-if="nowItem"
        @cancel="dialogFormVisible=false"
        @comfirm="resourceList"
      ></resourceAdd>
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
      menuList: [],
      flag: true
    };
  },
  created() {
    this.resourceList(1);
  },
  methods: {
    isMobile() {
      return localStorage.getItem("ismobile");
    },
    action(val, son) {
      if (val == "add") {
        this.nowItem = val;
        this.flag = false;
        console.log(this.flag);
      }
      if (val != "add") {
        son &&
          ((this.nowItem = {
            childcount: "",
            functionLevel: "",
            name: "",
            component: "",
            path: "",
            pId: val.id,
            pName: val.name,
            type: "",
            Mark: "",
            icon: ""

            // id:'',
            // title: '',
            // pId: '',
            // component:'',
            // path:'',
            // Mark:'1',
            // name:val.name,
            // icon:''
          }),
          (this.flag = true));
        !son &&
          ((this.nowItem = {
            id: val.id,
            title: val.meta.title,
            pId: val.name,
            component: val.component,
            path: val.path,
            Mark: val.mark,
            name: val.name,
            icon: val.meta.icon,
            pName: val.name,
            type: val.type
          }),
          (this.flag = true));
      }

      this.dialogFormVisible = true;
      if (this.nowItem != "add" && !son) {
        this.newTitle = "修改";
      } else {
        this.newTitle = "新增";
      }
    },
    // 树形列表
    resourceList(num) {
      this.menuList = [];
      api.menuList({ Mark: num, type: "menu" }).then(res => {
        this.menuList = res.data.data;
        console.log(this.menuList);
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
.btncalss {
  position: absolute;
  top: 0.1vw;
  right: 1vw;
}
</style>
