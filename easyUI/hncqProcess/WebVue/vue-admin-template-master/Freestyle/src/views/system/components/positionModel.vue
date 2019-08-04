<template>
  <el-form class="reverseBox" ref="positionFrom" :model="positionFrom" label-width="130px" :rules="rules">
    <el-form-item label="岗位英文名:" prop="jobNameEn">
      <el-input v-model="positionFrom.jobNameEn" placeholder="请输入岗位英文名"/>
    </el-form-item>
    <el-form-item label="岗位中文名:" prop="jobNameCn">
      <el-input v-model="positionFrom.jobNameCn" placeholder="请输入岗位中文名"/>
    </el-form-item>
    <el-form-item label="备注">
      <el-input :rows="4" v-model="positionFrom.jobRemark" type="textarea" placeholder="请输入内容"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('positionFrom')">保存</el-button>
      <el-button @click="resetForm('positionFrom')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import postionAPI from '@/api/position'
export default {
  name: "positionModel",
  inject: ["reload"],
  props: ["nowItem"],
  data(){
    return {
      positionFrom: {
        id: '',
        jobNameCn: '',
        jobNameEn: '',
        jobRemark: ''
      },
      rules: {
        jobNameCn: [{ required: true, message: '请输入岗位中文名', trigger: 'blur' }],
        jobNameEn: [{ required: true, message: '请输入岗位英文名', trigger: 'blur' }]
      }
    }
  },
  created(){
    this.initPositionById();
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postionAPI.positionAdd(this.positionFrom).then(res=>{
            this.$message({
              message: '恭喜你，新增成功',
              type: 'success'
            });
            this.$emit("cancel");   //关闭弹框
            this.$emit("comfirm");   //确认
          });
        }
      });
    },
    initPositionById(){
      console.log(this.nowItem)
      if (this.nowItem =='add'){   //添加时不需要初始化
        this.positionFrom={};
        return;
      }else {
        this.positionFrom={};
        postionAPI.getPositionById(this.nowItem.id).then(res=>{
          this.positionFrom=res.data.data;
        })
      }
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
