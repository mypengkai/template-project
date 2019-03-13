<template>
    <div>
        <el-form :model="form" label-width="100px">
            <div style="width:47vw">
                <!-- 新增 -->
                <el-form-item label="组织机构id" v-if="nowItem =='add'">
                    <el-input v-model="name">
                        <el-button slot="append" icon="el-icon-search" @click="innerVisible = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="分部分项id" v-if="nowItem =='add'">
                    <el-input v-model="departname">
                        <el-button slot="append" icon="el-icon-search" @click="projectVisible = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="接收人id" v-if="nowItem =='add'">
                    <el-input v-model="username">
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
                    <dropzone id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
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
                        <div class="fl">
                            <div>
                                <span>发起人:</span>
                                <el-input v-model="commandUser.faqiren"></el-input>
                            </div>
                            <div>
                                <span>接收人:</span>
                                <el-input v-model="commandUser.jieshouren"></el-input>
                            </div>
                        </div>

                        <div class="fl">
                            <div>
                                <span>开始时间:</span>
                                <el-input v-model="commandUser.createTime"></el-input>
                            </div>
                            <div>
                                <span>结束时间:</span>
                                <el-input v-model="commandUser.finishTime"></el-input>
                            </div>
                        </div>

                        <div class="fl">
                            <div>
                                <span>状态:</span>
                                <el-input v-model="states"></el-input>
                            </div>
                            <div>
                                <span>相关描述:</span>
                                <el-input v-model="commandUser.remark"></el-input>
                            </div>
                        </div>

                        <div class="rl">
                            <el-button type="primary" round @click="innerTranspond = true">转发指令</el-button>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="相关照片" v-if="nowItem !=='add'">
                    <el-carousel :interval="3000" arrow="always" height="25vh">
                        <el-carousel-item v-for="(item,index) in picture" :key="index">
                            <img :src="item" alt="" style="cursor:pointer" class="avatar" @click="actionImg()">
                        </el-carousel-item>
                    </el-carousel>
                </el-form-item>
            </div>
        </el-form>
        <div class="tar">
            <el-button @click="$emit('cancel')">取 消</el-button>
            <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm">确 定</el-button>
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
                        <el-carousel :interval="3000" arrow="always" height="30vh">
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
import api from "@/api/instruct.js";
import instruct from "@/api/instruct.js";
import project from "@/api/project.js";
import Organization from "@/api/Organization.js";
import process from "@/api/process.js";
import Dropzone from "@/components/Dropzone";
export default {
  props: ["nowItem"],
  name: "DropzoneDemo",
  components: { Dropzone },
  data() {
    return {
      dialogImageUrl: "",
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
        label: "departname"
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
        Mark: "" // 标记， 1项目，2业主，3监理，4标段
      },
      //发送工序id
      sendDataSon: {
        processLogId: "" // 工序id
      },
      transpondName: "", // 转发用户名回填中文
      total: 0,
      picture: [], // 图片数组,
      imgData: [], // 下一层图片数组
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      userList: [], // 接收人列表
      name: "", // 组织机构回填显示
      states: "", //指令内容状态 0 已处理 1未处理
      username: "", // 接收人id回填
      departname: "", // 分部分项回填显示
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
  },
  methods: {
    initForm() {
      if (this.nowItem == "add") return;
      let ObCopyData = this.$tool.ObCopy(this.nowItem); //复制nowItem传来的值 处理复杂类型
      this.form = ObCopyData.data; // 第一层查看
      this.transpondForm.commanduserId = ObCopyData.data.commanduserId; // 转发指令
      this.commandUser = ObCopyData.data.commandUser[0]; //指令内容
      this.picture = ObCopyData.data.picture; // 图片数组
      this.sendDataSon = this.form.processLogId; // 发送工序id
      this.states = this.commandUser.state; // 指令内容是否处理
      if (this.states == 0) {
        this.states = "已处理";
      } else {
        this.states = "未处理";
      }
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
        this.formSon = res.data.data[0]; // 图片详情信息
        this.imgData = res.data.data; // 内层图片数组
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
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.form.userGroupId = data.id;
      this.name = data.name;
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
    },
    // 转发指令
    _delivery() {
      instruct.InstructionCommand(this.transpondForm).then(res => {
        this.innerTranspond = false;
      });
    },
    // 上传图片
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
    },
    dropzoneR(file) {
      console.log(file);
      this.$message({ message: "Delete success", type: "success" });
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
