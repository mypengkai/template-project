<template>
  <div class="crestedBox">
    <!-- 锚点 -->
    <p id="meetTop"></p>
    <el-form
      class="reverseBox"
      ref="myApplyChangeForm"
      :model="myApplyChangeForm"
      label-width="130px"
      :rules="rules"
    >
      <el-form-item label="会议编号:" prop="meetingSummaryNumber">
        <el-input v-model="myApplyChangeForm.meetingSummaryNumber" :disabled="true" />
      </el-form-item>
      <el-form-item label="会议主题:" prop="meetingTheme">
        <el-input v-model="myApplyChangeForm.meetingTheme" placeholder="请输入会议主题" />
      </el-form-item>

      <el-form-item label="会议地点:" prop="meetingAddress">
        <el-input v-model="myApplyChangeForm.meetingAddress" placeholder="请输入会议地点" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="增减金额(万元):" prop="addDecreaseMoney">
            <el-input
              type="number"
              v-model="myApplyChangeForm.addDecreaseMoney"
              placeholder="请输入增减金额"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额计算式:" prop="formulaCalculatingAmount">
            <el-input
              type="text"
              v-model="myApplyChangeForm.formulaCalculatingAmount"
              placeholder="请输入增减计算式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="增减数量" prop="addDecreaseNumber">
            <el-input
              type="number"
              v-model="myApplyChangeForm.addDecreaseNumber"
              placeholder="请输入增减数量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量计算式" prop="quantitativeFormulas">
            <el-input
              type="text"
              v-model="myApplyChangeForm.quantitativeFormulas"
              placeholder="请输入数量计算式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="组织机构:" prop="departId">
            <el-select style="width:100%"
              v-model="myApplyChangeForm.departId"
              placeholder="请选择"
              @change="checkDepart()"
            >
              <el-option
                v-for="item in userGroupTree"
                :key="item.id"
                :label="item.departname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分部分项:" prop="projectItemId">
            <select-tree 
              clearable
              :options="projectItemTreeOption"
              :props="projectItemDefaultProps"
              v-on:noDe="handleProjectItemChange"
              ref="getSelectData"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开始桩号:">
            <el-input
              v-model="myApplyChangeForm.startStation"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束桩号:">
            <el-input
              v-model="myApplyChangeForm.endStation"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会议主持人:" prop="meetingName">
            <el-input
              placeholder="请选择会议主持人"
              v-model="myApplyChangeForm.meetingName"
              :readonly="true"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="handleUserOnclick()"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议记录人:" prop="meetingNoteName">
            <el-input
              placeholder="请选择会议记录人"
              v-model="myApplyChangeForm.meetingNoteName"
              :readonly="true"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="handleNoteUserOnclick()"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="处理人:" prop="handleUserName">
        <el-input
          placeholder="请选择处理人"
          v-model="myApplyChangeForm.handleUserName"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="handlePersonOnclick"></el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="抄送人:" prop="copyUserName">
        <el-input
          placeholder="请选择抄送人"
          v-model="myApplyChangeForm.copyUserName"
          :readonly="true"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="copyPersonOnclick"></el-button>
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="开会时间:" prop="meetingDatetime">
            <el-date-picker
              v-model="myApplyChangeForm.meetingDatetime"
              type="date"
              placeholder="选择开会时间"
              size="small"
              style="width:100%"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd "
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完成时间:" prop="plancompletionTime">
            <el-date-picker
              v-model="myApplyChangeForm.plancompletionTime"
              type="date"
              placeholder="选择计划时间"
              size="small"
              style="width:100%"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="变更理由:" prop="changeReason">
        <el-input
          :rows="4"
          type="textarea"
          v-model="myApplyChangeForm.changeReason"
          placeholder="请输入变更理由"
        />
      </el-form-item>

      <el-form-item label="现场纪要内容:" prop="sceneSummaryContent">
        <el-input
          :rows="4"
          type="textarea"
          v-model="myApplyChangeForm.sceneSummaryContent"
          placeholder="请输入纪要内容"
        />
      </el-form-item>

      <el-form-item label="备注:" prop="remarks">
        <el-input
          :rows="4"
          v-model="myApplyChangeForm.remarks"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <div style="display: flex;justify-content:flex-end">
          <el-button @click="$emit('cancel')">取 消</el-button>
          <el-button type="primary" @click="submitForm('myApplyChangeForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>

        <!-- 历史记录 -->
