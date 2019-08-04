<template>
  <div class="p20">
    <!--左边角色列表-->
    <div class="topBar">
      <span>岗位名称:</span>
      <el-input v-model="queryData.jobName" placeholder="请输入岗位名称"/>
      <div class="rl">
        <el-button type="primary" icon="el-icon-search" class="pan-btn light-blue-btn" @click="loadPostionList()">查询</el-button>
        <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" v-ltx="'addPosition'" icon="el-icon-circle-plus-outline" class="pan-btn light-blue-btn" @click="addPosition('add')">新增</el-button>
      </div>
    </div>
    <!-- 列表  -->
    <el-table border :data="positionList" style="width: 100%" height="67vh" class="textList">
      <el-table-column prop="job_id" label="编号" align="center"/>
      <el-table-column prop="job_name_cn" label="岗位中文名" align="center"/>
      <el-table-column prop="job_name_en" label="岗位英文名" align="center"/>
      <el-table-column prop="create_time" label="创建时间" align="center"/>
      <el-table-column prop="realname" label="创建人" align="center"/>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle v-ltx="'editPosition'" @click="addPosition(scope.row)"/>
          <el-button type="danger" icon="el-icon-delete" circle v-ltx="'deletePosition'" @click="deletePosition(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-sizes="[7,15,20,30]" :page-size="1" :total="total" :current-page.sync="queryData.pageNo" class="pageList pt20 mt1" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="loadPostionList"/>
    <!-- 弹框 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" class="dialogBox">
      <el-form class="reverseBox" ref="positionFrom" :model="positionFrom" label-width="130px" :rules="rules">
        <el-form-item label="岗位英文名:" prop="jobNameEn">
          <el-input v-model="positionFrom.jobNameEn" placeholder="请输入岗位英文名"/>
        </el-form-item>
        <el-form-item label="岗位中文名:" prop="jobNameCn">
          <el-input v-model="positionFrom.jobNameCn" placeholder="请输入岗位中文名"/>
        </el-form-item>
        <el-form-item label="岗位类型:" prop="jobType">
          <el-select v-model="positionFrom.jobType" placeholder="请选择用户类型">
            <el-option
              v-for="item in jobTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="jobRemark">
          <el-input :rows="4" v-model="positionFrom.jobRemark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('positionFrom')">保存</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import postionAPI from '@/api/position'
export default {
  name: "position",
  data(){
    return {
      queryData: {
        jobName: '',
        pageNo: 1,
        pageSize: 7
      },
      positionList: [],  //岗位列表
      total: 0, // 分页总条数
      dialogFormTitle: '', // 弹框的名称
      dialogFormVisible: false,
      positionFrom: {
        id: '',
        jobNameCn: '',
        jobNameEn: '',
        jobRemark: '',
        jobType: ""  //岗位类型
      },
      rules: {
        jobNameCn: [{ required: true, message: '请输入岗位中文名', trigger: 'blur' }],
        jobNameEn: [{ required: true, message: '请输入岗位英文名', trigger: 'blur' }],
        jobType: [{ required: true, message: '请输入岗位类型', trigger: 'change' }],
      },
      jobTypeList: [{
        id: '1',
        value: '业主'
      },{
        id: '2',
        value: '监理'
      },{
        id: '3',
        value: '施工单位'
      }]
    }
  },
  created(){
    this.loadPostionList();
  },
  methods: {
    loadPostionList(){
      postionAPI.positionPageList(this.queryData).then(res=>{
        this.total = res.data.data.totalCount
        this.positionList = res.data.data.data
      })
    },
    handleSizeChange(data){
      this.queryData.pageSize=data
      this.loadPostionList();
    },
    reset(){  //重置
      this.queryData.jobName="";
      this.loadPostionList();
    },
    addPosition(data){  //新增岗位
      this.positionFrom={};
      if(data==='add'){
        this.dialogFormTitle='新增';
      }else{
        this.dialogFormTitle=data.job_name_cn+'~修改';
        postionAPI.getPositionById(data.id).then(res=>{
          this.positionFrom=res.data.data;
        })
      }
      this.dialogFormVisible=true;  //弹框显示
    },
    deletePosition(data){   //删除岗位
      this.$confirm('即将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postionAPI.postionDeleteById(data.id).then(res=>{
          this.$message({
            type: 'success',
            message: res.data.message
          });
          //刷新列表
          this.loadPostionList();
        })
      })
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postionAPI.positionAdd(this.positionFrom).then(res=>{
            this.$message({
              message: '恭喜你，新增成功',
              type: 'success'
            });
            this.dialogFormVisible=false;  //弹框显示
            //刷新列表
            this.loadPostionList();
          });
        }
      });
    },
    resetForm(formName){
      this.positionFrom.jobRemark="";
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
