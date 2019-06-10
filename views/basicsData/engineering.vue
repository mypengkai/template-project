<template>
  <div class="p20">
    <!-- 选择区域 -->
    <div>
      <el-row>
        <el-col :span="18">
          <div style="opacity: 0;">
            0
          </div>
        </el-col>
        <el-col :span="2">
          <a :href="downloadTemplate">
            <el-button
              type="primary"
              icon="el-icon-download"
              class="pan-btn light-blue-btn"
            >下载</el-button>
          </a>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-zoom-out"
            class="pan-btn light-blue-btn"
            @click="showDialog"
          >
            导入
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            class="pan-btn light-blue-btn"
            @click="action('add')"
          >
            新增
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 操作列表 -->
    <!-- <el-scrollbar> -->
    <!-- :eval-func="func" :eval-args="args" :expand-all="expandAll" -->
    <tree-table ref="projectItemTreeTable" :data="dataList" class="textList" row-key border>
      <el-table-column label="工程分部分项" align="center">
        <template slot-scope="scope">
          <span style>{{ scope.row.projectItem }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属组织机构" align="center">
        <template slot-scope="scope">
          <span style>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

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

      <el-table-column label="起始桩号" align="center">
        <template slot-scope="scope">
          <span style>{{ scope.row.startStation }}</span>
        </template>
      </el-table-column>

      <el-table-column label="终止桩号" align="center">
        <template slot-scope="scope">
          <span style>{{ scope.row.endStation }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span style>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button v-ltx="'engineeringUpdate'" type="primary" icon="el-icon-edit" circle @click="action(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
            <el-button v-ltx="'engineeringAdd'" type="primary" icon="el-icon-plus" circle @click="action(scope.row,true)" />
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button v-ltx="'engineeringDelete'" type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </tree-table>
    <!-- </el-scrollbar> -->

    <!-- 新增弹框 -->
    <el-dialog :title="newTitle" :visible.sync="dialogFormVisible" class="dialogBox">
      <Xcadd
        v-if="nowItem"
        :nop-id="nopId"
        :flag1="flag1"
        :now-item="nowItem"
        :flag="this.flag"
        @cancel="dialogFormVisible=false"
        @comfirm="_projectList"
      />
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisiblechannel" title="导入数据" width="30%">
      <el-form :model="from" label-width="80px">
        <el-form-item label="组织机构:">
          <select-tree :options="options" :props="defaultProp" @noDe="noDe" />
        </el-form-item>
        <el-form-item label="文件上传:">
          <input type="file" accept=".xls">
        </el-form-item>
      </el-form>
      <div class="buttomBox">
        <el-button type="primary" @click="dialogFormVisiblechannel = false">
          取消
        </el-button>
        <el-button type="primary" @click="channel">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import request from '@/utils/request'
import treeToArray from './customEval.js'
import Xcadd from './popUp/Xcadd'
import api from '@/api/project.js'
import { getToken } from '@/utils/auth'
import SelectTree from '@/components/SelectTree/selectTree.vue'
export default {
  name: 'TreeTable',
  components: {
    treeTable,
    Xcadd,
    SelectTree
  },
  data() {
    return {
      headers: {
        'X-AUTH-TOKEN': getToken()
      },
      idd: '',
      url: process.env.BASE_API + '/rest/projectItemInfo/addbyList',
      func: treeToArray,
      expandAll: false,
      dataList: [],
      newTitle: '', // 弹框标题变量
      answer: '', // 删除的响应变量
      nowItem: '',
      dialogFormVisible: false,
      dialogFormVisiblechannel: false,
      total: 0,
      nopId: '',
      args: [null, null, 'timeLine'],
      flag: true,
      flag1: true,
      options: [],
      downloadTemplate: 'static/template/分部,分项工程导入模板.xls', // 下载路径
      from: {
        projectName: '',
        remark: ''
      },
      defaultProp: {
        // 组织机构
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = '')
    }
  },
  mounted() {
    this.$refs.projectItemTreeTable.$el.classList.add('el-table--scrollable-y')
  },
  created() {
    this._projectList()
    this.projectInit()
  },
  methods: {
    handleAvatarSuccess(response) {
      const flag = response.message === '成功'
      if (flag) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      }
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isXLS = testmsg === 'xls'
      if (!isXLS) {
        this.$message.error('上传文件只能是 xls 格式!')
      }
      return isXLS
    },
    action(val, son) {
      if (val == 'add') {
        this.nowItem = val;
        (this.flag = false), (this.flag1 = true)
      }
      if (val != 'add') {
        son &&
          ((this.nowItem = {
            userGroupId: '',
            startStation: '',
            endStation: '',
            name: '',
            fuid: val.id,
            lgt: '',
            lat: '',
            projectItem: '',
            projectType: '',
            pName: val.projectItem,
            departname: val.departname
          }),
          (this.flag = true),
          (this.flag1 = true))
        !son &&
          ((this.nowItem = {
            userGroupId: val.userGroupId,
            startStation: val.startStation,
            endStation: val.endStation,
            name: val.name,
            fuid: val.pId,
            lgt: val.lgt,
            lat: val.lat,
            projectItem: val.projectItem,
            projectType: val.projectType,
            pName: val.projectItem,
            id: val.id
          }),
          (this.flag1 = false))
      }
      this.dialogFormVisible = true
      if (this.nowItem != 'add' && !son) {
        this.newTitle = '修改'
      } else {
        this.newTitle = '新增'
      }
    },
    _projectList() {
      api.projectList().then(res => {
        this.dataList = res.data.data
        console.log(this.dataList, 'this.dataList')
        const dataList = this.dataList
      })
    },
    // 删除按钮
    Delete(data) {
      this.$confirm('即将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._projectDelete(data)
      })
    },
    // 删除请求
    _projectDelete(data) {
      api.projectDelete(data.id).then(res => {
        const _message = res.data.message
        if (_message == '成功') {
          this.answer = 'success'
        } else {
          this.answer = 'error'
        }
        this._projectList()
        this.$message({
          type: this.answer,
          message: _message
        })
      })
    },

    //  组织机构查询
    projectInit() {
      request.get('/rest/organizate/depart').then(res => {
        if (res.data.respCode == 0) {
          this.options = res.data.data
        }
      })
    },

    // 组织机构
    noDe(data, checked, indeterminate) {
      this.from.projectName = data.name
      this.idd = data.id
    },
    // 导入
    showDialog() {
      this.dialogFormVisiblechannel = true
      this.from.projectName = ''
      this.from.remark = ''
    },
    //
    channel() {
      if (this.from.projectName == '') {
        this.$message({
          message: '请选择组织机构'
        })
        return false
      }
      this.$refs.upload.submit()
    }
    // 下载文件(本地)

  }
}
</script>

<style lang="scss" scoped>
.Treebox {
  // height: 60vh;
  overflow-x: hidden;
  overflow-y: scroll;
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
