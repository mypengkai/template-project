<template>
  <div class="p20">
    <!-- 左边角色列表 -->

    <div class="topBar">
      <span>角色名称:</span>
      <el-input v-model="input" placeholder="请输入内容"></el-input>

      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="chaxun()">搜索</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="dialogFormVisible=true">新增</el-button>
      </div>
    </div>
    

    <el-table class="textList" :data="tableData" height="74vh">
      <el-table-column prop="rolecode" label="角色编码">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编译" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle  @click="bianTan(scope.row)" v-if="tableData.length!=0"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle  @click="open2(scope.row.id)" v-if="tableData.length!=0"></el-button>
          </el-tooltip>
          <el-tooltip content="PC端查询" placement="top">
            <el-button type="success" icon="el-icon-zoom-out" circle  @click="sxlb(scope.row.id,'1')" v-if="tableData.length!=0"></el-button>
          </el-tooltip>
          <el-tooltip content="移动端查询" placement="top">
            <el-button type="primary" icon="el-icon-search" circle  @click="sxlb(scope.row.id,'2')" v-if="tableData.length!=0"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <!-- 分页 -->
    <!-- <div class="block" style="" id="blockTop">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[15,30,45,60]"
        :page-size="15"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div> -->

    <!-- 新增弹框 -->
    <el-dialog title="新增详情" :visible.sync="dialogFormVisible">
      <el-form :model="formSet">
        <el-form-item label="角色编码" label-width="120px">
          <el-input v-model="formSet.rolecode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="formSet.rolename" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJia()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑详情" :visible.sync="xiudialogSxlbVisible">
      <el-form :model="formGet">
        <el-form-item label="角色编码" label-width="120px">
          <el-input v-model="formGet.rolecode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="formGet.rolename" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="xiudialogSxlbVisible = false">取 消</el-button>
        <el-button type="primary" @click="xiuGai()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 树形列表弹框 -->
    <el-dialog title="树形菜单" :visible.sync="dialogSxlbVisible">
      <!-- zreet -->
      <div class="shu">
        <el-tree :data="shuData" show-checkbox default-expand-all node-key="id" ref="tree" :default-checked-keys="shuMo" highlight-current :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSxlbVisible = false">取 消</el-button>
        <el-button type="primary" @click="addZre()">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import api from "@/api/resource.js";
export default {
   inject: ["reload"],
  data() {
    return {
      dialogSxlbVisible: false,
      xiudialogSxlbVisible: false,
      tableData: null,
      input: "",
      dialogFormVisible: false,
      currentPage1: 1,
      formSet: {
        rolename: "",
        rolecode: ""
      },
      formGet: {
        rolename: "",
        rolecode: ""
      },
      getId: "",
      // 分页总条数
      total: 0,
      // 一页多少条
      currentPage4: 15,
      shuData: [],
      shuId: "",
      shuidData: "",
      shuMo: [],
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
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    // 获取列表数据
    fn() {
      return request.post("/rest/role/getList").then(res => {
        this.tableData = res.data.data;
      });
    },
    // 新增接口
    addJia() {
      let objForm = {
        roleName: this.formSet.rolename,
        roleCode: this.formSet.rolecode
      };
      return request.post("/rest/role/add", objForm).then(res => {
        if (res.data.respCode == "0") {
          this.$message({
            message: "恭喜你，新增成功",
            type: "success"
          });
          this.fn();
          this.formSet.rolename = "";
          this.formSet.rolecode = "";
          this.dialogFormVisible = false;
        }
      });
    },
    // 编辑弹框
    bianTan(data) {
      this.xiudialogSxlbVisible = true;
      this.formGet.rolename = data.rolename;
      this.formGet.rolecode = data.rolecode;
      this.getId = data.id;
    },
    // 编辑接口
    xiuGai(data) {
      let objxiuForm = {
        roleName: this.formGet.rolename,
        roleCode: this.formGet.rolecode,
        id: this.getId
      };
      // console.log(objxiuForm)
      return request.post("/rest/role/add", objxiuForm).then(res => {
        if (res.data.respCode == "0") {
          this.$message({
            message: "恭喜你，修改成功",
            type: "success"
          });
          this.fn();
          this.xiudialogSxlbVisible = false;
        }
      });
    },
    // 删除接口
    open2(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let idDelete = { roleid: id };
        return request.get(`/rest/role/delete/${id}`, idDelete).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fn();
        });
      });
    },
    // 查看树形列表接口
    sxlb(id,Mark) {
      
      this.dialogSxlbVisible = true;
      this.shuId = id;
      // console.log(id,Mark)
      request.post("/rest/role/functionList",{id,Mark}).then(res => {
        
        this.shuData = res.data.data;
        
      });
     
      // api.getTree({Mark,id}).then(res => {
        
      //   this.shuData = res.data.data;
        
      // });
    },
    // 查询接口
    chaxun() {
      // var idCha={id:'402881f36468e19e016468e7f12a0003'}
      if (this.input == "") {
        this.fn();
        return false;
      }
      request.post("/rest/role/chakan", { rolename: this.input }).then(res => {
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
      let idForm = { roleid: this.shuId, functions: this.shuidData };
      request.post("/rest/role/updataFunction", idForm).then(res => {
        this.$message({
          message: "恭喜你，保存成功",
          type: "success"
        });
        // console.log(res);
      });
      this.dialogSxlbVisible = false;
    },
      // 重置按钮
    reset() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.roleLayout {
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
}
</style>
