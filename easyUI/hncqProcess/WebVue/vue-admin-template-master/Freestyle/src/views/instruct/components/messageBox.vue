<template>
    <div>
        <el-form :model="transpondForm" label-width="80px">
            <el-form-item label="指定人">
                <el-input v-model="transpondName">
                    <el-button slot="append" icon="el-icon-search" @click="acceptUser = true"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="transpondForm.remark"></el-input>
            </el-form-item>
        </el-form>
        <div class="tar">
            <el-button @click="innerTranspond = false">取 消</el-button>
            <el-button type="primary" @click="_delivery">确 定</el-button>
        </div>
    </div>
</template>

<script>
// import BMap from "BMap";
export default {
  props: ["nowItem"],
  data() {
    return {
      //   转发指令
      transpondForm: {
        commanduserId: "", // 指令用户表id
        zhidingren: "", // 指定人id
        remark: "" // 备注
      }
    };
  },
  methods: {
    //用户列表点击回填
    tableClick(item) {
      this.form.ReceiveUserid = item.id; // 新增传接收人id
      this.username = item.username; // 新增接收人id名回填
      this.transpondForm.zhidingren = item.id; // 转发指定人id
      this.transpondName = item.username; // 转发指定人姓名回填
      this.acceptUser = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
</style>
