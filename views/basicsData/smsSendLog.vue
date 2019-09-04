<!--
   发送短信记录查询
-->
<template>
  <div class="p20">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>手机号码:</span>
          <el-input v-model="smsLog.sendPhone" placeholder="请输入手机号码" />
        </el-col>
        <el-col :span="6">
          <span>短信类型:</span>
          <el-input v-model="smsLog.smsContent" placeholder="请输入短信类型" />
        </el-col>
        <el-col :span="6">
          <span>用户名:</span>
          <el-input v-model="smsLog.smsRealname" placeholder="请输入用户名" />
        </el-col>
      </el-row>
    </div>
    <div class="topBar">
      <el-row>
        <el-col :span="12">
          <span>发送时间:</span>
          <el-date-picker v-model="smsLog.stateTime" type="date" placeholder="请选择"></el-date-picker>-
          <el-date-picker v-model="smsLog.endTime" type="date" placeholder="请选择"></el-date-picker>
        </el-col>

        <el-col :span="6" style="margin-left:10%">
          <el-button
            type="primary"
            icon="el-icon-search"
            class="pan-btn light-blue-btn"
            @click="getSmsLogList()"
          >查询</el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            class="pan-btn light-blue-btn"
            @click="getSmsRechargeList()"
          >重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table border :data="smsLogList" style="width: 100%" height="60vh" class="textList">
      <el-table-column prop="realname" label="用户名" align="center" width="150" />
      <el-table-column prop="sendPhone" label="手机号码" align="center" width="150" />
      <el-table-column prop="smsDate" label="发送时间" align="center" width="150" />
      <el-table-column prop="smsContent" label="发送内容" align="left" />
      <el-table-column label="短信类型" align="center" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.type==='log'">日志</template>
          <template v-else-if="scope.row.type==='processCheck'">工序验收</template>
          <template v-else-if="scope.row.type==='selfCheck'">自主验收</template>
          <template v-else-if="scope.row.type==='polling'">巡视</template>
          <template v-else-if="scope.row.type==='command'">指令</template>
          <template v-else-if="scope.row.type==='sideStation'">旁站</template>
          <template v-else-if="scope.row.type==='notice'">通知</template>
          <template v-else-if="scope.row.type==='meeting'">变更纪要</template>
        </template>
      </el-table-column>
      <el-table-column prop="sendNum" label="发送数量" align="center" width="100" />
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              circle
              @click="smsCheck(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-sizes="[10,20,30]"
      :page-size="10"
      :total="total"
      :current-page.sync="smsLog.pageNo"
      class="pageList pt20 mt1"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="getSmsLogList"
    />

    <!-- 详情查看 -->

    <el-dialog title="详情查看" :visible.sync="dialogVisible" width="30%"></el-dialog>
  </div>
</template>

<script>
import smsRechargeAPI from "../../api/smsRecharge";

export default {
  inject: ["reload"],
  name: "smsSendLog",
  data() {
    return {
      smsLog: {
        sendPhone: "",
        smsContent: "",
        smsRealname: "",
        stateTime: "",
        endTime: "",
        pageNo: 1,
        pageSize: 10
      },
      smsLogList: [], //手机短信记录
      total: 0
    };
  },
  created() {
    this.getSmsLogList();
  },
  methods: {
    getSmsLogList() {
      //查询短信发送记录
      smsRechargeAPI.getSmsInfoLogList(this.smsLog).then(res => {
        this.total = res.data.data.totalCount;
        this.smsLogList = res.data.data.data;
      });
    },
    handleSizeChange(data) {
      //分页的方法
      this.smsLog.pageSize = data;
      this.getSmsLogList();
    },
    smsCheck(data) {
      //查看详情
    },

    getSmsRechargeList() {
      this.reload();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.topBar {
     padding:0 5px; 
}
</style>
