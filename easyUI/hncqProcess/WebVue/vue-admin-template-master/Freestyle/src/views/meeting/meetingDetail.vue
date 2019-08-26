<template>
  <div class="demo-image__preview detail">
    <div class="current">
      <table
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;"
      >
        <caption>当前会议纪要</caption>
        <tr>
          <th>会议编号</th>
          <td>{{changeInfo.meetingSummaryNumber}}</td>
          <th>会议主题</th>
          <td>{{changeInfo.meetingTheme}}</td>
          <th>会议地点</th>
          <td>{{changeInfo.meetingAddress}}</td>
        </tr>
        <tr>
          <th>组织机构</th>
          <td>{{changeInfo.departname}}</td>
          <th>分部分项</th>
          <td>{{changeInfo.projectItem}}</td>
          <th>桩号</th>
          <td>{{(changeInfo.startStation!==null && changeInfo.startStation!=="" && changeInfo.startStation!==undefined && changeInfo.endStation!==null && changeInfo.endStation!=="" && changeInfo.endStation!==undefined) ? (changeInfo.startStation+'~'+changeInfo.endStation) : ''}}</td>
        </tr>
        <tr>
          <th>增减金额(万元)</th>
          <td>{{changeInfo.addDecreaseMoney}}</td>
          <th>会议等级</th>
          <td>
            <template v-if="changeInfo.moneyLevel==='one_level'">一级</template>
            <template v-else-if="changeInfo.moneyLevel==='two_level'">二级</template>
            <template v-else-if="changeInfo.moneyLevel==='three_level'">三级</template>
            <template v-else-if="changeInfo.moneyLevel==='four_level'">四级</template>
          </td>
          <th>金额计算式</th>
          <td>{{changeInfo.formulaCalculatingAmount}}</td>
        </tr>
        <tr>
          <th>会议主持人</th>
          <td>{{changeInfo.meetingHostName}}</td>
          <th>会议记录人</th>
          <td>{{changeInfo.meetingNoteTakerName}}</td>
          <th>会议时间</th>
          <td>{{changeInfo.meetingDatetime}}</td>
        </tr>
        <tr>
          <th>增减数量</th>
          <td>{{changeInfo.addDecreaseNumber}}</td>
          <th>数量计算式</th>
          <td>{{changeInfo.quantitativeFormulas}}</td>
          <th>变更状态</th>
          <td>
            <template v-if="changeInfo.changeToken=='1'">申请</template>
            <template v-else-if="changeInfo.changeToken=='2'">审核</template>
            <template v-else-if="changeInfo.changeToken=='3'">备案</template>
            <template v-else-if="changeInfo.changeToken=='7'">完成</template>
          </td>
        </tr>
        <tr>
          <th>会议等级</th>
          <td>
            <template v-if="changeInfo.moneyLevel=='one_level'">一级</template>
            <template v-else-if="changeInfo.moneyLevel=='two_level'">二级</template>
            <template v-else-if="changeInfo.moneyLevel=='three_level'">三级</template>
            <template v-else-if="changeInfo.moneyLevel=='four_level'">四级</template>
          </td>
          <th>会议内容</th>
          <td>{{changeInfo.sceneSummaryContent}}</td>
          <th>变更理由</th>
          <td>{{changeInfo.changeReason}}</td>
        </tr>

        <tr>
          <th>抄送人</th>
          <td>{{Newmeetnames}}</td>
          <th>创建时间</th>
          <td>{{Newmeettimes}}</td>
          <th>计划完成时间</th>
          <td>{{Newplantimes}}</td>
        </tr>

        <tr v-for="(node,index) in newChangInfo.role" :key="index">
          <template v-if="node.state==0">
            <th>发起人</th>
            <td>{{node.userName}}</td>
            <th>创建时间</th>
            <td>{{node.createTime}}</td>
            <th>计划完成时间</th>
            <td>{{node.plancompletionTime}}</td>
          </template>
          <template v-if="node.state==1">
            <th>审核人</th>
            <td>{{node.userName}}</td>
            <th>处理时间</th>
            <td>{{node.createTime}}</td>
            <th>计划完成时间</th>
            <td>{{node.plancompletionTime}}</td>
          </template>
          <template v-if="node.state==2">
            <th>备案人</th>
            <td>{{node.userName}}</td>
            <th>创建时间</th>
            <td>{{node.createTime}}</td>
            <th>计划完成时间</th>
            <td>{{node.plancompletionTime}}</td>
          </template>
        </tr>
      </table>
    </div>

    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item, key) in historyChangeInfo" :key="key" type="primary">
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;"
          >
            <caption>历史会议纪要</caption>
            <tr>
              <th>会议编号</th>
              <td>{{item.publicData.meetingSummaryNumber}}</td>
              <th>会议主题</th>
              <td>{{item.publicData.meetingTheme}}</td>
              <th>会议地点</th>
              <td>{{item.publicData.meetingAddress}}</td>
            </tr>
            <tr>
              <th>组织机构</th>
              <td>{{item.publicData.departname}}</td>
              <th>分部分项</th>
              <td>{{item.publicData.projectItem}}</td>
              <th>桩号</th>
              <td>{{(item.publicData.startStation!==null && item.publicData.startStation!=="" && item.publicData.startStation!==undefined && item.publicData.endStation!==null && item.publicData.endStation!=="" && item.publicData.endStation!==undefined) ? (item.publicData.startStation+'~'+item.publicData.endStation) : ''}}</td>
            </tr>
            <tr>
              <th>增减金额(万元)</th>
              <td>{{item.publicData.addDecreaseMoney}}</td>
              <th>会议等级</th>
              <td>
                <template v-if="item.publicData.moneyLevel==='one_level'">一级</template>
                <template v-else-if="item.publicData.moneyLevel==='two_level'">二级</template>
                <template v-else-if="item.publicData.moneyLevel==='three_level'">三级</template>
                <template v-else-if="item.publicData.moneyLevel==='four_level'">四级</template>
              </td>
              <th>金额计算式</th>
              <td>{{item.publicData.formulaCalculatingAmount}}</td>
            </tr>
            <tr>
              <th>会议主持人</th>
              <td>{{item.publicData.meetingHostName}}</td>
              <th>会议记录人</th>
              <td>{{item.publicData.meetingNoteTakerName}}</td>
              <th>会议时间</th>
              <td>{{item.publicData.meetingDatetime}}</td>
            </tr>
            <tr>
              <th>增减数量</th>
              <td>{{item.publicData.addDecreaseNumber}}</td>
              <th>数量计算式</th>
              <td>{{item.publicData.quantitativeFormulas}}</td>
              <th>变更状态</th>
              <td>
                <template v-if="item.publicData.changeToken=='1'">申请</template>
                <template v-else-if="item.publicData.changeToken=='2'">审核</template>
                <template v-else-if="item.publicData.changeToken=='3'">备案</template>
                <template v-else-if="item.publicData.changeToken=='7'">完成</template>
              </td>
            </tr>
            <tr>
              <th>会议等级</th>
              <td>
                <template v-if="item.publicData.moneyLevel=='one_level'">一级</template>
                <template v-else-if="item.publicData.moneyLevel=='two_level'">二级</template>
                <template v-else-if="item.publicData.moneyLevel=='three_level'">三级</template>
                <template v-else-if="item.publicData.moneyLevel=='four_level'">四级</template>
              </td>
              <th>会议内容</th>
              <td>{{item.publicData.sceneSummaryContent}}</td>
              <th>变更理由</th>
              <td>{{item.publicData.changeReason}}</td>
            </tr>

            <tr>
              <th>抄送人</th>
              <td>{{Oldmeetnames}}</td>
              <th>创建时间</th>
              <td>{{Oldmeettimes}}</td>
              <th>计划完成时间</th>
              <td>{{Oldplantimes}}</td>
            </tr>

            <tr v-for="(value,index) in item.role" :key="index">
              <template v-if="value.state==0">
                <th>发起人</th>
                <td>{{value.userName}}</td>
                <th>创建时间</th>
                <td>{{value.createTime}}</td>
                <th>计划完成时间</th>
                <td>{{value.plancompletionTime}}</td>
              </template>
              <template v-if="value.state==2">
                <th>备案人</th>
                <td>{{value.userName}}</td>
                <th>创建时间</th>
                <td>{{value.createTime}}</td>
                <th>计划完成时间</th>
                <td>{{value.plancompletionTime}}</td>
              </template>
              <template v-if="value.state==1">
                <th>审核人</th>
                <td>{{value.userName}}</td>
                <th>处理时间</th>
                <td>{{value.createTime}}</td>
                <th>计划完成时间</th>
                <td>{{value.plancompletionTime}}</td>
              </template>
            </tr>
          </table>
        </el-timeline-item>
      </el-timeline>
    </div>
  
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
  data() {
    return {
      changeInfo: {}, //变更记录
      historyChangeInfoKey: [],
      historyChangeInfo: [], //历史的变更记录
      newChangInfo: [], //新的变更记录
      Newmeetnames: "", // 最新抄送人
      Newmeettimes: "", // 创建时间
      Newplantimes: "", // 计划时间
      Oldmeetnames: "", // 历史抄送人
      Oldmeettimes: "",
      Oldplantimes: ""
    };
  },
  created() {
    this.initChangeDetail();
  },
  methods: {
    initChangeDetail() {
      change.getApplySee({ meetingId: this.changeId }).then(res => {
        //debugger;
        //console.log(res, "res");
        this.changeInfo = res.data.data.MeetingInfo;
        //将数组中index>0的放在历史数据中,而等于0为最新数据
        let index = 0;
        for (let key in res.data.data.log) {
          if (key === "0") {
            this.newChangInfo = res.data.data.log[key];
            let newArray = this.newChangInfo.role;
            let meetingName = "";
            let statetime = "";
            let plantime = "";
            newArray.forEach(element => {
              if (element.state == 3) {
                meetingName += element.userName + ",";
                statetime = element.createTime;
                plantime = element.plancompletionTime;
              }
            });
            this.Newmeettimes = statetime;
            this.Newmeetnames = meetingName.substring(
              0,
              meetingName.length - 1
            );
            this.Newplantimes = plantime;
          } else {
            this.historyChangeInfoKey.push(index);
            this.historyChangeInfo.push(res.data.data.log[key]);

            this.historyChangeInfo.forEach(value => {
              let OmeetingName = "";
              let Ostatetime = "";
              let Oplantimes = "";
              let items = value.role;

              items.forEach(vm => {
                if (vm.state == 3) {
                  OmeetingName += vm.userName + ",";
                  Ostatetime = vm.createTime;
                  Oplantimes = vm.plancompletionTime;
                }
              });
              this.Oldmeettimes = Ostatetime;
              this.Oldmeetnames = OmeetingName.substring(
                0,
                OmeetingName.length - 1
              );
              this.Oldplantimes = Oplantimes;
            });
            index++;
          }
        }
        //console.log(this.historyChangeInfo);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  & :last-child {
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
.block {
  margin-top: 20px;
}
.current {
  padding: 0 0 0 73px;
}
.detail {
  height: 100%;
  overflow-x: hidden;
  
}
</style>
