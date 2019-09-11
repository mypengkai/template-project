<template>
  <div class="orderInstruct">
    <div class="conent">
      <p><span>分部分项：</span><i>{{nowItem.projectItem}}</i></p>
      <p><span>工序名：</span><i>{{nowItem.process}}</i></p>
      <p><span>创建人：</span><i>{{nowItem.realname}}</i></p>
      <p><span>创建时间：</span><i>{{nowItem.createTime}}</i></p>
      <p><span>计划复核时间：</span><i>{{nowItem.planTime}}</i></p>
      <p><span>当前处理人：</span><i>{{nowItem.nowsendusername}}</i></p>
      <p><span>状态：</span><i>
        <template v-if="nowItem.state=='-1'">已发起,待处理</template>
        <template v-else-if="nowItem.state=='-2'">已修改，待处理</template>
        <template v-else-if="nowItem.state=='0'">已转发</template>
        <template v-else-if="nowItem.state=='1'">已复核</template>
        <template v-else-if="nowItem.state=='2'">已完成,待复核</template>
        <template v-else-if="nowItem.state=='3'">已退回,待修改</template>
      </i></p>
    </div>
    <div class="block">
      <p>指令流程：<span v-for="(item,index) in typeConent" :key="index">
                    <img :src="item.src" alt="">{{item.name}}
                  </span></p>
      <el-timeline>
        <el-timeline-item v-for="(item,index) in nowItem.commandUsers" :key="index">
          <p v-if="item.userRole==-1"><img :src="typeConent[0].src" alt="">创建人：{{item.realname}}</p>
          <p v-if="item.userRole==-2"><img :src="typeConent[0].src" alt="">修改人：{{item.realname}}</p>
          <p v-else-if="item.userRole==0"><img :src="typeConent[1].src" alt="">转发人：{{item.realname}}</p>
          <p v-else-if="item.userRole==2"><img :src="typeConent[3].src" alt="">完成人：{{item.realname}}</p>
          <p v-else-if="item.userRole==1"><img :src="typeConent[4].src" alt="">复核人：{{item.realname}}</p>
          <p v-else-if="item.userRole==3"><img :src="typeConent[5].src" alt="">退回人：{{item.realname}}</p>
          <p v-else-if="item.userRole==null || item.userRole==''"><img :src="typeConent[2].src" alt="">接收人：{{item.realname}}</p>
           <template v-if="item.userRole==-1 || item.userRole==-2">
                 <p>指令内容：{{item.remark}}</p>
                  <div class="imgBox">影像资料：
                    <ul>
                      <li v-for="(node, key) in item.files" :key="key">
                        <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                          <img :src="node.filePath" alt=""  @click="pictureShow(item.files)"   style="width: 100px; height: 100px">
                        </template>
                        <template v-else-if="node.fileType=='mp4' || node.fileType=='mov'">
                          <video :src="node.filePath" style="width: 100px; height: 100px;" @click="videoPlayerShow(node)"></video>
                        </template>
                      </li>
                    </ul>
                  </div>
           </template>
          <template v-else-if="item.userRole==0 || item.userRole==1 || item.userRole==2 || item.userRole==3">
                  <p>计划完成时间：{{item.planFinishTime}}</p>
                  <p>实际完成时间：{{item.finishTime}}</p>
                  <p>指令内容：{{item.remark}}</p>
                  <div class="imgBox">影像资料：
                    <ul>
                      <li v-for="(node, key) in item.files" :key="key">
                        <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                          <img :src="node.filePath" alt=""  @click="pictureShow(item.files)"   style="width: 100px; height: 100px">
                        </template>
                        <template v-else-if="node.fileType=='mp4' || node.fileType=='mov'">
                          <video :src="node.filePath" style="width: 100px; height: 100px;" @click="videoPlayerShow(node)"></video>
                        </template>
                      </li>
                    </ul>
                  </div>
          </template>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog title="图片预览" width="60%" :visible.sync="dialogpicture" append-to-body>
      <viewer :imgList="processPicture"></viewer>
    </el-dialog>

    <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
      <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
    </el-dialog>
  </div>
</template>
<script>
import viewer from '@/components/viewer'
export default {
    props:{
        nowItem:{
            type:Object
        }
    },
    components:{
        viewer
    },
    data(){
        return{
          formData:{},
          dialogpicture:false,
          vedioinnerVisible:false,
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
        typeConent:[
            {
              src:require("./images/start.png"),
              name:'创建'
            },
            {
              src:require("./images/transpond.png"),
              name:'转发'
            },
            {
              src:require("./images/receive.png"),
              name:'接收'
            },
            {
              src:require("./images/finish.png"),
              name:'完成'
            },
            {
              src:require("./images/check.png"),
              name:'复核'
            },
            {
              src:require("./images/return.png"),
              name:'退回'
            },
        ]
      }
    },
    created(){
        console.log(this.nowItem)
    },
    methods:{
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
}
</script>
<style lang="scss">
.orderInstruct{
    height: 60vh;
    overflow-x: hidden;
    padding: 0 20px;
    .conent{
        p{
            margin: 10px 0;
            span{
                font-weight: bold;
                display: inline-block;
                width:120px;
                text-align: right;
            }
            i{
               font-style: normal;
            }
        }
    }
    .block{
        p{
        span{
            margin:0 5px;
        }
        }
    }
    .imgBox{
     ul{
        overflow: hidden;
        padding: 0;
        margin: 0;
        li{
          float: left;
          list-style: none;
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
</style>
