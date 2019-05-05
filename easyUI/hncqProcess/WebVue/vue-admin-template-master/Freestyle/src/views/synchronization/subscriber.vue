<template lang="">
    <div class="p20">
       <div class="tongbu" style="">
            <div class="rl" style="margin-bottom:10px">
              <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn"   @click="tongbu()">从物质平台同步</el-button>
               <el-button type="primary" icon="el-icon-refresh" class="pan-btn light-blue-btn"   @click="tongData()">同步数据</el-button>
            </div>
       </div>
     
       <el-table :data="userData" style="width: 100%" border height="600" class="textList">
            <el-table-column label="用户账号" align="center">
                <template slot-scope="scope">
                  <span style="">{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
                <template slot-scope="scope">
  <span style>{{scope.row.realname}}</span>
</template>
            </el-table-column>
            <el-table-column label="组织机构" align="center">
                <template slot-scope="scope">
  <span style>{{scope.row.departname}}</span>
</template>
            </el-table-column>
            <el-table-column label="同步状态" align="center">
                <template slot-scope="scope">
  <template v-if="scope.row.sid==='' || scope.row.sid===null">
    <i class="el-icon-close"></i>
  </template>
  <template v-else>
    <i class="el-icon-check"></i>
  </template>
</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
  <el-button type="primary" icon="el-icon-refresh" circle @click="renew(scope.row)"></el-button>
</template>
            </el-table-column>
        
        </el-table>
        <!-- 分页 -->
        <el-pagination class="mt1" background :page-sizes="[6,15,20,30]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="sendData.pageNo" @size-change="handleSizeChange" @current-change="getUserList()">
        </el-pagination>
    </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import request from "@/utils/request";
import api from "../../api/tongUser";
export default {
  name: "TreeTableDemo",
  components: { treeTable, SelectTree },
  data() {
    return {
      userData: [],
      total: 0,
      sendData: {
        pageNo: 1,
        pageSize: 6
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    tongbu() {
      //同步用户到用户中间件
      api.user().then(res => {
        if (res.data.respCode == 0) {
          (res.data.message = "成功"), (res.data.data = "同步到中间表成功");
          res.data.ok = true;
          res.data.respCode = -1;
          this.$message({
            message: "同步成功"
          });
        }
      });
    },
    getUserList() {
      //展示用户中间表信息
      api.userData(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userData = res.data.data.data;
        let userData = this.userData;
      });
    },
    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this.getUserList();
    },
    tongData() {
      this.getUserList();
    },
    renew(data) {
      var sid = data.sid;
      // 同步用户到用户表
      api.updateUserData({ id: data.id }).then(res => {
        if (sid !== null) {
          this.$message("该用户名已经存在,不能录入重复的信息");
        } else {
          this.$message("同步成功");
        }
        this.getUserList();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.pan-btn {
  font-size: 0.8vw;
}
</style>
