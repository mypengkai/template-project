<template>
  <div class="p20">
    <!-- 选择区域 -->
    <div class="topBar p20">
      <el-col :span="4.5">
        <span>类型:</span>
        <el-select v-model="formUnified.type" placeholder="请选择" size="small">
          <el-option v-for="item in checkStateOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4.5">
        <span>内容：</span>
        <el-input
          size="small"
          class="inputName"
          placeholder="请输入内容"
          v-model="formUnified.text"
          clearable
          style="width:150px"
        ></el-input>

      </el-col>

      <el-col :span="8.5">
        <div class="grid-content">
          <span>创建日期：</span>
          <el-date-picker v-model="formUnified.startTime" type="date" size="small" value-format="yyyy-MM-dd"
                          placeholder="选择开始日期"/>
          <el-date-picker v-model="formUnified.endTime" type="date" size="small" value-format="yyyy-MM-dd"
                          placeholder="选择结束日期"
          />
        </div>
      </el-col>

      <el-col :span="5.5">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="initTable()">查询
        </el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-circle-plus-outline" @click="addText">
          新增
        </el-button>
      </el-col>

    </div>

    <!-- 数据列表 -->
    <el-table :data="tableData" :row-style="{height: '0'}" class="textList" height="72vh" stripe highlight-current-row
              border>
      <!--      <el-table-column prop="type" label="类型" align="center"/>-->
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.type=='selfcheck'">自检</template>
          <template v-else-if="scope.row.type=='notice'">通知</template>
          <template v-else-if="scope.row.type=='command'">指令</template>
          <template v-else-if="scope.row.type=='realcheck'">工序验收</template>
          <template v-else-if="scope.row.type=='polling'">巡视</template>
          <template v-else-if="scope.row.type=='sideStation'">旁站</template>
          <template v-else-if="scope.row.type=='meeting'">变更纪要</template>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="内容" align="center"/>
      <el-table-column prop="realname" label="创建人" align="center"/>
      <el-table-column prop="createtime" label="创建时间" align="center"/>
      <el-table-column min-width="120" fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button v-ltx="'processingUpdate'" type="warning" size="small" icon="el-icon-edit" circle
                       @click="editText(scope.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button v-ltx="'processingDelete'" type="danger" size="small" icon="el-icon-delete" circle
                       @click="deleteText(scope.row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="formUnified.pageNo" :page-sizes="[10,20,30]" :page-size="formUnified.pageSize"
                   :total="total" class="pageList pt20 mt1" background
                   layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                   @current-change="initTable"/>

    <!--新增、修改弹框-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="30%" append-to-body>
      <el-form :model="formData" ref="formData" label-width="120px">
        <el-form-item label="类型：">
          <el-select v-model="formData.type" placeholder="请选择" size="small" style="width: 100%;">
            <el-option v-for="item in checkStateOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="formData.text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subimtText('formData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import unifiedMessage from '@/api/unifiedMessage'

  export default {
    inject: ['reload'],
    data() {
      return {
        tableData: [],
        formData: {
          type: '',
          text: '',
          unifiedId: ''
        },
        formUnified: {
          type: '',
          text: '',
          startTime: '',
          endTime: '',
          pageNo: 1, // 当前页
          pageSize: 10 // 每页条数
        },
        dialogVisible: false,
        dialogTitle: '',  //弹框标题
        total: 0, // 总数
        /*   rules: {
             process: [{ required: true, message: '请输入工序', trigger: 'blur' }],
             processnumber: [{ required: true, message: '请输入工序编码', trigger: 'blur' }]
           },*/
        checkStateOptions: [{   //验收状态
          value: 'selfcheck',
          label: '自检'
        }, {
          value: 'notice',
          label: '通知'
        }, {
          value: 'command',
          label: '指令'
        }, {
          value: 'realcheck',
          label: '工序验收'
        }, {
          value: 'polling',
          label: '巡视'
        }, {
          value: 'sideStation',
          label: '旁站'
        }, {
          value: 'meeting',
          label: '变更纪要'
        }]
      }
    },
    mounted() {
      this.initTable()
    }
    ,
    methods: {
      initTable() {
        unifiedMessage.searchUnifiedApplyPage(this.formUnified).then(res => {
          this.tableData = res.data.data.data
          console.log('sssss', this.tableData)
          this.total = res.data.data.totalCount
        })
      },
      subimtText(formData) {  //新增
        this.$refs[formData].validate((valid) => {
          if (valid) {
            unifiedMessage.addUnifiedApply(this.formData).then(res => {
              if (res.data.ok) {
                this.$message({
                  message: '恭喜你，操作成功！',
                  type: 'success'
                })
                this.dialogVisible = false
                this.initTable()
              }
            })
          }
        })
      }
      ,
      deleteText(unifiedId) {
        this.$confirm('确定删除次条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>
          unifiedMessage.deleteUnifiedApply({ unifiedId: unifiedId }).then(res => {
            if (res.data.ok) {
              this.initTable()
            }
          })
        )
      },
      addText() {  //新增
        this.dialogVisible = true
        this.dialogTitle = '新增'
        this.formData = {}
      },
      editText(row) {
        // this.dialogTitle = ''
        this.formData = {
          type: row.type,
          text: row.text,
          unifiedId: row.id
        }
        this.dialogVisible = true
        this.dialogTitle = '修改'
      },
      /*unifiedMessage.addUnifiedApply({ unifiedId: row }).then(res => {
        if (res.data.ok) {
          this.formData = res.data.data
        }
      })*/
      handleSizeChange(size) {  //翻页的时候触发
        this.formUnified.pageSize = size
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