<el-collapse accordion v-if="historyChangeInfo.length > 0">
  <el-collapse-item title="历史变更纪要">
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item, key) in historyChangeInfo" :key="key" type="danger">
            <div class="conent">
                   <div class="conent">
                                <ol>
                                  <li><span>会议编号:</span><i>{{item.publicData.meetingSummaryNumber}}</i></li>
                                  <li><span>会议主题:</span><i>{{item.publicData.meetingTheme}}</i></li>
                                  <li><span>会议地点:</span><i>{{item.publicData.meetingAddress}}</i></li>
                                  
                                  <li><span>组织机构:</span><i>{{item.publicData.departname}}</i></li>
                                  <li><span>分部分项:</span><i>{{item.publicData.projectItem}}</i></li>
                                  <li><span>桩号:</span><i>{{(item.publicData.startStation!==null && item.publicData.startStation!=="" && item.publicData.startStation!==undefined && item.publicData.endStation!==null && item.publicData.endStation!=="" && item.publicData.endStation!==undefined) ? (item.publicData.startStation+'~'+item.publicData.endStation) : ''}}</i></li>
                                 
                                  <li><span>变更等级:</span>
                                      <el-tag  type="info" v-if="item.publicData.moneyLevel==='one_level'">一级</el-tag>
                                      <el-tag  type="success" v-else-if="item.publicData.moneyLevel==='two_level'">二级</el-tag> 
                                      <el-tag type="warning" v-else-if="item.publicData.moneyLevel==='three_level'">三级</el-tag> 
                                      <el-tag  type="danger" v-else-if="item.publicData.moneyLevel==='four_level'">四级</el-tag> 
                                  </li>
                                  
                                  <li><span>会议主持人:</span><i>{{item.publicData.meetingHostName}}</i></li>
                                  <li><span>会议记录人:</span><i>{{item.publicData.meetingNoteTakerName}}</i></li>
                                  <li><span>开会时间:</span><i>{{item.publicData.meetingDatetime}}</i></li>
                                  <li><span>增减金额(万元):</span><i>{{item.publicData.addDecreaseMoney}}</i></li>
                                  <li><span>金额计算式:</span><i>{{item.publicData.formulaCalculatingAmount}}</i></li>
                                  <li><span>增减数量:</span><i>{{item.publicData.addDecreaseNumber}}</i></li>
                                  <li><span>数量计算式:</span><i>{{item.publicData.quantitativeFormulas}}</i></li>
                                  <li><span>变更状态:</span><i v-if="item.publicData.changeToken=='1'">申请</i>
                                      <i v-else-if="item.publicData.changeToken=='2'">审核</i>
                                      <i v-else-if="item.publicData.changeToken=='3'">备案</i>
                                      <i v-else-if="item.publicData.changeToken=='7'">完成</i></li>
                                  <li><span>申请人:</span><i>{{item.publicData.applyUserName}}</i></li>
                                  <li><span>申请时间：</span><i>{{item.publicData.createTime}}</i></li>
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
                                  <el-timeline id="timeline">
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
                                                    <!-- <img :src="node.filePath" alt=""  @click="pictureShow(item.fileinfos)"   style="width: 100px; height: 100px"> -->
                                                    <el-image
                                        style="width: 100px; height: 100px"
                                        :src="node.filePath"
                                        fit="fill"
                                        @click="pictureShow(item.fileinfos)"
                                      ></el-image>
                                                </template>
                                                <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                                                  <!-- <video :src="node.filePath" style="width: 100px; height: 100px;"
                                                        @click="videoPlayerShow(node)"></video> -->
                                                         <div class="video-box">
                                                            <video id="video2" style="width:100px;height:100px">
                                                              <source :src="node.filePath" type="video/mp4" />
                                                            </video>
                                                            <div class="video-img" @click="videoPlayerShow(node)"></div>
                                                          </div>
                                                </template>
                                              </li>
                                          </ul>
                                      </p>
                                    </el-timeline-item>
                                  </el-timeline>
                                </p>
                              </div>
                         </div>
            </div>
        </el-timeline-item>
      </el-timeline>
    </div>
        <el-button type="primary" icon="el-icon-arrow-up" circle @click="toTop" class="backButton"></el-button>
  </el-collapse-item>
