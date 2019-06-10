<template>
  <div class="p20 layoutBox">
    <div class="topBar">
      <el-row>
        <el-col :span="18">
          <span>姓名</span>
          <el-input v-model="form.userName" clearable placeholder="请输入内容"/>
          <span>创建日期:</span>
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="选择日期时间"
            style="min-width:200px"/>
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="选择日期时间"
            style="min-width:200px"/>
        </el-col>
        <el-col :span="6">
          <div class="rl">
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-search"
              @click="chaxun">查询</el-button>
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-refresh"
              @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      :row-style="{height: '0'}"
      class="textList"
      height="600"
      stripe
      highlight-current-row
      border>
      <el-table-column label="图片" align="center" >
        <template slot-scope="scope">
        <img :src="scope.row.filePath"></template>
      </el-table-column>
      <el-table-column prop="realname" label="姓名" align="center" >
        <template slot-scope="scope">
        <span>{{ scope.row.realname }}</span></template>
      </el-table-column>
      <el-table-column label="内容" align="center" >
        <template slot-scope="scope">
        <span>{{ scope.row.describe }}</span></template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" >
        <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
            <el-button type="primary" icon="el-icon-search" circle @click="handleEdit(scope.row)"/>
        </el-tooltip></template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage4"
      :page-sizes="[5,10,15,30]"
      :page-size="1"
      :total="total"
      class="pageList mt1"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>

    <el-dialog :title="'日志详情'" :visible.sync="dialogFormVisible" class="dialogBox">
      <logCheck :target-id="targetID"/>
    </el-dialog>
  </div>
</template>
<script>
import chaKanList from './components/chakanList'
import request from '@/utils/request'
import logCheck from '@/views/process/components/logCheck'
export default {
  inject: ['reload'],
  components: {
    chaKanList,
    logCheck
  },
  data() {
    return {
      form: {
        // 当前页
        pageNo: 1,
        // 每页条数
        pageSize: 5,
        // 姓名值
        userName: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: ''
      },
      formList: {
        // 时间
        createTime: '',
        // 描述
        describe: '',
        // 名字
        realname: '',
        // 图片
        pictures: [],
        // 经度
        lat: '',
        // 纬度
        lgt: '',
        // 地址
        photoLocation: ''
      },
      dialogFormVisible: false,
      total: 0,
      bookType: '',
      tableData: null,
      currentPage4: 1,
      noType: '',
      targetID: '' // 查看项id
    }
  },
  mounted() {},
  created() {
    this.fn()
  },
  methods: {
    handleSizeChange(val) {
      this.form.pageSize = val
      this.fn()
    },
    handleCurrentChange(val) {
      this.form.pageNo = val
      this.fn()
    },
    reset() {
      // 重置
      this.reload()
    },
    fn() {
      const objFrom = {
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        userName: this.form.userName,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      }
      return request
        .post('/rest/processInfoLog/everyDayLogPageList', objFrom)
        .then(res => {
          if (res.status == 200) {
            var data = res.data.data.data
            this.total = res.data.data.totalCount
            this.tableData = data
          }
        })
    },
    handleEdit(data) {
      this.formList.pictures.length = 0
      request.post(`/rest/processInfoLog/findLog/${data.id}`).then(res => {
        this.targetID = data.id
        this.formList.realname = res.data.data.realname
        this.formList.createTime = res.data.data.createTime
        this.formList.describe = res.data.data.describe
        this.formList.lat = res.data.data.lat
        this.formList.lgt = res.data.data.lgt
        this.formList.photoLocation = res.data.data.photoLocation
        this.formList.pictures.push(res.data.data.pictures)
      })
      this.dialogFormVisible = true
    },
    chaxun() {
      this.fn()
    }
  }
}
</script>

<style lang="scss" scoped>
.cx {
  margin-top: 15px;
}
.layoutBox {
  height: 100%;
  position: relative;
}
</style>

