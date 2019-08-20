<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>组织机构名称:</span>
      <select-tree clearable :options="userGroupTree" :props="defaultUserGroupProps" node-key="id" :default-expand-all="false" v-on:noDe="handleCheckChange"
                   ref="organization_userGroup"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="syncFormZj()">中交同步</el-button>
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="syncFormZj()">中交更新</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="syncToShtooneProjectItem()">同步入库</el-button>
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="syncToShtooneProjectItemGoUpdate()">同步更新</el-button>
      </div>
    </div>
    <el-table :data="syncUserGroupDataList" class="textList" border row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="组织机构" align="left" prop="name"></el-table-column>
      <el-table-column label="组织机构编码" align="center" prop="orgCode"></el-table-column>
      <el-table-column label="组织机构类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orgTpye==1">项目</span>
          <span v-if="scope.row.orgTpye==2">业主</span>
          <span v-if="scope.row.orgTpye==3">监理</span>
          <span v-if="scope.row.orgTpye==4">标段</span>
        </template>
      </el-table-column>
      <el-table-column label="GPS搜寻范围(米)" align="center" prop="searchRange"></el-table-column>
      <el-table-column label="备注" align="center" prop="description"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button v-ltx="'dicUpdate'" type="warning" size="small" icon="el-icon-edit" circle @click="addOrganization(scope.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button v-ltx="'dicDelete'" type="danger" size="small" icon="el-icon-delete" circle @click="deleteOrganization(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
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
