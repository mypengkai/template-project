<template>
  <div class="dealMee">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="审核人:">
        <el-input
          placeholder="请选择审核人"
          v-model="form.name"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="checkMeetName"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="处理结果:">
        <el-select v-model="form.isAdopt" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划完成时间:">
        <el-date-picker
          type="date"
          placeholder="选择计划完成时间"
          v-model="form.plancompletionTime"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="处理说明:">
        <el-input :rows="4" type="textarea" v-model="form.checkExplain" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input :rows="4" v-model="form.remarks" type="textarea" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <div style="display:flex;justify-content:flex-end">
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 审核人 -->
    <el-dialog
      width="70%"
      title="审核人"
      :visible.sync="dialogusersVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.username" placeholder="请选择" @change="checkRealname"></el-input>
      </div>
      <el-table
        ref="changeSingleTable"
        :data="usersData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handeUserCheck"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="realname" label="用户名"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeUsersChange"
        @current-change="initUsername()"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkUser">确 认</el-button>
        <el-button @click="dialogusersVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from "@/api/user.js";
import change from "@/api/change.js";
export default {
  props: {
    moneyLevel: {
      type: String
    },
    nowItem: {
      type: String
    }
  },
  data() {
    return {
      form: {
        isAdopt: "", // （0 通过 1 不通过）
        checkExplain: "", //原因
        meetingId: "", // 会议id
        userId: "", // 审核人id
        name: "",
        plancompletionTime: "", // 计划完成时间
        remarks: ""
      },
      options: [
        {
          value: "0",
          label: "通过"
        },
        {
          value: "1",
          label: "不通过"
        }
      ],
      users: {
        username: "", // 人名
        pageNo: 1,
        pageSize: 10,
        moneyLevel: "" // 金额等级
      },
      usersData: [],
      usersTotal: 0,
      dialogusersVisible: false,
      handleUser: null
    };
  },
  created() {
    this.form.meetingId = this.nowItem;
    this.users.moneyLevel = this.moneyLevel;
  },
  methods: {
    checkRealname() {
      this.initUsername();
    },
    handeUsersChange(val) {
      this.users.pageSize = val;
      this.initUsername();
    },
    handeUserCheck(val) {
      this.handleUser = val;
    },
    checkUser() {
      this.form.name = this.handleUser.realname;
      this.form.userId = this.handleUser.id;
      this.dialogusersVisible = false; //弹框消失
    },
    checkMeetName() {
      this.dialogusersVisible = true; //弹框消失
      this.initUsername();
    },
    initUsername() {
      user.getNextmeetUser(this.users).then(res => {
        this.usersData = res.data.data.data;
      });
    },
    //提交
    onSubmit() {
      if (this.form.name == "") {
        this.$message({
          message: "请选择审核人",
          type: "warn"
        });
        return false;
      }
      if (this.form.plancompletionTime == "") {
        this.$message({
          message: "请选择计划完成时间",
          type: "warn"
        });
        return false;
      }
      if (this.form.isAdopt == "") {
        this.$message({
          message: "请选择处理结果",
          type: "warn"
        });
        return false;
      }
      if (this.form.checkExplain == "") {
        this.$message({
          message: "请输入处理原因",
          type: "warn"
        });
        return false;
      }
      change.dealApply(this.form).then(res => {
        if (res.data.ok == true) {
          this.$message({
            message: "处理成功",
            type: "warn"
          });
           this.$emit("cancel"); //关闭弹框
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dealMee {
  padding-right: 30px;
}
</style>