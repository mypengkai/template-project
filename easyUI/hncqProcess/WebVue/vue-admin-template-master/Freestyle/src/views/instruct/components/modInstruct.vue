<template>
  <div class="addInstrucet">
    <el-form :model="form" ref="form" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织机构：" prop="departname">
            <el-select
             style="width:100%"
              v-model="form.departname"
              placeholder="请选择"
              @change="userGroupOnChange"
              size="small"
            >
              <el-option
                v-for="item in userGroupTree"
                :key="item.id"
                :label="item.departname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="width:100%" label="分部分项：" prop="projectItemId">
            <select-tree
              clearable
              :options="projectItemTree"
              ref="getSelectData"
              :props="projectItemDefaultProp"
              size="small"
              v-on:noDe="projectItemOnClick"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工序名称：" prop="process">
            <el-select
              @change="changeProcess"
             style="width:100%"
              v-model="form.process"
              placeholder="请选择工序"
              size="small"
            >
              <el-option
                v-for="item in processSDictOption"
                :key="item.id"
                :label="item.process"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="width:100%" label="处理人：" prop="nowsendusername">
            <el-input
              v-model="form.nowsendusername"
              size="small"
              clearable
              placeholder="请选择"
              :readonly="true"
            >
            <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划复核时间：" prop="planCheckTime">
            <el-date-picker
              style="width:100%"
              v-model="form.planCheckTime"
              type="date"
              placeholder="选择日期："
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划处理时间：" prop="planFinishTime">
            <el-date-picker
              style="width:100%"
              v-model="form.planFinishTime"
              type="date"
              placeholder="选择日期："
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="width:100%" label="指令内容：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
           <el-form-item label="图片选择：">
              <el-upload
                class="avatar-uploader"
                ref="modifyupload"
                :action="fileUploadUrl"
                name="files"
                :headers="headers"
                :limit="9"
                list-type="picture-card"
                :auto-upload="false"
                :data="fileData"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="50%" :src="dialogImageUrl" alt="图片" />
              </el-dialog>
            </el-form-item>
        </el-col>
      </el-row>
      <div class="tar" style="margin:10px;">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="_comfirm('form')">确 定</el-button>
      </div>
    </el-form>

    <!-- 指令流程 -->
    <el-collapse>
      <el-collapse-item title="指令流程" name="1">
        <orderInstruct :nowItem="handObj"></orderInstruct>
      </el-collapse-item>
    </el-collapse>

    <!-- 接收人弹框 -->
    <el-dialog
      class="dialogBox"
      width="45%"
      title="选择处理人"
      :visible.sync="acceptUserDialog"
      append-to-body
    >
      <div class="topBar">
        <span>组织机构:</span>
        <el-select
          v-model="receiveData.userGroupId"
          placeholder="请选择"
          @change="handleReceiveUserGroupCheckChange"
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
import remark from "@/components/remark";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import orderInstruct from "./orderInstruct";
import viewer from "@/components/viewer";
import { debug } from "util";

