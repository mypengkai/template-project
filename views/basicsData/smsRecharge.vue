<template>
  <div class="p20">
    <!--左边角色列表-->
    <el-row>
      <el-col :span="6">
        <el-form label-width="80px">
          <el-form-item label="组织机构:">
            <select-tree
              size="small"
              clearable
              :options="orgUserGroupList"
              :props="defaultUserGroupProps"
              v-on:noDe="handClick"
              ref="getSelectData"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10">
        <div class="rl">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            class="pan-btn light-blue-btn"
            @click="getSmsRechargeList()"
          >查询</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            class="pan-btn light-blue-btn"
            @click="resetQueryParam()"
          >重置</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            class="pan-btn light-blue-btn"
            v-ltx="'addSmsRecharge'"
            @click="addSmsRecharge()"
          >添加</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table border :data="rechargeList" style="width: 100%" height="72vh" class="textList">
      <el-table-column align="center" prop="departname" label="组织机构" />
      <el-table-column align="center" prop="remainSmsNum" label="剩余短信" />
      <el-table-column align="center" prop="sendSmsSuccessNum" label="发送成功" />
      <el-table-column align="center" prop="sendAllNum" label="总发送数量" />
      <el-table-column align="center" prop="sendSmsFailNum" label="发送失败数量" />
      <el-table-column align="center" prop="warnMoney" label="提醒余额" />
      <el-table-column align="center" prop="isWarn" label="是否提醒" />
      <el-table-column align="center" prop="warnPhone" label="提醒手机号码" />
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            circle
            v-ltx="'editSmsRecharge'"
            @click="editSmsRecharge(scope.row)"
          />
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            circle
            v-ltx="'deleteSmsRecharge'"
            @click="deleteSmsRecharge(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-sizes="[10,20,30]"
      :page-size="10"
      :total="total"
      :current-page.sync="queryData.pageNo"
      class="pageList pt20 mt1"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="getSmsRechargeList"
    />
    <!-- 新增/编辑对话框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="dialogBox">
      <el-form ref="rechargeForm" :model="rechargeForm" label-width="120px" :rules="rules">
        <el-form-item label="组织机构:" prop="departId">
          <select-tree
            clearable
            :options="orgUserGroupList"
            :props="defaultUserGroupProps"
            v-on:noDe="handleRechargeUserGroupNodeClick"
          />
        </el-form-item>
        <el-form-item label="剩余短信数量:" prop="remainSmsNum">
          <el-input
            type="number"
            v-model.number="rechargeForm.remainSmsNum"
            @focus="rechargeUserGroup.flag=false"
          ></el-input>
        </el-form-item>
        <el-col :span="8">
          <el-form-item label="总发送:" prop="sendAllNum">
            <el-input v-model.number="rechargeForm.sendAllNum" :readonly="true" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发送成功:" prop="sendSmsSuccessNum">
            <el-input
              v-model.number="rechargeForm.sendSmsSuccessNum"
              :readonly="true"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发送失败数量:" prop="sendSmsFailNum">
            <el-input
              v-model.number="rechargeForm.sendSmsFailNum"
              :readonly="true"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提醒余额:" prop="warnMoney">
            <el-input v-model.number="rechargeForm.warnMoney" @focus="rechargeUserGroup.flag=false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否提醒:" prop="isWarn">
            <el-switch
              v-model="rechargeForm.isWarn"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="提醒手机号码:" prop="warnPhone">
            <el-input v-model.number="rechargeForm.warnPhone" @focus="rechargeUserGroup.flag=false"></el-input>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveRecharge()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import smsRechargeAPI from "../../api/smsRecharge";
