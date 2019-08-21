<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>组织机构名称:</span>
      <select-tree clearable :options="userGroupTree" :props="defaultUserGroupProps" node-key="id" :default-expand-all="false" v-on:noDe="handleCheckChange"
                   ref="organization_userGroup"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="loadSyncUserGroupDataList()">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="syncFormZj()">中交同步</el-button>
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="syncFormZj()">中交更新</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="syncToShtooneProjectItem()">同步入库</el-button>
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="syncToShtooneProjectItemGoUpdate()">同步更新</el-button>
      </div>
    </div>
    <el-table :data="syncUserGroupDataList" class="textList" border row-key="id" default-expand-all
              lazy :load="loadNextUserGroup" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" height="68vh">
      <el-table-column label="分部分项" align="left" prop="Description"></el-table-column>
      <el-table-column label="编码" align="center" prop="Code"></el-table-column>
      <el-table-column label="父编码" align="center" prop="ParentCode"></el-table-column>
      <el-table-column label="起始桩号" align="center" prop="StartStake"></el-table-column>
      <el-table-column label="终止桩号" align="center" prop="EndStake"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="CreatedTime"></el-table-column>
    </el-table>

  </div>
</template>

<script>
import SelectTree from '@/components/SelectTree/selectTree.vue'
import request from '@/utils/request'

export default {
  name: "projectItemZj",
  data(){
    return{
      userGroupTree: [],  //组织机构树形
      defaultUserGroupProps: {
        children: "children",
        label: "name",
        value: "id",
        parent: "parentdepartid",
      },
      queryData: {
        userGroupId: "",
      },
      syncUserGroupDataList: [],   //同步成功的组织机构
   }
  },
  components: { SelectTree },
  created(){
    this.initOrganizationTreeTable();
  },
  methods:{
    loadSyncUserGroupDataList(){
      if(this.$tool.isEmptyStr(this.queryData.userGroupId)){
        this.$message({
          type: 'warn',
          message: "请选择组织机构"
        });
      }else {
        request.post('/rest/processCheck/treeProjectItemInfo', {orgCode: this.queryData.userGroupId}).then(res => {
          this.syncUserGroupDataList = res.data.data;
        })
      }
    },
    loadNextUserGroup(row, treeNode, resolve){   //加载下级组织机构
      request.post('/rest/processCheck/treeItemInfoSon', {codeid: row.Code}).then(res => {
        resolve(res.data.data)
      })
    },
    initOrganizationTreeTable() {  // 初始化树列表
      request.get('/rest/organizate/depart').then(res => {
        this.userGroupTree = res.data.data
      })
    },
    syncFormZj(){  //从中交平台同步
      if(this.$tool.isNotEmptyStr(this.queryData.userGroupId)){
        request.post('/rest/processCheck/addProjectAccountTreeTW', {orgCode: this.queryData.userGroupId, date: '2000-01-01 00:00:00'}).then(res=>{
          if(res.data.ok){
            this.$message({
              type: "success",
              message: "从中交平台同步成功!"
            });
          }
        });
      }else{
        this.$message({
          type: "warn",
          message: "请选择组织机构!"
        });
      }

    },
    handleCheckChange(item){  //组织机构选择
      this.queryData.userGroupId=item.id;
    },
    syncToShtooneProjectItem(){  //同步到现场管理平台库
      if(this.$tool.isNotEmptyStr(this.queryData.userGroupId)) {
        request.post('/rest/processCheck/addProjectItemInfo', {
          orgCode: this.queryData.userGroupId,
          date: '2000-01-01 00:00:00'
        }).then(res => {
          if (res.data.ok) {
            this.$message({
              type: "success",
              message: "更新入库"
            });
          }
        });
      }else{
        this.$message({
          type: "warn",
          message: "请选择组织机构!"
        });
      }
    },
    syncToShtooneProjectItemGoUpdate(){  //更新修改的内容

    },
  }
}
</script>

<style scoped>

</style>
