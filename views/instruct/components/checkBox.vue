<template>
    <div>
        <el-form :model="form" label-width="120px">
            <div style="width:70%">
                <el-form-item label="相关工程">
                    <el-input v-model="form.project"></el-input>
                </el-form-item>

                <el-form-item label="发起人">
                    <el-input v-model="form.initiator"></el-input>
                </el-form-item>

                <el-form-item label="发起时间">
                    <el-input v-model="form.createTime"></el-input>
                </el-form-item>

                <el-form-item label="计划时间">
                    <el-input v-model="form.planTime"></el-input>
                </el-form-item>

                <el-form-item label="指令内容">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div class="tar">
            <el-button>取 消</el-button>
            <el-button type="primary">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
  props: ["nowItem"],
  data() {
    return {
      form: {
        project: "",
        initiator: "",
        createTime: "",
        planTime: "",
        remark: ""
      },
      dialogFormVisible: true
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      // console.log(this.nowItem);
      if (this.nowItem == "add") return;
      this.form = this.$tool.ObCopy(this.nowItem); //处理复杂类型
    }
  }
};
</script>

<style>
</style>
