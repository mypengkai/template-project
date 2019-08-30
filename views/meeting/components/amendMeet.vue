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
            <el-select
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
              placeholder="请输入开始桩号"
              clearable
              :readonly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束桩号:">
            <el-input
              v-model="myApplyChangeForm.endStation"
              placeholder="请输入结束桩号"
              clearable
              :readonly="true"
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

      <el-form-item label="审核人:" prop="handleUserName">
        <el-input
          placeholder="请选择审核人"
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
              style="min-width:180px"
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
              style="min-width:180px"
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
              <th>变更等级</th>
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
              <td>{{item.publicData.applyUserName}}</td>
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
                    :style="{'color':(item.state == 1 ? 'blue' :'red')}"
                  >{{item.state==1 ? "审核人" : "备案人" }}: {{item.userName}}</p>
                  <p>计划完成时间:{{item.plancompletionTime}}</p>
                  <p>{{item.state==1 ? "审核意见" : "备案意见"}}：{{item.checkexplain}}</p>
                  <p class="imgBox">影像资料：
                        <ul>
                          <li v-for="(node, key) in item.fileinfos" :key="key">
                            <template v-if="node.fileType==='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                                  <viewer :images="item.fileinfos">
                                        <img v-for="(item,index) in item.fileinfos" :src="item.filePath" :key="index" style="width:100%;height:100%"/>
                                  </viewer>      
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
        </el-timeline-item>
      </el-timeline>
    </div>
        <el-button type="primary" icon="el-icon-arrow-up" circle @click="toTop" class="backButton"></el-button>
  </el-collapse-item>
</el-collapse>  


    <!-- 视屏 -->
    <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
      ></video-player>
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
        <el-input v-model="users.realname" placeholder="请选择" @change="checkRealname"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请选择" @change="checkPosition"></el-input>
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
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeUsersChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkUser">确 认</el-button>
        <el-button @click="dialogusersVisible=false">取 消</el-button>
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
        <el-input v-model="users.realname" placeholder="请选择" @change="checkRealname"></el-input>
        <span>职位：</span>
        <el-input v-model="users.position" placeholder="请选择" @change="checkPosition"></el-input>
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
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="users.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="noteNameTotal"
        :current-page.sync="users.pageNo"
        @size-change="handeNoteNameChange"
        @current-change="initDparentUser()"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkNoteName">确 认</el-button>
        <el-button @click="dialogNoteNameVisible=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择处理人弹框 -->
    <el-dialog
      width="70%"
      title="选择审核人"
      :visible.sync="dialogHandleFormVisible"
      class="dialogBox"
      append-to-body
    >
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
        <el-table-column property="realname" label="用户名"></el-table-column>
        <el-table-column property="mobilePhone" label="电话"></el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="handleQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="handlerPersonTotal"
        :current-page.sync="handleQueryParam.pageNo"
        @size-change="handleNextJobSizeChange"
        @current-change="loadNextJobUserList()"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subimtHandlerPerson">确 认</el-button>
        <el-button @click="dialogHandleFormVisible=false">取 消</el-button>
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
        class="pageList mt1"
        background
        :page-sizes="[10,20,30]"
        :page-size="copyQueryParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="copyPersonTotal"
        :current-page.sync="copyQueryParam.pageNo"
        @size-change="handleCopyPersonSizeChange"
        @current-change="initCopyUsersList()"
      ></el-pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subimtCopyPerson">确 认</el-button>
        <el-button @click="dialogCopyPersonFormVisible=false">取 消</el-button>
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
          { required: true, message: "请选择组织机构", trigger: "change" }
        ],
        projectItemId: [
          { required: true, message: "请选择分部分项", trigger: "change" }
        ],
        meetingName: [
          { required: true, message: "请选择会议主持人", trigger: "change" }
        ],
        meetingNoteName: [
          { required: true, message: "请选择会议记录人", trigger: "change" }
        ],
        handleUserName: [
          { required: true, message: "请选择审核人", trigger: "change" }
        ],
        copyUserName: [
          { required: true, message: "请选择抄送人", trigger: "change" }
        ],
        meetingDatetime: [
          { required: true, message: "请选择开会时间", trigger: "change" }
        ],
        plancompletionTime: [
          { required: true, message: "请选择计划完成时间", trigger: "change" }
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
        moneyLevel: ""
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
    changeSelectPerson
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
        this.$refs.getSelectData.labelModel = "";
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
    checkRealname() {
      this.initDparentUser();
    },
    checkPosition() {
      this.initDparentUser();
    },
    handleUserOnclick() {
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
      user.getNextJobUserByCurrentId(this.handleQueryParam).then(res => {
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

     videoPlayerShow(node) {
        this.playerOptions.sources[0] = {
          src: node.filePath,
          type: 'video/mp4'
        }
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
          this.$refs.getSelectData.placeholder = this.myApplyChangeForm.projectItem;
            let logs = res.data.data.log[0].role;
            let copynames = "";
            logs.forEach(element => {
              if (element.state == 3) {
                copynames += element.userName + ",";
              }
            });
            this.myApplyChangeForm.copyUserName = copynames.substring(
              0,
              copynames.length - 1
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
    p{
      span{
         padding:0 5px;
      }
    }
}
.backButton{
    text-align: right;
   margin-left: 90%;
   margin-top: 20px;
}
</style>
