<template>
    <div>
        <el-form :model="form" label-width="120px">
            <div style="width:70%">
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
                    <el-input v-model="form.ReceiveUserid">
                        <el-button slot="append" icon="el-icon-search" @click="acceptUser = true"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="计划检查时间" v-if="nowItem =='add'">
                    <el-input v-model="form.planCheckTime"></el-input>
                </el-form-item>

                <el-form-item label="指令内容" v-if="nowItem =='add'">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item label="状态" v-if="nowItem =='add'">
                    <el-input v-model="form.state"></el-input>
                </el-form-item>

                <el-form-item label="指令类型" v-if="nowItem =='add'">
                    <el-input v-model="form.commandType"></el-input>
                </el-form-item>

                <!-- 查看 -->
                <el-form-item label="相关工程" v-if="nowItem !=='add'">
                    <el-input v-model="form.project"></el-input>
                </el-form-item>

                <el-form-item label="发起人" v-if="nowItem !=='add'">
                    <el-input v-model="form.initiator"></el-input>
                </el-form-item>

                <el-form-item label="发起时间" v-if="nowItem !=='add'">
                    <el-input v-model="form.createTime"></el-input>
                </el-form-item>

                <el-form-item label="计划时间" v-if="nowItem !=='add'">
                    <el-input v-model="form.planTime"></el-input>
                </el-form-item>

                <el-form-item label="指令内容" v-if="nowItem !=='add'">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div class="tar">
            <el-button>取 消</el-button>
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
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
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
      options: [
        {
          value: "选项1",
          label: "业主"
        },
        {
          value: "选项2",
          label: "监理"
        }
      ],
      value: "",
      form: {
        id: "",
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
        state: "", // 状态
        commandType: "", // 指令类型
        files: "" // 图片
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
      sendData: {
        pageNo: 1, // 当前页
        pageSize: 8, // 每页条数
        Mark: "" // 标记， 1项目，2业主，3监理，4标段
      },
      total: 0,
      orgTree: [], // 组织机构树
      projectList: [], // 分部分项树
      userList: [], // 接收人列表
      departName: "", // 组织机构回填显示
      departname: "", // 分部分项回填显示
      dialogFormVisible: true,
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
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
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
        console.log(res.data.data.data);
        this.total = res.data.data.totalCount;
        this.userList = res.data.data.data;
      });
    },
    handleSelectionChange(val) {
      this.userList = val;
      console.log(val);
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
    _comfirm() {
      // 新增
      this.nowItem == "add" &&
        api.addCommand(this.form).then(res => {
          this.$emit("comfirm");
        });
      // 查看单个
      this.nowItem != "add" &&
        api.addCommand(this.form).then(res => {
          this.$emit("comfirm");
        });
    }
  }
};
</script>

<style>
</style>
