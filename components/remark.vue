<template>
  <div class="remark">
    <ul>
      <li
        v-for="(item,index) in remarkList"
        :key="index"
        @click="getRemark(item,index)"
        :class="{selected:index==active}"
      >
        <span class="el-icon-tickets"></span>
        <span>{{item.text}}</span>
      </li>
    </ul>

    <div class="btnBox">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>
<script>
//统一回复变量
//   selfcheck: 'selfcheck',
//   notice: 'notice',
//   command: 'command',
//   realcheck: 'realcheck',
//   polling: 'polling',
//   sideStation: 'sideStation',
//   meeting: 'meeting'
import project from "@/api/project.js";
export default {
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      remarkList: [],
      text: "",
      active: null
    };
  },
  created() {
    this.getInit();
    console.log(this.type, "type");
  },
  methods: {
    confirm() {
      this.$emit("setRemark", this.text);
      this.$emit("cancel");
    },
    cancel() {
      this.$emit("cancel");
    },
    getInit() {
      project.getAllResponse({ type: this.type }).then(res => {
        console.log(res);
        this.remarkList = res.data.data;
      });
    },
    getRemark(item, index) {
      this.text = item.text;
      this.active = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.remark {
  max-height: 50vh;
  overflow-x: hidden;
  padding: 0 30px;
  margin: 0;
  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      margin: 10px 0;
      padding: 5px 0;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      span{
          margin: 0 5px;
      }
    }
  }
  .btnBox {
    display: flex;
    justify-content: flex-end;
    .el-button {
      margin: 5px;
    }
  }
}
.selected {
  color: blue;
  font-weight: bold;
}
/deep/.el-dialog__body {
  padding: 10px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
</style>