<template>
  <div class="transpondBox">
    <el-form :model="transpondForm" label-width="120px" ref="transpondForm" :rules="rules">
      <el-form-item label="处理人：" prop="transpondName">
        <el-input
          :readonly="true"
          v-model="transpondForm.zhidingrenName"
          clearable
          placeholder="请选择"
        >
          <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="计划完成时间：" prop="planFinishTime">
        <el-date-picker
          v-model="transpondForm.planFinishTime"
          type="date"
          placeholder="选择日期时间："
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="transpondForm.remark"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="tar">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="transpondCommand('transpondForm')">确 定</el-button>
    </div>
    <!-- 选择处理人 -->
    <el-dialog
      class="dialogBox"
      width="45%"
      title="选择处理人"
      :visible.sync="acceptUserDialog"
      append-to-body
    >
      <div class="topBar">
        <span>组织机构:</span>
        <el-select v-model="receiveData.userGroupId" placeholder="请选择">
          <el-option
            v-for="item in userGroupTree"
            :key="item.id"
            :label="item.departname"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>姓名:</span>
        <el-input v-model="receiveData.realname" placeholder="请输入姓名"></el-input>
        <el-button
          class="pan-btn light-blue-btn"
          type="primary"
          icon="el-icon-search"
          @click="query()"
        >查询</el-button>
      </div>
      <el-table
        border
        :data="receiveUsersList"
        highlight-current-row
        height="50vh"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职位"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>

      <el-pagination
        background
        :current-page.sync="receiveData.pageNo"
        :page-sizes="[10,20,30]"
        :page-size="receiveData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="receiveUserList()"
        :total="total"
      ></el-pagination>
    </el-dialog>

    <!-- 快捷回复 -->
    <el-dialog width="50%" class="dialogBox" title="指令完成" :visible.sync="dialogremarkVisible" append-to-body>
      <remark @cancel="dialogremarkVisible=false"></remark>
    </el-dialog>
  </div>
</template>
<script>
import Organization from "@/api/Organization.js";
import processInfo from "@/api/process.js";
import remark from "@/components/remark";
import instruct from "@/api/instruct.js";
export default {
  props: {
    nowItem: {
      type: Object
    }
  },
  components: { remark },
  data() {
    return {
      transpondForm: {
        commanduserId: "", // 指令用户表id
        zhidingren: "", // 指定人id
        zhidingrenName: "", // 处理人名称
        remark: "", // 备注
        planFinishTime: ""
      },
      acceptUserDialog: false,
      dialogremarkVisible: false,
      receiveUsersList: [],
      userGroupTree: [],
      total: 0,
      receiveData: {
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        userGroupId: "",
        realname: "", //用户真实名字
        position: "" //职位
      },
      rules:{
        zhidingrenName: [
            { required: true, message: '请选择处理人', trigger: 'change' }
          ],
          planFinishTime: [
            { required: true, message: '请选择时间', trigger: 'change' }
          ],
      }
    };
  },
  created() {
    console.log(this.nowItem)
    this.initUserGroupTree();
    this.receiveUserList();
    this.transpondForm.commanduserId = this.nowItem.commanduserId;
  },
  methods: {
    alertAcceptUserDialog() {
      this.acceptUserDialog = true;
    },
    checkRemark() {
      this.dialogremarkVisible = true;
    },
    receiveUserList() {
      //接收人列表
      processInfo.getUsersByDepartId(this.receiveData).then(res => {
        this.total = res.data.data.totalCount;
        this.receiveUsersList = res.data.data.data;
      });
    },
    query() {
      this.receiveUserList();
    },
    handleCurrentChange(val) {
      //确认接收人
      this.transpondForm.zhidingrenName = val.username;
      this.transpondForm.zhidingren = val.id;
      this.acceptUserDialog = false;
    },
    initUserGroupTree() {
      // 初始化组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    close(){
        this.$emit('cancel')
    },
    transpondCommand(formName) {
         this.$refs[formName].validate((valid) => {
          let that = this
          if (valid) {
            instruct.InstructionCommand(that.transpondForm).then(res => {
              if (res.data.ok) {
                that.$message({
                  message: "转发成功",
                  type: "warning"
                });
                that.$emit("comfirm");
                that.$emit("cancel");
              }
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
};
</script>