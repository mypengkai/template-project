<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <span style="padding-top: 10px;">
        <el-form inline>
          <el-form-item label="组织机构：">
            <select-tree :options="options" v-on:noDe="noDe" :props="defaultProp" v-model="value"/>
          </el-form-item>
        </el-form>
      </span>
      <span v-if="value!=''">
        <el-tree style="margin-left:74px;margin-top:-15px" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </span>
    </div>
    <!-- 右边详情列表 -->
    <div class="particularsList">
      <!-- v-if="treeFrom.projectItem!=''" -->
      <div class="particulars" >
        <p>
          <span>工程名称:</span>
          <input placeholder="" v-model="treeFrom.projectItem" v-if="treeFrom.projectItem!=''" readonly="true">
        </p>
        <p>
          <span>工程类型:</span>
          <input v-model="treeFrom.projectType" v-if="treeFrom.projectType!=''" readonly="true">
        </p>
        <p>
          <span>代码:</span>
          <input v-model="treeFrom.projectCode" v-if="treeFrom.projectCode!=''" readonly="true">
        </p>
        <p>
          <span>桩号:</span>
          <input v-model="treeFrom.zhuanghao" v-if="treeFrom.zhuanghao!=''" readonly="true">
        </p>
        <p>
          <span v-if="processName!=undefined && processName!='' ">状态:</span>
          <input v-model="treeFrom.state1" v-if="processName!=undefined && processName!='' " readonly="true">
        </p>
        <p>
          <!-- v-if="processName!=undefined && processName!=''" -->
          <el-button type="primary" plain  @click="addGx()">添加工序</el-button>
        </p>
      </div>
      <!-- 操作列表 -->
      <!-- v-if="processName!=undefined && processName!='' " -->
       <div class="Cztab">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="planCheckTime" label="时间" >
          </el-table-column>
          <el-table-column prop="processName" label="工序过程">
          </el-table-column>
          <el-table-column prop="state2" label="状态">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" v-if="scope.row.state2==0">指定验收</el-button>
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" v-else-if="scope.row.state2==1">修改指定验收</el-button>
              <el-button @click="handleClick(scope.row)" type="primary" size="small" style="margin-left:33px" v-if="scope.row.state2==0">查看</el-button>
              <el-button @click="handleClick(scope.row)" type="primary" size="small" v-else>查看</el-button>
              <el-button type="danger" @click="dlet(scope)" size="small" v-if="scope.row.state2==0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条 -->
      </div>
    </div>
    <!-- 添加工序弹框 -->
    <el-dialog title="指定工序" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="工序类型" label-width="120px">
          <el-select v-model="value1" :placeholder="gongxuMrz" style="width:790px" @change="tree1">
            <el-option v-for="item in options1" :key="item.index" :label="item.processType" :value="item">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序" label-width="120px">
          <el-select v-model="value2" placeholder="全部" style="width:790px" @change="tree2">
            <el-option v-for="item in options2" :key="item.index" :label="item.process" :value="item">
              </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="工序验收序号" label-width="120px">
          <el-input v-model="form.xuhao" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="工序验收次数" label-width="120px">
          <el-input v-model="form.cishu" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.beizhu"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addXzgx()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑指定验收弹框 -->
    <el-dialog title="指定验收" :visible.sync="bjDialogFormVisible" width="35%">
      <!-- 内嵌验收人弹框 -->
      <el-dialog width="50%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body>
        <el-form>
        <el-form-item label="用户类型" label-width="120px">
          <el-select v-model="value3" placeholder="请选择">
            <!-- <el-option v-for="item in opSlelt" :key="item.value" :label="item.label" :value="item.value">
             </el-option> -->
          </el-select> 
          <span class="dwmc">单位名称</span>
          <el-select v-model="value3" placeholder="请选择">
            <!-- <el-option v-for="item in opTions" :key="item.value" :label="item.label" :value="item.value">
             </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="小组" label-width="120px">
          <el-select v-model="value3" placeholder="请选择">
            <!-- <el-option v-for="item in opTions" :key="item.value" :label="item.label" :value="item.value">
             </el-option> -->
          </el-select>
          <span class="fz">分组</span>
           <el-select v-model="value3" placeholder="请选择">
            <!-- <el-option v-for="item in opTions" :key="item.value" :label="item.label" :value="item.value">
             </el-option> -->
          </el-select>
        </el-form-item>
        <el-table :data="ysrData" height="40vh">
          <el-table-column fixed="left" label="选中验收人" width="300">
            <template slot-scope="scope">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" name="Fruit" @click="xzk(scope,$event)">
            </template>
          </el-table-column>
          <el-table-column property="username" label="姓名" width="300"></el-table-column>
          <el-table-column property="departname" label="职务"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[15,30,45,60]"
            :page-size="15"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageForm.total">
          </el-pagination>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="qdysr()">确 定</el-button>
        </div>
      </el-dialog>
      
      <el-form :model="bjFrom">
        <el-form-item label="监理验收人" label-width="125px">
          <el-input v-model="bjFrom.name" autocomplete="off" style="width:50%"></el-input>
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="jlYsr()">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="监理验收时间" label-width="125px">
          <el-date-picker
            v-model="bjFrom.time"
            type="date"
            placeholder="选择日期"
            style="width:253px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="施工单位验收人" label-width="125px">
          <el-input v-model="bjFrom.names" autocomplete="off" style="width:50%"></el-input>
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="sgYsr()">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="施工单位验收时间" label-width="125px">
         <el-date-picker
            v-model="bjFrom.times"
            type="date"
            placeholder="选择日期"
            style="width:253px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bjDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="zdys()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import SelectTree from '@/components/SelectTree/selectTree.vue';
