<template>
  <div class="demo-image__preview detail">
    <em  id="meetTop"></em>
     <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="当前变更纪要" name="1" >
              <div class="current">
                  <ol>
                    <li><span>会议编号:</span><i>{{changeInfo.meetingSummaryNumber}}</i></li>
                    <li><span>会议主题:</span><i>{{changeInfo.meetingTheme}}</i></li>
                    <li><span>会议地点:</span><i>{{changeInfo.meetingAddress}}</i></li>
                    <li><span>创建时间：</span><i>{{changeInfo.createTime}}</i></li>
                    <li><span>组织机构:</span><i>{{changeInfo.departname}}</i></li>
                    <li><span>分部分项:</span><i>{{changeInfo.projectItem}}</i></li>
                    <li><span>桩号:</span><i>{{(changeInfo.startStation!==null && changeInfo.startStation!=="" && changeInfo.startStation!==undefined && changeInfo.endStation!==null && changeInfo.endStation!=="" && changeInfo.endStation!==undefined) ? (changeInfo.startStation+'~'+changeInfo.endStation) : ''}}</i></li>
                  
                    <li><span>会议主持人:</span><i>{{changeInfo.meetingHostName}}</i></li>
                    <li><span>会议记录人:</span><i>{{changeInfo.meetingNoteTakerName}}</i></li>
                    <li><span>开会时间:</span><i>{{changeInfo.meetingDatetime}}</i></li>
                     <li><span>变更等级:</span>
                        <el-tag  type="info" v-if="changeInfo.moneyLevel==='one_level'">一级</el-tag>
                        <el-tag  type="success" v-else-if="changeInfo.moneyLevel==='two_level'">二级</el-tag> 
                        <el-tag type="warning" v-else-if="changeInfo.moneyLevel==='three_level'">三级</el-tag> 
                        <el-tag  type="danger" v-else-if="changeInfo.moneyLevel==='four_level'">四级</el-tag> 
                    </li>
                    <li><span>增减金额(万元):</span><i>{{changeInfo.addDecreaseMoney}}</i></li>
                    <li><span>金额计算式:</span><i>{{changeInfo.formulaCalculatingAmount}}</i></li>
                    <li><span>增减数量:</span><i>{{changeInfo.addDecreaseNumber}}</i></li>
                    <li><span>数量计算式:</span><i>{{changeInfo.quantitativeFormulas}}</i></li>
                    <li><span>变更状态:</span><i v-if="changeInfo.changeToken=='1'">申请</i>
                        <i v-else-if="changeInfo.changeToken=='2'">审核</i>
                        <i v-else-if="changeInfo.changeToken=='3'">备案</i>
                        <i v-else-if="changeInfo.changeToken=='7'">完成</i></li>
                    <li><span>申请人:</span><i>{{changeInfo.applyUserName}}</i></li>
                    <li><span>现场纪要内容:</span><i>{{changeInfo.sceneSummaryContent}}</i></li>
                    <li><span>变更理由:</span><i>{{changeInfo.changeReason}}</i></li> 
                    <li><span>备注:</span><i>{{changeInfo.remarks}}</i></li>   
                  </ol>
              <div class="roleName">
                <p>
                  <span>抄送人：</span>
                  <i v-for="(node,index) in newChangInfo.role" :key="index">
                    <template v-if="node.state==3">{{node.userName}}</template>
                  </i>
                </p>
                <p>
                  <span>流程:</span>
                  <el-timeline>
                    <el-timeline-item
                      v-if="item.state !=3 && item.state !=0"
                      v-for="(item, index) in newChangInfo.role"
                      :key="index"
                      :type="item.state==1? 'primary' :'danger' "
                    >
                      <p>处理时间:{{item.createTime}}</p>
                      <p
                        :style="{'color':(item.state == 1 ? 'blue' :'red')}"
                      >{{item.state==1 ? "审核人" : "备案人" }}: {{item.userName}}
                      <p>计划完成时间:{{item.plancompletionTime}}</p>
                      <p>{{item.state==1 ? "审核意见" : "备案意见"}}：{{item.checkexplain}}</p>
                      <p class="imgBox">影像资料：
                            <ul >
                                <li v-for="(node, key) in item.fileinfos" :key="key">
                                  <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                                      <img :src="node.filePath" alt=""  @click="pictureShow(item.fileinfos)"   style="width: 100px; height: 100px">
                                  </template>
                                  <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                                    <video
                                      :src="node.filePath"
                                      style="width: 100px; height: 100px;"
                                      @click="videoPlayerShow(node)"
                                    ></video>
                                  </template>
                                </li>
                              </ul>
                      </p>
                    </el-timeline-item>
                  </el-timeline>
                </p>
            </div>
         </div>
        </el-collapse-item>
        <el-collapse-item title="历史变更纪要" name="2">
                   <div v-if="historyChangeInfo.length==0">暂无历史变更纪要</div>
                  <div class="block" v-else>
                      <el-timeline >
                        <el-timeline-item v-for="(item, key) in historyChangeInfo" :key="key" type="danger" :timestamp="item.publicData.createTime" placement="top">
                            <div class="conent">
                                <ol>
                                  <li><span>会议编号:</span><i>{{item.publicData.meetingSummaryNumber}}</i></li>
                                  <li><span>会议主题:</span><i>{{item.publicData.meetingTheme}}</i></li>
                                  <li><span>会议地点:</span><i>{{item.publicData.meetingAddress}}</i></li>
                                  <li><span>创建时间：</span><i>{{item.publicData.createTime}}</i></li>
                                  <li><span>组织机构:</span><i>{{item.publicData.departname}}</i></li>
                                  <li><span>分部分项:</span><i>{{item.publicData.projectItem}}</i></li>
                                  <li><span>桩号:</span><i>{{(item.publicData.startStation!==null && item.publicData.startStation!=="" && item.publicData.startStation!==undefined && item.publicData.endStation!==null && item.publicData.endStation!=="" && item.publicData.endStation!==undefined) ? (item.publicData.startStation+'~'+item.publicData.endStation) : ''}}</i></li>
                                 
                                  <li><span>会议主持人:</span><i>{{item.publicData.meetingHostName}}</i></li>
                                  <li><span>会议记录人:</span><i>{{item.publicData.meetingNoteTakerName}}</i></li>
                                  <li><span>开会时间:</span><i>{{item.publicData.meetingDatetime}}</i></li>
                                   <li><span>变更等级:</span>
                                      <el-tag  type="info" v-if="item.publicData.moneyLevel==='one_level'">一级</el-tag>
                                      <el-tag  type="success" v-else-if="item.publicData.moneyLevel==='two_level'">二级</el-tag> 
                                      <el-tag type="warning" v-else-if="item.publicData.moneyLevel==='three_level'">三级</el-tag> 
                                      <el-tag  type="danger" v-else-if="item.publicData.moneyLevel==='four_level'">四级</el-tag> 
                                  </li>
                                   <li><span>增减金额(万元):</span><i>{{item.publicData.addDecreaseMoney}}</i></li>
                                  <li><span>金额计算式:</span><i>{{item.publicData.formulaCalculatingAmount}}</i></li>
                                  <li><span>增减数量:</span><i>{{item.publicData.addDecreaseNumber}}</i></li>
                                  <li><span>数量计算式:</span><i>{{item.publicData.quantitativeFormulas}}</i></li>
                                  <li><span>变更状态:</span><i v-if="item.publicData.changeToken=='1'">申请</i>
                                      <i v-else-if="item.publicData.changeToken=='2'">审核</i>
                                      <i v-else-if="item.publicData.changeToken=='3'">备案</i>
                                      <i v-else-if="item.publicData.changeToken=='7'">完成</i></li>
                                  <li><span>申请人:</span><i>{{item.publicData.applyUserName}}</i></li>
                                  <li><span>现场纪要内容:</span><i>{{item.publicData.sceneSummaryContent}}</i></li>
                                  <li><span>变更理由:</span><i>{{item.publicData.changeReason}}</i></li>
                                  <li><span>备注:</span><i>{{item.publicData.remarks}}</i></li>      
                              </ol>
                              <div class="roleName">
                                <p>
                                <span>抄送人：</span>
                                  <i v-for="(node,index) in item.role" :key="index">
                                    <template v-if="node.state==3">{{node.userName}}</template>
                                  </i>
                                </p>
                                <p>
                                  <span>流程:</span>
                                  <el-timeline>
                                    <el-timeline-item 
                                      v-if="item.state !=3 && item.state !=0"
                                      v-for="(item, index) in item.role"
                                      :key="index"
                                      :type="item.state==1? 'primary' :'danger' "
                                    >
                                      <p>处理时间:{{item.createTime}}</p>
                                      <p
                                        :style="{'color':(item.state == 1 ? 'blue' :'red')}"
                                      >{{item.state==1 ? "审核人" : "备案人" }}: {{item.userName}}</p>
                                      <p>计划完成时间:{{item.plancompletionTime}}</p>
                                      <p>{{item.state==1 ? "审核意见" : "备案意见"}}：{{item.checkexplain}}</p>
                                      <p class="imgBox">影像资料：
                                            <ul>
                                              <li v-for="(node, key) in item.fileinfos" :key="key">
                                                <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                                                    <img :src="node.filePath" alt=""  @click="pictureShow(item.fileinfos)"   style="width: 100px; height: 100px">
                                                </template>
                                                <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                                                  <video :src="node.filePath" style="width: 100px; height: 100px;"
                                                        @click="videoPlayerShow(node)"></video>
                                                </template>
                                              </li>
                                          </ul>
                                      </p>
                                    </el-timeline-item>
                                  </el-timeline>
                                </p>
                              </div>
                         </div>
               </el-timeline-item>
         </el-timeline>
    </div>
        <el-button type="primary" icon="el-icon-arrow-up" circle @click="toTop" v-show="historyChangeInfo.length>0"></el-button>
        </el-collapse-item>
    </el-collapse>


    
    <!-- 视屏 -->
   <el-dialog title="图片预览" width="60%" :visible.sync="dialogpicture" append-to-body>
      <viewer :imgList="processPicture"></viewer>
    </el-dialog>



    <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
      ></video-player>
    </el-dialog>
  </div>
