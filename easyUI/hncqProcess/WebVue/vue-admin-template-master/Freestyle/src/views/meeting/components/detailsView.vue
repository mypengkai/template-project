<template>
  <div class="detailview">
    <div class="newConent">
      <div class="newLeft">
           <ul>
               <li>会议编号：<span>{{changeInfo.meetingSummaryNumber}}</span></li>
               <li>会议主题：<span>{{changeInfo.meetingTheme}}</span></li>
               <li>会议地点：<span>{{changeInfo.meetingAddress}}</span></li>
               <li>组织机构：<span>{{changeInfo.departname}}</span></li>
               <li>分部分项<span>{{changeInfo.projectItem}}</span></li>
               <li>桩号<span>{{(changeInfo.startStation+'~'+changeInfo.endStation)}}</span></li>
               <li>增减金额(万元)：<span>{{changeInfo.addDecreaseMoney}}</span></li>
               <li>金额等级：<span v-if="changeInfo.moneyLevel==='one_level'">一级</span>
                             <span v-else-if="changeInfo.moneyLevel==='two_level'">二级</span>
                             <span v-else-if="changeInfo.moneyLevel==='three_level'">三级</span>
                             <span v-else-if="changeInfo.moneyLevel==='four_level'">四级</span> </li>
               <li>金额计算式：<span>{{changeInfo.formulaCalculatingAmount}}</span></li>
               <li>增减数量：<span>{{changeInfo.addDecreaseNumber}}</span></li>
               <li>数量计算式：<span>{{changeInfo.quantitativeFormulas}}</span></li>
               <li>变更状态：<span v-if="changeInfo.changeToken=='1'">申请</span>
            <span v-else-if="changeInfo.changeToken=='2'">审核</span>
            <span v-else-if="changeInfo.changeToken=='3'">备案</span>
            <span v-else-if="changeInfo.changeToken=='7'">完成</span></li>
               <li>会议主持人：<span>{{changeInfo.meetingHostName}}</span></li>
                <li>会议记录人：<span>{{changeInfo.meetingNoteTakerName}}</span></li>
                <li>开会时间：<span>{{changeInfo.meetingDatetime}}</span></li>
                <li>会议内容：<span>{{changeInfo.sceneSummaryContent}}</span></li>
                <li>变更理由：<span>{{changeInfo.changeReason}}</span></li>
                <li>备注：<span>{{changeInfo.remark}}</span></li>
           </ul>
      </div>
      <div class="newRight"></div>
    </div>
    <div class="oldConent">
      <div class="newLeft">
        <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/12 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/3 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="newRight"></div>
    </div>
  </div>
</template>
<script>
import change from "@/api/change";
export default {
    props: {
    changeId: {
      type: String,
      default: ""
    }
  },
    data(){
        return{
           newChangInfo: [], //新的变更记录
           historyChangeInfo: [], //历史的变更记录
        }
    },
    created() {
    this.initChangeDetail();
  },
   methods: {
    initChangeDetail() {
      change.getApplySee({ meetingId: this.changeId }).then(res => {
        //this.changeInfo = res.data.data.MeetingInfo;
        //将数组中index>0的放在历史数据中,而等于0为最新数据
        let index = 0;
        for (let key in res.data.data.log) {
          if (key === "0") {
            this.newChangInfo = res.data.data.log[key];
          } else {
            this.historyChangeInfoKey.push(index);
            this.historyChangeInfo.push(res.data.data.log[key]);
            index++;
          }
        }
        
      });
    }
  }
}
</script>
<style lang="scss" scoped>

</style>