<!--
  手机绑定imei
--->
<template>
  <div class="p20">
    <!-- 查询 -->
    <div class="topBar">
      <span>用户账号:</span>
      <el-input v-model="queryParam.name" size="small" clearable placeholder="请输入账号"/>
      <div class="rl">
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search" @click="bindPhoneList()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </div>
    </div>
    <el-table :data="userBindMobileList" class="textList" style="width: 100%" height="72vh">
      <el-table-column prop="username" label="用户账号" />
      <el-table-column prop="realname" label="名称" align="center"/>
      <el-table-column prop="imei" label="设备身份码" align="center"/>
      <el-table-column prop="clientId" label="个推id" align="center"/>
      <el-table-column prop="vendor" label="厂商" align="center"/>
      <el-table-column prop="model" label="型号" align="center"/>
      <el-table-column prop="phoneType" label="操作系统" align="center"/>
      <el-table-column prop="createDate" label="创建时间" align="center"/>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="registerImei(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-sizes="[7,15,20,30]" :page-size="1" :total="total" :current-page.sync="queryParam.pageNo" class="pageList pt20 mt1" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="bindPhoneList"/>
    <!-- 注册手机imei -->
    <el-dialog title="手机绑定" :visible.sync="dialogFormVisible" class="dialogBox">
      <el-form ref="bindMobile" :model="bindMobile" label-width="120px" :rules="rules">
        <el-form-item label="手机标识:" prop="imei">
          <el-input v-model="bindMobile.imei" placeholder="请输入手机唯一标识"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerMobileImei()">绑 定</el-button>
          <el-button @click="dialogFormVisible=false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import userBindMobile from '@/api/userBindPhone'
export default {
  name: "registerPhone",
  data(){
    return {
      queryParam: {
        name: "",  //用户名
        pageNo: 1,
        pageSize: 7
      },
      total: 0,
      userBindMobileList: [],  //列表
      dialogFormVisible: false,
      bindMobile: {
        userId: "",
        imei: "",
      },
      rules: {  // 表单验证规则
        imei: [{ required: true, message: '请输入手机唯一码', trigger: 'blur' }]
      }
    }
  },
  created(){
    this.bindPhoneList();
  },
  methods:{
    bindPhoneList(){  //用户绑定手机列表
      userBindMobile.userBindMobileList(this.queryParam).then(res=>{
        this.total = res.data.data.totalCount;
        this.userBindMobileList=res.data.data.data;
      });
    },
    handleSizeChange(val) {   //分页
      this.queryParam.pageSize = val
      this.bindPhoneList()
    },
    // 重置按钮
    reset() {
      this.queryParam.name="";
      this.bindPhoneList();
    },
    registerImei(data){   //注册手机
      this.bindMobile={};
      userBindMobile.getdBindMobileByUserId({userid: data.userId}).then(res=>{
        this.bindMobile=res.data.data;
      });
      this.dialogFormVisible=true;
    },
    registerMobileImei(){
      this.$refs['bindMobile'].validate((valid) => {
        if (valid) {
          userBindMobile.addUserMobileBind(this.bindMobile).then(res=>{
            this.$message({
              type: "success",
              message: "绑定完成!"
            });
            //刷新列表
            this.bindPhoneList();
            this.dialogFormVisible=false;  //关闭弹框
          })
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
