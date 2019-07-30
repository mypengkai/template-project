<!--
   发送短信记录查询
-->
<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>手机号码:</span>
      <el-input v-model="smsLog.sendPhone"  placeholder="请输入手机号码" />
      <span>短信内容:</span>
      <el-input v-model="smsLog.smsContent"  placeholder="请输入手机号码" />
      <div class="rl">
        <el-button type="primary" size="small" icon="el-icon-search" class="pan-btn light-blue-btn" @click="getSmsRechargeList()">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-refresh" class="pan-btn light-blue-btn" @click="getSmsRechargeList()">重置</el-button>
      </div>
    </div>
    <el-table :data="smsLogList" style="width: 100%" height="67vh" class="textList">
      <el-table-column prop="smsDate" label="发送时间"/>
      <el-table-column prop="sendPhone" label="手机号码"/>
      <el-table-column prop="smsContent" label="发送内容"/>
      <el-table-column prop="userName" label="用户名称"/>
      <el-table-column prop="sendNum" label="发送数量"/>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-sizes="[7,15,20,30]" :page-size="1" :total="total" :current-page.sync="smsLog.pageNo" class="pageList pt20 mt1" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="getSmsLogList"/>

  </div>


</template>

<script>
import smsRechargeAPI from '../../api/smsRecharge'
export default {
  name: "smsSendLog",
  data () {
    return {
      smsLog: {
        sendPhone: "",
        smsContent: "",
        pageNo: 1,
        pageSize: 15
      },
      smsLogList: [],  //手机短信记录
      total: 0
    }
  },
  created(){
    this.getSmsLogList()
  },
  methods: {
    getSmsLogList(){   //查询短信发送记录
      smsRechargeAPI.getSmsInfoLogList(this.smsLog).then(res=>{
        this.total = res.data.data.totalCount
        this.smsLogList = res.data.data.data
      })
    },
    handleSizeChange(data){   //分页的方法
      this.smsLog.pageSize=data
      this.getSmsLogList()
    },
    findSmsInfoDetail(data){  //查看详情

    }
  }
}
</script>

<style scoped>

</style>
