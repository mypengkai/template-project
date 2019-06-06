<template>
  <div class="huixin-content">
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <div style="text-align: right">
            <el-button type="primary" plain class="pan-btn light-blue-btn" @click="resourceList(2)">移动端</el-button>
            <el-button type="primary" plain class="pan-btn light-blue-btn" @click="resourceList(1)">PC端</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="action('add')">新增</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <tree-table :data="menuList" class="textList" border row-key>
      <el-table-column label="菜单标题" height="250" align="center">
        <template slot-scope="scope">{{ scope.row.meta.title }}</template>
      </el-table-column>
      <el-table-column label="菜单名称" height="250" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="分支名称" align="center">
        <template slot-scope="scope">{{ scope.row.component }}</template>
      </el-table-column>
      <el-table-column label="菜单地址" align="center">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type==='0' ? '按钮': '菜单' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope" type="scope.row">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              v-ltx="'resourceUpdate'"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="action(scope.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
            <el-button
              v-ltx="'resourceAdd'"
              :disabled="scope.row.type==='button'?true:false"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="action(scope.row,true)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              v-ltx="'resourceDelete'"
              :disabled="scope.row.children.length>0?true:false"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="Delete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 新增/修改弹框 -->
    <el-dialog :title="newTitle" :visible.sync="dialogFormVisible" :before-close="closeResourceDialog" :append-to-body="true" :lock-scroll="false" class="dialogBox">
      <template>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="资源名称：" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资源类型：">
                <el-switch v-model="ruleForm.type" active-color="#13ce66" active-value="1" inactive-value="0" inactive-color="#ff4949" />
                <span ref="el_switch_type">菜单</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用设备：">
                <el-switch v-model="ruleForm.isVueFunction" active-color="#13ce66" active-value="1" inactive-value="2" inactive-color="#ff4949"/>
                <span ref="el_switch_Mark">PC端</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item v-if="flag" label="父资源名称：" prop="ID">
                <el-input :disabled="flag" :placeholder="ruleForm.parentName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资源标题：" prop="title">
                <el-input v-model="ruleForm.title"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资源图标：" prop="icon">
                <el-input v-model="ruleForm.icon"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资源组件：" prop="component">
                <el-input v-model="ruleForm.component"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单路径：" prop="path">
                <el-input v-model="ruleForm.path"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单排序：" prop="functionLevel">
                <el-input-number v-model="ruleForm.functionLevel" :min="1" :max="100" controls-position="right" label="菜单排序"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
  </div>

</template>
<script>
import treeTable from '@/components/TreeTable'
import api from '@/api/resource.js'
export default {
  name: 'TreeTable',
  components: {
    treeTable
  },
  data() {
    // 判断是否为正整数
    const checkFunctionLevel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('菜单排序不能为空'))
      } else {
        if (Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) < 999) {
          callback()
        } else {
          return callback(new Error('请输入正整数'))
        }
      }
    }
    return {
      newTitle: '',
      dialogFormVisible: false,
      menuList: [],
      flag: true,
      mark: 1,
      // 新增修改时发生
      ruleForm: {
        name: '', // 菜单名称
        pId: '', // 父菜单id
        title: '', // 菜单标题
        icon: '', // icon图标
        component: '', // 组件
        path: '', // 菜单路径
        isVueFunction: '1', // 设备标识
        id: '',
        type: '1',
        parentName: '',
        functionLevel: 1 // 菜单排序
      },
      rules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
        ID: [{ required: false, message: '请输入父级资源ID', trigger: 'blur' }],
        title: [{ required: true, message: '请输入资源标题', trigger: 'blur' }],
        Mark: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        functionLevel: [{ required: true, message: '请输入菜单排序', validator: checkFunctionLevel, trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 监听 type的变化
    ruleForm: {
      handler(val, oldVal) {
        // 资源类型
        switch (val.type) {
          case '1':
            this.$refs.el_switch_type.innerHTML = '菜单'
            break
          case '0':
            this.$refs.el_switch_type.innerHTML = '按钮'
            break
        }
        // 使用设备
        switch (val.isVueFunction) {
          case '1':
            this.$refs.el_switch_Mark.innerHTML = 'PC端'
            break
          case '2':
            this.$refs.el_switch_Mark.innerHTML = '移动端'
            break
        }
      },
      deep: true
    }
  },
  created() {
    this.resourceList(this.ruleForm.isVueFunction)
  },
  methods: {
    action(val, son) {
      if (val === 'add') {
        this.newTitle = '新增'
        this.flag = false
        this.ruleForm = {}
      } else if (son) {
        this.newTitle = val.meta.title + '~新增'
        this.flag = true
        this.ruleForm.pId = val.id
        this.ruleForm.parentName = val.meta.title
      } else {
        this.newTitle = '修改'
        this.flag = true
        this.getmenuObj(val.id)
      }
      this.dialogFormVisible = true
    },
    // 树形列表
    resourceList(num) {
      this.menuList = []
      api.menuList({ Mark: num, type: 'menu' }).then(res => {
        this.menuList = res.data.data
      })
    },
    // 删除按钮
    Delete(data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._menuDelete(data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 删除请求
    _menuDelete(data) {
      api.menuDelete(data.id).then(res => {
        this.resourceList()
      })
    },
    // 关闭dialog
    closeResourceDialog(data) {
      this.ruleForm = {}
      this.flag = false
      this.newTitle = ''
      this.dialogFormVisible = false
    },
    // 根据id获取单个菜单对象
    getmenuObj: function(id) {
      const that = this
      api.menuCheck(id).then(res => {
        that.ruleForm = res.data.data
      })
    },
    // 提交对象
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新增
          api.menuAdd(this.ruleForm).then(res => {
            this.$emit('comfirm')
            this.$message({
              type: 'success',
              message: '已完成!'
            })
            this.$emit('cancel')
          })
        } else {
          return false
        }
      })
      // 刷新当前列表
      this.closeResourceDialog('')
      this.resourceList(this.ruleForm.isVueFunction)
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
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
.pan-btn{
  font-size: .8vw;
}
</style>
