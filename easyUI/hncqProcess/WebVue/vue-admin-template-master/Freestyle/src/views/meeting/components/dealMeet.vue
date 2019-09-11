<template>
  <div class="dealMee">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="处理人:" prop="name" v-if="flag">
        <el-input
          placeholder="请选择处理人"
          v-model="form.name"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="checkMeetName"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="计划完成时间:" prop="plancompletionTime" v-if="flag">
        <el-date-picker
          type="date"
          placeholder="选择计划完成时间"
          v-model="form.plancompletionTime"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="处理说明:" prop="checkExplain">
        <el-input :rows="4" type="textarea" v-model="form.checkExplain" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input :rows="4" v-model="form.remarks" type="textarea" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <div style="display:flex;justify-content:flex-end">
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="warning" @click="onSubmit('0')">不通过</el-button>
          <el-button type="primary" @click="onSubmit('1')" v-if="isPass">通过</el-button>
          <el-button type="primary" @click="onSubmit('1')" v-if="isDone">完成</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 审核人 -->
    <el-dialog
      width="70%"
      title="处理人"
      :visible.sync="dialogusersVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.username" placeholder="请选择" @change="checkRealname"></el-input>
        <div class="rl">
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-refresh"
            @click="reset()"
          >重置</el-button>
        </div>
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
        <el-table-column type="index" width="50" ></el-table-column>
        <el-table-column property="realname" label="用户名" align="center"></el-table-column>
        <el-table-column property="zhiwei" label="职位" align="center"></el-table-column>
        <el-table-column property="mobilePhone" label="电话" align="center"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeUsersChange"
        @current-change="initUsername()"
      ></el-pagination>
      <div style="margin-left:70%">
        <el-button @click="dialogusersVisible=false">取 消</el-button>
        <el-button type="primary" @click="checkUser">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from "@/api/user.js";
import change from "@/api/change.js";
import tool from "@/utils/common.js";
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
      users: {
        username: "", // 人名
        pageNo: 1,
        pageSize: 10,
        moneyLevel: "" // 金额等级
      },
      usersData: [],
      // buttomName: "通过", // 按钮名称
      usersTotal: 0,
      isDone:false,
      isPass:true,
      dialogusersVisible: false,
      handleUser: null,
      flag: true,
      rules: {
        name: [{ required: true, message: "请选择处理人", trigger: "change" }],
        plancompletionTime: [
          { required: true, message: "请选择计划完成时间", trigger: "change" }
        ],
        checkExplain: [
          { required: true, message: "请输入处理说明", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.form.meetingId = this.nowItem;
    this.users.moneyLevel = this.moneyLevel;
    let info = localStorage.getItem("userInfo");
    let userinfo = JSON.parse(info);
    // 当前登录用户职位
    const zhiwei = userinfo.job_name_en;
    let money_position = tool.money_position;

    //debugger;
    // 金额等级 职位 都想等 是完
    for (var i = 0; i < money_position.length; i++) {
      if (
        money_position[i].moneyLevel == this.moneyLevel &&
        money_position[i].job_name_cn == zhiwei
      ) {
        // this.buttomName = "完成";
        this.isDone = true;
        this.isPass = false;
        this.flag = false;
        break;
      } else {
        // this.buttomName = "通过";
         this.isDone = false;
        this.isPass = true;
        this.flag = true;
      }
    }
  },
  methods: {
    checkRealname() {
      this.initUsername();
    },
    query() {
      this.initUsername();
    },
    reset() {
      this.users.username = "";
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
        this.usersTotal = res.data.data.totalCount;
        console.log(this.usersData, "this.usersData");
      });
    },

//     isAdopt: 1
// checkExplain: 滚滚滚
// meetingId: f6323b406d1aaa94016d1b5ee7340098
// userId: 40288a8f6c216896016c21ab3b1d0002
// name: 周杰
// plancompletionTime: 2019-09-12
// remarks: 国服

// isAdopt: 0
// checkExplain: 发电房
// meetingId: f6323b406d1aaa94016d1b5e4a460090
// userId: 40288a8f6cd27ea9016cd291ecc30009
// name: 陈驰
// plancompletionTime: 2019-09-12
// remarks: 发电房
    //提交
    onSubmit(form) {
      this.form.isAdopt = form;
      this.$refs["form"].validate(valid => {
        let that = this;
        if (valid) {
          change.dealApply(that.form).then(res => {
            if (res.data.ok) {
              that.$emit("comfirm");
              that.$emit("cancel"); //关闭弹框
            }
          });
        } else {
          console.log("error submit!!");
          return false;
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
/deep/.el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #303133;
  font-weight: 700;
  margin-top: 10px;
}
</style>