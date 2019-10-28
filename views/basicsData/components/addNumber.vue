<template>
  <div class="addNumber">
     <div class="conent">
          <div class="conentLeft">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="组名:" prop="groupName">
          <el-input v-model="addForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="组员:" prop="groupUser">
         <el-input v-model="addForm.groupUser" :readonly="true">
                  <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog()"></el-button>
        </el-input>
        </el-form-item>
         <el-form-item label="组织机构:" prop="organizationId">
          <el-select placeholder="请选择" style="width:100%" v-model="addForm.organizationId"  @change="checkGroup">
            <el-option
              v-for="item in userGroupOption"
              :key="item.id"
              :label="item.departname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="分部分项:" prop="groupId">
            <div style="height:42vh; overflow-y:auto;border:1px solid #DCDFE6; width:100%;border-radius: 5px">
               <el-tree
              :data="setProjectItem"
              :props="defaultSetKeyProjectItemProps"
              lazy
              show-checkbox
              node-key="id"
              :load="loadNextLayer"
              highlight-current
              :filter-node-method="filterNode"
              ref="setKeyProjectItemTree"
            />
            </div>
          </el-form-item>
      </el-form>
    </div>
    <div class="conentRight">
          <el-table :data="formData" style="width: 100%" border class="textList" height="70vh">
              <el-table-column prop="username" label="用户姓名" align="center"></el-table-column>
              <el-table-column prop="zhiwei" label="职位" align="center"></el-table-column>
              <el-table-column prop="mobilePhone" label="手机号码" align="center"></el-table-column>
         </el-table>
    </div>
     </div>
    <div class="btn">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
    </div>



      <!-- 用户弹框 -->
    <el-dialog
      class="dialogBox"
      width="45%"
      title="选择用户"
      :visible.sync="acceptUserDialog"
      append-to-body
    >
    <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="receiveData.realname" placeholder="请输入用户名"></el-input>
         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="_searchList">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>
      </div>
        <el-table
          border
          :data="receiveUsersList"
          highlight-current-row
          style="width: 100%"
          height="40vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="zhiwei" label="职务"></el-table-column>
          <el-table-column prop="mobilePhone" label="电话"></el-table-column>
        </el-table>
        <el-pagination
           class="pageList"
          :current-page.sync="receiveData.pageNo"
          :page-sizes="[10,20,30]"
          :page-size="receiveData.pageSize"
          @size-change="handeUsersChange"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="receiveUserList()"
          :total="total"
        ></el-pagination>
         <div class="tar" style="margin: 10px">
          <el-button @click="acceptUserDialog = false">取消</el-button>
          <el-button type="primary" @click="toggleSelection()">确定</el-button>
        </div>

    </el-dialog>
  </div>
</template>
<script>
import Organization from "@/api/Organization";
import processInfo from "@/api/process.js";
import request from "@/utils/request";
export default {
  data() {
    return {
      userGroupOption: [], // 组织机构数据
      setProjectItem: [], // 分部分项
      addForm: {
        organizationId: "", //组织机构id
        groupId: "", // 分部分项id(可多选)
        groupName: "", // 组名
        groupUserId: "", // 组员id
        groupUser: "", // 组员
        phoneNumber: "" // 号码
      },
     receiveData: {
        pageNo: 1, // 当前页
        pageSize: 10, // 每页条数
        userGroupId: "",
        projectItemId: "", // 分部分项id
        realname: "", //用户真实名字
        position: "" //职位
      },
      total: 0,
      receiveUsersList:[],
      formData: [],
      multipleSelection:[],   // 选择的人
      defaultSetKeyProjectItemProps: {
        children: "id",
        label: "projectItem",
        isLeaf: "leaf"
      },
      rules: {
        groupName: [
            { required: true, message: '请输入组名', trigger: 'blur' }
          ],
           groupUser: [
            { required: true, message: '请选择组员', trigger: 'blur' }
          ],
           organizationId: [
            { required: true, message: '请选择组织机构', trigger: 'blur' }
          ],
           groupId: [
            { required: true, message: '请选择分部分项', trigger: 'blur' }
          ],
      },
      acceptUserDialog:false
    };
  },
  created() {
    this.initUserGroupTree();
    this.receiveUserList();
  },
  methods: {
    // 初始化组织机构
    initUserGroupTree() {
      Organization.userGroupSelect().then(res => {
        if (res.data.ok) {
          this.userGroupOption = res.data.data;
        }
        console.log(this.userGroupOption, "this.userGroupOption");
      });
    },
    // 选择组织机构触发分部分项
    checkGroup(data) {
      console.log(data);
      this.addForm.organizationId = data;
      Organization.getAllProjectItemTree({ userGroupId: data, pId: "0", iskey: "0" }).then(
        res => {
          if (res.data.ok) {
            this.setProjectItem = res.data.data;
          }
        }
      );
    },
    //
     receiveUserList() {
      //接收人列表
      processInfo.getUsersByDepartId(this.receiveData).then(res => {
        this.total = res.data.data.totalCount;
        this.receiveUsersList = res.data.data.data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handeUsersChange(val) {
      this.receiveData.pageSize = val;
      this.receiveUserList();
    },
    alertAcceptUserDialog(){
      this.acceptUserDialog = true
    },
    _searchList(){
        this.receiveUserList();
    },
    reset(){
        this.receiveData.realname="";
        this.receiveUserList();
    },
    toggleSelection() {
      this.acceptUserDialog = false;
      this.formData = this.multipleSelection;
      let items = this.multipleSelection;
      let names="";
      let ids="";
      let mobles="";
      for (let i = 0; i < items.length; i++) {
        ids += items[i].id + ",";
        mobles += items[i].mobilePhone + ",";
        names += items[i].username + ",";
      }
      this.addForm.groupUserId = ids;
      this.addForm.groupUser = names;
      this.addForm.phoneNumber = mobles;
    },
    loadNextLayer(node, resolve) {
      //异步加载下一级分部分项
      if (node.level > 0) {
        Organization.getAllProjectItemTree({
          userGroupId: this.addForm.organizationId,
          pId: node.data.id,
          iskey: "1"
        }).then(res => {
          resolve(res.data.data);
        });
      }
    },
    filterNode(value, data, node) {
      //过滤分部分项
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    close() {
      this.$emit("cancel");
    },

//    organizationId: 030001003001
// groupId: 030001003001_T01J001F001ZV001QD001
// groupName: 测试【四组】
// groupUserId: 40288a8f6cd27ea9016cd291ecc30009,40288a8f6ce12592016ce14a6ef20008,
// groupUser: 陈驰,徐翔,
// phoneNumber: 18627839094,18627839094,
// userGroupId: 030001003001



    submitForm(formName) {
      let ids = this.$refs.setKeyProjectItemTree.getCheckedKeys();
      this.addForm.groupId = ids.join(",");
      this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post("/rest/NumberGroup/addgroup",  this.addForm).then(res => {
            if (res.data.ok) {
              this.$message({
                message: "恭喜你，新增成功",
                type: "success"
              });
              this.$emit("cancel");
              this.$emit("comfirm"); //确认
            }
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.addNumber {

  .conent{
      overflow: hidden;
  }
  .conentLeft {
    float: left;
    width: 40%;
    //height:70vh;
  }
  .conentRight {
    float: left;
    width: 60%;
    padding: 0 30px;
    //height:70vh;
  }
  .btn{
      margin-left:80%;
      margin-top:20px;
  }
}
/deep/.el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #303133;
  font-weight: 700;
  margin-top: 10px;
}

</style>
