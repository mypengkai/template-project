<template>
  <div>
    <el-form ref="userFrom" :model="form" :rules="rules">
      <div>
        <!-- 新增 -->
        <div :class="{reverseAddBox:nowItem=='add'}">
          <el-form-item style="width:20vw" label="组织机构" v-if="nowItem =='add'" prop="" label-width="120px">
            <select-tree clearable :options="orgTree" :props="defaultProps" v-on:noDe="handleCheckChange" v-model="value" />
            <!-- <el-input v-model="name" :disabled="true">
            <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
          </el-input> -->
          </el-form-item>

          <el-form-item style="width:20vw" label="分部分项" v-if="nowItem =='add'" prop="" label-width="120px">
            <select-tree :options="projectList" :props="projectTree" v-on:noDe="projectChange" v-model="value1" />
            <!-- <el-input v-model="projectItem" :disabled="true">
            <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
          </el-input> -->
          </el-form-item>

          <el-form-item style="width:20vw" label="接收人" v-if="nowItem =='add'" prop="username" label-width="120px">
            <el-input v-model="username" :disabled="true">
              <el-button slot="append" icon="el-icon-search" @click="acceptUser = true"></el-button>
            </el-input>
          </el-form-item>

          <div class="TimeAndType" v-if="nowItem =='add'">
            <span class="fl">
              <el-form-item label="计划检查时间" v-if="nowItem =='add'" prop="planTime" label-width="120px">
                <el-date-picker v-model="planTime" type="datetime" @change="planDataRange" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </span>

            <span class="rl mr">
              <el-form-item label="指令类型" v-if="nowItem =='add'" prop="label" label-width="120px">
                <el-select v-model="value" placeholder="请选择" @change="commandTypeList">
                  <el-option v-for="(item,index) in TypeList" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </span>
          </div>

          <el-form-item style="width:37vw" label="指令内容" v-if="nowItem =='add'" prop="remark" label-width="120px">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
          </el-form-item>

          <el-form-item label="图片选择" v-if="nowItem =='add'" prop="dialogImageUrl" label-width="120px">
            <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers" list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-exceed="handleExceed" :data="form">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="50%" :src="dialogImageUrl" alt="图片">
            </el-dialog>
          </el-form-item>
        </div>

        <!-- 查看 -->
        <div :class="{reverseBox:nowItem!=='add'}">
          <!-- 左边信息 -->
          <div style="width:47%" class="fl">
            <el-form-item style="width:22vw" label="相关工程" v-if="nowItem !=='add'" label-width="120px">
              <el-input v-model="form.projectItem"></el-input>
            </el-form-item>

            <el-form-item style="width:22vw" label="创建时间" v-if="nowItem !=='add'" label-width="120px">
              <el-input v-model="form.createTime"></el-input>
            </el-form-item>

            <el-form-item label="指令内容" v-if="nowItem !=='add'" label-width="120px">
              <!-- 参考图标 -->
              <div class="reference">
                <el-timeline>
                  <el-timeline-item v-for="(activity, index) in activities2" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
                    {{activity.content}}
                  </el-timeline-item>
                </el-timeline>
              </div>

              <div class="pta">
                <el-timeline :reverse="reverse">
                  <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="convertIcon(activity, 'icon')" :type="convertIcon(activity, 'type')" :size="convertIcon(activity,'size')" :timestamp="activity.finishTime">
                    {{activity.name}} 指令描述 : {{ activity.remark }}
                  </el-timeline-item>
                </el-timeline>
              </div>
              <div class="temporary">
                <span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</span>
                <el-input v-model="states"></el-input>
              </div>

              <div class="textareaBar">
                <span>相关描述:</span>
                <el-input type="textarea" style="width:70%" autosize v-model="remark"></el-input>
              </div>

              <!-- <el-timeline :reverse="reverse" :class="{timelineBox:activities.length < 5}"> -->

            </el-form-item>
          </div>
          <!-- 右边图像 -->
          <div style="width:50%" class="rl">
            <!-- <div v-if="nowItem !=='add'&& states == '未处理'"> -->
            <div v-if="nowItem !=='add'&& states == '已处理'">
              <div class="fl w50">
                <span class="accomplish">发起</span>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="影像资料" name="first">
                    <el-carousel :interval="3000" arrow="always" height="45vh">
                      <el-carousel-item v-for="(item,index) in picture" :key="index">
                        <img :src="item.picture" alt="" style="cursor:pointer" class="avatar" @click="actionImg('0')">
                      </el-carousel-item>
                    </el-carousel>
                  </el-tab-pane>
                  <el-tab-pane label="拍照地点" name="second">
                    <div style="height:45vh">
                      <instructMap :nowItem="nowItem"></instructMap>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>

              <div class="rl w50">
                <span class="accomplish">完成</span>
                <el-tabs v-model="activeName1" @tab-click="handleClick">
                  <el-tab-pane label="影像资料" name="first">
                    <el-carousel :interval="3000" arrow="always" height="45vh">
                      <el-carousel-item v-for="(item,index) in pictures" :key="index">
                        <img :src="item.picture" alt="" style="cursor:pointer" class="avatar" @click="actionImg('1')">
                      </el-carousel-item>
                    </el-carousel>
                  </el-tab-pane>
                  <el-tab-pane label="拍照地点" name="second">
                    <div style="height:45vh">
                      <Map :nowItem="nowItem"></Map>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>

            <!-- 完成的 -->
            <div v-if="nowItem !=='add'&& states == '未处理'">
              <!-- 导航切换 -->
              <div class="navb" label-width="120px">
                <el-menu :default-active="activeIndex2" mode="horizontal" @select="handleSelect" text-color="#ccc" active-text-color="#409EFF">
                  <el-menu-item index="1" @click="nowType=0">影像资料</el-menu-item>
                  <el-menu-item index="2" @click="nowType=1">所在位置</el-menu-item>
                </el-menu>
              </div>
              <!-- 轮播信息 -->
              <div style="" v-if="nowType==0">
                <el-form-item label="" v-if="nowItem !=='add'" class="intervalBox">
                  <el-carousel :interval="3000" arrow="always" height="45vh">
                    <el-carousel-item v-for="(item,index) in picture" :key="index">
                      <img :src="item.picture" alt="" style="cursor:pointer" class="avatar" @click="actionImg()">
                    </el-carousel-item>
                  </el-carousel>
                </el-form-item>
              </div>
              <!-- 地图 -->
              <div style="height:45vh" v-if="nowType==1">
                <instructMap :nowItem="nowItem"></instructMap>
              </div>
            </div>

          </div>
        </div>
      </div>
    </el-form>
    <!-- <div class="tar" v-if="$route.name=='instructReceive'"> -->
    <div class="tar">
      <!-- <el-button @click="$emit('cancel')">取 消</el-button> -->
      <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive' && states == '未处理'" @click="innerTranspond = true">转发指令</el-button>
      <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm">确 定</el-button>
    </div>

    <!-- 组织机构树形表单 -->
    <!-- <el-dialog width="30%" title="所属单位" :visible.sync="innerVisible" append-to-body>
      <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
      </el-tree>
    </el-dialog> -->
    <!-- 分部分项树形表单 -->
    <!-- <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
      <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
      </el-tree>
    </el-dialog> -->
    <!-- 接受人id -->
    <el-dialog width="40%" title="选择接收人" :visible.sync="acceptUser" append-to-body>
      <div>
        <span>用户类型</span>
        <el-select v-model="value" placeholder="请选择" @change="changeUserList">
          <el-option v-for="(item,index) in MarkList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-table :data="userList" style="width: 100%" @row-click="tableClick">
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="departname" label="职务">
          </el-table-column>
          <el-table-column prop="mobilePhone" label="电话">
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination background :current-page.sync="sendData.pageNo" :page-sizes="[8]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" @current-change="_userList()" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 转发信息 -->
    <el-dialog width="30%" title="转发信息" :visible.sync="innerTranspond" append-to-body>
      <el-form :model="transpondForm" label-width="80px">
        <el-form-item label="指定人">
          <el-input v-model="transpondName">
            <el-button slot="append" icon="el-icon-search" @click="acceptUser = true"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="transpondForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="innerTranspond = false">取 消</el-button>
        <el-button type="primary" @click="_delivery">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 照片详情查看 -->
    <el-dialog width="60%" title="详情查看" :visible.sync="innerVisibleSon" append-to-body>
      <el-form :model="formSon" label-width="200px">
        <div style="width:80%">

          <el-form-item label="指令描述">
            <el-input v-model="formSon.describe"></el-input>
          </el-form-item>

          <el-form-item label="拍摄时间">
            <el-input v-model="formSon.createTime"></el-input>
          </el-form-item>

          <el-form-item label="经度">
            <el-input v-model="formSon.lat"></el-input>
          </el-form-item>

          <el-form-item label="纬度">
            <el-input v-model="formSon.lgt"></el-input>
          </el-form-item>

          <el-form-item label="照片描述">
            <el-input v-model="formSon.photoDescribe"></el-input>
          </el-form-item>

          <el-form-item label="拍摄地点">
            <el-input v-model="formSon.photoLocation"></el-input>
          </el-form-item>

          <el-form-item label="照片">
            <el-carousel :interval="3000" arrow="always" height="20vh">
              <el-carousel-item v-for="(item,index) in imgData" :key="index">
                <img :src="item.filePath" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
        </div>
      </el-form>
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
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    instructMap,
    Map
  },
  props: ["nowItem"],
  data() {
    return {
      reverse: true,
      activeName: "second",
      activeName1: "second",
      activities: [
        {
          name: "",
          finishTime: "",
          remark: ""
        }
      ],
      activitiesIcon: [
        // 完成指令的人
        {
          size: "large",
          type: "success",
          icon: "el-icon-check"
        },
        // 正在处理中
        {
          size: "large",
          type: "primary",
          icon: "el-icon-loading"
        },
        // 转发人
        {
          size: "large",
          type: "info",
          icon: "el-icon-refresh"
        },
        // 发出指令的人
        {
          size: "large",
          type: "primary",
          icon: "el-icon-location-outline"
        }
      ],
      // 参考图标
      activities2: [
        {
          content: "发出指令的人",
          timestamp: "",
          type: "primary",
          icon: "el-icon-location-outline"
        },
        {
          content: "转发指令的人",
          timestamp: "",
          type: "info",
          icon: "el-icon-refresh"
        },
        {
          content: "正在处理指令",
          timestamp: "",
          type: "primary",
          icon: "el-icon-loading"
        },
        {
          content: "完成指令的人",
          timestamp: "",
          type: "success",
          icon: "el-icon-check"
        }
      ],
      answer: "", // 转发响应变量
      nowType: 0,
      activeIndex: "1",
      activeIndex2: "1",
      newnowType: 0,
      newactiveIndex: "1",
      newactiveIndex2: "1",
      uploadUrl: process.env.BASE_API + "/rest/command/addCommand",
      dialogImageUrl: "",
      value: "",
      value1: "",
      planTime: "",
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      form: {
        id: "",
        infologid: "", // 工序id
        realname: "", // 接收人姓名
        project: "", // 相关工程
        initiator: "", // 发起人
        createTime: "", // 发起时间
        planTime: "", // 计划时间
        remark: "", // 指令内容
        userGroupId: "", // 组织机构id
        processDictId: "", // 工序字典的工序id 非必传
        projectItemId: "", // 分部分项id
        ReceiveUserid: "", // 接收人id
        planCheckTime: "", // 计划检查时间
        commandType: "", // 指令类型
        projectItem: "", // 工程项目
        batchNo: ""
      },
      rules: {
        name: { required: true, message: "必填项", trigger: "blur" },
        username: { required: true, message: "必填项", trigger: "blur" },
        projectItem: { required: true, message: "必填项", trigger: "blur" },
        remark: { required: true, message: "必填项", trigger: "blur" },
        dialogImageUrl: { required: true, message: "必填项", trigger: "blur" },
        // planTime: { required: true, message: "必填项", trigger: "blur" },
        label: { required: true, message: "必填项", trigger: "blur" }
      }, //表单校验规则
      //   转发指令
      transpondForm: {
        commanduserId: "", // 指令用户表id
        zhidingren: "", // 指定人id
        remark: "" // 备注
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
      // 组织机构树显示
      defaultProps: {
        children: "children",
        label: "name"
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "projectItem"
      },
      // 用户类型下拉选择
      MarkList: [
        { label: "项目", value: 1 },
        { label: "业主", value: 2 },
        { label: "监理", value: 3 },
        { label: "标段", value: 4 }
      ],
      // 指令类型下拉
      TypeList: [
        { label: "安全指令", value: 1 },
        { label: "口头指令", value: 2 },
        { label: "纸质指令", value: 3 }
      ],
      sendData: {
        pageNo: 1, // 当前页
        pageSize: 8, // 每页条数
        orgId: "",
        Mark: "" // 标记， 1项目，2业主，3监理，4标段
      },
      //发送工序id
      sendDataSon: {
        processLogId: "", // 工序id
        Mark: "" // 0发送 1完成
      },
      transpondName: "", // 转发用户名回填中文
      total: 0,
      picture: [], // 图片数组,
      pictures: [], // 完成时图片数组
      imgData: [], // 下一层图片数组
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      userList: [], // 接收人列表
      name: "", // 组织机构回填显示
      states: [], //指令内容状态 0 已处理 1未处理
      remark: "", // 最后一个人的备注
      username: "", // 接收人id回填
      projectItem: "", // 分部分项回填显示
      innerVisibleSon: false, // 内层照片详情弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false, // 工程分项弹框
      acceptUser: false, // 接受人id弹框
      innerTranspond: false, // 转发指令信息
      dialogVisible: false // 上传图片
    };
  },
  created() {
    this.initForm();
    this.sendList();
    this._userList();
    this.form.batchNo = this.createUUID();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      let ObCopyData = this.$tool.ObCopy(this.nowItem); //复制nowItem传来的值 处理复杂类型
      this.form = ObCopyData.data; // 第一层查看
      this.transpondForm.commanduserId = ObCopyData.data.commanduserId; // 转发指令
      this.commandUser = ObCopyData.data.commandUser; //指令内容
      this.activities = ObCopyData.data.commandUser;
      console.log(this.activities);
      this.activities.forEach(v => {
        v.commandStagePeople == 1 && (v.commandStagePeople1 = "发出指令的人");
        v.commandStagePeople == 2 && (v.commandStagePeople1 = "转发指令的人");
        v.commandStagePeople == 3 && (v.commandStagePeople1 = "正在处理指令");
        v.commandStagePeople == 4 && (v.commandStagePeople1 = "完成指令的人");
      });
      this.picture = ObCopyData.data.pictureOfCommand; // 图片数组
      this.sendDataSon = this.form.processLogId; // 发送工序id
      this.pictures = ObCopyData.data.finishPictureOfCommand;
      this.remark = this.commandUser[this.commandUser.length - 1].remark;
      this.states = this.form.finishPictureOfCommand; // 指令内容是否处理
      if (this.states.length == 0) {
        this.states = "未处理";
      } else {
        this.states = "已处理";
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 切换
    handleSelect(key, keyPath) {},
    sendList() {
      // 组织机构树
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
      // 分部分项树
      // project.projectList().then(res => {
      //   this.projectList = res.data.data;
      // });
    },
    _userList() {
      //   接受人id
      processInfo.getCheckPerson(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userList = res.data.data.data;
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
        //  let arrItem =res.data.data.slice(0,1)
        //  delete arrItem[0].createTime
        //  console.log(arrItem)
        this.imgData = res.data.data; // 内层图片数组
        console.log(this.imgData.shift(0, 1));
      });
      this.innerVisibleSon = true;
    },
    // 下拉框传值表格
    changeUserList(val) {
      this.sendData.Mark = val;
      this._userList();
    },
    // 指令类型下拉框
    commandTypeList(val) {
      this.form.commandType = val;
    },
    //用户列表点击回填
    tableClick(item) {
      this.form.ReceiveUserid = item.id; // 新增传接收人id
      this.username = item.username; // 新增接收人id名回填
      this.transpondForm.zhidingren = item.id; // 转发指定人id
      this.transpondName = item.username; // 转发指定人姓名回填
      this.acceptUser = false;
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
    // 组织机构选择后的数据
    handleCheckChange(data) {
      this.projectList = [];
      this.form.userGroupId = data.id;
      this.sendData.orgId = data.id;
      project.projectList(this.sendData).then(res => {
        if (res.data.data == null) {
          res.data.data = [];
        }
        this.projectList = res.data.data;
      });
    },
    // 分部分项选择后的数据
    projectChange(data) {
      this.form.projectItemId = data.id;
    },
    // 计划时间
    planDataRange(val) {
      this.form.planCheckTime = val;
    },
    _comfirm(file) {
      // 新增
      if (this.nowItem === "add") {
        this.$refs.upload.submit();
      }
      // this.$message({
      //   type: "success",
      //   message: "成功"
      // });
      this.$emit("cancel");
      this.reload();
    },
    // 转发指令
    _delivery() {
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
    // 图片上传
    handleRemove(file, fileList) {
      // console.log(file, fileList);
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
    },
    handleExceed: function(files, fileList) {
      // console.log(files);
      // console.log(fileList);
    }
  }
};
</script>

<style lang="scss" scoped>
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
  height: 62vh;
  overflow-y: scroll;
  position: relative;
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
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
    left: 0.5vw;
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
  font-size: 1vw;
}
.reverseAddBox {
  width: 90%;
  height: 65vh;
  overflow-y: scroll;
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
}
</style>