</el-collapse>  



   <!-- 视屏 -->
   <el-dialog title="图片预览" width="60%" :visible.sync="dialogpicture" append-to-body>
      <viewer :imgList="processPicture"></viewer>
    </el-dialog>
    <!-- 视屏 -->
    <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
      <!-- <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
      ></video-player> -->
      <fileVideo :fileData="node" v-if="flag"></fileVideo>
    </el-dialog>







   <!-- 选择会议记录人 -->
    <el-dialog
      width="70%"
      title="会议主持人"
      :visible.sync="dialogusersVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.realname" placeholder="请输入用户名"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请输入职位"></el-input>
        <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="query">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>

      </div>
      <el-table
        ref="changeSingleTable"
        :data="usersData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handeUserCheck"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="zhiwei" label="职位"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeUsersChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogusersVisible=false">取 消</el-button>
        <el-button type="primary" @click="checkUser">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 会议记录人 -->
    <el-dialog
      width="70%"
      title="会议记录人"
      :visible.sync="dialogNoteNameVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="users.realname" placeholder="请输入用户名"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请输入职位"></el-input>
         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="query">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="changeSingleTable"
        :data="noteNameData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handeNoteNameCheck"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="zhiwei" label="职位"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="noteNameTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeNoteNameChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogNoteNameVisible=false">取 消</el-button>
        <el-button type="primary" @click="checkNoteName">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 选择处理人弹框 -->
    <el-dialog
      width="70%"
      title="选择处理人"
      :visible.sync="dialogHandleFormVisible"
      class="dialogBox"
      append-to-body
    >
       <div class="topBar">
        <span>用户名：</span>
        <el-input v-model="copyQueryParam.username" placeholder="请输入用户名"></el-input>

         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="queryCopy">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="resetCopy()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="changeSingleTable"
        :data="handlePersonData"
        border
        highlight-current-row
        height="40vh"
        class="textList"
        @current-change="handlePersonCurrentChange"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="realname" label="用户名" align="center"></el-table-column>
        <el-table-column property="zhiwei" label="职位" align="center"></el-table-column>
        <el-table-column property="mobilePhone" label="电话" align="center"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="handleQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="handlerPersonTotal"
        :current-page.sync="handleQueryParam.pageNo"
        @size-change="handleNextJobSizeChange"
        @current-change="loadNextJobUserList()"
      ></el-pagination>
      <div style="margin-left:80%">
         <el-button @click="dialogHandleFormVisible=false">取 消</el-button>
         <el-button type="primary" @click="subimtHandlerPerson">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 选择抄送人弹框 -->
    <el-dialog
      width="70%"
      title="选择抄送人"
      :visible.sync="dialogCopyPersonFormVisible"
      class="dialogBox"
      append-to-body
    >
      <div class="topBar">
        <span>组织机构：</span>
        <el-select
          v-model="copyQueryParam.userGroupId"
          placeholder="请选择"
          @change="copyUserGroupOnClick()"
        >
          <el-option
            v-for="item in copyUserGroupTree"
            :key="item.id"
            :label="item.departname"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>用户名：</span>
        <el-input v-model="copyQueryParam.realname" placeholder="请输入用户名"></el-input>

         <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="queryCopy">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="resetCopy()">重置
              </el-button>
            </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="copyPersonData"
        tooltip-effect="dark"
        height="40vh"
        class="textList"
        @selection-change="handleCopySelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="zhiwei" label="职位" align="center"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        background
        :page-sizes="[10,20,30]"
        :page-size="copyQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="copyPersonTotal"
        :current-page.sync="copyQueryParam.pageNo"
        @size-change="handleCopyPersonSizeChange"
        @current-change="initCopyUsersList()"
      ></el-pagination>
      <div style="margin-left:80%">
        <el-button @click="dialogCopyPersonFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="subimtCopyPerson">确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/syncSelectTree.vue";
