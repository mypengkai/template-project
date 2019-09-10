<template>
  <div class="returnBox">
    <el-form :model="returnForm" label-width="130px" ref="returnForm" :rules="returnRules">
      <el-form-item label="计划完成时间：" prop="planFinishTime">
        <el-date-picker
          v-model="returnForm.planFinishTime"
          type="date"
          placeholder="选择日期时间："
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
      <el-form-item label="备注：">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="returnForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="图片选择：">
        <el-upload
          class="avatar-uploader"
          ref="uploadReturn"
          :action="fileUploadUrl"
          name="files"
          :headers="headers"
          list-type="picture-card"
          :auto-upload="false"
          :data="fileData"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisibleReturn">
          <img width="50%" :src="dialogImageUrlReturn" alt="图片" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <div class="tar">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="returnCommand('returnForm')">确 定</el-button>
    </div>

     <!-- 快捷回复 -->
    <el-dialog width="50%" class="dialogBox" title="快捷回复" :visible.sync="dialogremarkVisible" append-to-body>
      <remark @cancel="dialogremarkVisible=false" @setRemark="getRemark" :type="'command'"></remark>
    </el-dialog>
  </div>
</template>
<script>
import remark from "@/components/remark";
import instruct from "@/api/instruct.js";
import { getToken } from "@/utils/auth";
export default {
  props: {
    nowItem: {
      type: Object
    }
  },
  components:{remark},
  data() {
    return {
      returnForm: {
        commandid: "", // 指令用户表id
        remark: "", // 备注
        planFinishTime: ""
      },
      fileUploadUrl: process.env.BASE_API + "/rest/command/videoOrImageUpload", //文件路径
      // 文件参数
      fileData: {
        commandid: "", // 指令id
        typeState: 3,
        lgt: "",
        lat: "",
        photoLocation: "",
        commandsendid: ""
      },
      headers: {
        "X-AUTH-TOKEN": getToken()
      },
      dialogremarkVisible:false,
      returnRules:{
        planFinishTime: [
            { required: true, message: '请选择时间', trigger: 'change' }
          ],
      }
    };
  },
  created(){
      this.returnForm.commandid = this.nowItem.id;
      this.fileData.commandid = this.nowItem.id;
  },
  methods: {
    checkRemark(){
        this.dialogremarkVisible = true
    },
    getRemark(data){
        this.returnForm.remark = data
    },
    close(){
        this.$emit('cancel')
    },
    returnCommand(formName) {
        this.$refs[formName].validate((valid) => {
          let that = this
          if (valid) {
              instruct.returnCommand(that.returnForm).then(res => {
                if (res.data.ok) {
                  that.fileData.commandsendid = res.data.data;
                  that.$refs.uploadReturn.submit();
                  that.$emit('comfirm')
                  that.$emit('cancel') 
              } 
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
         
  }
};
</script>

<style lang="scss" scoped>
.returnBox {
  height: 50vh;
  overflow-x: hidden;
  padding: 0 30px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  margin: 0 8px 8px 0;
  display: inline-block;
}
/deep/.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  line-height: 80px;
  vertical-align: top;
}
</style>