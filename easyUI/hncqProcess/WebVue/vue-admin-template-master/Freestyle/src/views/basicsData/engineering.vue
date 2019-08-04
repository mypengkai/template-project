<!--
   工程分部分项
-->
<template>
  <div class="p20" ref="projectContent">
    <!-- 选择区域 -->
    <el-row style="padding: 10px">
      <el-col :span="18">
        <div style="opacity: 0;">&nbsp;</div>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          icon="el-icon-download"
          class="pan-btn light-blue-btn" @click="projectTemplateDownLoad">下载</el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          icon="el-icon-zoom-out"
          class="pan-btn light-blue-btn"
          @click="ImportProjectFromExcel">导入</el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="pan-btn light-blue-btn"
          @click="projectAdd('add')">新增</el-button>
      </el-col>
    </el-row>
    <!-- 操作列表 -->
    <el-table ref="projectItemTreeTable" :data="dataList" row-key="id" class="textList" default-expand-all border
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="projectItem" label="工程分部分项" align="center"></el-table-column>
      <el-table-column prop="name" label="所属组织机构" align="center"></el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.projectType==='1'">
            单位工程
          </template>
          <template v-else-if="scope.row.projectType==='2'">
            子单位工程
          </template>
          <template v-else-if="scope.row.projectType==='3'">
            分部工程
          </template>
          <template v-else-if="scope.row.projectType==='4'">
            子分部工程
          </template>
          <template v-else-if="scope.row.projectType==='5'">
            分项工程
          </template>
          <template v-else-if="scope.row.projectType==='6'">
            子分项工程
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="startStation" label="起始桩号" align="center"></el-table-column>
      <el-table-column prop="endStation" label="终止桩号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button v-ltx="'engineeringUpdate'" type="primary" icon="el-icon-edit" circle @click="updateProject(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
            <el-button v-ltx="'engineeringAdd'" type="primary" icon="el-icon-plus" circle @click="projectAdd(scope.row)" />
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button v-ltx="'engineeringDelete'" type="danger" icon="el-icon-delete" circle @click="deleteProject(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹框 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" class="dialogBox">
      <el-form class="reverseBox" :model="projectForm" :rules="rules" ref="addProjectForm" label-width="120px">
        <el-form-item label="组织机构:" >
          <el-input v-model="userGroup.value" @focus="InitUserGroupTree" placeholder="请选择组织机构"  :readonly="true" suffix-icon="el-icon-more-outline"/>
          <el-popover
            ref="userGroupPopover"
            v-model="userGroup.flag"
            placement="bottom-start"
            width="350"
            trigger="click">
            <el-tree
              :data="orgUserGroupList"
              :props="defaultUserGroupProps"
              highlight-current
              :default-expand-all="true"
              @node-click="handleUserGroupNodeClick"
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="工程分部分项:">
          <el-input v-model="projectForm.projectItem" placeholder="请输入工程分部分项"/>
        </el-form-item>
        <el-form-item label="父工程分部分项:" >
          <el-input v-model="projectItem.value" @focus="InitProjectItemTree" placeholder="请选择工程分部分项" :readonly="true" suffix-icon="el-icon-more-outline"/>
          <el-popover
            ref="userGroupPopover"
            v-model="projectItem.flag"
            placement="bottom-start"
            width="350"
            trigger="click">
            <el-tree
              :data="projectItemTreeList"
              :props="defaultProjectTreeProps"
              highlight-current
              @node-click="handleProjectItemNodeClick"
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="桩号:" >
          <el-col :span="11">
            <el-input v-model="projectForm.startStation" placeholder="请输入起始桩号"/>
          </el-col>
          <el-col :span="2">~</el-col>
          <el-col :span="11">
            <el-input v-model="projectForm.endStation" placeholder="请输入终止桩号"/>
          </el-col>
        </el-form-item>
        <el-form-item label="经纬度:" >
          <el-col :span="11">
            <el-input v-model="projectForm.lgt" placeholder="请输入经度"/>
          </el-col>
          <el-col :span="2">~</el-col>
          <el-col :span="11">
            <el-input v-model="projectForm.lat" placeholder="请输入纬度"/>
          </el-col>
        </el-form-item>
        <el-form-item label="工程类型:" >
          <el-select v-model="projectForm.projectType" placeholder="请选择">
            <el-option
              v-for="item in projectTypeDataList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
    </el-dialog>

  <!-- 数据上传 -->
    <el-dialog :visible.sync="dialogImportDataVisible" title="导入数据" width="30%">
      <el-form label-width="80px">
        <el-form-item label="组织机构:" >
          <el-input v-model="userGroupImport.value" @focus="InitImportUserGroupTree" placeholder="请选择组织机构"  :readonly="true" suffix-icon="el-icon-more-outline"/>
          <el-popover
            v-model="userGroupImport.flag"
            placement="bottom-start"
            width="350"
            trigger="click">
            <el-tree
              :data="dataImportUserGroupList"
              :props="defaultUserGroupProps"
              highlight-current
              :default-expand-all="true"
              @node-click="handleImportUserGroupNodeClick"
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="文件上传:">
          <input type="file" accept=".xls">
        </el-form-item>
      </el-form>
      <div class="buttomBox">
        <el-button type="primary" @click="dialogFormVisiblechannel = false">取消</el-button>
        <el-button type="primary" @click="ImportDataComfim">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import SelectTree from "@/components/SelectTree/selectTree"
import treeTable from '@/components/TreeTable'
import api from '@/api/project'
import organization from '@/api/Organization'
export default {
  name: 'engineering',
  data(){
    let userGroupIdValidator = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请选择所属组织机构'));
      } else {
        return callback() // 一些同学的问题可能就出在这里
      }
    };
    let projectItemValidator= (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入工程分部分项'));
      } else {
        return callback() // 一些同学的问题可能就出在这里
      }
    };
    let startStationValidator= (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入起始桩号'));
      } else {
        return callback() // 一些同学的问题可能就出在这里
      }
    };
    let endStationValidator= (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入终止桩号'));
      } else {
        return callback() // 一些同学的问题可能就出在这里
      }
    };
    let projectItemTypeValidator= (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请选择工程分部分项'));
      } else {
        return callback() // 一些同学的问题可能就出在这里
      }
    };
    return{
      describe: "工程分部分项",
      templateUrl: 'static/template/分部,分项工程导入模板.xls', // 下载路径
      dataList: [],   //数据列表
      dialogFormVisible: false,   //弹框不可见
      dialogFormTitle: '',   //修改和新增弹框名称
      projectForm: {   //工程分部分项表单
        id:'',
        userGroupId: '',   //组织机构id
        projectItem: '',  //新增的工程分部分项名称
        fuid:'',   //父工程分部分项id
        startStation: '',
        endStation: "",
        lgt: "",
        lat: "",
        projectType: "",
        projectCode: "",
        seq: "",
        userid: "",
        createTime: ""
      },
      rules: {  //工程分部分项 校验规则
        userGroupId: {
          required: true,
          trigger: "change",
          validator: userGroupIdValidator
        },
        projectItem: {
          required: true,
          trigger: "blur",
          validator: projectItemValidator
        },
        startStation: {
          required: true,
          trigger: "blur",
          validator: startStationValidator
        },
        endStation: {
          required: true,
          trigger: "blur",
          validator: endStationValidator
        },
        projectType: {
          required: true,
          trigger: "change",
          validator: projectItemTypeValidator
        }
      },
      //组织机构树
      defaultUserGroupProps: {
        children: "children",
        label: "name"
      },
      orgUserGroupList: [], // 组织机构树
      userGroup:{
        value: '',
        flag: false,
        selectedUserGroup: null  //选中的对象
      },
      //父工程分部分项树
      defaultProjectTreeProps: {
        children: "children",
        label: "projectItem"
      },
      projectItemTreeList: [],
      projectItem:{
        value: '',
        flag: false,
        selectedProjectItem: null
      },
      projectTypeDataList:[{
        value: '1',
        label: '单位工程'
      }, {
        value: '2',
        label: '子单位工程'
      }, {
        value: '3',
        label: '分部工程'
      }, {
        value: '4',
        label: '子分部工程'
      }, {
        value: '5',
        label: '分项工程'
      }, {
        value: '6',
        label: '子分项工程'
      }],
      //数据导入
      dialogImportDataVisible: false,
      userGroupImport:{
        value: '',
        flag: false
      },
      dataImportUserGroupList:[]
    }
  },
  components: {
    SelectTree,
    treeTable
  },
  created() {
    this.initProjectList()
  },
  methods:{
    initProjectList(){
      api.projectList().then(res => {
        this.dataList = res.data.data
      })
    },
    projectTemplateDownLoad(){  //下载 工程分部分项Excel模板
      let elemIF=document.createElement('iframe')
      elemIF.src = this.templateUrl;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
    },
    projectAdd(method){   //新增父分部分项
      this.dialogFormVisible=true;   //表单是否可见
      if(method==='add'){      // pid=null  父id为空的情况
        this.projectForm={};
        this.projectItem={};
        this.userGroup={};
        this.dialogFormTitle='新增';
      }else{
        this.dialogFormTitle=method.projectItem+'~新增';
        //默认将父工程分部分项给值
        //其他内容要为空
        this.projectForm={};
        this.projectItem.value=method.projectItem;
        this.projectForm.fuid=method.id;
        this.userGroup.value=method.departname;
        this.projectForm.userGroupId=method.departId;
      }
    },
    updateProject(data){   //修改工程分部分项
      this.dialogFormVisible=true;   //表单是否可见
      this.dialogFormTitle=data.projectItem+'~修改';
      this.getProjectItemById(data);
    },
    deleteProject(data){    //删除工程分部分项
      this.$confirm('即将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.projectItemDelete(data)
      })
    },
    ImportProjectFromExcel(){   //工程分部分项从Excel导入
      this.dialogImportDataVisible=true;
    },
    InitUserGroupTree(){    //  初始化组织机构树
      organization.organizateTree(null).then(res => {
        this.orgUserGroupList = res.data.data
      })
      this.userGroup.flag=true;
    },
    handleUserGroupNodeClick(data){   //选择组织机构后的回选
      this.userGroup.selectedUserGroup=data;   //选中的数据对象
      this.userGroup.value=data.name;
      this.projectForm.userGroupId=data.id;
      this.userGroup.flag=false;   //让其隐藏
    },
    InitProjectItemTree(){  //初始化工程分部分项
      if(this.userGroup.selectedUserGroup.children.length > 0) {
        this.$message({
          message: "组织机构只能选标段"
        });
      }else {
        //获取工程分部分项
        api.projectList({orgId: this.projectForm.userGroupId}).then(res => {
          if (res.data.data!==null) {
            this.projectItemTreeList = res.data.data;
            this.projectItem.flag=true;
          } else {
            this.$message({
              message: "暂无数据"
            });
            this.projectItem.flag=false;
            this.projectForm.fuid='';
          }
        });
      }
    },
    handleProjectItemNodeClick(data){
      this.projectItem.selectedProjectItem=data;
      this.projectItem.value=data.name;
      this.projectForm.fuid=data.id;
      this.projectItem.flag=false;  //隐藏
    },
    onSubmit(){  //提交数据新增
      let that=this;
      this.$refs['addProjectForm'].validate((valid) => {
        if (valid) {
          console.log(that.projectForm);
          api.projectAdd(that.projectForm).then(res => {
            this.$message({
              type: "success",
              message: that.dialogFormTitle+"完成!"
            });
            //刷新列表
            that.initProjectList();
            that.dialogFormVisible=false;  //关闭弹框
          });
        }
      });
    },
    projectItemDelete(data){   //删除工程分部分项
      api.projectDelete(data.id).then(res => {
        this.$message({
          type: 'success',
          message: res.data.message
        });
        //刷新列表
        this.initProjectList();
      })
    },
    getProjectItemById(data){
      api.projectCheck(data.id).then(res=>{
        this.projectForm=res.data.data;
        //父和名称
        this.projectForm.fuid= res.data.data.pid;
        this.userGroup.value=res.data.data.departname;
        this.projectItem.value=res.data.data.parentProjectItem;
      });
    },
    InitImportUserGroupTree(){  //初始化数据导入组织机构
      organization.organizateTree(null).then(res => {
        this.orgUserGroupList = res.data.data
      })
    },
    handleImportUserGroupNodeClick(data){

    },
    ImportDataComfim(){   //确认数据导入

    }
  }
}
</script>

<style lang="scss" scoped>
.Treebox {
  // height: 60vh;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 30px;
  text-align: center;
}
.Treebox::-webkit-scrollbar {
  // display: none;
}
.buttomBox {
  text-align: right;
}
</style>