import organizationAPI from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
export default {
  inject: ["reload"],
  name: "smsRecharge",
  components: {
    SelectTree
  },
  data() {
    // 验证手机号格式
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      rechargeList: [], //数据列表
      total: 0, // 分页总条数
      queryData: {
        // 查询参数
        pageNo: 1,
        pageSize: 10,
        departid: ""
      },
      //组织机构树
      defaultUserGroupProps: {
        children: "children",
        label: "name"
      },
      orgUserGroupList: [], // 组织机构树
      userGroup: {
        value: "",
        selectedUserGroup: null //选中的对象
      },
      dialogVisible: false, //   新增/修改对话框是否显示
      dialogTitle: "", //  新增/修改对话框名称
      rechargeForm: {
        // 短信充值表单
        id: "",
        departId: "",
        remainSmsNum: 0,
        sendSmsSuccessNum: 0,
        sendAllNum: 0,
        sendSmsFailNum: 0,
        warnMoney: 0,
        isWarn: true,
        warnPhone: ""
      },
      rules: {
        // 表单验证规则
        remainSmsNum: [
          {
            type: "number",
            required: true,
            message: "请输入剩余短信数",
            trigger: "blur"
          }
        ],
        warnMoney: [
          {
            type: "number",
            required: true,
            message: "请输入提醒金额",
            trigger: "blur"
          }
        ],
        warnPhone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        departId: [
          { required: true, message: "请选择组织机构", trigger: "change" }
        ]
      },
      rechargeUserGroupList: [], // 短信充值模块的组织机构
      rechargeUserGroup: {
        value: "",
        flag: false,
        selectedRechargeUserGroup: null //选中的对象
      }
    };
  },
  created() {
    this.getSmsRechargeList();
    this.InitUserGroupTree();
  },
  methods: {
    getSmsRechargeList() {
      //根据条件查询---数据集合
      this.userGroup.flag = false; //组织机构的浮层消失
      smsRechargeAPI.smsRechargeList(this.queryData).then(res => {
        this.total = res.data.data.totalCount;
        this.rechargeList = res.data.data.data;
      });
    },
    resetQueryParam() {
      //短信充值重置
      this.queryData = {};
      this.reload();
      this.getSmsRechargeList();
    },
    handleSizeChange(data) {
      this.queryData.pageSize = data;
      this.getSmsRechargeList();
    },
    InitUserGroupTree() {
      //  初始化组织机构树
      organizationAPI.organizateTree(null).then(res => {
        this.orgUserGroupList = res.data.data;
      });
    },
    handleUserGroupNodeClick(data) {
      //选择组织机构后的回选
      this.userGroup.selectedUserGroup = data; //选中的数据对象
      this.userGroup.value = data.name;
      this.queryData.departid = data.id;
      this.rechargeForm.departid = data.id;
    },
    addSmsRecharge() {
      //新增短信充值记录
      this.rechargeForm = {}; //清空新增短信表单
      this.rechargeUserGroup = {}; //清空选择
      this.dialogVisible = true;
      this.dialogTitle = "新增";
    },
    editSmsRecharge(data) {
      //编辑短信充值记录
      this.rechargeForm = {}; //清空新增短信表单
      this.rechargeUserGroup = {}; //清空选择
      this.dialogVisible = true;
      this.dialogTitle = "修改";
      smsRechargeAPI.getSmsRechargeById(data.id).then(res => {
        this.rechargeForm = res.data.data;
        this.rechargeUserGroup.value = res.data.data.departname;
      });
    },
    deleteSmsRecharge(data) {
      //删除短信充值记录
      this.$confirm("是否删除该记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        smsRechargeAPI.smsRechargeDelete(data.id).then(res => {
          this.$message({
            type: "success",
            message: res.data.message
          });
          //刷新列表
          this.getSmsRechargeList();
        });
      });
    },
    InitRechargeUserGroupTree() {
      //  初始化短信充值初始化树
      organizationAPI.organizateTree(null).then(res => {
        this.rechargeUserGroupList = res.data.data;
      });
    },
    handleRechargeUserGroupNodeClick(data) {
      this.rechargeUserGroup.selectedRechargeUserGroup = data;
      this.rechargeUserGroup.value = data.name;
      this.rechargeForm.departId = data.id;
    },
    handClick(data){
        this.queryData.departid = data.id;  
    },
    saveRecharge(rechargeForm) {
      //保存
      let that = this;
      this.$refs["rechargeForm"].validate(valid => {
        if (valid) {
          let seleWarn = that.rechargeForm.isWarn;
          //  更改el-switch的值
          if (seleWarn) {
            that.rechargeForm.isWarn = "1";
          } else {
            that.rechargeForm.isWarn = "0";
          }
          smsRechargeAPI
            .saveOrUpdateSmsRecharge(that.rechargeForm)
            .then(res => {
              if (res.data.ok) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                //刷新列表
                that.getSmsRechargeList();
                that.rechargeForm={};
                that.dialogVisible = false; //关闭弹框
              }else{
                 this.$message({
                     type: "danger",
                     message: res.data.message
                 })
              }
            });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.el-form-item {
  margin-bottom: 18px;
}
/deep/.el-col-6 {
  width: 25%;
  height: 45px;
}
</style>
