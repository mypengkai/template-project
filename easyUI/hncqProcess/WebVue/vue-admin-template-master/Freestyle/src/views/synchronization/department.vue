<template>
  <div class="p20">
    <div class="tongbu" style="">
      <div class="rl" style="margin-bottom:10px">
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn"  @click="tongbu()">从物质平台同步</el-button>
      </div>
    </div>
     <!-- syncId -->
    <el-table :data="treeData" border style="width: 100%" height="75vh" row-key="id" default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="组织机构" align="left" prop="name"></el-table-column>
      <el-table-column label="同步状态" align="center" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.syncId === 'null'">
            <i class="el-icon-close"></i>
          </template>
          <template v-else>
            <i class="el-icon-check"></i>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-refresh" circle @click="departData(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "../../api/tongbu";
export default {
  name: "TreeTableDemo",
  describe: "部门同步",
  data() {
    return {
      treeData: [],
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    tongbu() {
      //同步部门到中间件
      api.depart().then(res => {
        if (res.data.ok) {
          this.$message({
            message:'同步成功'
          });
          this.getTreeData();
        }
      });
    },
    getTreeData() {
      //展示同步部门中间表信息
      api.treeData().then(res => {
        this.treeData = res.data.data;
      });
    },
    departData(data){
      var syncId = data.syncId
       //同步部门
      api.updateData({id: data.id}).then(res=>{
        if(syncId !== "null"){
          this.$message("此单位已同步,无法再次同步")
        }else{
          this.$message("同步成功")
          data.syncId='success';
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .pan-btn{
    font-size: 0.2vw;
  }
</style>