export default {
  inject: ["reload"],
  components: {
    SelectTree,
    viewer,
    remark,
    orderInstruct
  },
  props: ["nowItem"],
  data() {
    return {
      formRules: {
        departname: [
          { required: true, message: "请选择组织机构", trigger: "blur" }
        ],
        projectItemId: [
          { required: true, message: "请选择分部分项", trigger: "blur" }
        ],
        process: [{ required: true, message: "请选择工序", trigger: "blur" }],
        nowsendusername: [
          { required: true, message: "请选择处理人", trigger: "blur" }
        ],
        planCheckTime: [
          { required: true, message: "请选择计划开始时间", trigger: "blur" }
        ],
        planFinishTime: [
          { required: true, message: "请选择计划完成时间", trigger: "blur" }
        ]
      },
      returnRules: {
        planFinishTime: [
          { required: true, message: "请选择完成时间", trigger: "blur" }
        ]
      },
      dialogRemark: false,
      dialogVisible: false,
      processMDictOption: [], // 工序类型下拉框
      processSDictOption: [], // 工序下拉框
      acceptUserDialog: false,
      answer: "", // 转发响应变量
      dialogImageUrl: "",
      dialogImageUrlReturn: "",
      dialogImageUrlSoonFinish: "",
      dialogImageUrlFinish: "",
      dialogImageUrlModify: "",
      commcheckList: [], // 预览图片信息
      planTime: "",
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      form: {
        remark: "", // 指令内容
        userGroupId: "", // 组织机构id
        departname: "", //组织机构名称
        processDictId: "", // 工序字典的工序id 非必传
        process: "", // 工序名称
        projectItemId: "", // 分部分项id
        projectItem: "", //分部分项名称
        ReceiveUserid: "", // 接收人id
        nowsendusername: "", // 接收人名称
        planCheckTime: "", // 计划检查时间
        commandType: "", // 指令类型
        batchNo: "",
        patrolId: "", //巡视id
        planFinishTime: "", //计划完成时间
        commandid: "" // 指令id
      },
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      handList: "", // 流程数据
      // 工程分项树显示
      projectItemDefaultProp: {
        children: "children",
        label: "projectItem"
      },
      receiveData: {
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        userGroupId: "",
        realname: "", //用户真实名字
        position: "" //职位
      },
      total: 0,
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      receiveUsersList: [], // 接收人列表
      orgId: "",
      fileUploadUrl: process.env.BASE_API + "/rest/command/videoOrImageUpload", // 修改

      // -1 发起
      // 0 转发
      // 1复核
      // 2 完成（处置）
      // 3 退回
      handObj: {},
      fileData: {
        commandid: "", // 指令id
        typeState: -1,
        lgt: "",
        lat: "",
        photoLocation: "",
        commandsendid: ""
      }
    };
  },
  mounted() {
    this.$refs.getSelectData.labelModel = this.nowItem.projectItemName;
    this.initProject();
    this.initProcess();
  },
  created() {
    this.initUserGroupTree();
   
    this.receiveUserList();
    this.form.batchNo = this.createUUID(); //生成批处理id
    this.handObj = this.nowItem;
    sessionStorage.setItem("departId", this.nowItem.userGroupId);
    sessionStorage.setItem("projectId", this.form.projectid);
    this.form.processDictId = this.nowItem.sdid;
    this.form.projectItemId = this.nowItem.projectid;
    this.form.commandid = this.nowItem.id;
    this.form.remark = this.nowItem.remark;
    this.form.userGroupId = this.nowItem.userGroupId;
    this.form.departname = this.nowItem.departname;
    this.form.process = this.nowItem.process;
    this.form.ReceiveUserid = this.nowItem.ReceiveUserid;
    this.fileData.commandid = this.nowItem.id;
  },
  methods: {
    today() {
      let nowTime = new Date();
      this.form.planCheckTime = nowTime
        .toLocaleDateString()
        .replace(/\//g, "-");
      this.form.planFinishTime = nowTime
        .toLocaleDateString()
        .replace(/\//g, "-");
    },
    reset() {
      // 重置按钮
      this.reload();
    },
    query() {
      this.receiveUserList();
    },
    getRemark(data) {
      this.transpondForm.remark = data;
      this.modifyForm.remark = data;
      this.finishForm.remark = data;
      this.soonFinishForm.remark = data;
      this.returnForm.remark = data;
    },
    checkRemark() {
      this.dialogRemark = true;
    },
    initUserGroupTree() {
      // 初始化组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    userGroupOnChange(data) {
      //选择标段改动
      this.orgId = data;
      this.form.userGroupId = data;
      Organization.getProjectItemFromLayer({
        userGroupId: data,
        pId: "0"
      }).then(res => {
        this.projectItemTree = res.data.data;
      });
    },
    // 初始分部分项
    initProject() {
      let data = sessionStorage.getItem("departId");
      Organization.getProjectItemFromLayer({
        userGroupId: data,
        pId: "0"
      }).then(res => {
        this.projectItemTree = res.data.data;
      });
    },

    loadNextNode(node, resolve) {
      //异步获取下一级节点数据
      if (node.level > 0) {
        project
          .getProjectItemFromLayer({
            userGroupId: this.selectedUserGroup,
            pId: node.data.id
          })
          .then(res => {
            resolve(res.data.data);
          });
      }
    },
    projectItemOnClick(data) {
      // 获取分部分项id
      this.form.projectItemId = data.id;
      this.initProcessByTypeId(data.id);
    },
    initProcessByTypeId(codeid) {
      // 初始化新增工序通过工序类型id
      request
        .post("/rest/processCheck/numberSdData", { codeid: codeid })
        .then(res => {
          this.processSDictOption = res.data.data;
        });
    },
    initProcess() {
      let codeid = sessionStorage.getItem("projectId");
      request
        .post("/rest/processCheck/numberSdData", { codeid: codeid })
        .then(res => {
          this.processSDictOption = res.data.data;
        });
    },
    // 选择工序
    changeProcess(val) {
      this.form.processDictId = val;
    },
    processTypeChangeProcess(data) {
      // 点击新增工序--工序类型改变工序
      this.initProcessByTypeId(data);
    },
    receiveUserList() {
      //接收人列表
      processInfo.getUsersByDepartId(this.receiveData).then(res => {
        this.total = res.data.data.totalCount;
        this.receiveUsersList = res.data.data.data;
      });
    },

    handleProjectItemOnClick(data) {
      // 分部分项选择后的数据
      this.form.projectItemId = data.id;
      this.form.projectItemName = data.name;
    },
    alertAcceptUserDialog(state) {
      //弹出接收人对话框
      this.receiveData = {};
      this.dialogState = state;
      this.receiveUserList();
      this.acceptUserDialog = true;
    },
    handleReceiveUserGroupCheckChange(data) {
      //选择接收人后的组织机构弹框
      this.receiveData.userGroupId = data;
      this.receiveUserList();
    },

    _comfirm(form) {
      //提交
      this.$refs[form].validate(valid => {
        let that = this;
        if (valid) {
           instruct.modifyCommand(that.form).then(res => {
                if (res.data.ok) {
                  that.fileData.commandsendid = res.data.data;
                  that.$refs.modifyupload.submit();
                  that.$emit('comfirm')
                  that.$emit('cancel')
              }
           });   
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$emit("cancel");
    },
    handleCurrentChange(val) {
      //确认接收人
      this.form.ReceiveUserid = val.id; // 新增传接收人id
      this.form.nowsendusername = val.username; // 新增接收人id名回填
      this.acceptUserDialog = false;
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },

    createUUID: function() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.addInstrucet {
  height: 60vh;
  overflow-x: hidden;
  padding: 0 20px;
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
.timelineBox {
  height: 9vh;

  .el-timeline-item {
    float: left;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 15px;
    width: 8vw;
    border-top: 2px solid #e4e7ed !important;
  }
}
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
  position: relative;

  /deep/ .el-form-item__label {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  /deep/ .el-input {
    font-size: 0.7vw;
  }

  /deep/ .el-textarea {
    margin-bottom: 5px;
  }

  /deep/ .el-input__inner {
    font-size: 14px;
  }

  /deep/ .el-timeline {
    line-height: 30px;
  }

  /deep/ .reference .el-timeline-item {
    font-size: 12px;
  }

  /deep/ .el-textarea__inner {
    height: 30px;
  }
}
.reference {
  width: 100%;
  margin-top: 10px;

  .el-timeline {
    margin-left: -2vw;
    font-size: 0.7vw;
    list-style: none;
  }

  .el-timeline-item {
    float: left;
    padding-bottom: 0;
    height: 3vh;
  }

  /deep/ .el-timeline-item__node--normal {
    width: 0.7vw;
    height: 0.7vw;
  }

  /deep/ .el-timeline-item__timestamp {
    font-size: 0.8vw;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 0vw;
    width: 0vw;
    height: 3vh;
    border-left: 0.1vw solid rgba(31, 68, 143, 0);
  }

  /deep/ .el-timeline-item__node--normal {
    left: 0.4vw;
  }

  /deep/ .el-timeline-item__wrapper {
    position: relative;
    padding-left: 1.2vw;
    top: -0.5vh;
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

  /deep/ .el-form-item__label {
    font-size: 0.7vw;
  }

  /deep/ .el-input {
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
  padding: 20px 10px;

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

/deep/ .reverseBox[data-v-d793087e] .el-textarea__inner {
  height: 60px;
  min-height: 60px;
}

li {
  list-style-type: none;
}
.video-box {
  position: relative;
}
.video-box video {
  display: inline-block;
  vertical-align: baseline;
}
.video-box .video-img {
  text-align: center;
  position: absolute;
  top: 25%;
  left: 25%;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background: url(../../../imgs/play.png) no-repeat;
  background-size: 50% 50%;
  cursor: pointer;
}
/deep/.el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #303133;
  font-weight: 700;
  margin-top: 10px;
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
/deep/.el-collapse-item__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
  color: blue;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
}
</style>
