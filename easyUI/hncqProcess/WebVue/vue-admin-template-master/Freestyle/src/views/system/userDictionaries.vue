<template>
  <div class="app-container">
    <div class="inquire" style>
      <div class="rl" style="margin-bottom:10px">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="pan-btn light-blue-btn"
          @click="addtan()"
        >新增</el-button>
      </div>
    </div>
    <tree-table class="textList" :data="shuData" border style row-key="id">
      <el-table-column label="组织机构">
        <template slot-scope="scope">
          <span style>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构编码">
        <template slot-scope="scope">
          <span style>{{ scope.row.orgCode }}</span>
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
          <span style>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="bianTan(scope.row)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="dlelTan(scope.row)"></el-button>
          </el-tooltip>
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
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="width:83%">
          <el-form-item label="上级组织机构" label-width="120px">
            <!-- <el-tree :data="shuData" highlight-current :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
            <!-- <select-tree :options="shuData"  v-on:noDe="handleNodeClick" :props="defaultProps" /> -->
            <el-input v-model="checkvalue" @focus="zuzhi"></el-input>
            <el-popover
              ref="popover4"
              v-model="flag"
              placement="bottom-start"
              width="400"
              trigger="click"
            >
              <el-tree
                :data="shuData"
                highlight-current
                :props="defaultProps"
                @node-click="handleNodeClick"
              ></el-tree>
            </el-popover>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <!-- <textarea  v-model="formSet.miaoCode"></textarea> -->
            <el-input type="textarea" v-model="formSet.miaoCode"></el-input>
          </el-form-item>
        </div>
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
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="width:83%">
          <el-form-item label="上级组织机构" label-width="120px">
            <!-- <el-tree :data="shuData" highlight-current :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
            <!-- <select-tree :options="shuData"  v-on:noDe="handleNodeClick" :props="defaultProps" /> -->
            <el-input v-model="checkvalue1" :disabled="true" @focus="zuzhi"></el-input>
            <!-- <el-popover
                  ref="popover4"
                  v-model="flag1"
                  placement="bottom-start"
                  width="400"
                  trigger="click">
                  <el-tree :data="shuData" highlight-current :props="defaultProps" @node-click="dlestleNodeClick"></el-tree> 
            </el-popover>-->
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <!-- <textarea  v-model="formSet.miaoCode"></textarea> -->
            <el-input type="textarea" v-model="formSet.miaoCode"></el-input>
          </el-form-item>
        </div>
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
import SelectTree from "@/components/SelectTree/selectTree.vue";
import request from "@/utils/request";
export default {
  name: "TreeTableDemo",
  components: { treeTable, SelectTree },
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
        label: "name"
      },
      shuData: [],
      flag: false,
      flag1: false,
      checkvalue: "",
      checkvalue1: "",
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
    // chaxun(){
    //   if(this.input==''){
    //     this.fn();
    //     return false
    //   }
    //   request.get('/rest/organizate/depart/'+this.input).then((res)=>{
    //     this.shuData=[];
    //     this.shuData=res.data.data
    //   })
    // },
    // 编辑弹框
    bianTan(data) {
      console.log(data);

      this.biandialogFormVisible = true;
      this.shumo.length = 0;
      this.value =
        data.orgTpye == "1"
          ? "项目"
          : data.orgTpye == "2"
          ? "业主"
          : data.orgTpye == "3"
          ? "监理"
          : data.orgTpye == "4"
          ? "标段"
          : "";
      this.formSet.roleCode = data.name;
      this.formSet.miaoCode = data.description;
      this.departid = data.id;
      this.checkvalue1 = data.parent.name;
      this.shumo.push(data.parentdepartid);
      // setTimeout(() => {
      //     this.$refs.vuetree.setCurrentKey(this.shumo.toString())
      // }, 100);
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
      this.checkvalue = "";
      this.dialogFormVisible = true;
    },
    // 新增
    addJia(data) {
      if (this.formSet.roleCode == "") {
        this.$message({
          message: "请输入组织机构"
        });
        return false;
      }
      if (data == 0 && this.parentdepartid == "") {
        this.$message({
          message: "请选中上级组织机构",
          type: "warning"
        });
        return false;
      }
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
      request.post("/rest/organizate/addDepart", addForm).then(res => {
        if (res.data.respCode == "0") {
          console.log(res.data, "res.data");
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
    // 新增树监听事件
    handleNodeClick(data) {
      this.parentdepartid = data.id;
      this.checkvalue = data.name;
      this.flag = false;
    },
    // 编辑树监听事件
    dlestleNodeClick(data) {
      this.parentdepartid = data.id;
      this.flag1 = false;
    },
    // 初始化树列表
    fn() {
      request.get("/rest/organizate/depart").then(res => {
        this.shuData = res.data.data;
      });
    },
    zuzhi() {
      this.flag = true;
      this.flag1 = true;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #ffff99 !important;
}
/deep/ .el-select {
  max-width: 800px;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: #ffff99;
}
/deep/.el-dialog__body {
  height: 60vh;
}
</style>
