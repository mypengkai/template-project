<template>
  <div class="p20">
    <div class="search">
      <el-row>
        <el-col :span="6"><div class="grid-content"><span>单位：</span><el-select filterable/></div></el-col>
        <el-col :span="6"><div class="grid-content"><span>单位工程：</span><el-select filterable/></div></el-col>
        <el-col :span="6"><div class="grid-content"><span>分部工程：</span></div></el-col>
        <el-col :span="6"><div class="grid-content"><span>子分部工程：</span></div></el-col>
      </el-row>
      <el-row>
        <div class="grid-content">
          <span>类型：</span>
          <el-radio-group v-model="searchType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">验收</el-radio>
            <el-radio :label="3">自检</el-radio>
            <el-radio :label="4">指令</el-radio>
            <el-radio :label="5">巡视</el-radio>
            <el-radio :label="6">变更</el-radio>
          </el-radio-group>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <span>日期：</span>
          <el-date-picker v-model="dateFrom" type="date"/>
          <span>至</span>
          <el-date-picker v-model="dateTo" type="date"/>
        </div>
      </el-row>
    </div>

    <div class="content">
      <el-tabs type="border-card">
        <el-tab-pane label="工程痕迹管理">
          <div style="height: 400px;">
            <list :trace-type="1"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员痕迹管理">
          <div style="height: 200px;">
            <list :trace-type="2"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import list from './detailList'
export default {
  name: 'TraceManage',
  components: {
    list
  },
  data() {
    return {
      department: '',
      departmentProject: '',
      searchType: 1,
      dateFrom: '',
      dateTo: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select {
    width: 70%;
  }
  .grid-content {
    height: 40px;
    line-height: 40px;
  }
  .content {
    margin-top: 10px;
  }
</style>
