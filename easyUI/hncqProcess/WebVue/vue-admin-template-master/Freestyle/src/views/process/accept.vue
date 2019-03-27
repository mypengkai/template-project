<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <span style="padding-top: 10px;">
        <el-form inline>
          <el-form-item label="组织机构：">
            <select-tree :options="options" v-on:noDe="noDe" :props="defaultProp"/>
          </el-form-item>
        </el-form>
      </span>
      <span v-if="value!=''">
        <el-tree style="margin-left:74px;margin-top:-15px" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </span>
    </div>
    <!-- 右边详情列表 -->
    <div class="particularsList" v-if="treeFrom.projectType!=''&&treeFrom.projectType!=undefined">
      <div class="particulars" >
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
          <span v-if="childrenId!=undefined&&childrenId!=''">状态:</span>
          <input v-model="treeFrom.state1"  readonly="true" v-if="childrenId!=undefined&&childrenId!=''">
        </p>
        <p>
          <el-button type="primary" icon="el-icon-circle-plus" plain  @click="addGx()" v-if="childrenId!=undefined&&childrenId!=''">添加工序</el-button>
        </p>
      </div>
      <!-- 操作列表 -->
      
       <div class="Cztab" v-if="childrenId!=undefined&&childrenId!=''">
        <el-table :data="tableData" border style="width: 100%" height="65vh">
          <el-table-column prop="processName" label="工序过程">
          </el-table-column>
          <el-table-column prop="planCheckTime" label="时间" >
          </el-table-column>
          <el-table-column prop="state2" label="状态">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" v-if="scope.row.state2=='指定工序'">指定验收</el-button>
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" v-else-if="scope.row.state2=='已指定验收计划'">修改指定验收</el-button>
              <el-button type="primary" size="small" :id="scope.$index" @click="tjgx(scope)" style="display: none" v-else></el-button>
              <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small" style="margin-left:33px" v-if="scope.row.state2=='自检完成'">查看</el-button> -->
              <el-button @click="handleClick(scope.row)" type="primary" size="small" >查看</el-button>
              <el-button type="danger" @click="dlet(scope)" size="small" v-if="scope.row.state2=='指定工序'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加工序弹框 -->
    <el-dialog title="指定工序" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="acceptRule" ref="addAccept">
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
        <el-form-item label="工序验收次数" label-width="120px" prop="cishu">
          <el-input v-model="form.cishu" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="备注" label-width="120px" prop="beizhu">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.beizhu"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addXzgx('addAccept')">确 定</el-button>
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
          <el-table-column fixed="left" label="选中验收人" width="300" >
            <template slot-scope="scope">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" name="Fruit"  @click="xzk(scope,$event)">
            </template>
          </el-table-column>
          <el-table-column property="username" label="姓名" width="300"></el-table-column>
          <el-table-column property="zhiwei" label="职务"></el-table-column>
          <el-table-column property="mobilePhone" label="电话"></el-table-column>
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
      
      <el-form :model="bjFrom" :rules="accept" ref='deleAccept'>
        <el-form-item label="监理验收人" label-width="125px" prop="jlysr">
          <el-input v-model="bjFrom.name" :readonly="true" autocomplete="off" style="width:50%"></el-input>
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="jlYsr('3')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="监理验收时间" label-width="125px" prop="jlysrTime">
          <el-date-picker
          :editable="false"
            v-model="bjFrom.time"
            type="date"
            placeholder="选择日期"
            style="width:253px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="施工验收人" label-width="125px" prop="sgysr">
          <el-input v-model="bjFrom.names" :readonly="true" autocomplete="off" style="width:50%"></el-input>
          &nbsp;&nbsp;&nbsp;<span class="ysr" @click="jlYsr('4')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="施工验收时间" label-width="125px" prop="sgysrTime">
         <el-date-picker
            :editable="false"
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
    const validatejlysr = (rule, value, callback) => {
      if (this.bjFrom.name=='') {
        console.log(this.bjFrom.name)
        callback(new Error('请选择验收人'))
      } else {
         callback();
      }
    }
    const validatejlTime= (rule, value, callback) => {
      if (this.bjFrom.time=='') {
        callback(new Error('请选择时间'))
      } else {
         callback();
      }
    }
    const validatesgysr = (rule, value, callback) => {
      if (this.bjFrom.names=='') {
        callback(new Error('请选择验收人'))
      } else {
         callback();
      }
    }
    const validatesgTime = (rule, value, callback) => {
      if (this.bjFrom.times=='') {
        callback(new Error('请选择时间'))
      } else {
         callback();
      }
    }
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
      // 新增校验
      acceptRule: {
      cishu: [{ required: true, message: "请输入工序次数", trigger: "blur" }],
      beizhu: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      // 指定验收校验
      accept: {
      jlysr: [{ required: true, trigger: "change",validator: validatejlysr }],
      jlysrTime: [{ required: true, validator: validatejlTime, trigger: "blur" }],
      sgysr: [{ required: true, validator: validatesgysr, trigger: "change" }],
      sgysrTime: [{ required: true, validator: validatesgTime, trigger: "blur" }],
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
        label: "name"
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
      fatherId:"",
      gongxuId:"",
      childrenId:"",
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
      currentPage4:1
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
        console.log(this.options)
      })
    },
    // 初始化新增工序类型input框数据
    fnLei(){
      request.post('/rest/processType/getList').then((res)=>{
        this.options1=res.data.data.data;
        console.log(this.options1)
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
      this.value=data.description
      // console.log(data)
      this.valId=data.id;
      this.fatherId=data.parentdepartid;
      this.userGroupId=data.id;
      this.processName='';
      this.treeFrom.projectItem='';
      request.post('/rest/projectItemInfo/getList',{orgId:this.valId}).then((res)=>{
        console.log(res)
        this.data=res.data.data;
      })
    },
    // 点击树节点展示右边详情接口
    ztrrFrom(){
       request.post('/rest/processCheck/getProject_Process',{projectItemId:this.treeId}).then((res)=>{
        let type=res.data.data.projects.projectType;
        this.treeFrom.projectItem=res.data.data.projects.projectItem;
        this.treeFrom.projectType=type=="1"?"单位工程":type=="2"?"子单位工程":type=="3"?"分部工程":type=="4"?"子分部工程":type=="5"?"分部项程":type=="6"?"子分项工程":'';
        this.treeFrom.projectCode=res.data.data.projects.projectCode;
        this.treeFrom.zhuanghao=res.data.data.projects.zhuanghao;
        this.tableData=res.data.data.detail;
        console.log(res)
        this.tableData.forEach(i=>{
          if(i.planCheckTime=="null"){
            i.planCheckTime=''
          }
          i.state2==0?i.state2="指定工序":i.state2==1?i.state2="已指定验收计划":i.state2==2?i.state2="自检完成":i.state2="验收完成"
          //  i.state2=="0"?i.state2="指定工序":i.state2="已指定验收计划"
          // console.log(i)
        })
        this.treeFrom.state1=res.data.data.projects.state1!=null?'已指定验收':'未指定验收';
        this.tableData.reverse()
      })
    },
    // 点击树形节点展示右边详情列表
    handleNodeClick(data) {
      // console.log(data)
      this.childrenId='';
      this.treeId=data.id;
      this.ztrrFrom();
      if(data.children.length==0){
        this.childrenId=data.id
      }
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
    addXzgx(formName){
      this.$refs[formName].validate(valid => {
      if (valid) {
          let fromData={
            userGroupId:this.userGroupId,
            processMDictId:this.processMDictId,processDictId:this.processDictId,
            projectItemId:this.treeId,
            remark:this.form.beizhu,
            checkNum:this.form.cishu
          }
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
        }else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑指定验收弹框
    tjgx(data){
      this.bjFrom.name='';
      this.bjFrom.names='';
      this.bjFrom.time='';
      this.bjFrom.times='';
      this.bjDialogFormVisible=true;
      this.treeFrom.state2=data.row.state2;
      this.bjFrom.processId=data.row.id;
      if(data.row.state2=='已指定验收计划'){
        request.post('/rest/processCheck/searchProcessCheckPersons',{processId:this.bjFrom.processId}).then((res)=>{
          // console.log(res)
          this.bjFrom.name=res.data.data.planSelfCheckPerson;
          this.bjFrom.time=res.data.data.planSelfCheckTime;
          this.bjFrom.names=res.data.data.planCheckPerson;
          this.bjFrom.times=res.data.data.planCheckTime;
          this.xgzdsgId=res.data.data.planSelfCheckPersonId;
          this.xgzdjlId=res.data.data.planCheckPersonId;
        }) 
      }
    },
    // 获取验收人接口
    fnYsr(){
      let ysr ={pageNo:this.pageForm.pageNo,pageSize:this.pageForm.pageSize,Mark:this.pageForm.Mark,name:this.ysrVul,work:this.ysrZhiwu,orgId:this.valId};
      request.post('/rest/processCheck/getCheckPerson',ysr).then((res)=>{
        console.log(res)
        this.ysrData=res.data.data.data;
        this.pageForm.total=res.data.data.totalCount;
        this.innerVisible=true;
      })
    },
    // 验收人弹框数据
    jlYsr(data){
      console.log(this.pageForm.pageNo)
      this.pageForm.pageNo=1;
      this.ysrVul='';
      this.ysrZhiwu='';
      this.pageForm.Mark=data;
      this.fnYsr();
    },
    // 验收人查询接口
    chaxun(){
      console.log(this.pageForm.pageNo)
      this.pageForm.pageNo=1;
      this.fnYsr()
    },
    // 监听总条数
    handleSizeChange(val) {
      this.pageForm.pageSize=val;
      this.fnYsr()
    },
    // 监听总页数
    handleCurrentChange(val) {
      // if(this.pa)
      console.log(val)
     
      this.pageForm.pageNo=val;
       console.log(this.pageForm.pageNo)
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
      let bjysForm={
      processId:this.bjFrom.processId,
      planSelfCheckTime:timeDate,
      planSelfCheckPerson:this.treeFrom.state2=='指定工序'?this.bjFrom.nameId:this.bjFrom.nameId!=''?this.bjFrom.nameId:this.xgzdsgId,
      planCheckTime:timesDate,            
      planCheckPerson:this.treeFrom.state2=='指定工序'?this.bjFrom.namesId:this.bjFrom.namesId!=''?this.bjFrom.namesId:this.xgzdjlId
      }    
      this.$refs.deleAccept.validate(valid => {
        if (valid) {
            request.post('/rest/processCheck/appointProcessCheckPersons',bjysForm).then((res)=>{
              if(res.data.respCode==0){
                  this.$message({
                  message: this.treeFrom.state2=='指定工序'?'恭喜你，指定验收成功':'恭喜你，修改指定验收成功',
                  type: 'success'
                });
                if(this.treeFrom.state2=='指定工序'){
                  this.ztrrFrom() ;
                  this.bjDialogFormVisible=false;
                  return false;
                }
                this.bjDialogFormVisible=false;
              }
            })
          }else {
            console.log("error submit!!");
            return false;
        }
      })
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
          if(res.data.data==null&&!res.data.data.length) return false
          this.chakanData.push(res.data.data)
          this.chakanData.forEach(i=>{
              i.projectType=i.projectType=="1"?"单位工程":i.projectType=="2"?"子单位工程":i.projectType=="3"?"分部工程":i.projectType=="4"?"子分部工程":i.projectType=="5"?"分部项程":i.projectType=="6"?"子分项工程":'';
              i.state1=i.state1==1?'已指定验收':'未指定验收';
              i.state2==0?i.state2="指定工序":i.state2==1?i.state2="已指定验收计划":i.state2==2?i.state2="自检完成":i.state2="验收完成"
            })
            console.log(this.chakanData)
          this.zijian=this.chakanData.selfCheckDescribe;
          this.yanshou=this.chakanData.checkDescribe;
          this.imgData=res.data.data.selfFilePath;
          this.imgData2=res.data.data.filePath;
          this.imgId=this.chakanData[0].processLogId;
        }
      })
    },
    // 点击图片展示图片详情接口
    imgLeft(data,imgTan){
      // imgTan;
      // request.post('/rest/processCheck/getPictureDetail',{processLogId:this.imgId,Mark:data}).then((res)=>{
      //   console.log(res)
      //   this.imgForm.describe=res.data.data[0].describe;
      //   this.imgForm.createTime=res.data.data[0].createTime;
      //   this.imgForm.lat=res.data.data[0].lat;
      //   this.imgForm.lgt=res.data.data[0].lgt;
      //   this.imgForm.photoDescribe=res.data.data[0].photoDescribe;
      //   this.imgForm.photoLocation=res.data.data[0].photoLocation;
      //   this.imgForm.state=res.data.data[1].state=='0'?'自检':'验收';
      //   res.data.data.shift();
      //   this.imgData3=res.data.data;
      // })
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