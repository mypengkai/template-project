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
      <div class="particulars" v-if="treeFrom.projectItem!=''&&treeFrom.projectItem!=undefined">
        <p>
          <span>工程名称:</span>
          <input placeholder="" v-model="treeFrom.projectItem" readonly="true">
        </p>
        <p>
          <span>工程类型:</span>
          <input v-model="treeFrom.projectType" readonly="true">
        </p>
        <p>
          <span>代码:</span>
          <input v-model="treeFrom.projectCode" readonly="true">
        </p>
        <p>
          <span>桩号:</span>
          <input v-model="treeFrom.zhuanghao" readonly="true">
        </p>
        <p>
          <span v-if="processName!=null && processName!='' ">状态:</span>
          <input v-model="treeFrom.state1" v-if="processName!=null && processName!=''" readonly="true">
        </p>
        <p>
          <el-button type="primary" icon="el-icon-circle-plus" plain  @click="addGx()" v-if="processName!=null && processName!=''">添加工序</el-button>
        </p>
      </div>
      <!-- 操作列表 -->
       <div class="Cztab" v-if="processName!=null && processName!='' ">
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
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" style="display: none" v-else></el-button>
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
      <el-dialog   title="选中验收人" :visible.sync="innerVisible" append-to-body>
        <el-form>
          <el-row>
            <el-col :span="11"><span>姓名：</span><el-input v-model="ysrVul" placeholder="请输入内容" style="width:65%"></el-input></el-col>
            <el-col :span="11"><span>职务：</span><el-input v-model="ysrZhiwu" placeholder="请输入内容" style="width:65%"></el-input></el-col>
            <el-col :span="2"><el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button></el-col>
          </el-row>
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
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="jlYsr('3')">[选择验收人]</span>
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
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="jlYsr('4')">[选择验收人]</span>
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
    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" width="80%">
    <imgList :chakanData='chakanData' :imgData='imgData' :imgData2='imgData2' :imgId='imgId' :zijian='zijian' :yanshou='yanshou' :imgForm='imgForm' :imgData3='imgData3' @imgLeft='imgLeft'></imgList>
    </el-dialog>
  </div>
</template>

<script>
import imgList from './components/imgList'
import request from '@/utils/request'
import SelectTree from '@/components/SelectTree/selectTree.vue';
export default {
  components: {
    SelectTree,
    imgList
  },
  data() {  
    return {
      options: [],
      options1:[],
      options2:[],
      imgData:null,
      imgData2:null,
      imgData3:null,
      data:[],
      tableData: null,
      chakanData:[],
      processName:'',
      ysrData:[],
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
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
      imgForm:{
        describe:"",
        createTime:"",
        lat:"",
        lgt:"",
        photoDescribe:"",
        photoLocation:"",
        state:""
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
      // imginnerVisible:false,
      dialogTableVisible:false,
      value: "",
      value1:"",
      value2:"",
      ysrVul:"",
      ysrZhiwu:"",
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
      zijian:'',
      yanshou:'',
      imgId:'',
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
      console.log(data)
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
        this.tableData=res.data.data;
        this.treeFrom.projectItem=this.tableData[0].projectItem;
        this.treeFrom.projectType=this.tableData[0].projectType;
        this.treeFrom.projectCode=this.tableData[0].projectCode;
        this.treeFrom.zhuanghao=this.tableData[0].zhuanghao;
        this.treeFrom.state1=this.tableData[0].state1;
        this.tableData[0].processName!=null?this.processName=this.tableData[0].processName:this.processName=null;
        this.tableData.splice(1,3)
        this.tableData.reverse()
        console.log(this.tableData[0])
        
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
      let ysr ={pageNo:this.pageForm.pageNo,pageSize:this.pageForm.pageSize,Mark:this.pageForm.Mark,name:this.ysrVul,work:this.ysrZhiwu};
      request.post('/rest/processCheck/getCheckPerson',ysr).then((res)=>{
        this.ysrData=res.data.data.data;
        this.pageForm.total=res.data.data.totalCount;
        this.innerVisible=true;
      })
    },
    // 验收人弹框数据
    jlYsr(data){
      this.ysrVul='';
      this.ysrZhiwu='';
      this.pageForm.Mark=data;
      this.fnYsr();
    },
    // 验收人查询接口
    chaxun(){
      this.fnYsr()
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
      this.even=e;
      this.pageForm.Mark=='3'?this.bjFrom.name=data.row.username:this.bjFrom.names=data.row.username;
      this.pageForm.Mark=='3'?this.bjFrom.nameId=data.row.id:this.bjFrom.namesId=data.row.id;
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
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/rest/processCheck/delete/'+data.row.id).then((res)=>{
            if(res.data.respCode==0){
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
            this.ztrrFrom()
          }
        })
      })  
    },
    // 查看接口
    handleClick(row) {
      this.chakanData.length=0;
      this.dialogTableVisible=true;
      request.post('/rest/processCheck/getProcessDetail',{id:row.id}).then(res=>{
        if(res.data.respCode=="0"){
          this.chakanData.push(res.data.data)
          this.zijian=this.chakanData.selfCheckDescribe;
          this.yanshou=this.chakanData.checkDescribe;
          this.imgData=res.data.data.pictures.selfFilePath;
          this.imgData2=res.data.data.pictures.filePath;
          this.imgId=this.chakanData[0].processLogId;
        }
      })
    },
    // 点击图片展示图片详情接口
    imgLeft(data,imgTan){
      imgTan;
      request.post('/rest/processCheck/getPictureDetail',{processLogId:this.imgId,Mark:data}).then((res)=>{
        this.imgForm.describe=res.data.data[0].describe;
        this.imgForm.createTime=res.data.data[0].createTime;
        this.imgForm.lat=res.data.data[0].lat;
        this.imgForm.lgt=res.data.data[0].lgt;
        this.imgForm.photoDescribe=res.data.data[0].photoDescribe;
        this.imgForm.photoLocation=res.data.data[0].photoLocation;
        this.imgForm.state=res.data.data[1].state=='0'?'自检':'验收';
        res.data.data.shift();
        this.imgData3=res.data.data;
      })
    },
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