import changeSelectPerson from "@/components/HuixinComponents/changeSelectPerson";
import project from "@/api/project";
import user from "@/api/user";
import change from "@/api/change";
import tool from "@/utils/common.js";
import fileVideo from "@/components/video"
import viewer from "@/components/viewer"
export default {
  name: "createChange",
  data() {
    return {
      myApplyChangeForm: {
        meetingId: "", // 会议记要id
        moneyLevel: "", //金额等级
        addDecreaseMoney: "", //金额
        meetingTheme: "", //变更名称
        meetingSummaryNumber: "", // 变更编号
        departId: "", //组织机构id
        projectItemId: "", //工程分部分项i
        projectItem: "",
        userId: "", //下一个审核人id
        makeCopy: "", //抄送人id
        changeToken: "1", // 申请
        meetingDatetime: "", //会议时间
        plancompletionTime: "", // 计划完成时间
        changePosition: "", //变更位置
        meetingAddress: "", // 会议位置
        meetingHostId: "", // 会议主持人id
        meetingName: "", // 会议主持人
        meetingNoteTakerId: "", // 会议记录人id
        meetingNoteName: "", // 会议记录人
        addDecreaseNumber: "", //增减数量
        quantitativeFormulas: "", // 数量计算式
        formulaCalculatingAmount: "", // 金额计算式
        sceneSummaryContent: "", // 记要内容
        remarks: "", //备注
        startStation: "", //开始桩号
        endStation: "", //结束桩号
        handleUserName: "", //选择处理人
        copyUserName: "", //抄送人
        formulaCalculatingAmount: "", //金额计算式
        quantitativeFormulas: "", // 数量计算式
        changeReason: "" // 变更理由
      },
    //  历史记录
         vedioinnerVisible:false,
         historyChangeInfoKey: [],
         historyChangeInfo: [], //历史的变更记录
         newChangInfo:[],
          dialogpicture:false,
          processPicture:[],
          node:{},
          flag:false,
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

      rules: {
        addDecreaseMoney: [
          { required: true, message: "请输入增减金额", trigger: "blur" }
        ],
        meetingTheme: [
          { required: true, message: "请输入会议主题", trigger: "blur" }
        ],
        meetingAddress: [
          { required: true, message: "请输入会议地点", trigger: "blur" }
        ],
        addDecreaseNumber: [
          { required: true, message: "请输入增减数量", trigger: "blur" }
        ],
        departId: [
          { required: true, message: "请选择组织机构", trigger: "blur" }
        ],
        projectItemId: [
          { required: true, message: "请选择分部分项", trigger: "blur" }
        ],
        meetingName: [
          { required: true, message: "请选择会议主持人", trigger: "blur" }
        ],
        meetingNoteName: [
          { required: true, message: "请选择会议记录人", trigger: "blur" }
        ],
        handleUserName: [
          { required: true, message: "请选择处理人", trigger: "blur" }
        ],
        copyUserName: [
          { required: true, message: "请选择抄送人", trigger: "blur" }
        ],
        meetingDatetime: [
          { required: true, message: "请选择开会时间", trigger: "blur" }
        ],
        plancompletionTime: [
          { required: true, message: "请选择计划完成时间", trigger: "blur" }
        ]
      }, //表单校验规则
      userGroupDefaultProps: {
        // 组织机构树显示
        children: "children",
        label: "name"
      },
      projectItemDefaultProps: {
        // 工程分项树显示
        children: "children",
        label: "projectItem"
      },
      dialogHandleFormVisible: false, //是否弹出选择备案或者审核人
      dialogCopyPersonFormVisible: false, //选择抄送人弹框
      dialogusersVisible: false, // 会议记录人
      dialogNoteNameVisible: false,
      userGroupTree: [], // 组织机构树
      projectItemTreeOption: [], // 分部分项树
      users: {
        userGroupId: "", // 组织机构id
        realname: "", // 姓名
        position: "", // 职位
        pageNo: 1,
        pageSize: 10
      },
      usersTotal: 0,
      usersData: [], // 组织机构下的人员（主持人）
      noteNameData: [], // 记录人
      noteNameTotal: 0,
      handeNoteName: null,
      selectedHandlerPersonRow: null, //当前选中的处理人
      handleUser: null, // 当前选中的会议人
      handlePersonData: [], //处理人集合
      handlerPersonTotal: 0, //集合长度
      handleQueryParam: {
        username: "", //用户名
        pageNo: 1,
        pageSize: 10,
        moneyLevel: "",
        meetingType:'1'
      },
      copyUserGroupTree: [], //处理人组织机构Tree
      copyPersonData: [], //处理人数据列表
      copyQueryParam: {
        userGroupId: "", //组织机构
        realname: "", //姓名
        position: "", //职位
        pageNo: 1,
        pageSize: 10
      },
      copyPersonTotal: 0, //抄送人集合长度
      multipleSelectionCopy: [] //多选抄送人
    };
  },
  components: {
    SelectTree,
    changeSelectPerson,
    fileVideo,
    viewer
  },
  props: {
    nowItem: {
      type: String,
      required: true
    }
  },
  watch: {
    myApplyChangeForm: {
      handler(newVal, oldVal) {
        if (this.$tool.isNotEmptyStr(newVal.addDecreaseMoney)) {
          this.convertMoneyToLevel(newVal.addDecreaseMoney);
        }
      },
      deep: true
    }
  },
  created() {
    this.initUserGrouptTree();
    this.getChangeName();
     this.initDealMeet();
    this.myApplyChangeForm.meetingId = this.nowItem;
    this.getProject();
  },
  methods: {
    queryCopy(){
        this.initCopyUsersList();
        this.loadNextJobUserList();
    },
    resetCopy(){
        this.copyQueryParam.userGroupId = '';
        this.copyQueryParam.realname = '';
        this.handleQueryParam.username = '';
        this.initCopyUsersList();
        this.loadNextJobUserList();
    },
    query(){
        this.initDparentUser();
    },
    reset(){
        this.users.realname = "";
        this.users.position ="";
        this.initDparentUser();

    },




    //记要名称
    getChangeName() {
      let currentDate = tool.formatDate(new Date(), "yyyyMMddHHmmss");
      this.myApplyChangeForm.meetingSummaryNumber = "BGHYJY-" + currentDate;
    },
    initUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.userGroupTree = res.data.data;
      });
    },
    // 获取组织机构id
    checkDepart() {
      let orgId = this.myApplyChangeForm.departId;
      this.users.userGroupId = this.myApplyChangeForm.departId;
      // 分部分项数据
      Organization.getProjectItemFromLayer({
        userGroupId: orgId,
        pId: "0"
      }).then(res => {
        this.projectItemTreeOption = res.data.data;
      });
    },
    // 获取分部分项
    getProject() {
      let orgId = localStorage.getItem("orgId");
      Organization.getProjectItemFromLayer({
        userGroupId: orgId,
        pId: "0"
      }).then(res => {
        this.projectItemTreeOption = res.data.data;
      });
    },

    handleProjectItemChange(data) {
      // 工程分部分项id
      this.myApplyChangeForm.projectItemId = data.id;
      this.myApplyChangeForm.projectItem = data.name;
      this.getStationByProjectItemId(data.id);
    },
    getStationByProjectItemId(id) {
      project.projectCheck(id).then(res => {
        if (
          res.data.data.startStation !== null &&
          res.data.data.startStation !== "" &&
          res.data.data.startStation !== undefined &&
          res.data.data.endStation !== null &&
          res.data.data.endStation !== "" &&
          res.data.data.endStation !== undefined
        ) {
          this.myApplyChangeForm.endStation = res.data.data.endStation;
          this.myApplyChangeForm.startStation = res.data.data.startStation;
        }
      });
    },
    //获取标段下的人员（会议记录人，主持人）
    initDparentUser() {
      Organization.getUserName(this.users).then(res => {
        this.usersData = res.data.data.data;
        this.usersTotal = res.data.data.totalCount;
        this.noteNameData = res.data.data.data;
        this.noteNameTotal = res.data.data.totalCount;
      });
    },
    // checkRealname() {
    //   this.initDparentUser();
    // },
    // checkPosition() {
    //   this.initDparentUser();
    // },
    handleUserOnclick() {
      this.users.realname = "";
      this.users.position ="";
      this.dialogusersVisible = true;
      this.initDparentUser();
    },
    handeUsersChange(val) {
      this.users.pageSize = val;
      this.initDparentUser();
    },
    handeUserCheck(val) {
      this.handleUser = val;
    },
    checkUser() {
      this.myApplyChangeForm.meetingName = this.handleUser.username;
      this.myApplyChangeForm.meetingHostId = this.handleUser.id;
      this.dialogusersVisible = false; //弹框消失
    },
    // 会议记录人
    handleNoteUserOnclick() {
      this.users.realname = "";
      this.users.position ="";
      this.dialogNoteNameVisible = true;
      this.initDparentUser();
    },
    checkNoteName() {
      this.myApplyChangeForm.meetingNoteName = this.handeNoteName.username;
      this.myApplyChangeForm.meetingNoteTakerId = this.handeNoteName.id;
      this.dialogNoteNameVisible = false;
    },
    handeNoteNameCheck(val) {
      this.handeNoteName = val;
    },
    handeNoteNameChange(val) {
      this.users.pageSize = val;
      this.initDparentUser();
    },

    handlePersonOnclick() {
      //选择处理人弹框
      this.dialogHandleFormVisible = true;
      this.loadNextJobUserList();
    },
    loadNextJobUserList() {
      //返回所有的处理人
      user.getNextmeetUser(this.handleQueryParam).then(res => {
        this.handlerPersonTotal = res.data.data.totalCount;
        this.handlePersonData = res.data.data.data;
      });
    },
    handleNextJobSizeChange(val) {
      this.handleQueryParam.pageSize = val;
      this.loadNextJobUserList();
    },
    handlePersonCurrentChange(val) {
      this.selectedHandlerPersonRow = val;
    },
    subimtHandlerPerson() {
      //返回处理人对象
      this.myApplyChangeForm.handleUserName = this.selectedHandlerPersonRow.realname;
      this.myApplyChangeForm.userId = this.selectedHandlerPersonRow.id;
      this.dialogHandleFormVisible = false; //弹框消失
    },
    copyPersonOnclick() {
      //选择抄送人弹框
      this.dialogCopyPersonFormVisible = true;
      this.initCopyUserGrouptTree();
    },
    initCopyUserGrouptTree() {
      // 组织机构树
      Organization.userGroupSelect().then(res => {
        this.copyUserGroupTree = res.data.data;
        //默认选择第一个
        this.copyQueryParam.userGroupId = res.data.data[0].id;
        this.initCopyUsersList();
      });
    },
    copyUserGroupOnClick() {
      //组织机构筛选框
      this.initCopyUsersList();
      this.initDparentUser();
    },
    initCopyUsersList() {
      //初始化抄送人列表
      user.getUserListByDepartId(this.copyQueryParam).then(res => {
        this.copyPersonData = res.data.data.data;
        this.copyPersonTotal = res.data.data.totalCount;
      });
    },
    handleCopyPersonSizeChange(val) {
      this.copyQueryParam.pageSize = val;
      this.initCopyUsersList();
    },
    handleCopySelectionChange(item) {
      this.multipleSelectionCopy = item;
    },
    subimtCopyPerson() {
      //确认抄送人
      let ids = "",
        names = "";
      for (let i = 0; i < this.multipleSelectionCopy.length; i++) {
        if (ids.length > 0) {
          ids += ",";
        }
        ids += this.multipleSelectionCopy[i].id;

        if (names.length > 0) {
          names += ",";
        }
        names += this.multipleSelectionCopy[i].username;
      }
      this.myApplyChangeForm.copyUserName = names;
      this.myApplyChangeForm.makeCopy = ids;
      this.dialogCopyPersonFormVisible = false;
    },
    convertMoneyToLevel(money) {
      // 更改申请等级
      if (Number(money) > 0 && Number(money) < 5) {
        this.myApplyChangeForm.moneyLevel = "one_level";
      } else if (Number(money) >= 5 && Number(money) < 20) {
        this.myApplyChangeForm.moneyLevel = "two_level";
      } else if (Number(money) >= 20 && Number(money) < 50) {
        this.myApplyChangeForm.moneyLevel = "three_level";
      } else if (Number(money) >= 50) {
        this.myApplyChangeForm.moneyLevel = "four_level";
      }
      this.handleQueryParam.moneyLevel = this.myApplyChangeForm.moneyLevel;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          change.amendApply(this.myApplyChangeForm).then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.myApplyChangeForm = "";
            this.$emit("cancel"); //关闭弹框
            this.$emit("comfirm"); //确认
          });
        } else {
          console.log("error submit!!");
          return false;
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
        // this.playerOptions.sources[0] = {
        //   src: node.filePath,
        //   type: 'video/mp4'
        // }
        this.flag = false;
        this.$nextTick(()=>{
           this.flag = true
        })
        this.node = node
        this.vedioinnerVisible = true
      },


    // 处理数据回填
    initDealMeet() {
      change.getApplySee({ meetingId: this.nowItem }).then(res => {
        if (res.data.ok == true) {
          this.myApplyChangeForm = res.data.data.MeetingInfo;
          localStorage.setItem("orgId", res.data.data.MeetingInfo.departId);
          
          this.myApplyChangeForm.meetingName = this.myApplyChangeForm.meetingHostName;
          this.myApplyChangeForm.meetingNoteName = this.myApplyChangeForm.meetingNoteTakerName;
          this.$refs.getSelectData.labelModel = this.myApplyChangeForm.projectItem;
            let logs = res.data.data.log[0].role;
            let copynames = "";
            let ids = "";
            logs.forEach(element => {
              if (element.state == 3) {
                copynames += element.userName + ",";
                ids += element.userId + ','
              }
            });
            this.myApplyChangeForm.copyUserName = copynames.substring(
              0,
              copynames.length - 1

            );
             this.myApplyChangeForm.makeCopy = ids.substring(
              0,
              ids.length - 1
            );
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
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.crestedBox {
  height: 60vh;
  padding-right: 30px;
  overflow-x: hidden;

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
  .roleName{
     float: right;
      width:40%;
      height: 40vh;
      overflow-x: hidden;
    p{
      span{
          font-weight: bold;
      }
      i{
         padding:0 5px;
         
      }
    }
}
.backButton{
   text-align: right;
   margin-left: 90%;
   margin-top: 20px;
}
ul, ol {
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    list-style: none;
  }
}
 i{        
    font-style: normal;
   }
.block{
   ol{
      float: left;
      width: 60%;
     li{
       span{
          width: 120px;
          display: inline-block;
          font-weight: bold;
       }
     }
   }
}
.conent{
   overflow: hidden;
}
/deep/.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    margin-top: 10px;
}
.video-box {
  position: relative;
}

.video-box video {
  display: inline-block;
  vertical-align: baseline;
}

.video-box .video-img {
  text-align: center;
  position: absolute;
  top: 25%;
  left: 25%;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background: url(../../../imgs/play.png) no-repeat;
  background-size: 50% 50%;
  cursor: pointer;
}
</style>
