<template>
  <div class=" checkBox">
    <el-form :model="form" label-width="120px">
      <!-- 新增 -->
      <div :class="{reverseAddBox:nowItem=='add'}">
        <el-row>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="组织机构：" v-if="nowItem =='add'">
              <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleCheckChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="分部分项：" v-if="nowItem =='add'">
              <select-tree :options="projectItemTree" :props="projectTree" v-on:noDe="handleProjectItemOnClick"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工序类型" prop="processMDictId" v-if="nowItem =='add'">
              <el-select v-model="form.processMDictId" placeholder="请选择工序类型" @change="processTypeChangeProcess">
                <el-option v-for="item in processMDictOption" :key="item.id" :label="item.processType" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序" prop="processSDictId" v-if="nowItem =='add'">
              <el-select v-model="form.processDictId" placeholder="请选择工序" >
                <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="接收人：" v-if="nowItem =='add'" prop="receiveUserName" >
              <el-input v-model="form.receiveUserName" :disabled="true">
                <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('receive')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="TimeAndType" v-if="nowItem =='add'">
              <el-form-item label="计划检查时间：" v-if="nowItem =='add'" prop="planTime" >
                <el-date-picker v-model="form.planCheckTime" type="datetime" placeholder="选择日期时间：" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="width:28vw" label="指令内容：" v-if="nowItem =='add'" >
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="图片选择：" v-if="nowItem =='add'" prop >
          <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers" list-type="picture-card"
                     :auto-upload="false" :on-preview="handlePictureCardPreview" :data="form">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="50%" :src="dialogImageUrl" alt="图片">
          </el-dialog>
        </el-form-item>
      </div>

      <!-- 查看 -->
      <div :class="{reverseBox:nowItem!=='add'}" class="elInputBox" label-width="120px">
        <el-form-item style="width:22vw" label="分部分项：" v-if="nowItem !=='add'" >
          <el-input type="textarea" autosize readonly v-model="form.projectItem"></el-input>
        </el-form-item>
        <el-form-item style="width:22vw" label="计划检查时间：" v-if="nowItem !=='add'" >
          <el-input type="textarea" autosize readonly v-model="form.planTime"></el-input>
        </el-form-item>
        <el-form-item style="width:22vw" label="创建时间：" v-if="nowItem !=='add'">
          <el-input readonly v-model="form.createTime"></el-input>
        </el-form-item>
        <el-form-item label="指令时间轴：" v-if="nowItem !=='add'" >
          <div class="reference">
            <el-timeline>
              <el-timeline-item v-for="(activity, index) in activities2" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color"
                                :size="activity.size" :timestamp="activity.timestamp">{{activity.content}}</el-timeline-item>
            </el-timeline>
          </div>
          <div class="pta">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="convertIcon(activity, 'icon')"
                    :type="convertIcon(activity, 'type')" :size="convertIcon(activity,'size')" :timestamp="activity.finishTime">
                {{activity.name}} 指令描述 : {{ activity.remark }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-form-item>
        <div style="overflow:hidden;position:relative" v-if="nowItem !=='add' && finishPictureOfCommand.length>0 ">
          <div class="fl faqi">
            <span class="accomplish">发起指令</span>
            <el-tabs v-model="activeName">
              <el-tab-pane label="影像资料" name="first">
                <ul>
                  <li v-for="(item,index) in form.pictureOfCommand" :key="index" @click="actionImg(item,index)">
                    <img :src="item.picture" style="cursor:pointer">
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="拍照地点" name="second">
                <div style="height:45vh">
                  <instructMap :nowItem="nowItem"></instructMap>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="elhr"></div>
              <div class="rl wanchen">
                <span class="accomplish">完成指令</span>
                <el-tabs v-model="activeName1">
                  <el-tab-pane label="影像资料" name="first">
                    <ul>
                      <li v-for="(item,index) in finishPictureOfCommand" :key="index" @click="actionImgs(item,index)">
                        <img :src="item.picture" style="cursor:pointer">
                      </li>
                    </ul>
                  </el-tab-pane>
                  <el-tab-pane label="拍照地点" name="second">
                    <div style="height:45vh">
                      <Map :nowItem="nowItem"></Map>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          <!-- 指令发送 -->
          <div v-if="nowItem !=='add' && finishPictureOfCommand.length===0 " class="pictureContent">
              <el-tabs type="border-card" v-model="tabPosition">
                <el-tab-pane label="影像资料" name="first">
                  <div class="imgContation">
                    <ul>
                      <li v-for="(item,index) in pictureOfCommand" :key="index" @click="actionImg(item,index)">
                        <img :src="item.picture" alt style="width:100%;height:100%">
                      </li>
                    </ul>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="所在位置" name="second">
                  <div style="height:45vh">
                    <instructMap :nowItem="nowItem"></instructMap>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
        </div>
    </el-form>
    <div class="tar">
      <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive' && finishPictureOfCommand.length===0 " @click="innerTranspondDialog = true">转发指令</el-button>
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm('userFrom')">确 定</el-button>
    </div>

    <!-- 接收人弹框 -->
    <el-dialog class="dialogBox" width="45%" title="选择接收人" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>接收人组织机构:</span>
        <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleReceiveUserGroupCheckChange"/>
      </div>
      <el-table border :data="receiveUsersList" highlight-current-row style="width: 100%" height="50vh" @current-change="handleCurrentChange">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="departname" label="职务"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[15,30,60,100]" :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()" :total="total"></el-pagination>
    </el-dialog>
    <!-- 转发信息 -->
    <el-dialog class="dialogBox" width="30%" title="转发信息" :visible.sync="innerTranspondDialog" append-to-body>
      <el-form :model="transpondForm" :rules="rulesform" label-width="80px">
        <el-form-item label="指定人：" prop="transpondName">
          <el-input v-model="transpondForm.transpondName">
            <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('transpond')"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="transpondForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="innerTranspondDialog = false">取 消</el-button>
        <el-button type="primary" @click="transpondCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 发起人-->
    <el-dialog title="图片预览" :visible.sync="dialogcommcheck" fullscreen append-to-body>
      <viewer :photo="commcheckList" :imgList="pictureOfCommand"></viewer>
    </el-dialog>


     <!-- 图片预览 接收人-->
    <el-dialog title="图片预览" :visible.sync="dialogcommchecks" fullscreen append-to-body>
      <viewer :photo="commcheckList" :imgList="finishPictureOfCommand"></viewer>
    </el-dialog>

  </div>
</template>

<script>
import request from "../../../utils/request";
import { getToken } from "@/utils/auth";
import instruct from "@/api/instruct.js";
import project from "@/api/project.js";
import Organization from "@/api/Organization.js";
import processInfo from "@/api/process.js";
import instructMap from "./instructMap";
import Map from "./Map";
import SelectTree from "@/components/SelectTree/selectTree.vue";
import viewer from "@/components/viewer";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    instructMap,
    Map,
    viewer
  },
  props: ["nowItem"],
  data() {
    return {
      reverse: false,   //转发
      activeName: "second",   //发起指令的tab
      activeName1: "second",   //收到指令的tab
      processMDictOption: [],  // 工序类型下拉框
      processSDictOption: [],  // 工序下拉框
      dialogcommcheck: false,
      dialogcommchecks:false,
      tabPosition: "first",
      activities: [
        {
          name: "",
          finishTime: "",
          remark: ""
        }
      ],
      activitiesIcon: [{// 完成指令的人
        size: "large",
        type: "success",
        icon: "el-icon-check"
      }, {  // 正在处理中
        size: "large",
        type: "primary",
        icon: "el-icon-loading"
      }, { // 转发人
        size: "large",
        type: "info",
        icon: "el-icon-refresh"
      }, {  // 发出指令的人
        size: "large",
        type: "primary",
        icon: "el-icon-location-outline"
      }],
      // 参考图标
      activities2: [{
        content: "发出指令",
        timestamp: "",
        type: "primary",
        icon: "el-icon-location-outline"
      }, {
        content: "转发指令",
        timestamp: "",
        type: "info",
        icon: "el-icon-refresh"
      }, {
        content: "正在处理指令",
        timestamp: "",
        type: "primary",
        icon: "el-icon-loading"
      }, {
        content: "完成指令",
        timestamp: "",
        type: "success",
        icon: "el-icon-check"
      }],
      answer: "", // 转发响应变量
      nowType: 0,
      activeIndex: "1",
      activeIndex2: "1",
      newnowType: 0,
      newactiveIndex: "1",
      newactiveIndex2: "1",
      uploadUrl: process.env.BASE_API + "/rest/command/addCommand",
      dialogImageUrl: "",
      commcheckList: [], // 预览图片信息
      planTime: "",
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      form: {
        remark: "", // 指令内容
        userGroupId: "", // 组织机构id
        userGroupName: "",   //组织机构名称
        processMDictId: "",  //工序类型id
        processDictId: "", // 工序字典的工序id 非必传
        projectItemId: "", // 分部分项id
        projectItemName: "",  //分部分项名称
        ReceiveUserid: "", // 接收人id
        receiveUserName: "",   //接收人名称
        planCheckTime: "", // 计划检查时间
        commandType: "", // 指令类型
        batchNo: "",
        patrolId: "",  //巡视id
      }, //表单校验规则
      rulesform: {
        transpondName: {
          required: true,
          message: "请选择指定人",
          trigger: "blur"
        }
      },
      //   转发指令
      transpondForm: {
        commanduserId: "", // 指令用户表id
        zhidingren: "", // 指定人id
        remark: "", // 备注
        transpondName: ""
      },
      // 指令内容框框
      commandUser: {
        createTime: "", // 开始时间
        finishTime: "", // 结束时间
        faqiren: "", // 发起人
        jieshouren: "", // 接受人
        remark: "", // 相关描述
        state: "" // 处理状态
      },

      //   查看详情
      formSon: {
        createTime: "", // 拍照时间
        describe: "", // 指令描述
        lat: "", // 经度
        lgt: "", // 纬度
        photoDescribe: "", // 照片描述
        photoLocation: "" // 拍摄地点
      },
      userGroupDefaultProps: {  // 组织机构树显示
        children: "children",
        label: "name"
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "projectItem"
      },
      receiveData: {
        pageNo: 1, // 当前页
        pageSize: 15, // 每页条数
        userGroupId: "",
        realname: "", //用户真实名字
        position: ""   //职位
      },
      //发送工序id
      sendDataSon: {
        processLogId: "", // 工序id
        Mark: "" // 0发送 1完成
      },
      transpondName: "", // 转发用户名回填中文
      total: 0,
      pictureOfCommand: [], // 发送指令时的图片
      finishPictureOfCommand: [], // 完成指令时的图片
      imgData: [], // 下一层图片数组
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      receiveUsersList: [], // 接收人列表
      name: "", // 组织机构回填显示
      states: [], //指令内容状态 0 已处理 1未处理
      remark: "", // 最后一个人的备注
      username: "", // 接收人id回填
      projectItem: "", // 分部分项回填显示
      innerVisibleSon: false, // 内层照片详情弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false, // 工程分项弹框
      acceptUserDialog: false, // 接受人id弹框
      dialogState: '',  //用于界定弹框是转发人还是接收人
      innerTranspondDialog: false, // 转发指令信息
      dialogVisible: false, // 上传图片

    };
  },
  created() {
    this.initForm();
    this.receiveUserList();
    this.form.batchNo = this.createUUID();  //生成批处理id
  },
  methods: {
    initForm() {
      if (this.nowItem == "add"){
        this.initUserGroupTree();  //初始化组织机构
        this.initProcessTypeDict();
        return;
      }
      let ObCopyData = this.$tool.ObCopy(this.nowItem); //复制nowItem传来的值 处理复杂类型
      this.form = ObCopyData; // 第一层查看
      this.activities = ObCopyData.commandUser;
      this.transpondForm.commanduserId = ObCopyData.commanduserId; // 转发指令
      this.pictureOfCommand= ObCopyData.pictureOfCommand;
      this.finishPictureOfCommand= ObCopyData.finishPictureOfCommand;
    },
    initUserGroupTree() {   // 初始化组织机构树
      Organization.organizateTree().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    initProcessTypeDict() {  // 初始化新增工序类型input框数据
      request.post('/rest/processType/getList').then(res => {
        this.processMDictOption = res.data.data.data
        this.initProcessByTypeId(this.processMDictOption[0].id)
      })
    },
    initProcessByTypeId(processTypeId) {   // 初始化新增工序通过工序类型id
      this.processSDictOption=[];  //先清空
      request.post('/rest/process/getList', { processTypeId: processTypeId }).then(res => {
        this.processSDictOption = res.data.data.data
      })
    },
    processTypeChangeProcess(data) {    // 点击新增工序--工序类型改变工序
      this.initProcessByTypeId(data)
    },
    receiveUserList() {  //接收人列表
      processInfo.getUsersByDepartId(this.receiveData).then(res => {
        this.total = res.data.data.totalCount;
        this.receiveUsersList = res.data.data.data;
      });
    },
    // 工序id拿图片详情
    actionImg(txtState) {
      this.sendDataSon.Mark = txtState;
      processInfo.getPictureDetail(this.sendDataSon).then(res => {
        this.formSon = res.data.data[1]; // 图片详情信息
        if (this.formSon.photoLocation == null) {
          this.formSon.photoLocation = "湖南常祁";
        }
        this.imgData = res.data.data; // 内层图片数组
        console.log(this.imgData.shift(0, 1));
      });
      this.innerVisibleSon = true;
    },
    convertIcon(activity, type) {
      // 发出指令的人
      if (activity.commandStagePeople == 1) {
        if (type === "icon") {
          return this.activitiesIcon[3].icon;
        } else if (type === "type") {
          return this.activitiesIcon[3].type;
        }
      } else if (activity.commandStagePeople == 2) {
        //转发指令的人
        if (type === "icon") {
          return this.activitiesIcon[2].icon;
        } else if (type === "type") {
          return this.activitiesIcon[2].type;
        }
      } else if (activity.commandStagePeople == 3) {
        // 正在处理指令
        if (type === "icon") {
          return this.activitiesIcon[1].icon;
        } else if (type === "type") {
          return this.activitiesIcon[1].type;
        }
      } else if (activity.commandStagePeople == 4) {
        //完成指令的人
        if (type === "icon") {
          return this.activitiesIcon[0].icon;
        } else if (type === "type") {
          return this.activitiesIcon[0].type;
        }
      }
    },
    handleCheckChange(data) {  // 组织机构选择后的数据
      this.form.userGroupId = data.id;
      this.form.userGroupName =data.name;
      project.projectList({orgId: data.id}).then(res => {
        this.projectItemTree = res.data.data;
      });
    },
    handleProjectItemOnClick(data) { // 分部分项选择后的数据
      this.form.projectItemId = data.id;
      this.form.projectItemName =data.name
    },
    alertAcceptUserDialog(state){  //弹出接收人对话框
      this.dialogState=state;
      this.receiveUserList();
      this.acceptUserDialog=true;
    },
    handleReceiveUserGroupCheckChange(data){   //选择接收人后的组织机构弹框
      this.receiveData.userGroupId=data.id;
      this.receiveUserList();
    },
    _comfirm() {  //提交
      if (this.nowItem === "add") {  // 新增
        if (this.form.userGroupId===null || this.form.userGroupId==="" || this.form.userGroupId===undefined) {
          this.$message({
            showClose: true,
            message: "请选择组织机构",
            type: "warning"
          });
          return false;
        }
        if (this.form.projectItemId==="" || this.form.projectItemId==="" || this.form.projectItemId===undefined) {
          this.$message({
            showClose: true,
            message: "请选择分部分项",
            type: "warning"
          });
          return false;
        }
        if (this.form.processDictId=== "" || this.form.processDictId==="" || this.form.processDictId===undefined) {
          this.$message({
            showClose: true,
            message: "请选择工序类型",
            type: "warning"
          });
          return false;
        }
        if (this.form.ReceiveUserid=== "" || this.form.ReceiveUserid==="" || this.form.ReceiveUserid===undefined) {
          this.$message({
            showClose: true,
            message: "请选择工序类型",
            type: "warning"
          });
          return false;
        }
        if (this.form.planCheckTime=== "" || this.form.planCheckTime==="" || this.form.planCheckTime===undefined) {
          this.$message({
            showClose: true,
            message: "请选择计划时间",
            type: "warning"
          });
          return false;
        }
        this.$refs.upload.submit();
      }
      this.$emit("cancel");
      this.reload();
    },
    transpondCommand() {  // 转发指令
      if (this.transpondForm.transpondName == "") {
        this.$message({
          showClose: true,
          message: "请输入指定人",
          type: "warning"
        });
        return false;
      }
      instruct.InstructionCommand(this.transpondForm).then(res => {
        let _message = res.data.message;
        if (_message == "成功") {
          this.answer = "success";
        } else {
          this.answer = "error";
        }
        this.$message({
          type: this.answer,
          message: _message
        });
        this.$emit("cancel");
        this.reload();
      });
    },
    handleCurrentChange(val) {   //确认接收人
      if(this.dialogState==='receive') {
        this.form.ReceiveUserid = val.id; // 新增传接收人id
        this.form.receiveUserName = val.username; // 新增接收人id名回填
      }else if(this.dialogState==='transpond'){
        this.transpondForm.zhidingren = val.id; // 新增传接收人id
        this.transpondForm.transpondName = val.username; // 新增接收人id名回填
      }
      this.acceptUserDialog = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload: function(file) {
      this.commandFormData.append("files", file);
    },
    createUUID: function() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
      );
    },
    //图片预览  (发起人)
    actionImg(item,index) {

      let array = [];
      array.push(item);
      this.commcheckList = array;
      this.dialogcommcheck = true;
      this.pictureOfCommand.splice(index,1)
      this.pictureOfCommand.unshift(item)
    },
     //图片预览(接收人)
    actionImgs(item,index) {
      let array = [];
      array.push(item);
      this.commcheckList = array;
      this.dialogcommchecks = true;
      this.finishPictureOfCommand.splice(index,1)
      this.finishPictureOfCommand.unshift(item)
    }
  }
};
</script>

