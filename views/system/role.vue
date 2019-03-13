<template>
  <div class="roleLayout p20">
    <!-- 左边角色列表 -->
    <div class="roleList">
      <div class="inquire">
        <div class="fl">
          <span class="fl" style="padding-top: 1vh;">角色名称:</span>
          <span class="fl" style="padding-left: 0.5vw;">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </span>
        </div>

        <div class="rl">
          <el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="addtan()">新增</el-button>
          <el-button type="primary" icon="el-icon-edit-outline">录入</el-button>
        </div>
      </div>
      <!-- table表 -->
      <div style="padding-top: 3vw;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="rolecode" label="角色编码">
          </el-table-column>
          <el-table-column prop="rolename" label="角色名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="primary" icon="el-icon-edit" @click="addtan()"></el-button> -->
              <el-button type="danger" icon="el-icon-delete" @click="open2(scope.row.id)"></el-button>
              <el-button type="success" @click="sxlb(scope.row.id)">查看列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <!-- 分页 -->
      <div class="block" style="" id="blockTop">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[15,30,45,60]"
        :page-size="15"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>
    </div>
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
    <!-- 树形列表弹框 -->
      <el-dialog title="树形列表详情" :visible.sync="dialogSxlbVisible">
        <!-- zreet -->
         <div class="ztr">
           <ul id="treeDemo" class="ztree"></ul>
         </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSxlbVisible = false">取 消</el-button>
          <el-button type="primary" @click="addZre()">保 存</el-button>
        </div>
      </el-dialog>
      
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      dialogSxlbVisible:false,
      tableData:null,
      input: '',
      dialogFormVisible:false,
      currentPage1: 1,
       formSet: {
          rolename: '',
          rolecode:''
      },
      // 分页总条数
      total:0,
      // 一页多少条
      currentPage4:15,
      // ztree插件参数
        zNodes:[],
        setting : {
          view: {
              showIcon: true
          },
          check: {
              enable: true,
              chkDisabledInherit: true
            },
          data: {
              key: {
                  name:"name"
              },
              simpleData: {
                  enable: true,
                  idKey: 'id',
                  pIdKey: 'pid'
              }
          },
          callback: {
            onCheck: this.zTreeOnCheck,
            beforeCheck:this.beforeZtree
          }
      },
      treenodeid:'',
      jueId:'',
      str:''
    };
  },
  mounted(){
    this.fn()
  },
  methods: {
    zTreeOnCheck(event, treeId, treeNode) {
      this.treenodeid='';
      this.str='';
      this.treenodeid+=treeNode.id+",";
      this.str=this.treenodeid.substr(0,this.treenodeid.length-1)
      treeNode.checked==true?true:false
      // console.log(treeNode.checked)
      return true
    },
    beforeZtree(treeId, treeNode){
      console.log(treeNode)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取列表数据
    fn(){
      return request.post('/rest/role/getList').then((res)=>{
        this.tableData=res.data.data
        // console.log(this.tableData)
      })
    },
    // 点击弹出新增框
    addtan(){
      this.dialogFormVisible=true
    },
    // 新增接口
    addJia(){
      var objForm={roleName:this.formSet.rolename,roleCode:this.formSet.rolecode}
      return request.post('/rest/role/add',objForm).then((res)=>{
        if(res.data.respCode=="0"){
          this.formSet.rolename='';
          this.formSet.rolecode='';
          this.fn()
          this.dialogFormVisible=false;
        }
      })
    },
    // 删除接口
    open2(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idDelete={roleid:id}
          return request.get(`/rest/role/delete/${id}`,idDelete).then((res)=>{
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fn()
          })
        })
      },
    // 查看树形列表接口
<<<<<<< .mine
    sxlb(id){
      this.dialogSxlbVisible=true;
      this.shuId=id;
      request.post('/rest/menu/getList').then((res)=>{
        this.shuData=res.data.data;
      })
    },
||||||| .r11697
    sxlb(id){
      this.dialogSxlbVisible=true;
      this.shuId=id;
      request.post('/rest/menu/getList').then((res)=>{
        console.log(res)
        this.shuData=res.data.data
      })
    },
=======
      sxlb(id){
        this.jueId=id;
        this.dialogSxlbVisible=true;
        request.get('/rest/role/functionList/{id}',{id:id}).then((res)=>{
            if(res.status==200){
            this.zNodes=res.data.data
            // console.log(this.zNodes)
            $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes)
            }
          })
      },
>>>>>>> .r11698
    // 查询接口
    chaxun(){
      var idCha={id:'402881f36468e19e016468e7f12a0003'}
        if(this.input==''){
          this.fn();
          return false
        }
        return request.post('/rest/role/chakan/'+this.input).then((res)=>{
<<<<<<< .mine
          console.log(this.tableData)
          console.log(res)
||||||| .r11697
=======
        console.log(res.data.data)
>>>>>>> .r11698
        this.tableData=[]
        this.tableData.push(res.data.data)
        console.log(this.tableData)
      })
    },
    // 关联角色和菜单接口
    addZre(){
<<<<<<< .mine
      this.shuMo.length=0;
      for(let val of this.$refs.tree.getCheckedNodes()){
        this.shuMo.push(val.id)
      }
      this.shuidData=this.shuMo.join(',')
      let idForm={roleid:this.shuId,functions:this.shuidData}
      request.post('/rest/role/updataFunction',idForm).then((res)=>{
        this.$message({
          message: '恭喜你，保存成功',
          type: 'success'
        });
||||||| .r11697
      this.shuMo.length=0;
      this.shuData='';
      for(let val of Array.from(this.$refs.tree.getCheckedNodes())){
        this.shuMo.push(val.id)
      }
      this.shuidData=this.shuMo.join(',')
      let idForm={roleid:this.shuId,functions:this.shuidData}
      request.post('/rest/role/updataFunction',idForm).then((res)=>{
        this.$message({
          message: '恭喜你，保存成功',
          type: 'success'
        });
=======
      let ztreeFrom = {roleid:this.jueId,functions:this.str}
      request.post('/rest/role/updataFunction',ztreeFrom).then((res)=>{
        console.log(this.zNodes)
>>>>>>> .r11698
        console.log(res)
      })
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
  .ztr{
      overflow-y:scroll;
      height: 500px;
    }
}
</style>
