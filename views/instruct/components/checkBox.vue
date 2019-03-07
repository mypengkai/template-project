<template>
    <div>
        <el-form :model="form" label-width="100px">
            <div style="width:47vw">
                <!-- 新增 -->
                <el-form-item label="组织机构id" v-if="nowItem =='add'">
                    <el-input v-model="departName">
                        <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="分部分项id" v-if="nowItem =='add'">
                    <el-input v-model="departname">
                        <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="接收人id" v-if="nowItem =='add'">
                    <el-input v-model="form.username">
                        <el-button slot="append" icon="el-icon-search" @click="acceptUser = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="计划检查时间" v-if="nowItem =='add'">
                    <el-date-picker v-model="planTime" type="datetime" @change="planDataRange" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="指令类型" v-if="nowItem =='add'">
                    <el-select v-model="value" placeholder="请选择" @change="commandTypeList">
                        <el-option v-for="(item,index) in TypeList" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="指令内容" v-if="nowItem =='add'">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item label="图片选择" v-if="nowItem =='add'">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>

                <!-- 查看 -->
                <el-form-item label="相关工程" v-if="nowItem !=='add'">
                    <el-input v-model="form.projectItem"></el-input>
                </el-form-item>

                <el-form-item label="发起人" v-if="nowItem !=='add'">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>

                <el-form-item label="发起时间" v-if="nowItem !=='add'">
                    <el-input v-model="form.createTime"></el-input>
                </el-form-item>

                <el-form-item label="计划时间" v-if="nowItem !=='add'">
                    <el-input v-model="form.planTime"></el-input>
                </el-form-item>

                <el-form-item label="指令内容" v-if="nowItem !=='add'">
                    <div class="topBar">
                        <span>发起人:</span>
                        <el-input v-model="commandUser.faqiren"></el-input>

                        <span>接收人:</span>
                        <el-input v-model="commandUser.jieshouren"></el-input>

                        <span>开始时间:</span>
                        <el-input v-model="commandUser.createTime"></el-input>

                        <span>结束时间:</span>
                        <el-input v-model="commandUser.finishTime"></el-input>

                        <span>状态:</span>
                        <el-input v-model="commandUser.state"></el-input>

                        <span>相关描述:</span>
                        <el-input v-model="commandUser.remark"></el-input>
                    </div>

                </el-form-item>

                <el-form-item label="相关照片" v-if="nowItem !=='add'">
                    <el-carousel :interval="3000" arrow="always" height="25vh">
                        <el-carousel-item v-for="item in picture" :key="item">
                            <img :src="item" alt="" style="cursor:pointer" class="avatar" @click="actionImg()">
                        </el-carousel-item>
                    </el-carousel>
                </el-form-item>
            </div>
        </el-form>
        <div class="tar">
            <el-button @click="$emit('cancel')">取 消</el-button>
            <el-button type="primary" @click="_comfirm">确 定</el-button>
        </div>

        <!-- 组织机构树形表单 -->
        <el-dialog width="30%" title="所属单位" :visible.sync="innerVisible" append-to-body>
            <el-tree :data="orgTree" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="handleCheckChange" :props="defaultProps">
            </el-tree>
        </el-dialog>
        <!-- 分部分项树形表单 -->
        <el-dialog width="30%" title="分部分项" :visible.sync="projectVisible" append-to-body>
            <el-tree :data="projectList" :highlight-current="true" :render-after-expand="false" node-key="id" @node-click="projectChange" :props="projectTree">
            </el-tree>
        </el-dialog>
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
                </el-table>
            </div>
            <div>
                <el-pagination background :current-page.sync="sendData.pageNo" :page-sizes="[8]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" @current-change="_userList()" :total="total">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 照片详情查看 -->
        <el-dialog width="60%" title="详情查看" :visible.sync="innerVisibleSon" append-to-body>
            <el-form :model="formSon" label-width="200px">
                <div style="width:60%">

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
                        <el-carousel :interval="3000" arrow="always" height="30vh">
                            <el-carousel-item v-for="item in imgData" :key="item">
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
import api from "@/api/instruct.js";
import project from "@/api/project.js";
import Organization from "@/api/Organization.js";
import process from "@/api/process.js";
export default {
  props: ["nowItem"],
  data() {
    return {
      dialogImageUrl: "",
      nowItemSon: "",
      dialogVisible: false,
      value: "",
      planTime: "",
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
        files: "" // 图片
      },
      commandUser:
        // 指令内容框框
        {
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
        label: "departName"
      },
      // 工程分项树显示
      projectTree: {
        children: "children",
        label: "departname"
      },
      //   用户类型下拉选择
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
        Mark: "" // 标记， 1项目，2业主，3监理，4标段
      },
      //发送工序id
      sendDataSon: {
        processLogId: "" // 工序id
      },

      total: 0,
      picture: [], // 图片数组,
      imgData:[], // 下一层图片数组
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      userList: [], // 接收人列表
      departName: "", // 组织机构回填显示
      departname: "", // 分部分项回填显示
      dialogFormVisible: true,
      innerVisibleSon: false,
      innerVisible: false, // 组织机构弹框
      projectVisible: false, // 工程分项弹框
      acceptUser: false // 接受人id弹框
    };
  },
  created() {
    this.initForm();
    this.sendList();
    this._userList();
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      let ObCopyData = this.$tool.ObCopy(this.nowItem); //处理复杂类型
      this.form = ObCopyData.data; // 第一层查看
      this.commandUser = ObCopyData.data.commandUser[0]; //指令内容
      this.picture = ObCopyData.data.picture; // 图片数组
      this.sendDataSon = this.form.processLogId;
      console.log(this.sendDataSon.processLogId);
    },
    sendList() {
      // 组织机构树
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
      // 分部分项树
      project.projectList().then(res => {
        this.projectList = res.data.data;
      });
    },
    _userList() {
      //   接受人id
      process.getCheckPerson(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.userList = res.data.data.data;
      });
    },
    // 工序id拿图片详情
    actionImg() {
      process.getPictureDetail(this.sendDataSon).then(res => {
        this.formSon = res.data.data[0];
        this.imgData = res.data.data;
        console.log(res.data.data);
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
      this.form.username = item.username;
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.form.userGroupId = data.id;
      this.departName = data.departName;
      this.innerVisible = false;
    },
    // 分部分项选择后的数据
    projectChange(data, checked, indeterminate) {
      this.form.projectItemId = data.id;
      this.departname = data.departname;
      this.projectVisible = false;
    },
    // 计划时间
    planDataRange(val) {
      this.form.planCheckTime = val;
      console.log(this.form);
    },
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.addCommand(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个
      //   this.nowItem != "add" &&
      //     api.searchOne(this.form).then(res => {
      //       console.log(res);
      //     });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
</style>
