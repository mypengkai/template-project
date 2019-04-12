<template>
  <div class="p20">
    <span class="fl" style="padding-left: 0.5vw;">
       <el-form inline>
          <el-form-item label="组织机构：">
              <select-tree :options="options" :props="defaultProps" v-on:noDe="noDe" v-model="value"/>
          </el-form-item>
      </el-form>
    </span>

    <div class="rl">
      <el-button type="primary" size="small" icon="el-icon-search" @click="Inquire()">查询</el-button>
      <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="Add()">添加</el-button>
    </div>

    <!-- table表 -->
    <div class="userList">
      <el-table :data="userList" style="width: 100%" height="67vh" class="textList">
        <el-table-column prop="departname" label="组织机构"/>
        <el-table-column prop="remainSmsNum" label="剩余短信"/>
        <el-table-column prop="sendSmsSuccessNum" label="发送成功"/>
        <el-table-column prop="sendAllNum" label="总发送"/>
        <el-table-column prop="sendSmsFailNum" label="发送失败数量"/>
        <el-table-column prop="warnMoney" label="提醒余额"/>
        <el-table-column prop="isWarn" label="是否提醒"/>
        <el-table-column prop="warnPhone" label="提醒手机号码"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="Edit(scope.row)"/>
            <el-button type="danger" icon="el-icon-delete" circle @click="Delete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
      <div class="block" style="padding-left:5px" id="blockTop">
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
    <!-- 新增对话框 -->
    <el-dialog :visible.sync="addDialog" title="新增" width="550px" class="dialogBox">
      <el-form ref="formSet" :model="formSet" label-width="120px" :rules="rules">
        <el-form-item label="组织机构:">
          <el-tree :data="options" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-form-item>

        <el-form-item label="剩余短信数量:" prop="remainSmsNum">
          <el-input v-model.number="formSet.remainSmsNum" size="small" ></el-input>
        </el-form-item>

        <el-form-item label="发送成功:" prop="sendSmsSuccessNum">
          <el-input v-model.number="formSet.sendSmsSuccessNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="总发送:" prop="sendAllNum">
          <el-input v-model.number="formSet.sendAllNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="发送失败数量:" prop="sendSmsFailNum">
          <el-input v-model.number="formSet.sendSmsFailNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="提醒余额:" prop="warnMoney">
          <el-input v-model.number="formSet.warnMoney" size="small"></el-input>
        </el-form-item>

        <el-form-item label="是否提醒:" prop="isWarn">
          <el-switch v-model="formSet.isWarn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label="提醒手机号码:" prop="warnPhone">
          <el-input v-model.number="formSet.warnPhone" size="small"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addResetForm('formSet')">取 消</el-button>
        <el-button type="primary" @click="save('formSet')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :visible.sync="editDialog" title="编辑" width="550px">
      <el-form ref="editSet" :model="editSet" label-width="120px" :rules="rules">
        <el-form-item label="组织机构" label-width="120px">
          <el-tree :data="options" highlight-current :props="defaultProps" ref="vuetree" node-key="id" :default-expanded-keys="shumo" @node-click="dlestleNodeClick"></el-tree>
        </el-form-item>

        <el-form-item label="剩余短信数量:" prop="remainSmsNum">
          <el-input v-model="editSet.remainSmsNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="发送成功:" prop="sendSmsSuccessNum">
          <el-input v-model.number="editSet.sendSmsSuccessNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="总发送:" prop="sendAllNum">
          <el-input v-model.number="editSet.sendAllNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="发送失败数量:" prop="sendSmsFailNum">
          <el-input v-model.number="editSet.sendSmsFailNum" size="small"></el-input>
        </el-form-item>

        <el-form-item label="提醒余额:" prop="warnMoney">
          <el-input v-model.number="editSet.warnMoney" size="small"></el-input>
        </el-form-item>

        <el-form-item label="是否提醒:" prop="isWarn">
          <el-switch v-model="editSet.isWarn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label="提醒手机号码:" prop="warnPhone">
          <el-input v-model="editSet.warnPhone" size="small"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editResetForm('editSet')">取 消</el-button>
        <el-button type="primary" @click="updata('editSet')">保 存</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import request from '@/utils/request';
  import api1 from "../../api/Organization.js";
  import SelectTree from '@/components/SelectTree/selectTree.vue';
  export default {
    components:{
        SelectTree,
    },
    data() {
      // 验证手机号格式
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {

            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };

      return {
        formSet: {  // 添加对话框中的数据
          // id:'',
          departId: '',
          remainSmsNum: '',
          sendSmsSuccessNum: '',
          sendAllNum: '',
          sendSmsFailNum: '',
          warnMoney: '',
          isWarn: true,
          warnPhone: ''
        },
        editSet: {  // 编辑对话框中的数据
          id: '',
          departId: '',
          remainSmsNum: '',
          sendSmsSuccessNum: '',
          sendAllNum: '',
          sendSmsFailNum: '',
          warnMoney: '',
          isWarn: true,
          warnPhone: ''
        },
        currentPage4:1,
        userList: [], // 列表
        addDialog: false, // 点击添加跳出来的对话框
        editDialog: false,  // 点击编辑跳出来的对话框
        value: '',
        innerVisible: false, // 组织机构对话框
        orgTree: [], // 组织机构对话框树
        total: 0, // 分页总条数
        defaultProps: { // 树节点
          children: "children",
          label: "name"
        },
        sendData: { // 查询参数
          pageNo: 1,
          pageSize: 15,
          departid: ''
        },
        scopeRow: '',
        rules: {  // 表单验证规则
          remainSmsNum: [{type: 'number', required: true, message: "请输入剩余短信数", trigger: "blur"}],
          sendSmsSuccessNum: [{type: 'number', required: true, message: "请输入短信发送成功数", trigger: "blur"}],
          sendAllNum: [{type: 'number', required: true, message: "请输入短信总发送数", trigger: "blur"}],
          sendSmsFailNum: [{type: 'number', required: true, message: "请输入短信发送失败数", trigger: "blur"}],
          warnMoney: [{type: 'number', required: true, message: "请输入提醒金额", trigger: "blur"}],
          warnPhone: [{validator: checkPhone, trigger: 'blur'}]
        },
        options:[],
        shumo:[],
        defaultProp: {
          children: "children",
          label: "name"
        },
      }
    },

    created() {
      this._orgTree();
    },

    mounted() {
      this.fn()
      this.Reset();
    },

    methods: {
      // 初始化组织机构input框数据
        fn(){
            request.get('/rest/organizate/depart').then((res)=>{
              console.log(res)
                this.options=res.data.data;
            })
        },
      // 点击取消后 取消表单验证 关闭对话框
      editResetForm(formName) {
        this.$refs[formName].resetFields();
        this.editDialog = false;
      },
      addResetForm(formName) {
        this.$refs[formName].resetFields();
        this.addDialog = false;
      },

      // 初始化列表数据
      Reset() {
        this.sendData.departid = '';
        return request.post('/rest/smsPay/datagrid', this.sendData).then((res) => {
          // console.log(res)
          this.total = res.data.data.totalCount
          this.userList = res.data.data.data
        })
      },

      // 点击删除按钮
      Delete(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => this.doDelete(data));
      },

      // 进行删除操作
      doDelete(data) {
        return request.get(`/rest/smsPay/delete/${data.id}`).then((res) => {
          this.Reset();
        })
      },

      // 点击查询
      Inquire() {
        if (this.sendData.departid != null) {
          return request.post('/rest/smsPay/datagrid', this.sendData).then((res) => {
            this.total = res.data.data.totalCount
            this.userList = res.data.data.data
          })
        }
        else {
          Reset();
        }
      },

      // 点击添加
      Add() {
        this.addDialog = true
      },

      // 点击编辑
      Edit(data) {
        this.shumo.length=0;
        // 更改el-switch的值
        var sisWarn = data.isWarn;
        if (sisWarn == '是') {
          var sisWarn = true;
        }
        if (sisWarn == '否') {
          var sisWarn = false;
        }
        // console.log(data)
        this.shumo.push(data.departId)
          setTimeout(() => {
              this.$refs.vuetree.setCurrentKey(this.shumo.toString())
        }, 100);
        
        // 获取当前选择行中的值到编辑对话框中然后弹出
        this.scopeRow = data;
        var sdepartId = data.departId;
        var sremainSmsNum = data.remainSmsNum;
        var ssendSmsSuccessNum = data.sendSmsSuccessNum;
        var ssendAllNum = data.sendAllNum;
        var ssendSmsFailNum = data.sendSmsFailNum;
        var swarnMoney = data.warnMoney;
        var swarnPhone = data.warnPhone;
        this.editSet.departId = sdepartId;
        this.editSet.remainSmsNum = sremainSmsNum;
        this.editSet.sendSmsSuccessNum = ssendSmsSuccessNum;
        this.editSet.sendAllNum = ssendAllNum;
        this.editSet.sendSmsFailNum = ssendSmsFailNum;
        this.editSet.warnMoney = swarnMoney;
        this.editSet.isWarn = sisWarn;
        this.editSet.warnPhone = swarnPhone;
        // 召唤对话框
        this.editDialog = true;
      },

      //  点击编辑对话框中的保存
      updata(formName) {
        //  表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var seleWarn = this.editSet.isWarn;
            //  更改el-switch的值
            if (seleWarn) {
              seleWarn = '是';
            }
            else {
              seleWarn = '否';
            }
            console.log(this.scopeRow)
            //  获取编辑对话框中的数据到参数列表
            const ztreeFrom = {
              id: this.scopeRow.id,
              departId: this.editSet.departId,
              remainSmsNum: this.editSet.remainSmsNum,
              sendSmsSuccessNum: this.editSet.sendSmsSuccessNum,
              sendAllNum: this.editSet.sendAllNum,
              sendSmsFailNum: this.editSet.sendSmsFailNum,
              warnMoney: this.editSet.warnMoney,
              isWarn: seleWarn, // 改
              warnPhone: this.editSet.warnPhone
            };
            console.log(ztreeFrom)
            return request.post('/rest/smsPay/saveOrUpdate', ztreeFrom).then((res) => {
              this.editDialog = false;
              this.Reset();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 添加
      save(formName) {
        //  进行表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var seleWarn = this.formSet.isWarn;
            //  更改el-switch的值
            if (seleWarn) {
              seleWarn = '是';
            }
            else {
              seleWarn = '否'
            }
            //  获取添加对话框中的数据到参数列表
            const ztreeFrom = {
              departId: this.formSet.departId,
              remainSmsNum: this.formSet.remainSmsNum,
              sendSmsSuccessNum: this.formSet.sendSmsSuccessNum,
              sendAllNum: this.formSet.sendAllNum,
              sendSmsFailNum: this.formSet.sendSmsFailNum,
              warnMoney: this.formSet.warnMoney,
              isWarn: seleWarn, // 改
              warnPhone: this.formSet.warnPhone
            };
            console.log(ztreeFrom)
            return request.post('/rest/smsPay/saveOrUpdate', ztreeFrom).then((res) => {
              console.log(res)
              this.addDialog = false;
              this.Reset();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 组织机构树
      _orgTree() {
        api1.organizateTree().then(res => {
          // console.log(res.data.data);
          // 这里未完成给组织机构树形控件赋值...
        });
      },

      // 组织机构查询
      handleCheckChange(data, checked, indeterminate) {
        //  这里未完成选择组织机构...
      },
      // 分页
      handleSizeChange(val) {
       this.sendData.pageSize=val
       this.Reset()
      },
      handleCurrentChange(val) {
        this.sendData.pageNo=val;
        this.Reset()
      },
      // 点击表框组织机构节点获取ID
      noDe(data){
        this.sendData.departid=data.id
      },
       // 新增树监听事件
      handleNodeClick(data) {
        console.log(data)
        this.formSet.departId=data.id
      },
      // 编辑树监听事件
      dlestleNodeClick(data){
        this.editSet.departId=data.id
    },
    }
  }
</script>
<style lang="scss" scoped>
  .p20{
        padding: 20px;
        /deep/ .select-tree .el-input.el-input--suffix{
            width: 400px;
        }
        /deep/ .el-popper{
            width: 400px;
        }
        /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
          background-color: #ffff99 !important;
        }
        /deep/ .el-tree-node:focus>.el-tree-node__content{
          background-color: #ffff99;
        }
    }
</style>
