<template>
  <div class="app-container">
    <div class="inquire" style>
      <div class="rl" style="margin-bottom:10px">
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="addOrganization('add')">新增</el-button>
      </div>
    </div>
    <el-table :data="organizationTreeTable" class="textList" border row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
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

    <!-- 新增弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle">
      <el-form :model="organizationForm" :rules="rules" ref="organizationForm" label-width="140px">
        <el-form-item label="组织机构:" prop="departname">
          <el-input v-model="organizationForm.departname" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="组织机构类型:" prop="orgtype">
          <el-select v-model="organizationForm.orgtype" placeholder="请选择">
            <el-option v-for="item in orgTypeOption" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织机构:" prop="parentdepartid">
          <select-tree clearable :options="organizationTreeTable" :props="defaultProps" node-key="id" :default-expand-all="false" v-on:noDe="handleCheckChange"
                       ref="organization_userGroup"/>
        </el-form-item>
        <el-form-item label="GPS搜寻范围(m):">
          <el-input v-model.number="organizationForm.searchRange" @input="inputChange($event)"/>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="organizationForm.description" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrganization('organizationForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import SelectTree from '@/components/SelectTree/selectTree.vue'
import request from '@/utils/request'

export default {
  name: 'TreeTableDemo',
  components: { treeTable, SelectTree },
  data() {
    return {
      organizationTreeTable: [],   //组织机构树表格
      dialogFormVisible: false,
      dialogTitle: "",  //弹框标题
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        parent: "parentdepartid",
      },
      parentOrganizationTree: [],  //父级组织机构树
      organizationForm: {  //组织机构表单提交数据
        departid: "",
        departname: "",
        description: "",
        parentdepartid: "",
        orgtype: "",
        searchRange: 100  //默认搜寻100米
      },
      orgTypeOption: [{  //组织机构类型
        value: '1',
        label: '项目'
      }, {
        value: '2',
        label: '业主'
      }, {
        value: '3',
        label: '监理'
      }, {
        value: '4',
        label: '标段'
      }],
      rules: {
        departname: [{required: true, message: '请输入组织机构名称', trigger: 'blur'}],
        parentdepartid: [{required: true, message: '请选择父组织机构', trigger: 'blur'}],
        orgtype: [{required: true, message: '请选择组织机构类型', trigger: 'change'}],
        description: [{required: false, message: '请选择组织机构类型', trigger: 'change'}]
      }
    }
  },
  created() {
    this.initOrganizationTreeTable()
  },
  methods: {
    addOrganization(item) {  // 新增弹框
      if(item==='add'){  //新增
        this.organizationForm={  //组织机构表单提交数据
          departid: "",
          departname: "",
          description: "",
          parentdepartid: "",
          orgtype: "",
          searchRange: 100
        };
        this.dialogTitle="组织机构新增";
        this.dialogFormVisible=true;
        this.$refs.organization_userGroup.labelModel="";  //清空
      }else{
        request.get('/rest/organizate/depart/' + item.id).then(res=>{
          this.organizationForm=res.data.data;
          this.organizationForm.departid=res.data.data.id;
          this.organizationForm.searchRange=res.data.data.search_range;
          if(res.data.data.parentdepartname===null && res.data.data.parentdepartid===null){
            this.organizationForm.parentdepartid="0";
          }else{
            this.$refs.organization_userGroup.labelModel=res.data.data.parentdepartname;
            this.organizationForm.parentdepartid=res.data.data.parentdepartid;
          }
        });
        this.dialogTitle=item.name+"~修改";
        this.dialogFormVisible=true;
      }
    },
    saveOrganization(form) { //新增接口
      this.$refs[form].validate((valid) => {
        if (valid) {
          request.post('/rest/organizate/addDepart', this.organizationForm).then(res => {
            if (res.data.ok) {
              this.$message({
                message: this.dialogTitle,
                type: 'success'
              })
              this.initOrganizationTreeTable();
              this.dialogFormVisible=false;
            }
          })
        }
      });
    },
    deleteOrganization(data) {  // 删除接口
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post('/rest/organizate/delete/' + data.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initOrganizationTreeTable()
        })
      })
    },
    initOrganizationTreeTable() {  // 初始化树列表
      request.get('/rest/organizate/depart').then(res => {
        this.organizationTreeTable = res.data.data
      })
    },
    handleCheckChange(data, checked, indeterminate) { // 组织机构选择后的数据---监听Tree 选择
      this.organizationForm.parentdepartid = data.id;
    },
    inputChange(e){  //文本框无法输入
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #ffff99 !important;
}
/deep/ .el-select {
  max-width: 800px;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: #ffff99;
}
/deep/.el-dialog__body {
  height: 60vh;
}
.pan-btn{
  font-size: .8vw;
}
</style>
