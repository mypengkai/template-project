<template>
  <div class="p20" ref="projectContent">
     <div class="topBar">
      <el-row>
        <el-col :span="6">
        <span>组织机构:</span>
         <select-tree clearable :options="userGroupTree" :props="defaultUserGroupProps" node-key="id"
                   :default-expand-all="false" v-on:noDe="handleUserGroupCheckChange"
                   ref="ProjectItem_userGroup"/>
        </el-col>

        <el-col :span="8" style="margin-left:30%">
        <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="initProjectList">查询
        </el-button>
        <el-button type="primary" icon="el-icon-s-tools" class="pan-btn light-blue-btn" @click="setProjectItemKeyBtn">
          设置关键部位
        </el-button>
         <el-button type="primary" icon="el-icon-s-tools" class="pan-btn light-blue-btn" @click="setDeparent">
          设置分部分项编码
        </el-button>
        </el-col>
      </el-row>
    </div>



    <!-- 操作列表 -->
    <el-table ref="projectItemTreeTable" :data="dataList" class="textList" row-key="id" border
              lazy :load="loadNextProjectItemLayer" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              height="72vh">
      <el-table-column label="分部分项" align="left" prop="projectItem"></el-table-column>
      <el-table-column label="编码" align="center" width="100" prop="id"></el-table-column>
      <el-table-column label="父编码" align="center" width="100" prop="pid"></el-table-column>
      <el-table-column label="起始桩号" align="center" width="100" prop="startStation"></el-table-column>
      <el-table-column label="终止桩号" align="center" width="100" prop="endStation"></el-table-column>
      <el-table-column label="是否关键分项" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.iskey==='0'">否</span>
          <span v-if="scope.row.iskey==='1'">是</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成分项" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.iscomplete==='0'">未</span>
          <span v-if="scope.row.iscomplete==='1'">已</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150" prop="createTime"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button v-ltx="'engineeringUpdate'" type="warning" size="small" icon="el-icon-edit" circle
                       @click="updateProject(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹框 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" class="dialogBox">
       <div class="projectBox">
                <el-form class="reverseBox" :model="projectForm" :rules="rules" ref="addProjectForm" label-width="120px">
        <el-form-item label="组织机构:">
          <el-input v-model="userGroup.value" @focus="InitUserGroupTree" placeholder="请选择组织机构" :readonly="true"
                    suffix-icon="el-icon-arrow-down"/>
          <el-popover ref="userGroupPopover" v-model="userGroup.flag" placement="bottom-start" width="350"
                      trigger="click">
            <el-tree :data="orgUserGroupList" :props="defaultUserGroupProps" highlight-current
                     :default-expand-all="true" @node-click="handleUserGroupNodeClick"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="分部分项:" prop="projectItem">
          <el-input v-model="projectForm.projectItem" placeholder="请输入分部分项"/>
        </el-form-item>
        <el-form-item label="编码:" prop="id">
          <el-input v-model="projectForm.id" placeholder="编码" :readonly="true"/>
        </el-form-item>
        <el-form-item label="父工程分部分项:">
          <el-input v-model="projectItem.value" placeholder="请选择分部分项" :readonly="true"/>
        </el-form-item>
        <el-form-item label="父编码:">
          <el-input v-model="projectForm.pid" placeholder="请输入编码" :readonly="true"/>
        </el-form-item>
        <el-form-item label="桩号:">
          <el-col :span="11">
            <el-input v-model="projectForm.startStation" placeholder="请输入起始桩号"/>
          </el-col>
          <el-col :span="2">~</el-col>
          <el-col :span="11">
            <el-input v-model="projectForm.endStation" placeholder="请输入终止桩号"/>
          </el-col>
        </el-form-item>
        <el-form-item label="经纬度:">
          <el-col :span="11">
            <el-input v-model="projectForm.lgt" placeholder="请输入经度"/>
          </el-col>
          <el-col :span="2">~</el-col>
          <el-col :span="11">
            <el-input v-model="projectForm.lat" placeholder="请输入纬度"/>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
       </div>
    </el-dialog>

    <!-- 数据上传 -->
    <el-dialog :visible.sync="dialogImportDataVisible" title="导入数据" width="30%">
      <el-form label-width="80px">
        <el-form-item label="组织机构:">
          <el-input v-model="userGroupImport.value" @focus="InitImportUserGroupTree" placeholder="请选择组织机构"
                    :readonly="true" suffix-icon="el-icon-more-outline"/>
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
        <el-button type="primary" @click="ImportDataComfim()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 设置关键部位 -->
    <el-dialog :visible.sync="dialogSetPartKeyVisible" title="设置关键工序" :fullscreen="true">
      <el-form class="reverseBox" ref="setProjectItemKey" label-width="120px">
        <el-form-item label="组织机构:" prop="userGroupId">
          <select-tree clearable :options="userGroupTree" :props="defaultUserGroupProps" node-key="id"
                       :default-expand-all="false" v-on:noDe="handleSetKeyUserGroupCheckChange"
                       ref="setKeyProjectItem_userGroup"/>
        </el-form-item>
        <el-form-item label="分部分项:" prop="projectItem">
          <div style="height:66vh;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
            <el-tree :data="setProjectItemKey" :props="defaultSetKeyProjectItemProps" lazy show-checkbox node-key="id"
                     :load="loadNextLayer" highlight-current :default-checked-keys="defaultCheckedMenusKey"
                     :filter-node-method="filterNode" ref="setKeyProjectItemTree"/>
          </div>
        </el-form-item>
      </el-form>
      <div class="buttomBox">
        <el-button type="primary" @click="dialogSetPartKeyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSetKeyProjectItem()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import SelectTree from '@/components/SelectTree/selectTree'
  import treeTable from '@/components/TreeTable'
  import api from '@/api/project'
  import organization from '@/api/Organization'
  import role from '@/api/role.js'
  export default {
    name: 'engineering',
    data() {
      return {
        describe: '工程分部分项',
        templateUrl: 'static/template/分部,分项工程导入模板.xls', // 下载路径
        dataList: [],   //数据列表
        dialogFormVisible: false,   //弹框不可见
        dialogFormTitle: '',   //修改和新增弹框名称
        projectForm: {   //工程分部分项表单
          id: '',
          userGroupId: '',   //组织机构id
          projectItem: '',  //新增的工程分部分项名称
          fuid: '0',   //父工程分部分项id
          startStation: '',
          endStation: '',
          lgt: '',
          lat: '',
          projectType: '',
          projectCode: '',
          seq: 0,
          userid: '',
          createTime: ''
        },
        rules: {  //工程分部分项 校验规则
          userGroupId: [{ required: true, trigger: 'change', message: '请选择组织机构' }],
          projectItem: [{ required: true, trigger: 'blur', message: '请输入分部分项' }],
          projectType: [{ required: true, trigger: 'change', message: '请选择分部分项类型' }]
        },
        //组织机构树
        defaultUserGroupProps: {
          children: 'children',
          label: 'name'
        },
        orgUserGroupList: [], // 组织机构树
        userGroup: {
          value: '',
          flag: false,
          selectedUserGroup: null  //选中的对象
        },
        defaultCheckedMenusKey:[],  // 默认选中数组
        //父工程分部分项树
        defaultProjectTreeProps: {
          children: 'children',
          label: 'projectItem'
        },
        projectItemTreeList: [],
        projectItem: {
          value: '',
          flag: false,
          selectedProjectItem: null
        },
        projectTypeDataList: [{
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
        userGroupImport: {
          value: '',
          flag: false
        },
        dataImportUserGroupList: [],
        userGroupTree: [],  //组织机构树
        queryParamData: {
          userGroupId: ''   //组织机构id
        },
        //设置关键工序
        dialogSetPartKeyVisible: false,
        defaultSetKeyProjectItemProps: {
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        },
        setProjectItemKey: [],  //分部分项
        setProjectItemOrgId: '',  //设置关键工序中的组织机构id
        filterText: '',  //过滤数据
        getSelectedKeyIds: ''  //得到选中的关键部位
      }
    },
    components: {
      SelectTree,
      treeTable
    },
    watch: {
      filterText(val) {
        this.$refs.setKeyProjectItemTree.filter(val)
      }
    },
    created() {
      this.initOrganizationTreeTable()
    },
    methods: {
      initProjectList() {
        if (this.$tool.isEmptyStr(this.queryParamData.userGroupId)) {
          this.$message({
            type: 'warn',
            message: '请选择组织机构'
          })
        } else {
          api.getAllProjectItemTree({ userGroupId: this.queryParamData.userGroupId, pId: '0' }).then(res => {
            this.dataList = res.data.data
          })
        }
      },
      loadNextProjectItemLayer(tree, treeNode, resolve) {  //异步加载列表中分部分项
        api.getAllProjectItemTree({ userGroupId: this.queryParamData.userGroupId, pId: tree.id }).then(res => {
          resolve(res.data.data)
        })
      },
      projectTemplateDownLoad() {  //下载 工程分部分项Excel模板
        let elemIF = document.createElement('iframe')
        elemIF.src = this.templateUrl
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      },
      projectAdd(method) {   //新增父分部分项
        this.dialogFormVisible = true   //表单是否可见
        if (method === 'add') {      // pid=null  父id为空的情况
          this.projectForm = {
            id: '',
            userGroupId: '',   //组织机构id
            projectItem: '',  //新增的工程分部分项名称
            fuid: '0',   //父工程分部分项id
            startStation: '',
            endStation: '',
            lgt: '',
            lat: '',
            projectType: '',
            projectCode: '',
            seq: 0,
            userid: '',
            createTime: ''
          }
          this.projectItem = {}
          this.userGroup = {}
          this.dialogFormTitle = '新增'
        } else {
          this.dialogFormTitle = method.projectItem + '~新增'
          //默认将父工程分部分项给值
          //其他内容要为空
          this.projectForm = {
            id: '',
            userGroupId: '',   //组织机构id
            projectItem: '',  //新增的工程分部分项名称
            fuid: '0',   //父工程分部分项id
            startStation: '',
            endStation: '',
            lgt: '',
            lat: '',
            projectType: '',
            projectCode: '',
            seq: 0,
            userid: '',
            createTime: ''
          }
          this.projectItem.value = method.projectItem
          this.projectForm.fuid = method.id
          this.userGroup.value = method.departname
          this.projectForm.userGroupId = method.departId
        }
      },
      updateProject(data) {   //修改工程分部分项
        this.dialogFormTitle = data.projectItem + '~修改'
        this.getProjectItemById(data)
        this.dialogFormVisible = true   //表单是否可见
      },
      deleteProject(data) {    //删除工程分部分项
        this.$confirm('即将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.projectItemDelete(data)
        })
      },
      ImportProjectFromExcel() {   //工程分部分项从Excel导入
        this.dialogImportDataVisible = true
      },
      InitUserGroupTree() {    //  初始化组织机构树
        organization.organizateTree(null).then(res => {
          this.orgUserGroupList = res.data.data
        })
        this.userGroup.flag = true
      },
      handleUserGroupNodeClick(data) {   //选择组织机构后的回选
        this.userGroup.selectedUserGroup = data   //选中的数据对象
        this.userGroup.value = data.name
        this.projectForm.userGroupId = data.id
        this.userGroup.flag = false   //让其隐藏
      },
      InitProjectItemTree() {  //初始化工程分部分项
        if (this.userGroup.selectedUserGroup.children.length > 0) {
          this.$message({
            message: '组织机构只能选标段'
          })
        } else {
          //获取工程分部分项
          api.projectList({ orgId: this.projectForm.userGroupId }).then(res => {
            if (res.data.data !== null) {
              this.projectItemTreeList = res.data.data
              this.projectItem.flag = true
            } else {
              this.$message({
                message: '暂无数据'
              })
              this.projectItem.flag = false
              this.projectForm.fuid = ''
            }
          })
        }
      },
      handleProjectItemNodeClick(data) {
        this.projectItem.selectedProjectItem = data
        this.projectItem.value = data.projectItem
        this.projectForm.fuid = data.id
        this.projectItem.flag = false  //隐藏
      },
      onSubmit() {  //提交数据新增
        let that = this
        this.$refs['addProjectForm'].validate((valid) => {
          if (valid) {
            api.projectAdd(that.projectForm).then(res => {
              this.$message({
                type: 'success',
                message: that.dialogFormTitle + '完成!'
              })
              //刷新列表
              that.initProjectList()
              that.dialogFormVisible = false  //关闭弹框
            })
          }
        })
      },
      projectItemDelete(data) {   //删除工程分部分项
        api.projectDelete(data.id).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          //刷新列表
          this.initProjectList()
        })
      },
      getProjectItemById(data) {
        api.projectCheck(data.id).then(res => {
          this.projectForm = res.data.data
          //父和名称
          this.projectForm.fuid = res.data.data.pid
          this.userGroup.value = res.data.data.departname
          this.projectItem.value = res.data.data.parentProjectItem
        })
      },
      InitImportUserGroupTree() {  //初始化数据导入组织机构
        organization.organizateTree(null).then(res => {
          this.orgUserGroupList = res.data.data
        })
      },
      initOrganizationTreeTable() {  // 初始化树列表
        organization.organizateTree(null).then(res => {
          this.userGroupTree = res.data.data
        })
      },
      handleUserGroupCheckChange(item) {  //组织机构条件选择
        this.queryParamData.userGroupId = item.id
      },
      handleSetKeyUserGroupCheckChange(item) {  //设置关键工序的条件
        this.setProjectItemOrgId = item.id
        api.getAllProjectItemTree({ userGroupId: item.id, pId: '0' }).then(res => {
          this.setProjectItemKey = res.data.data;
        })
      },
   


      setProjectItemKeyBtn() {  //设置关键工序
        this.dialogSetPartKeyVisible = true
        api.getAllProjectItemKeyIds().then(res => {
          this.getSelectedKeyIds = res.data.data;
        })
      },
      loadNextLayer(node, resolve) {  //异步加载下一级分部分项
        if (node.level > 0) {
          api.getAllProjectItemTree({ userGroupId: this.setProjectItemOrgId, pId: node.data.id }).then(res => {
            let childNodes=[];
            for(let i=0;i<res.data.data.length;i++){
              childNodes.push({
                id: res.data.data[i].id,
                projectItem: res.data.data[i].projectItem,
                isLeaf: !res.data.data[i].projectItem
              })
              if(res.data.data[i].iskey=='1'){
                    this.defaultCheckedMenusKey.push(res.data.data[i])
              }
            }
             resolve(childNodes)
             this.$refs.setKeyProjectItemTree.setCheckedKeys(this.defaultCheckedMenusKey,false);
             console.log(this.$refs.setKeyProjectItemTree.setCheckedNodes(this.defaultCheckedMenusKey,false))
          })
           
        }
      },
      filterNode(value, data, node) {  //过滤分部分项
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      submitSetKeyProjectItem() {  //设置关键工序
        let ids = this.$refs.setKeyProjectItemTree.getCheckedKeys();
        let paramIds = ''
        for (let id of ids) {
          paramIds += id + ','
        }
        if (this.$tool.isEmptyStr(paramIds)) {
          this.$message({
            type: 'warn',
            message: '请选择需要设置的分部分项'
          })
        } else {
          api.setKeyProjectItemByIds({ ids: paramIds }).then(res => {
             if(res.data.ok){
                  this.$message({
                      type: 'success',
                      message: '设置成功'
                  })
                this.dialogSetPartKeyVisible = false
             }
          })
        }
      },
      handleImportUserGroupNodeClick(data) {

      },
      ImportDataComfim() {   //确认数据导入

      },
      setDeparent(){
          if(this.queryParamData.userGroupId==""){
              this.$message({
                message:"请选择组织机构"
              })
              return false
          }
          organization.setDeparent({departId:this.queryParamData.userGroupId}).then(res=>{
             if(res.data.ok){
                this.$message({
                  message:"设置成功"
                })
             }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .Treebox {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 30px;
    text-align: center;
  }

  .buttomBox {
    text-align: right;
  }
  .projectBox{
     height: 55vh;
     padding:0 20px;
     overflow-x: hidden;
  }
</style>
