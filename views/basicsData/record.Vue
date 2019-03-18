<template>
  <div class="p20">
    <span class="fl" style="padding-top: 1vh;">发送号码:</span>
    <span class="fl" style="padding-left: 1vw;"><el-input v-model="input" size="small" placeholder="请输入内容"/></span>

    <div class="rl">
        <el-button type="primary" size="small" icon="el-icon-search" @click="Rnquire()">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-refresh" @click="Reset()">重置</el-button>
    </div>
    <div >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="rolecode" label="发送时间"/>
        <el-table-column prop="rolename" label="发送内容"/>
        <el-table-column prop="rolename" label="发送号码"/>
        <el-table-column prop="rolecode" label="发送数量"/>
        <el-table-column prop="rolename" label="发送成功号码"/>
        <el-table-column prop="rolename" label="短信创建人"/>
        <el-table-column prop="rolecode" label="发送数量"/>
        <el-table-column prop="rolename" label="操作"/>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
  }
</script>
<style scoped>
</style>
