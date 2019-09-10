<template>
    <div class="optionPerson">
    <div class="topBar">
        <span>组织机构:</span>
        <el-select
          v-model="receiveData.userGroupId"
          placeholder="请选择"
        >
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
      <div style="margin-left:70%">
          <el-button class="btnSizes" @click="close">取 消</el-button>
          <el-button class="btnSizes" type="primary" @click="comfirmSelectedPerson()">确 定</el-button>
        </div>
    </div>
</template>
<script>
import Organization from "@/api/Organization.js";
import processInfo from "@/api/process.js";
export default {
    data(){
        return{
            receiveUsersList: [],
            userGroupTree: [],
            total:0,
            receiveData: {
                pageNo: 1, // 当前页
                pageSize: 10, // 每页条数
                userGroupId: "",
                realname: "", //用户真实名字
                position: "" //职位
            },
          
        }
    },
    created(){
         this.initUserGroupTree();
         this.receiveUserList();
    },
    methods:{
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
        console.log(val,"val")
      //确认接收人
      this.handData.checkName = val.username;
      this.handData.checkId = val.id;
      
    },
    initUserGroupTree() {
      // 初始化组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    close(){
        this.$emit("block")
    },
    comfirmSelectedPerson(){
        //console.log(this.handData,"handData")
        this.$emit("setSelect",this.handData);
        this.$emit("block")
    }
  }
}
</script>