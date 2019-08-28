<template>
  <div class="demo-image__preview detail">
    <el-tag  id="meetTop">当前会议纪要</el-tag>
    <div class="current">
      <table
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;"
      >
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
          <th>金额等级</th>
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
          <th>开会时间</th>
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
          <th>申请人</th>
          <td>{{changeInfo.applyUserName}}</td>
          <th>会议内容</th>
          <td>{{changeInfo.sceneSummaryContent}}</td>
          <th>变更理由</th>
          <td>{{changeInfo.changeReason}}</td>
        </tr>
      </table>
      <div class="roleName">
        <p>
          抄送人：
          <span v-for="(node,index) in newChangInfo.role" :key="index">
            <template v-if="node.state==3">{{node.userName}}</template>
          </span>
        </p>
        <p>
          流程:
          <el-timeline>
            <el-timeline-item
              v-if="item.state !=3 && item.state !=0"
              v-for="(item, index) in newChangInfo.role"
              :key="index"
              :type="item.state==1? 'primary' :'danger' "
            >
              <p>处理时间:{{item.createTime}}</p>
              <p
                :style="{'color':(item.state == 1 ? 'red' :'blue')}"
              >{{item.state==1 ? "审核人" : "备案人" }}: {{item.userName}}</p>
              <p>计划完成时间:{{item.plancompletionTime}}</p>
              <p>{{item.state==1 ? "审核意见" : "备案意见"}}：{{item.checkexplain}}</p>
              <p class="imgBox">影像资料：
                    <viewer :images="item.fileinfos">
                         <img v-for="(src,index) in item.fileinfos" :src="src.filePath" :key="index"/>
                   </viewer>
              </p>
            </el-timeline-item>
          </el-timeline>
        </p>
      </div>
    </div>
    <!-- 历史记录 -->
  <el-collapse accordion v-if="historyChangeInfo.length > 0">
  <el-collapse-item title="历史会议纪要">
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item, key) in historyChangeInfo" :key="key" type="danger">
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;"
          >
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
              <th>金额等级</th>
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
              <th>开会时间</th>
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
              <th>申请人</th>
              <td>{{changeInfo.applyUserName}}</td>
              <th>会议内容</th>
              <td>{{item.publicData.sceneSummaryContent}}</td>
              <th>变更理由</th>
              <td>{{item.publicData.changeReason}}</td>
            </tr>
          </table>
          <div class="roleName">
            <p>
              抄送人：
              <span v-for="(node,index) in item.role" :key="index">
                <template v-if="node.state==3">{{node.userName}}</template>
              </span>
            </p>
            <p>
              流程:
              <el-timeline id="timeline">
                <el-timeline-item
                  v-if="item.state !=3 && item.state !=0"
                  v-for="(item, index) in newChangInfo.role"
                  :key="index"
                  :type="item.state==1? 'primary' :'danger' "
                >
                  <p>处理时间:{{item.createTime}}</p>
                  <p
                    :style="{'color':(item.state == 1 ? 'red' :'blue')}"
                  >{{item.state==1 ? "审核人" : "备案人" }}: {{item.userName}}</p>
                  <p>计划完成时间:{{item.plancompletionTime}}</p>
                  <p>{{item.state==1 ? "审核意见" : "备案意见"}}：{{item.checkexplain}}</p>
                  <p class="imgBox">影像资料：
                       <viewer :images="item.fileinfos">
                         <img v-for="(src,index) in item.fileinfos" :src="src.filePath" :key="index"/>
                      </viewer>
                  </p>
                </el-timeline-item>
              </el-timeline>
            </p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
       <el-button type="primary" @click="toTop">回到顶部</el-button>
  </el-collapse-item>
</el-collapse>  
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
      newChangInfo: [] //新的变更记录
    };
  },
  created() {
    this.initChangeDetail();
  },
  methods: {
    initChangeDetail() {
      change.getApplySee({ meetingId: this.changeId }).then(res => {
        this.changeInfo = res.data.data.MeetingInfo;
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
    },
    // 回到顶部
    toTop(){
        meetTop.scrollIntoView();
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
ul {
  li {
    list-style: none;
  }
}
/deep/.el-card__body {
  padding: 0 20px;
}
.detail {
  height: 80vh;
  padding: 0 30px;
  overflow-x: hidden;
  .elTimeline {
    padding: 10px 40px;
  }
  .imgBox{
     ul{
        overflow: hidden;
        li{
          float: left;
          width:100px;
          height:100px;
          margin: 10px;
          img{
            width:100%;
            height:100%;
          }
        }
     }
  }
}
/deep/.el-collapse-item__header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 48px;
    line-height: 48px;
    background-color: #FFF;
    color: red;
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    font-size: 13px;
    font-weight: 500;
    -webkit-transition: border-bottom-color .3s;
    transition: border-bottom-color .3s;
    outline: 0;
}
/deep/.el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: block; 
}
#timeline{
    >.el-timeline-item:last-child .el-timeline-item__tail {
         display: block !important; 
   }
}
button{
   text-align: right;
   margin-left: 80%;
   margin-top: 20px;
}
</style>
