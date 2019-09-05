<template>
   <div class="handInstruct">
          <el-form :model="handData" label-width="120px">
            <el-form-item label="处理人：">
                <el-input  v-model="handData.zhidingrenName" @focus="alertDialog"></el-input>
            </el-form-item>
            
          <el-form-item label="计划处理时间：" prop="planFinishTime">
                  <el-date-picker v-model="handData.planFinishTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
            <el-form-item label="备注：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="handData.remark"></el-input>
            </el-form-item>
            <el-form-item label="图片选择：" v-show="imgShow">
            <el-upload class="avatar-uploader" ref="uploadFile" :action="uploadUrl" name="files"
                        :headers="headers"
                        list-type="picture-card"
                        :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="handData">
                <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisibleFinish">
            <img width="50%" :src="dialogImageUrlFinish" alt="图片">
          </el-dialog> -->
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button type="info" @click="close">取 消</el-button>
        <el-button type="success" @click="infoCheck" v-if="innerBtn">指令转发</el-button>
        <el-button type="danger" @click="infoReturn" v-if="returnBtn">指令退回</el-button>
        <el-button type="primary" @click="infoDone" v-if="soonFinishBtn">指令完成</el-button>
        <el-button type="success" @click="infoOffer" v-if="finishBtn">指令复核</el-button>
      </div>

    <el-dialog class="dialogBox" width="45%"  title="选择处理人" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>组织机构:</span>
        <el-select v-model="receiveData.userGroupId" placeholder="请选择" @change="handleReceiveUserGroupCheckChange">
          <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname"
                     :value="item.id"></el-option>
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
      <el-table border :data="receiveUsersList" highlight-current-row height="50vh"
                @current-change="handleCurrentChange">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职位"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>

      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[10,20,30]"
                     :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()"
                     :total="total"></el-pagination>
    </el-dialog>
   </div>

</template>
<script>
  import request from '../../../utils/request'
  import { getToken } from '@/utils/auth'
  import instruct from '@/api/instruct.js'
  import project from '@/api/project.js'
  import processInfo from '@/api/process.js'
  import Organization from '@/api/Organization.js'
  import remark from "@/components/remark"
export default {
    props:{
        nowItem:{
           type:Object
        }
    },
    data(){
        return{
             handData:{
                 commanduserId:'', // 指令id
                 commandid:'', // 指令id
                 remark:"",    // 备注
                 planFinishTime:'',  // 计划完成时间
                 zhidingren:'',      // 指定人id
                 zhidingrenName:'',   // 指定人名称
             },
             total:0,
               headers: {
                'X-AUTH-TOKEN': getToken()
               },
              receiveUsersList:[],
              userGroupTree:[],
              receiveData: {
                pageNo: 1, // 当前页
                pageSize: 10, // 每页条数
                userGroupId: '',
                realname: '', //用户真实名字
                position: ''   //职位
              },
              acceptUserDialog:false,

             uploadUrl: process.env.BASE_API + '/rest/command/returnCommand',
             innerBtn:false,
             returnBtn:false,
             soonFinishBtn:false,
             finishBtn:false,
             imgShow:true
            // uploadUrlReturn: process.env.BASE_API + '/rest/command/returnCommand',
            // uploadUrlSoonFinish: process.env.BASE_API + '/rest/command/soonFinishCommand',
            // uploadUrlFinish: process.env.BASE_API + '/rest/command/finishCommand',
            // uploadUrlModify: process.env.BASE_API + '/rest/command/modifyCommand',

        }
    },
    created(){
        this.handData.commandid = this.nowItem.id;
        this.handData.commanduserId = this.nowItem.commanduserId;
         let nowUserId = localStorage.getItem('userId')
          //处理按钮显示与否
          /* -1 发起人
             0 转发
             1 完成
             2 复核
             3 退回*/
          if (this.nowItem.state == '-1' || this.nowItem.state == '0') {
            this.innerBtn = true      // 转发
            this.returnBtn = true     // 退回
            this.soonFinishBtn = true  // 完成
            this.finishBtn = false     // 复核
            if (nowUserId == this.nowItem.sponsor) {
              this.soonFinishBtn = false
              this.finishBtn = false
            }

          } else if (this.nowItem.state == '3') {
            this.innerBtn = false
            this.returnBtn = false
            this.soonFinishBtn = false
            this.finishBtn = false
            this.imgShow = false
            if (nowUserId == this.nowItem.sponsor) {
              this.innerBtn = false
              this.returnBtn = false
              this.soonFinishBtn = false
              this.finishBtn = false
            }
          } else if (this.nowItem.state == '2') {
            this.innerBtn = false
            this.returnBtn = true
            this.soonFinishBtn = false
            this.finishBtn = false
            if (nowUserId == this.nowItem.sponsor) {
              this.finishBtn = true
            }
          } else if (this.nowItem.state == '1') {
            this.innerBtn = false
            this.returnBtn = false
            this.soonFinishBtn = false
            this.finishBtn = false
            this.imgShow = false
          }


    },
    methods:{
         receiveUserList() {  //接收人列表
            processInfo.getUsersByDepartId(this.receiveData).then(res => {
            this.total = res.data.data.totalCount
            this.receiveUsersList = res.data.data.data
            })
        },
        query(){
           this.receiveUserList();
        },
        alertDialog() {  //弹出接收人对话框
            this.receiveUserList()
            this.initUserGroupTree();
            this.acceptUserDialog = true
        },
      handleReceiveUserGroupCheckChange(data) {   //选择接收人后的组织机构弹框
        this.receiveData.userGroupId = data
        this.receiveUserList();
        
      },
      handleCurrentChange(val) {   //确认接收人
         this.handData.zhidingrenName = val.username;
         this.handData.zhidingren = val.id;
         this.acceptUserDialog = false
      },
      handlePictureCardPreviewReturn(file) {
        this.dialogImageUrlReturn = file.url
        this.dialogVisibleReturn = true
      },
      initUserGroupTree() {   // 初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupTree = res.data.data
        })
      },
      close(){
          this.$emit("cancel");
      },
      // 转发
       infoCheck(){
           instruct.InstructionCommand(this.handData).then(res=>{
                 if(res.data.ok){
                    this.$message({
                         message: '转发成功',
                         type: 'warning'  
                    })
                    this.$emit("comfirm")
                 }
                 
           })
       },
       // 退回
       infoReturn(){
          alert(3)
          this.uploadUrl = process.env.BASE_API + '/rest/command/returnCommand';
          this.$refs.uploadFile.submit();
          this.$emit("comfirm")
          this.$emit("cancel");
       },
       // 完成
       infoDone(){
          this.uploadUrl = process.env.BASE_API + '/rest/command/soonFinishCommand';
          this.$refs.uploadFile.submit();
          this.$emit("comfirm")
          this.$emit("cancel");
       },
       // 复核
       infoOffer(){
         alert(2)
         this.uploadUrl = process.env.BASE_API + '/rest/command/finishCommand';
         this.$refs.uploadFile.submit();
         this.$emit("comfirm")
         this.$emit("cancel");
       }
    }
}
</script>
<style lang="scss" scoped>
.handInstruct{
     height:66vh;
     overflow-x: hidden;
     padding: 0 30px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
/deep/.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    line-height: 100px;
    vertical-align: top;
}
</style>