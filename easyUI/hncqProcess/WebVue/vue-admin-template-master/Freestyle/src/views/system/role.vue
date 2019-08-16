<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>角色名称:</span>
      <el-input v-model="roleName" placeholder="请输入内容"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="fn()">查询</el-button>
        <el-button type="primary"  icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="AddRoleDialog()">新增</el-button>
      </div>
    </div>
    <el-table border  :data="tableData" class="textList" height="70vh">
      <el-table-column prop="rolecode" label="角色编码"/>
      <el-table-column prop="rolename" label="角色名称"/>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="PC端权限" placement="top">
            <el-button type="success" icon="el-icon-zoom-in" size="small" circle @click="getPcAndAppShior(scope.row.id,'1')"/>
          </el-tooltip>
          <el-tooltip content="移动端权限" placement="top">
            <el-button type="primary" icon="el-icon-phone" size="small" circle @click="getPcAndAppShior(scope.row.id,'2')"/>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button v-ltx="'roleUpdate'" type="warning" size="small" icon="el-icon-edit" circle @click="AddRoleDialog(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-ltx="'roleDelete'" v-if="scope.row.rolecode==='brower' ? false : true" type="danger" size="small" icon="el-icon-delete" circle @click="deleteRole(scope.row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--新增弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="clearRoleData">
      <el-form ref="formSet" :model="formSet" :rules="rules" label-width="120px">
        <el-form-item label="角色编码:" prop="roleCode">
          <el-input v-model="formSet.roleCode" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="formSet.roleName" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole('formSet')">确 定</el-button>
      </div>
    </el-dialog>

    <!--树形列表弹框-->
    <el-dialog :title="dialogTreeTitle" :visible.sync="dialogSxlbVisible" class="dialogBox">
      <!--zreet -->
      <div class="shu">
        <el-tree ref="tree" :data="menuTreeData" :default-checked-keys="defaultCheckedMenusKey" :props="defaultProps" show-checkbox default-expand-all node-key="id" :check-strictly="true" highlight-current/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSxlbVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleRefMenus()">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import role from '@/api/role.js'
export default {
  inject: ['reload'],
  data() {
    return {
      dialogSxlbVisible: false,
      dialogTitle: '新增',
      tableData: null,
      roleName: '',  //模糊查询角色名称
      dialogFormVisible: false,
      formSet: {
        id: '',
        roleName: '',
        roleCode: ''
      },
      dialogTreeTitle: 'PC端权限',
      menuTreeData: [],  //菜单树
      defaultCheckedMenusKey: [],  //默认选中的角色id
      Mark: '',  //表示是手机还是平台
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { pattern: /^[\u4E00-\u9FA5]+$/, message: '角色名称只能为中文'}],
        roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }, { pattern: /^[a-zA-Z]+$/, message: '只能输入英文' }]
      }
    }
  },
  mounted() {
    this.fn()
  },
  methods: {
    fn() {  //数据列表
      role.roleList({ roleName: this.roleName }).then(res => {
        this.tableData = res.data.data
      })
    },
    addRole(form) { // 新增接口
      this.$refs[form].validate((valid) => {
        if (valid) {
          role.roleAdd(this.formSet).then(res => {
            if (res.data.respCode == '0') {
              this.$message({
                message: '恭喜你，新增成功',
                type: 'success'
              })
              this.fn()
              this.dialogFormVisible = false
            }
          })
        }
      });
    },
    // 编辑弹框
    AddRoleDialog(data) {
      if (data != null && data != undefined && data != '') {
        this.formSet.roleName = data.rolename
        this.formSet.roleCode = data.rolecode
        this.formSet.id = data.id
        this.dialogTitle = '编辑'
      } else {
        this.dialogTitle = '新增';
        this.formSet = {
          id: '',
          roleName: '',
          roleCode: ''
        }
      }
      this.dialogFormVisible = true
    },
    deleteRole(id) {  //删除角色
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        role.roleDelete(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fn()
        })
      })
    },
    getPcAndAppShior(id, Mark) {
      if (Mark === '2') {
        this.dialogTreeTitle = '移动端权限'
      } else if (Mark === '1') {
        this.dialogTreeTitle = 'PC端权限'
      }
      this.dialogSxlbVisible = true
      this.formSet.id = id
      this.Mark = Mark
      role.getResourceByRoleId({ id: id, Mark: Mark }).then(res => {
        this.menuTreeData = res.data.data
      })
      this.setMenuTreeChecked(id, Mark)
    },
    setMenuTreeChecked(id, mark) {  //设置菜单默认选中
      role.getFunctionByRoleId({ id: id, Mark: mark }).then(res => {
        this.defaultCheckedMenusKey = res.data.data
      })
    },
    saveRoleRefMenus() {  //保存角色和菜单之间的关联
      this.defaultCheckedMenusKey.length = 0
      for (const val of this.$refs.tree.getCheckedNodes()) {
        this.defaultCheckedMenusKey.push(val.id)
      }
      role.setRoleRelFunction({ roleid: this.formSet.id, functions: this.defaultCheckedMenusKey.join(','), Mark: this.Mark }).then(res => {
        this.$message({
          message: '恭喜你，保存成功',
          type: 'success'
        })
      })
      this.dialogSxlbVisible = false
    },
    // 重置按钮
    reset() {
      this.reload()
    },
    clearRoleData(data) {  // 清空role对象
      this.formSet = {
        id: '',
        roleName: '',
        roleCode: ''
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.roleList {
  float: left;
  width: 100%;
  .inquire {
    span {
      display: block;
    }
  }
}
.shu {
  overflow-y: auto;
  height: 500px;
}
</style>
