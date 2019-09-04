<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
         <span>工序:</span>
         <el-input v-model="queryParamData.process" size="small" placeholder="请输入工序"/>
        </el-col>
        
        <el-col :span="6">
          <span>工序编码:</span>
          <el-input v-model="queryParamData.code" size="small" placeholder="请输入工序编码"/>
        </el-col>
        <el-col :span="6">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="initTable()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-circle-plus-outline" @click="addProcess"> 新增 </el-button>
        </el-col>
      </el-row>
    </div>

  

    <!-- 数据列表 -->
    <el-table :data="tableData" :row-style="{height: '0'}" class="textList" height="68vh" stripe highlight-current-row
              border>
      <el-table-column prop="seq" label="序号" align="center"/>
      <el-table-column prop="process" label="工序" align="center"/>
      <el-table-column prop="createName" label="创建人" align="center"/>
      <el-table-column prop="createTime" label="创建时间" align="center"/>
      <el-table-column prop="processnumber" label="编码" align="center"/>
      <el-table-column min-width="150px" fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button v-ltx="'processingUpdate'" type="warning" size="small" icon="el-icon-edit" circle
                       @click="editProcess(scope.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button v-ltx="'processingDelete'" type="danger" size="small" icon="el-icon-delete" circle
                       @click="deleteProcessType(scope.row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="queryParamData.pageNo" :page-sizes="[10,20,30]" :page-size="queryParamData.pageSize"
                   :total="total" class="pageList pt20 mt1" background
                   layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                   @current-change="initTable"/>

    <!--新增、修改弹框-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="40%" append-to-body>
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="工序名称：" prop="process">
          <el-input v-model="form.process"/>
        </el-form-item>
        <el-form-item label="工序编码：" prop="processnumber">
          <el-input v-model="form.processnumber"/>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subimtProcess('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    inject: ['reload'],
    data() {
      return {
        tableData: [],
        form: {
          process: '',
          remark: '',
          processnumber: ''  //工序编码
        },
        queryParamData: {  //检索条件
          pageNo: 1,
          pageSize: 10,
          code: '',  //工序编码
          process: ''   //工序名称
        },
        dialogVisible: false,
        dialogTitle: '',  //弹框标题
        total: 0, // 总数
        rules: {
          process: [{ required: true, message: '请输入工序', trigger: 'blur' }],
          processnumber: [{ required: true, message: '请输入工序编码', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.initTable()
    },
    methods: {
      initTable() {
        request.post('/rest/process/getList', this.queryParamData).then(res => {
          this.tableData = res.data.data.data
          this.total = res.data.data.totalCount
        })
      },
      subimtProcess(form) {  //新增
        this.$refs[form].validate((valid) => {
          if (valid) {
            request.post('/rest/process/processAdd', this.form).then(res => {
              if (res.data.ok) {
                this.$message({
                  message: '恭喜你，添加成功',
                  type: 'warning'
                })
                this.dialogVisible = false
                this.initTable()
              }
            })
          }
        })
      },
      deleteProcessType(processTypeId) {
        this.$confirm('确定删除该工序类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>
          request.get(`/rest/process/delete/${processTypeId}`).then(res => {
            if (res.data.ok) {
              this.initTable()
            }
          })
        )
      },
      addProcess() {  //新增工序
        this.dialogVisible = true
        this.dialogTitle = '新增'
        this.form = {}
      },
      editProcess(row) {
        this.dialogVisible = true
        this.dialogTitle = row.process + '~修改'
        request.get(`/rest/process/getProcessById/${row.id}`).then(res => {
          if (res.data.ok) {
            this.form = res.data.data
          }
        })
      },
      handleSizeChange(size) {  //翻页的时候触发
        this.queryParamData.pageSize = size
        this.initTable()
      },
      // 重置按钮
      reset() {
        this.reload()
      }
    }
  }
</script>

<style lang="scss" scoped>
  body,
  html,
  .engineer {
    width: 100%;
    max-height: 100vh;
    overflow: hidden;
  }

  .processType {
    margin-bottom: 10px;
    overflow: hidden;

  .searchinfo {

  .el-input {
    width: 200px;
  }

  }
  .processHeader {
    margin: 1vw 0;
  }

  }

  .el-table thead {
    background-color: #ccc;
  }

  /deep/ .el-form-item__label {
    padding-right: 5px;
    width: auto;
  }

  .pan-btn {
    font-size: 0.8vw;
  }
</style>
