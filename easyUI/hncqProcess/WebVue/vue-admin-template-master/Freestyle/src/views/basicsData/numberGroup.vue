<template>
  <div class="p20">
    <div class="topBar">
      <!-- <span>组织机构:</span>
      <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
        <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                   :value="item.id"></el-option>
      </el-select>
      <span>分部分项:</span>

      <select-tree clearable lazy show-checkbox :options="projectItemTreeOptions" ref="getSelectData"
                   :props="projectItemDefaultProp"
                   v-on:noDe="projectItemOnClick"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="_searchList">查询
        </el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn"
                   @click="action('add')">新增
        </el-button>
      </div>-->

      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange">
            <el-option
              v-for="item in userGroupOption"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>分部分项:</span>

          <select-tree
            clearable
            lazy
            show-checkbox
            :options="projectItemTreeOptions"
            ref="getSelectData"
            :props="projectItemDefaultProp"
            v-on:noDe="projectItemOnClick"
          />
        </el-col>
        <el-col :span="8">
          <div>
            <el-button
              type="primary"
              icon="el-icon-search"
              class="pan-btn light-blue-btn"
              @click="_searchList"
            >查询</el-button>
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-refresh"
              @click="reset()"
            >重置</el-button>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              class="pan-btn light-blue-btn"
              @click="action('add')"
            >新增</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 查询列表 -->
    <div>
      <el-table border class="textList" :data="groupList" style="width: 100%" height="68vh">
        <el-table-column align="center" prop="groupName" width="150" label="组名" />
        <el-table-column align="center" prop="groupUser" label="组员" />
        <el-table-column align="center" prop="createTime" width="150" label="创建时间" />
        <el-table-column align="center" prop="realname" width="100" label="创建人" />
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <!--            <el-button type="warning" size="small" icon="el-icon-edit" circle @click="Edit(scope.row)"/>-->
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="Delete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination
      class="pageList mt1"
      background
      :current-page.sync="sendData.pageNo"
      :page-sizes="[10,20,30]"
      :page-size="sendData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="_searchList()"
      :total="total"
      @size-change="handleSizeChange"
    ></el-pagination>

    <!-- 编辑弹框 -->
    <el-dialog
      fullscreen
      :lock-scroll="true"
      class="dialogBox"
      :title="nowItem=='add'?'新增':'查看'"
      :visible.sync="dialogFormVisible"
    >
      <checkBox
        :nowItem="nowItem"
        v-if="nowItem"
        @cancel="dialogFormVisible=false"
        @comfirm="_searchList()"
      ></checkBox>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import checkBox from "./components/checkBox";
import api from "../../api/numberGroup";
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import project from "@/api/project";

export default {
  inject: ["reload"],
  components: {
    SelectTree,
    checkBox
  },
  data() {
    return {
      groupList: [], //  发送指令集合
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      userGroupTree: [], // 组织机构树
      projectItemTree: [], // 分部分项树
      total: 0,
      sendData: {
        departId: "", //部门id
        projectItemId: "", // 分部分项id
        pageNo: 1, // 当前页
        pageSize: 10 // 每页条数
      },

      nowItem: "",
      name: "", // 组织机构回填显示
      projectItem: "", // 分部分项回填显示
      dialogFormVisible: false, // 查看编辑弹框
      innerVisible: false, // 组织机构弹框
      projectVisible: false, // 工程分项弹框

      userGroupOption: [],
      projectItemTreeOptions: [], // 分部分项树
      userGroupId: "",
      orgId: "",
      projectItemDefaultProp: {
        // 工程分项树显示
        children: "id",
        label: "projectItem",
        isLeaf: "leaf"
      },
      defaultUserGroupProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this._searchList();
    this.initUserGrouptTree();
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    },
    initUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupOption = res.data.data;
      });
    },
    userGroupOnChange(data) {
      // 组织机构下拉树
      this.orgId = data;
      Organization.getProjectItemFromLayer({
        userGroupId: data,
        pId: "0"
      }).then(res => {
        this.projectItemTreeOptions = res.data.data;
        this.$refs.getSelectData.labelModel = "";
      });
    },
    loadNextNode(node, resolve) {
      //异步获取下一级节点数据
      if (node.level > 0) {
        Organization.getProjectItemFromLayer({
          userGroupId: this.selectedUserGroup,
          pId: node.data.id
        }).then(res => {
          resolve(res.data.data);
        });
      }
    },
    projectItemOnClick(data) {
      // 分部分项选择后的数据
      this.sendData.projectItemId = data.id;
    },
    /*   async actionItem(id) {  // 查询单个请求
           let { data } = await api.searchOne({ id })
           this.nowItem = data.data
           this.dialogFormVisible = true
         },*/
    _searchList() {
      // 列表请求
      api.numberGroupList(this.sendData).then(res => {
        this.total = res.data.data.totalCount;
        this.groupList = res.data.data.data;
      });
    },

    // 点击删除按钮
    Delete(data) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this.doDelete(data));
    },

    // 进行删除操作
    doDelete(data) {
      return request.get(`/rest/NumberGroup/del/${data.id}`).then(res => {
        // this.Reset()
        this._searchList();
      });
    },
    addProcessFunction(formName) {
      // 新增
      const fromData = {
        userGroupId: this.userGroupId,
        processMDictId: this.form.processMDictId,
        processDictId: this.form.processSDictId,
        projectItemId: this.projectItemId,
        remark: this.form.remark,
        checkNum: this.checkNum,
        seq: this.seq
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          request.post("/rest/processCheck/addProcess", fromData).then(res => {
            if (res.data.respCode == 0) {
              this.$message({
                message: "恭喜你，新增成功",
                type: "success"
              });
              this.loadAppointProcessList();
              this.dialogFormVisible = false;
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.sendData.pageSize = val;
      this._searchList();
    },
    handleUserGroupChange(data) {
      // 组织机构树点击事件
      this.projectItemTree = []; //清空数据
      if (data.children.length === 0) {
        this.sendData.departId = data.id;
        project.projectList({ orgId: data.id }).then(res => {
          this.projectItemTree = res.data.data;
        });
      } else {
      }
    },
    projectItemOnClick(data) {
      // 工程分部分项id
      this.sendData.projectItemId = data.id;
    },
    reset() {
      // 重置按钮
      this.reload();
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    }
  }
};
</script>

<style lang="scss" scoped>
/* .el-select .el-input {
     width: 130px;
   }*/

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

/*  .dialogBox {
    margin-top: -2vh;
  }*/

.mybox {
  /deep/ .el-range-editor.el-input__inner {
    padding: 3px 0px;
  }

  /deep/ .el-date-editor {
    width: 148px;
  }
}
</style>
