<template>
  <div class="p20">
    <div class="tongbu" style="">
      <div class="rl" style="margin-bottom:10px">
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn"  @click="tongbu()">从物质平台同步</el-button>
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn"  @click="tongData()">同步数据</el-button>
      </div>
    </div>
     <!-- syncId -->
    <tree-table :data="treeData" border >
      <el-table-column label="组织机构" align="center">
        <template slot-scope="scope"><span style="">{{scope.row.name}}</span></template>
      </el-table-column>
      <el-table-column label="同步状态" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.syncId === 'null'">
            <i class="el-icon-close"></i>
          </template>
          <template v-else>
            <i class="el-icon-check"></i>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-refresh" circle @click="departData(scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import request from "@/utils/request";
import api from "../../api/tongbu";
export default {
  name: "TreeTableDemo",
  components: { treeTable, SelectTree },
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
        if (res.data.respCode == 0) {
          (res.data.message = "成功"), (res.data.data = "同步到中间表成功");
          res.data.ok = true;
           this.$message({
             message:'同步成功'
           })
        }
      });
    },
    getTreeData() {
      //展示同步部门中间表信息
      api.treeData().then(res => {
        this.treeData = res.data.data;
      });
    },
    tongData(){
     this.getTreeData();
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
    font-size: .8vw;
  }
</style>
