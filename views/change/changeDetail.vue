<template>
  <div class="demo-image__preview" style="overflow-y: auto; width: 100%; ">
    <table border="0" cellspacing="0" cellpadding="0"
           style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;">
      <caption>当前变更记录</caption>
      <tr>
        <th>变更名称</th>
        <td>{{changeInfo.changeName}}</td>
        <th>变更金额(万元)</th>
        <td>{{changeInfo.amountMoney}}</td>
        <th>变更等级</th>
        <td>
          <template v-if="changeInfo.moneyLevel==='one_level'">一级</template>
          <template v-else-if="changeInfo.moneyLevel==='two_level'">二级</template>
          <template v-else-if="changeInfo.moneyLevel==='three_level'">三级</template>
          <template v-else-if="changeInfo.moneyLevel==='four_level'">四级</template>
        </td>
      </tr>
      <tr>
        <th>变更单位</th>
        <td>{{changeInfo.departname}}</td>
        <th>分部分项</th>
        <td>{{changeInfo.projectItem}}</td>
        <th>桩号</th>
        <td>{{(changeInfo.startStation!==null && changeInfo.startStation!=="" && changeInfo.startStation!==undefined && changeInfo.endStation!==null && changeInfo.endStation!=="" && changeInfo.endStation!==undefined) ? (changeInfo.startStation+'~'+changeInfo.endStation) : ''}}
        </td>
      </tr>
      <tr>
        <th>会议时间</th>
        <td>{{changeInfo.departname}}</td>
        <th>分部分项</th>
        <td>{{changeInfo.projectItem}}</td>
        <th>桩号</th>
        <td>{{(changeInfo.startStation!==null && changeInfo.startStation!=="" && changeInfo.startStation!==undefined && changeInfo.endStation!==null && changeInfo.endStation!=="" && changeInfo.endStation!==undefined) ? (changeInfo.startStation+'~'+changeInfo.endStation) : ''}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import change from "@/api/change";
export default {
  name: "changeDetail",
  props: {
    changeId: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      changeInfo:{},  //变更记录
      historyChangeInfo: new Map(),  //历史的变更记录
      newChangInfo: [],  //新的变更记录
    }
  },
  created(){
    this.initChangeDetail();
  },
  methods: {
    initChangeDetail(){
      change.getChangeDetailById({changeId: this.changeId}).then(res=>{
        this.changeInfo = res.data.data.ChangeInfo;
        //将数组中index>0的放在历史数据中,而等于0为最新数据
        let index=0;
        for(let key in res.data.data.log){
          if(key==="0"){
            this.newChangInfo=res.data.data.log[key];
          }else{
            this.historyChangeInfo.set(index, res.data.data.log[key]);
            index++;
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    color: #000;
    border: 1px solid #ddd;
  }

  td {
    border: 1px solid #ddd;

  }
</style>
