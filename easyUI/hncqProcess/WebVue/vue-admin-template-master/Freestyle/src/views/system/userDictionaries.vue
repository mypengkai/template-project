<template>
  <div class="app-container">
    <div class="inquire" style="">
      <div class="fl">
        <span class="fl" style="padding-top: 1vh;">组织机构名称:</span>
        <span class="fl" style="padding-left: 0.5vw;margin-bottom: 2vh">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </span>
      </div>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus" @click="addtan()">新增</el-button>
      </div>
    </div>
    <tree-table :data="shuData" border>
      <el-table-column label="组织机构">
        <template slot-scope="scope">
          <span style="">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构编码">
        <template slot-scope="scope">
          <span style="">{{ scope.row.orgCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构类型">
        <template slot-scope="scope">
          <span v-if="scope.row.orgTpye==1">项目</span>
          <span v-if="scope.row.orgTpye==2">业主</span>
          <span v-if="scope.row.orgTpye==3">监理</span>
          <span v-if="scope.row.orgTpye==4">标段</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span style="">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle v-if="scope.row.orgCode!='A01A01'" @click="bianTan(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle v-if="scope.row.orgCode!='A01A01'" @click="dlelTan(scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-table>
    <!-- 新增弹框 -->
    <el-dialog title="新增详情" :visible.sync="dialogFormVisible">
      <el-form :model="formSet">
        <el-form-item label="组织机构" label-width="120px">
          <el-input v-model="formSet.roleCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构类型" label-width="120px">
          <el-select v-model="value" placeholder="请选择" @change="bblur">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织机构" label-width="120px">
          <el-tree :data="shuData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <textarea style="height:100px;width:790px" v-model="formSet.miaoCode"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJia(0)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog title="编辑详情" :visible.sync="biandialogFormVisible">
      <el-form :model="formSet">
        <el-form-item label="组织机构" label-width="120px">
          <el-input v-model="formSet.roleCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构类型" label-width="120px">
          <el-select v-model="value" placeholder="请选择" @change="bblur">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织机构" label-width="120px">
          <el-tree :data="shuData" highlight-current :props="defaultProps" ref="vuetree" node-key="id" :default-expanded-keys="shumo"></el-tree>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <textarea style="height:100px;width:800px" v-model="formSet.miaoCode"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="biandialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="bianJia(1)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import request from "@/utils/request";
export default {
  name: "TreeTableDemo",
  components: { treeTable },
  data() {
    return {
      input: "",
      biandialogFormVisible: false,
      dialogFormVisible: false,
      formSet: {
        roleCode: "",
        firstCode: "",
        miaoCode: ""
      },
      defaultProps: {
        children: "children",
        label: "departName"
      },
      shuData: [],
      parentdepartid: "",
      departid: "",
      shumo: [],
      options: [
        {
          value: "1",
          label: "项目"
        },
        {
          value: "2",
          label: "业主"
        },
        {
          value: "3",
          label: "监理"
        },
        {
          value: "4",
          label: "标段"
        }
      ],
      value: "",
      leiXing: ""
    };
  },
  created() {},
  mounted() {
    this.fn();
  },
  methods: {
    bblur(data) {
      this.leiXing = data;
    },
    // 查询接口
    chaxun() {
      if (this.input == "") {
        this.fn();
        return false;
      }
      request.get("/rest/organizate/depart/" + this.input).then(res => {
        this.shuData = [];
        this.shuData = res.data.data;
      });
    },
    // 编辑弹框
    bianTan(data) {
      this.biandialogFormVisible = true;
      this.shumo.length = 0;
      this.value =
        data.orgTpye == "1"
          ? "项目"
          : data.orgTpye == "2"
            ? "业主"
            : data.orgTpye == "3" ? "监理" : data.orgTpye == "4" ? "标段" : "";
      this.formSet.roleCode = data.departName;
      this.formSet.miaoCode = data.description;
      this.departid = data.id;
      this.shumo.push(data.parentdepartid);
      setTimeout(() => {
        this.$refs.vuetree.setCurrentKey(this.shumo.toString());
      }, 100);
      this.parentdepartid = data.parentdepartid;
    },
    // 编辑
    bianJia(data) {
      this.addBian(data);
      this.formSet.roleCode = "";
      this.formSet.miaoCode = "";
      this.biandialogFormVisible = false;
    },
    // 新增弹框
    addtan() {
      this.formSet.roleCode = "";
      this.formSet.miaoCode = "";
      this.departid = "";
      this.parentdepartid = "";
      this.value = "";
      this.dialogFormVisible = true;
    },
    // 新增
    addJia(data) {
      this.addBian(data);
      this.dialogFormVisible = false;
    },
    // 新增编辑接口
    addBian(data) {
      let addForm = {
        departid: this.departid,
        departname: this.formSet.roleCode,
        description: this.formSet.miaoCode,
        parentdepartid: this.parentdepartid,
        orgtype: this.leiXing
      };
      console.log(addForm);
      request.post("/rest/organizate/addDepart", addForm).then(res => {
        if (res.data.respCode == "0") {
          this.$message({
            message: data == 0 ? "恭喜你，新增成功" : "恭喜你，修改成功",
            type: "success"
          });
          this.fn();
        }
      });
    },
    // 删除接口
    dlelTan(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request.post("/rest/organizate/delete/" + data.id).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fn();
          console.log(res);
        });
      });
    },
    handleNodeClick(data) {
      this.parentdepartid = "";
      this.parentdepartid = data.id;
    },
    // 初始化树列表
    fn() {
      request.get("/rest/organizate/depart").then(res => {
        var data = res.data.data;
        this.shuData = data;
        console.log(this.shuData);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #ffff99 !important;
}
.el-select {
  width: 800px;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #ffff99;
}
</style>
