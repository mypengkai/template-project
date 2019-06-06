<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>角色名称:</span>
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="chaxun()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="bianTan()">新增</el-button>
      </div>
    </div>
    <el-table class="textList" :data="tableData" height="74vh">
      <el-table-column prop="rolecode" label="角色编码"></el-table-column>
      <el-table-column prop="rolename" label="角色名称"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="bianTan(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="open2(scope.row.id)" v-if="isDelete(scope.row.rolecode)"></el-button>
          </el-tooltip>
          <el-tooltip content="PC端权限" placement="top">
            <el-button type="success" icon="el-icon-zoom-out" circle @click="sxlb(scope.row.id,'1')"></el-button>
          </el-tooltip>
          <el-tooltip content="移动端权限" placement="top">
            <el-button type="primary" icon="el-icon-search" circle @click="sxlb(scope.row.id,'2')"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--新增弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="clearRole">
      <el-form :model="formSet" ref="formSet">
        <el-form-item label="角色编码:" label-width="120px">
          <el-input v-model="formSet.roleCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" label-width="120px">
          <el-input v-model="formSet.roleName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJia()">确 定</el-button>
      </div>
    </el-dialog>

    <!--树形列表弹框-->
    <el-dialog :title="dialogTreeTitle" :visible.sync="dialogSxlbVisible" class="dialogBox">
      <!--zreet -->
      <div class="shu">
        <el-tree :data="shuData" show-checkbox default-expand-all node-key="id" ref="tree" check-strictly="true" :default-checked-keys="shuMo" highlight-current :props="defaultProps"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSxlbVisible = false">取 消</el-button>
        <el-button type="primary" @click="addZre()">保 存</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import role from "@/api/role.js";
export default {
  inject: ["reload"],
  data() {
    return {
      dialogSxlbVisible: false,
      dialogTitle: '新增',
      tableData: null,
      input: "",
      dialogFormVisible: false,
      formSet: {
        id: "",
        roleName: "",
        roleCode: ""
      },
      dialogTreeTitle:'PC端权限',
      shuData: [],
      shuId: "",
      shuidData: "",
      shuMo: [],
      Mark: '',
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted() {
    this.fn();
  },
  methods: {
    fn() {
      role.roleList().then(res=>{
        this.tableData = res.data.data;
      })
    },
    //默认给其浏览权限
    isDelete(rolecode){
      if(rolecode==='brower'){
        return false;
      }else{
        return true;
      }
    },
    // 新增接口
    addJia() {
      role.roleAdd(this.formSet).then(res => {
        if (res.data.respCode == "0") {
          this.$message({
            message: "恭喜你，新增成功",
            type: "success"
          });
          this.fn();
          this.dialogFormVisible = false;
        }
      });
    },
    // 编辑弹框
    bianTan(data) {
      if(data!=null && data!=undefined && data!=''){
        this.formSet.roleName = data.rolename;
        this.formSet.roleCode = data.rolecode;
        this.formSet.id = data.id;
        this.dialogTitle='编辑';
      }else{
        this.dialogTitle='新增';
      }
      this.dialogFormVisible = true;
    },
    // 删除接口
    open2(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        role.roleDelete(id).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fn();
        });
      });
    },
    // 查看树形列表接口
    sxlb(id, Mark) {
      if(Mark==='2'){
        this.dialogTreeTitle='移动端权限';
      }else if(Mark==='1'){
        this.dialogTreeTitle='PC端权限';
      }
      this.dialogSxlbVisible = true;
      this.shuId=id;
      this.Mark=Mark;
      role.getResourceByRoleId({id:id, Mark: Mark}).then(res => {
        this.shuData = res.data.data;
      });
      this.setTreeChecked(id, Mark);
    },
    setTreeChecked(id, mark){
      role.getFunctionByRoleId({id:id, Mark:mark}).then(res=>{
        this.shuMo=res.data.data;
      })
    },
    // 查询接口
    chaxun() {
      if (this.input == "") {
        this.fn();
        return false;
      }
      role.getRoleByName({ rolename: this.input }).then(res => {
        this.tableData = [];
        if (res.data.data != undefined) {
          this.tableData.push(res.data.data);
        }
      });
    },
    // 关联角色和菜单接口
    addZre() {
      this.shuMo.length = 0;
      for (let val of this.$refs.tree.getCheckedNodes()) {
        this.shuMo.push(val.id);
      }
      this.shuidData = this.shuMo.join(",");
      role.setRoleRelFunction({ roleid: this.shuId, functions: this.shuidData, Mark: this.Mark }).then(res => {
        this.$message({
          message: "恭喜你，保存成功",
          type: "success"
        });
      });
      this.dialogSxlbVisible = false;
    },
    // 重置按钮
    reset() {
      this.reload();
    },
    //清空role对象
    clearRole(data){
      this.formSet={
        id: "",
        roleName: "",
        roleCode: ""
      };
      this.dialogFormVisible=false;
    }
  }
};
</script>

<style lang="scss" scoped>
.roleList {
  float: left;
  width: 100%;
  .inquire {
    span {
      display: block;
    }
  }
}
.shu {
  overflow-y: scroll;
  height: 500px;
}
</style>