<style lang="scss" scoped>
.checkBox{
    height:60vh;
    overflow-x: hidden;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
  }
}
.TimeAndType {
  height: 7vh;
  span {
    display: block;
  }
}
// 时间轴
.timelineBox {
  height: 9vh;
  .el-timeline-item {
    float: left;
  }
  /deep/.el-timeline-item__tail {
    position: absolute;
    left: 15px;
    width: 8vw;
    border-top: 2px solid #e4e7ed !important;
  }
}
//图片地图切换
.navb {
  width: 50%;
  height: 7%;
  margin-left: 30px;
}
.navbc {
  width: 70%;
  height: 7%;
  margin-left: 30px;
}
.intervalBox {
  element.style {
    margin-left: transparent;
  }
}
.reverseBox {
  // height: 62vh;
  // overflow-y: auto;
  position: relative;
  /deep/.el-form-item__label {
    font-size: 14px;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
  /deep/.el-textarea{
    margin-bottom: 5px;
  }
  /deep/.el-input__inner{
    font-size: 14px;
  }
   /deep/.el-timeline{

     line-height: 30px;
   }
  /deep/.reference .el-timeline-item{
    font-size: 12px;
  }
  /deep/.el-textarea__inner{
    height: 30px;
  }
}
//时间轴图标描述
.reference {
  width: 100%;
  .el-timeline {
    margin-left: -2vw;
    font-size: 0.7vw;
    list-style: none;
  }
  .el-timeline-item {
    float: left;
    padding-bottom: 0;
    height: 3vh;
    // padding-right: 1vw;
  }
  /deep/.el-timeline-item__node--normal {
    width: 0.7vw;
    height: 0.7vw;
  }
  /deep/.el-timeline-item__timestamp {
    font-size: 0.8vw;
  }
  /deep/.el-timeline-item__tail {
    position: absolute;
    left: 0vw;
    width: 0vw;
    height: 3vh;
    border-left: 0.1vw solid rgba(31, 68, 143, 0);
  }
  /deep/.el-timeline-item__node--normal {
    left: 0.4vw;
  }
  /deep/.el-timeline-item__wrapper {
    position: relative;
    padding-left: 1.2vw;
    top: -1.5vh;
  }
}
.accomplish {
  display: block;
  text-align: center;
  font-size: 1.2vw;
  color: #00000b;
}
.reverseAddBox {
  width: 100%;
  // height: 65vh;
  // overflow-y: auto;
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
.faqi,
.wanchen {
  width: 50%;
  padding: 10px;

  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;
    li {
      list-style: none;
      float: left;
      width: 15vh;
      height: 15vh;
      padding: 1%;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
.pictureContent {
  padding: 10px;
  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;
    li {
      list-style: none;
      float: left;
      width: 20vh;
      height: 20vh;
      padding: 1%;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
.elhr {
  position: absolute;
  width: 1px;
  height: 50vh;
  bottom: 0;
  left: 50%;
  background: #ccc;
}
</style>