</template>

<script>
import change from "@/api/change";
import viewer from "@/components/viewer";
export default {
  name: "changeDetail",
  props: {
    changeId: {
      type: String,
      default: ""
    }
  },
  components:{
      viewer
  },
  data() {
    return {
      activeName:"1",
      changeInfo: {}, //变更记录
      historyChangeInfoKey: [],
      historyChangeInfo: [], //历史的变更记录
      newChangInfo: [], //新的变更记录

      vedioinnerVisible:false,
      dialogpicture:false,
      processPicture:[],
         playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            src: '',
            type: 'video/mp4'

          }],
          poster: '', //你的封面地址
          width: document.documentElement.clientWidth, //播放器宽度
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
    };
  },

  created() {
    this.initChangeDetail();
    console.log(this.changeId)
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
    },
      pictureShow(node) {
      //图片预览
      let newArr = [];
      for (let i = 0; i < node.length; i++) {
        if (
          node[i].fileType == "jpg" ||
          node[i].fileType == "png" ||
          node[i].fileType == "jpeg"
        ) {
          newArr.push(node[i]);
        }
      }
      this.processPicture = newArr;
      this.dialogpicture = true;
    },
     videoPlayerShow(node) {
        this.playerOptions.sources[0] = {
          src: node.filePath,
          type: 'video/mp4'
        }
        this.vedioinnerVisible = true
      }
  }
};
</script>
<style lang="scss" scoped>
.conent{
   overflow: hidden;
}
.block {
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  ol{
     float: left;
     width: 60%;
      li{
         height: 30px;
         span{
           
            font-weight: bold;
            width: 150px;
            display: inline-block;
         }
         i{
           
            font-style: normal;
           
         }
      }
   }
 
}
.current {
  margin: 0 30px;
  overflow: hidden;
   ol{
     float: left;
     width:60%;
      li{
         height: 30px;
         span{
            
            font-weight: bold;
            width: 150px;
            display: inline-block;
         }
         i{
            
            font-style: normal;
         }
      }
   }
}
ul, ol {
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    list-style: none;
  }
}
.roleName{
    float: right;
    width:40%;
    height: 60vh;
    overflow-x: hidden;
    p{
      span{
       
        font-weight: bold;
      }
      i{
         padding:0 5px;
         font-style: normal;
      }
    }
}
.detail {
  height: 80vh;
  padding: 0 30px;
  overflow-x: hidden;
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
    color: blue;
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

button{
   text-align: right;
   margin-left: 90%;
   margin-top: 20px;
}
</style>