export default {
  components: {
    SelectTree,
  },
  data() {  
    return {
      options: [],
      options1:[],
      options2:[],
      data:[],
      tableData: null,
      processName:'',
      ysrData:[],
      opSlelt: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      treeFrom:{
        projectItem:'',
        zhuanghao:'',
        projectCode:'',
        projectType:'',
        zhuangtai:'',
        state1:'',
        state2:''
      },
      form: {
          name: '',
          cishu: '',
          xuhao: '',
          beizhu: ''
        },
      bjFrom:{
        name:'',
        nameId:'',
        time:'',
        names:'',
        namesId:'',
        times:'',
        // 工序Id
        processId:''
      },
      pageForm:{
        // 当前页
        pageNo:1,
        // 每页条数
        pageSize:15,
        // 验收人
        Mark:'',
        // 总条数
        total:0,
        // 姓名值
        userName: '',
        // 开始时间
        startTime:'',
        // 结束时间
        endTime:'',
      },
      defaultProps: {
        children: "children",
        label: "projectItem"
      },
      defaultProp:{
        children: "children",
        label: "departName"
      },
      dialogFormVisible:false,
      bjDialogFormVisible:false,
      innerVisible:false,
      value: "",
      value1:"",
      value2:"",
      value3:"",
      valId:"",
      treeId:"",
      gongxuId:"",
      gongxuMrz:"",
      userGroupId:"",
      processMDictId:"",
      projectItemId:"",
      processDictId:"",
      xgzdjlId:"",
      xgzdsgId:"",
      ysrName:"",
      even:null,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    };
  },
  mounted(){
    this.fn();
  },
  methods: {
    // 初始化合同段input框数据
    fn(){
      request.get('/rest/organizate/depart').then((res)=>{
        console.log(res)
        this.options=res.data.data;
        // console.log(this.options)
      })
    },
    // 初始化新增工序类型input框数据
    fnLei(){
      request.post('/rest/processType/getList').then((res)=>{
        this.options1=res.data.data.data;
        // console.log(this.options1)
        this.fnGong(this.options1[0].id);
        this.processMDictId=this.options1[0].id;
        this.gongxuMrz=this.options1[0].processType
      })
    },
    // 初始化新增工序input框数据
    fnGong(id){
      request.post('/rest/process/getList',{processTypeId:id}).then((res)=>{
        // console.log(res)
        this.options2=res.data.data.data
      })
    },
    // 根据input ID获取树形结构
    noDe(data){
      this.valId=data.id;
      this.userGroupId=data.id;
      this.processName='';
      this.treeFrom.projectItem='';
      request.post('/rest/projectItemInfo/getList',{orgId:this.valId}).then((res)=>{
        this.data=res.data.data;
      })
    },
    // 点击树节点展示右边详情接口
    ztrrFrom(){
       request.post('/rest/processCheck/getProject_Process',{projectItemId:this.treeId}).then((res)=>{
        // this.treeFrom.projectItem=res.data.data[0].projectItem;
        // this.treeFrom.projectType=res.data.data[0].projectType;
        // this.treeFrom.projectCode=res.data.data[0].projectCode;
        // this.treeFrom.projectCode=res.data.data[0].zhuanghao;
        // this.treeFrom.state1=res.data.data[0].state1;
        this.tableData=res.data.data;
        this.tableData.splice(1,3)
        this.tableData.reverse()
        console.log(this.tableData)
        this.processName=this.tableData[0].processName;
      })
    },
    // 点击树形节点展示右边详情列表
    handleNodeClick(data) {
      this.treeId=data.id;
      this.ztrrFrom();
      // console.log(data);
    },
    // 新增弹框获取input框数据
    addGx(){
      this.dialogFormVisible=true;
      this.value1='';
      this.value2='';
      this.fnLei();
    },
    // 点击新增工序类型获取工序框数据
    tree1(data){
      this.processMDictId=data.id;
      console.log(this.processMDictId)
      this.value1=data.processType;
      this.gongxuId=data.id
      request.post('/rest/process/getList',{processTypeId:this.gongxuId}).then((res)=>{
        this.options2=res.data.data.data
      })
    },
    // 监听工序窗口
    tree2(data){
      this.processDictId=data.id
      this.value2=data.process
    },
    // 新增工序接口
    addXzgx(){
      let fromData={userGroupId:this.userGroupId,processMDictId:this.processMDictId,processDictId:this.processDictId,projectItemId:this.treeId,remark:this.form.beizhu,checkNum:this.form.cishu}
      console.log(fromData)
      request.post('/rest/processCheck/addProcess',fromData).then((res)=>{
        if(res.data.respCode==0){
            this.$message({
            message: '恭喜你，新增成功',
            type: 'success'
          });
          this.form.beizhu='';
          this.form.cishu='';
          this.ztrrFrom();
          this.dialogFormVisible=false;
        }
      })
    },
    // 编辑指定验收弹框
    tjgx(data){
      console.log(data)
      this.bjFrom.name='';
      this.bjFrom.names='';
      this.bjFrom.time='';
      this.bjFrom.times='';
      this.bjDialogFormVisible=true;
      this.treeFrom.state2=data.row.state2;
      this.bjFrom.processId=data.row.id;
      if(data.row.state2==1){
        request.post('/rest/processCheck/searchProcessCheckPersons',{processId:this.bjFrom.processId}).then((res)=>{
          this.bjFrom.name=res.data.data.planSelfCheckPerson;
          this.bjFrom.time=res.data.data.planSelfCheckTime;
          this.bjFrom.names=res.data.data.planCheckPerson;
          this.bjFrom.times=res.data.data.planCheckTime;
          this.xgzdjlId=res.data.data.planCheckPersonId;
          this.xgzdsgId=res.data.data.planSelfCheckPersonId;
          console.log(res)
        }) 
      }
    },
    // 获取验收人接口
    fnYsr(){
      let ysr ={pageNo:this.pageForm.pageNo,pageSize:this.pageForm.pageSize,Mark:this.pageForm.Mark};
      request.post('/rest/processCheck/getCheckPerson',ysr).then((res)=>{
        this.ysrData=res.data.data.data
        this.pageForm.total=res.data.data.totalCount
        this.innerVisible=true
      })
    },
    // 监理验收人弹框数据
    jlYsr(){
      this.pageForm.Mark='1';
      this.fnYsr();
    },
    // 施工单位验收人弹框数据
    sgYsr(){
      this.pageForm.Mark='2';
      this.fnYsr();
    },
    // 监听总条数
    handleSizeChange(val) {
      this.pageForm.pageSize=val;
      this.fnYsr()
    },
    // 监听总页数
    handleCurrentChange(val) {
      this.pageForm.pageNo=val;
      this.fnYsr()
    },
    // 监听验收人单选框
    xzk(data,e){
      this.even=e
      this.pageForm.Mark=='1'?this.bjFrom.name=data.row.username:this.bjFrom.names=data.row.username;
      this.pageForm.Mark=='1'?this.bjFrom.nameId=data.row.id:this.bjFrom.namesId=data.row.id;
    },
    // 选择验收人显示表框中
    qdysr(data){
      this.even.target.checked=false;
      this.innerVisible=false;
    },
    // 编辑指定验收接口
    zdys(){
      let time=new Date(this.bjFrom.time)
      let timeDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(); 
      let times=new Date(this.bjFrom.times)
      let timesDate = times.getFullYear() + '-' + (times.getMonth() + 1) + '-' + times.getDate() + ' ' + times.getHours() + ':' + times.getMinutes() + ':' + times.getSeconds(); 
      if(this.treeFrom.state2==0){
          let bjysForm={processId:this.bjFrom.processId,planSelfCheckTime:timeDate,planSelfCheckPerson:this.bjFrom.nameId,planCheckTime:timesDate,planCheckPerson:this.bjFrom.namesId}
          request.post('/rest/processCheck/appointProcessCheckPersons',bjysForm).then((res)=>{
          if(res.data.respCode==0){
              this.$message({
              message: '恭喜你，指定验收成功',
              type: 'success'
            });
            console.log(bjysForm)
            this.ztrrFrom()
            this.bjDialogFormVisible=false;
          }
        })
      }else{
        let xgbjysForm={processId:this.bjFrom.processId,planSelfCheckTime:timeDate,planSelfCheckPerson:this.bjFrom.nameId!=''?this.bjFrom.nameId:this.xgzdjlId,planCheckTime:timesDate,planCheckPerson:this.bjFrom.namesId!=''?this.bjFrom.namesId:this.xgzdsgId}
        request.post('/rest/processCheck/appointProcessCheckPersons',xgbjysForm).then((res)=>{
          if(res.data.respCode==0){
              this.$message({
              message: '恭喜你，指定验收成功',
              type: 'success'
            });
            console.log(xgbjysForm)
            this.bjDialogFormVisible=false;
          }
        })
      }
    },
    // 删除接口
    dlet(data){
      request.get('/rest/processCheck/delete/'+data.row.id).then((res)=>{
        if(res.data.respCode==0){
          this.$message({
              type: 'success',
              message: '删除成功!'
            });
          this.ztrrFrom()
        }
      })
    },
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped >
.dwmc{
 margin-left: 170px;
 font-weight: 900 
}
.fz{
  margin-left: 198px;
  font-weight: 900 
}
/deep/ .el-select{
    width: 260px;
}
.acceptLayout {
  padding: 20px;
  /deep/ .select-tree .el-input.el-input--suffix{
    width: 400px;
  }
  /deep/ .el-popper{
    width: 400px;
  }
  .ysr{
    color: blue;
    font-size: 18px;
    cursor: pointer;
  }
  .ysr:hover{
    color: red;
  }
    
  .section {
    float: left;
    width: 30%;
  }
  .particularsList {
    float: left;
    width: 70%;
    height: 75vh;
    .particulars {
      height: 10vh;
      border: 1px solid #ccc;
      border-radius: 10px;
      p {
        width: 25%;
        float: left;
        margin: 0;
        padding: 8px;
        margin-left: 99px;
        margin-top: 10px;
        input{
          border: none;
          cursor: pointer;
          outline: none;
        }
      }
      p:nth-child(6){
        margin-top: 0
      }
    }
    .Cztab {
      margin-top: 10px;
      height: 60vh;
      border: 1px solid #ccc;
      border-radius: 10px;
      .paging {
        padding-top: 2vh;
        padding-left: 12vw;
      }
    }
  }
}
</style>
