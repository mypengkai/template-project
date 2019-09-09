<template>
  <div class=" checkBox">
    <el-form :model="form" ref="form" :rules="formRules" label-width="120px">
      <!-- 新增 -->
      <div :class="{reverseAddBox:nowItem=='add'}">
        <el-row>
          <el-col :span="12">
            <el-form-item  label="组织机构：" v-if="nowItem =='add'" prop="userGroupId">
              <el-select style="width:16vw" v-model="form.userGroupId" placeholder="请选择" @change="userGroupOnChange" size="small">
                <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:25vw" label="分部分项：" v-if="nowItem =='add'" prop="projectItemId">
              <select-tree clearable :options="projectItemTree" ref="getSelectData" :props="projectItemDefaultProp" size="small" v-on:noDe="projectItemOnClick"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="工序名称：" prop="processDictId" v-if="nowItem =='add'" >
              <el-select style="width:16vw" v-model="form.processDictId" placeholder="请选择工序" size="small" >
                <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:25vw" label="处理人：" v-if="nowItem =='add'" prop="receiveUserName">
              <el-input v-model="form.receiveUserName" size="small" @focus="alertAcceptUserDialog('receive')" clearable placeholder="请选择">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划复核时间：" v-if="nowItem =='add'" prop="planCheckTime">
              <el-date-picker v-model="form.planCheckTime" type="date" placeholder="选择日期：" value-format="yyyy-MM-dd" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间：" v-if="nowItem =='add'" prop="planFinishTime">
              <el-date-picker v-model="form.planFinishTime" type="date" placeholder="选择日期：" value-format="yyyy-MM-dd" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item  style="width:52vw" label="指令内容：" v-if="nowItem =='add'">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片选择：" v-if="nowItem =='add'">
              <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers" :limit="5"
                         list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreview" :data="form">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="50%" :src="dialogImageUrl" alt="图片">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 查看 -->
      <div :class="{reverseBox:nowItem!=='add'}" class="elInputBox" label-width="120px">
        <div class="conent">
          <p><span>分部分项：</span><i>{{nowItem.projectItem}}</i></p>
          <p><span>工序名：</span><i>{{nowItem.process}}</i></p>
          <p><span>创建人：</span><i>{{nowItem.realname}}</i></p>
          <p><span>创建时间：</span><i>{{nowItem.createTime}}</i></p>
          <p><span>计划复核时间：</span><i>{{nowItem.planTime}}</i></p>
          <p><span>当前处理人：</span><i>{{nowItem.nowsendusername}}</i></p>
          <p><span>状态：</span><i>
            <template v-if="nowItem.state=='-1'">已发起,待处理</template>
            <template v-else-if="nowItem.state=='0'">已转发</template>
            <template v-else-if="nowItem.state=='1'">已复核</template>
            <template v-else-if="nowItem.state=='2'">已完成,待复核</template>
            <template v-else-if="nowItem.state=='3'">已退回,待修改</template>
          </i></p>
        </div>
        <div class="block">
          <p>指令流程：<span v-for="(item,index) in typeConent" :key="index">
                        <img :src="item.src" alt="">{{item.name}}
                      </span>
          </p>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in nowItem.commandUsers" :key="index">
              <p v-if="item.userRole==-1"><img :src="typeConent[0].src" alt="">创建人：{{item.realname}}</p>
              <p v-else-if="item.userRole==0"><img :src="typeConent[1].src" alt="">转发人：{{item.realname}}</p>
              <p v-else-if="item.userRole==1"><img :src="typeConent[3].src" alt="">完成人：{{item.realname}}</p>
              <p v-else-if="item.userRole==2"><img :src="typeConent[4].src" alt="">复核人：{{item.realname}}</p>
              <p v-else-if="item.userRole==3"><img :src="typeConent[5].src" alt="">退回人：{{item.realname}}</p>
              <p v-else-if="item.userRole==null || item.userRole==''"><img :src="typeConent[2].src" alt="">接收人：{{item.realname}}</p>

                <template v-if="item.userRole==-1">
                  <p>指令内容：{{item.remark}}</p>
                    <div class="imgBox">影像资料：
                      <ul>
                        <li v-for="(node, key) in item.files" :key="key">
                          <template v-if="node.fileType=='jpg'||node.fileType == 'png' ||node.fileType == 'jpeg'">
                            <img :src="node.filePath" alt=""  @click="pictureShow(item.files)"   style="width: 100px; height: 100px">
                          </template>
                          <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
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
                            <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                              <video :src="node.filePath" style="width: 100px; height: 100px;" @click="videoPlayerShow(node)"></video>
                            </template>
                          </li>
                        </ul>
                      </div>
              </template>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="tar" style=" right:10%;position: absolute;bottom: 10px;padding: 10px">
        <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="innerBtn" @click="innerTranspondDialog = true">转发指令</el-button>
        <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="returnBtn" @click="returnDialog=true">退回指令</el-button>
        <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="soonFinishBtn" @click="soonFinishDialog=true">完成指令</el-button>
        <el-button type="primary" v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="finishBtn" @click="finishDialog=true">复核指令</el-button>
        <el-button v-if="nowItem=='add'" @click="close()">取 消</el-button>
        <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm('form')">确 定</el-button>
      </div>
    </el-form>


    <!-- 接收人弹框 -->
    <el-dialog class="dialogBox" width="45%"  title="选择处理人" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>组织机构:</span>
        <el-select v-model="receiveData.userGroupId" placeholder="请选择" @change="handleReceiveUserGroupCheckChange">
          <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname" :value="item.id"></el-option>
        </el-select>
        <span>姓名:</span>
        <el-input v-model="receiveData.realname" placeholder="请输入姓名"></el-input>
        <el-button class="pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
      </div>
      <el-table border :data="receiveUsersList" highlight-current-row height="50vh" @current-change="handleCurrentChange">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职位"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>

      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[10,20,30]" :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()" :total="total"></el-pagination>
    </el-dialog>

    <!-- 转发信息 -->
    <el-dialog class="dialogBox" width="40%" title="指令转发" :visible.sync="innerTranspondDialog" append-to-body>
      <el-form :model="transpondForm" label-width="120px">
        <el-form-item label="处理人：" prop="transpondName">
          <el-input readonly v-model="transpondForm.transpondName" @focus="alertAcceptUserDialog('transpond')" clearable placeholder="请选择">
        </el-input>
        </el-form-item>
        <el-form-item label="计划完成时间：" prop="planFinishTime">
          <el-date-picker v-model="transpondForm.planFinishTime" type="date" placeholder="选择日期时间：" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
         <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="transpondForm.remark"></el-input>
        </el-form-item>
        
      </el-form>
      <div class="tar">
        <el-button @click="innerTranspondDialog = false">取 消</el-button>
        <el-button type="primary" @click="transpondCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令退回 -->
    <el-dialog class="dialogBox" width="40%" title="指令退回" :visible.sync="returnDialog" append-to-body>
      <el-form :model="returnForm" label-width="130px" ref="returnForm" :rules="returnRules">
        <el-form-item label="计划完成时间：" prop="planFinishTime">
          <el-date-picker v-model="returnForm.planFinishTime" type="date" placeholder="选择日期时间：" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="returnForm.remark"></el-input>
        </el-form-item>
        

        <el-form-item label="图片选择：">
          <el-upload class="avatar-uploader" ref="uploadReturn" :action="fileUploadUrl" name="files" :headers="headers"
                     list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="fileData" >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleReturn">
            <img width="50%" :src="dialogImageUrlReturn" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="returnDialog = false">取 消</el-button>
        <el-button type="primary" @click="returnCommand('returnForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令完成modifytBtn -->
    <el-dialog class="dialogBox" width="40%" title="指令完成" :visible.sync="soonFinishDialog" append-to-body>
      <el-form :model="soonFinishForm" label-width="120px">
        <el-form-item label="完成时间：" prop="planFinishTime">
          <el-date-picker v-model="soonFinishForm.planFinishTime" type="date" placeholder="选择日期时间：" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
         <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="soonFinishForm.remark"></el-input>
        </el-form-item>
       

        <el-form-item label="图片选择：">
          <el-upload class="avatar-uploader" ref="uploadSoonFinish" :action="fileUploadUrl" name="files" :headers="headers"
                     list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="fileData">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleSoonFinish">
            <img width="50%" :src="dialogImageUrlSoonFinish" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="soonFinishDialog = false">取 消</el-button>
        <el-button type="primary" @click="soonFinishCommand()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令复核 -->
    <el-dialog class="dialogBox" width="40%" title="指令复核" :visible.sync="finishDialog" append-to-body>
      <el-form :model="finishForm" label-width="120px">
         <el-button type="success" style=" margin-left:50px;padding:2px " @click="checkRemark">快捷回复</el-button>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="finishForm.remark"></el-input>
        </el-form-item>
       
        <el-form-item label="图片选择：">
          <el-upload class="avatar-uploader" ref="uploadFinish" :action="fileUploadUrl" name="files" :headers="headers"
                     list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="fileData">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleFinish">
            <img width="50%" :src="dialogImageUrlFinish" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="finishDialog = false">取 消</el-button>
        <el-button type="primary" @click="finishCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令完成modifytBtn -->
    <el-dialog class="dialogBox" width="40%" title="指令修改" :visible.sync="modifyDialog" append-to-body>
      <el-form :model="modifyForm" label-width="130px">
        <el-form-item label="指定人：" prop="receiveUserName">
          <el-input readonly v-model="modifyForm.receiveUserName" @focus="alertAcceptUserDialog('receive')" clearable placeholder="请选择">
          </el-input>
        </el-form-item>
        <el-form-item label="计划检查时间：" prop="planCheckTime">
          <el-date-picker v-model="modifyForm.planCheckTime" type="date" placeholder="选择日期时间：" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划完成时间：" prop="planFinishTime">
          <el-date-picker v-model="modifyForm.planFinishTime" type="date" placeholder="选择日期时间：" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="modifyForm.remark"></el-input>
        </el-form-item>
        <el-button type="danger" style=" margin-bottom:10px;padding:0 " @click="checkRemark">快捷回复</el-button>
        <el-form-item label="图片选择：">
          <el-upload class="avatar-uploader" ref="uploadModify" :action="fileUploadUrl" name="files" :headers="headers"
                     list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="fileData">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleModify">
            <img width="50%" :src="dialogImageUrlModify" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 发起人-->
    <el-dialog title="图片预览" :visible.sync="dialogcommcheck" width="50%" append-to-body>
      <viewer :photo="commcheckList" :imgList="pictureOfCommand"></viewer>
    </el-dialog>
    
     <el-dialog title="影像资料" width="60%" :visible.sync="vedioinnerVisible" append-to-body>
      <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
    </el-dialog>


     <el-dialog :visible.sync="dialogRemark" title="自动回复" width="40%" append-to-body>
        <remark @setRemark="getRemark" @cancel="dialogRemark=false" :type="'command'"></remark>
    </el-dialog>
    
     

  </div>
</template>

<script>
  import request from '../../../utils/request'
  import { getToken } from '@/utils/auth'
  import instructApi from '@/api/instruct.js'
  import project from '@/api/project.js'
  import Organization from '@/api/Organization.js'
  import processInfo from '@/api/process.js'
  import instructMap from './instructMap'
  import Map from './Map'
  import remark from "@/components/remark"
  // import SelectTree from "@/components/SelectTree/selectTree.vue";
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'

  import viewer from '@/components/viewer'
import { debug } from 'util';

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      instructMap,
      Map,
      viewer,
      remark
    },
    props: ['nowItem'],
    data() {
      return {

        formRules: {
          userGroupId: [
            { required: true, message: '请选择组织机构', trigger: 'change' },
          ],
          projectItemId: [
            { required: true, message: '请选择分部分项', trigger: 'change' }
          ],
           processDictId: [
            { required: true, message: '请选择工序', trigger: 'change' }
          ],
           receiveUserName: [
            { required: true, message: '请选择接收人', trigger: 'change' }
          ],
          planCheckTime: [
            {  required: true, message: '请选择计划开始时间', trigger: 'change' }
          ],
          planFinishTime: [
            {  required: true, message: '请选择计划完成时间', trigger: 'change' }
          ],
        },
       returnRules:{
           planFinishTime:[{ required: true, message: '请选择完成时间', trigger: 'change' }]
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
        ],
        dialogRemark:false,
        returnDialog: false,
        soonFinishDialog: false,
        finishDialog: false,
        modifyDialog: false,
        returnBtn: true,
        innerBtn: true,
        soonFinishBtn: true,
        finishBtn: false,
        modifyBtn: false,
        reverse: false,   //转发
        activeName: 'first',   //发起指令的tab
        activeName1: 'first',   //收到指令的tab
        processMDictOption: [],  // 工序类型下拉框
        processSDictOption: [],  // 工序下拉框
        dialogcommcheck: false,
        dialogcommchecks: false,
        tabPosition: 'first',
        activities: [
          {
            name: '',
            finishTime: '',
            remark: ''
          }
        ],
        activitiesIcon: [{// 发出指令的人
          size: 'large',
          type: 'primary',
          icon: 'el-icon-location-outline'
        }, {  // 转发人
          size: 'large',
          type: 'warning',
          icon: 'el-icon-refresh'
        }, { // 正在处理
          size: 'large',
          type: 'primary',
          icon: 'el-icon-loading'
        }, {  // 完成指令的人
          size: 'large',
          type: 'success',
          icon: 'el-icon-check'
        }, {  // 复核的
          size: 'large',
          type: 'primary',
          icon: 'el-icon-s-check'
        }, {
          size: 'large',
          type: 'danger',
          icon: 'el-icon-refresh-left'

        }

        ],
        // 参考图标
        activities2: [{
          content: '发出',
          timestamp: '',
          type: 'primary',
          icon: 'el-icon-location-outline'
        }, {
          content: '转发',
          timestamp: '',
          type: 'warning',
          icon: 'el-icon-refresh'
        }, {
          content: '正在处理',
          timestamp: '',
          type: 'primary',
          icon: 'el-icon-loading'
        }, {
          content: '退回',
          timestamp: '',
          type: 'danger',
          icon: 'el-icon-refresh-left'
        },
          {
            content: '完成',
            timestamp: '',
            type: 'success',
            icon: 'el-icon-check'
          }, {
            content: '复核',
            timestamp: '',
            type: 'primary',
            icon: 'el-icon-s-check'
          }],

        answer: '', // 转发响应变量
        nowType: 0,
        activeIndex: '1',
        activeIndex2: '1',
        newnowType: 0,
        newactiveIndex: '1',
        newactiveIndex2: '1',
        uploadUrl: process.env.BASE_API + '/rest/command/addCommand',

        // uploadUrlReturn: process.env.BASE_API + '/rest/command/returnCommand',
        // uploadUrlSoonFinish: process.env.BASE_API + '/rest/command/soonFinishCommand',
        // uploadUrlFinish: process.env.BASE_API + '/rest/command/finishCommand',
        // uploadUrlModify: process.env.BASE_API + '/rest/command/modifyCommand',

        fileUploadUrl:  process.env.BASE_API + '/rest/command/videoOrImageUpload',  // 修改
        dialogImageUrl: '',
        dialogImageUrlReturn: '',
        dialogImageUrlSoonFinish: '',
        dialogImageUrlFinish: '',
        dialogImageUrlModify: '',
        commcheckList: [], // 预览图片信息
        planTime: '',
        headers: {
          'X-AUTH-TOKEN': getToken()
        },
        form: {
          remark: '', // 指令内容
          userGroupId: '', // 组织机构id
          userGroupName: '',   //组织机构名称
          processMDictId: '',  //工序类型id
          processDictId: '', // 工序字典的工序id 非必传
          projectItemId: '', // 分部分项id
          projectItemName: '',  //分部分项名称
          ReceiveUserid: '', // 接收人id
          receiveUserName: '',   //接收人名称
          planCheckTime: '', // 计划检查时间
          commandType: '', // 指令类型
          batchNo: '',
          patrolId: '',  //巡视id
          planFinishTime: ''  //计划完成时间
        }, //表单校验规则
        // rulesform: {
        //   transpondName: {
        //     required: true,
        //     message: '请选择指定人',
        //     trigger: 'blur'
        //   }
        // },
        //文件
        fileData: {
        commandid: "", // 指令id
        typeState: -1,
        lgt: "",
        lat: "",
        photoLocation: "",
        commandsendid: ""
      },
        //   转发指令
        transpondForm: {
          commanduserId: '', // 指令用户表id
          zhidingren: '', // 指定人id
          remark: '', // 备注
          transpondName: '',
          planFinishTime: ''
        },
        returnForm: {
          commandid: '', // 指令用户表id
          remark: '', // 备注
          planFinishTime: ''
        },
        soonFinishForm: {
          commandid: '', // 指令用户表id
          remark: '', // 备注
          planFinishTime: ''

        },
        finishForm: {
          commandid: '', // 指令用户表id
          remark: '', // 备注
          planFinishTime: ''
        },
        modifyForm: {
          commandid: '', // 指令用户表id
          remark: '', // 备注
          planCheckTime: '',
          planFinishTime: '',
          ReceiveUserid: '',
          transpondName: ''
        },
        // 指令内容框框
        commandUser: {
          createTime: '', // 开始时间
          finishTime: '', // 结束时间
          faqiren: '', // 发起人
          jieshouren: '', // 接受人
          remark: '', // 相关描述
          state: '' // 处理状态
        },

        //   查看详情
        formSon: {
          createTime: '', // 拍照时间
          describe: '', // 指令描述
          lat: '', // 经度
          lgt: '', // 纬度
          photoDescribe: '', // 照片描述
          photoLocation: '' // 拍摄地点
        },
        userGroupDefaultProps: {  // 组织机构树显示
          children: 'children',
          label: 'name'
        },
        // 工程分项树显示
        /*  projectTree: {
            children: "children",
            label: "projectItem"
          },*/
        projectItemDefaultProp: {
          children: 'children',
          label: 'projectItem'
        },
        receiveData: {
          pageNo: 1, // 当前页
          pageSize: 10, // 每页条数
          userGroupId: '',
          realname: '', //用户真实名字
          position: ''   //职位
        },
        //发送工序id
        sendDataSon: {
          processLogId: '', // 工序id
          Mark: '' // 0发送 1完成
        },
        transpondName: '', // 转发用户名回填中文
        total: 0,
        pictureOfCommand: [], // 发送指令时的图片
        finishPictureOfCommand: [], // 完成指令时的图片
        imgData: [], // 下一层图片数组
        userGroupTree: [], // 组织机构树
        projectItemTree: [], // 分部分项树
        receiveUsersList: [], // 接收人列表
        name: '', // 组织机构回填显示
        states: [], //指令内容状态 0 已处理 1未处理
        remark: '', // 最后一个人的备注
        username: '', // 接收人id回填
        projectItem: '', // 分部分项回填显示
        innerVisibleSon: false, // 内层照片详情弹框
        innerVisible: false, // 组织机构弹框
        projectVisible: false, // 工程分项弹框
        acceptUserDialog: false, // 接受人id弹框
        dialogState: '',  //用于界定弹框是转发人还是接收人
        innerTranspondDialog: false, // 转发指令信息
        dialogVisible: false, // 上传图片
        dialogVisibleReturn: false, // 上传图片
        dialogVisibleSoonFinish: false, // 上传图片
        dialogVisibleFinish: false, // 上传图片
        dialogVisibleModify: false, // 上传图片
        orgId: '',
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
            type: 'video/mp4',//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: '' //url地址
          }],
          poster: '', //你的封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
        vedioinnerVisible: false

      }
    },
    created() {
      this.initForm();
      this.initUserGroupTree();
      this.receiveUserList();
      this.form.batchNo = this.createUUID()  //生成批处理id
      console.log(this.nowItem)
    },
    methods: {
      reset() {  // 重置按钮
        this.reload()
      },
      query(){
         this.receiveUserList();
      },
      getRemark(data){
         this.transpondForm.remark = data;
         this.modifyForm.remark = data;
         this.finishForm.remark = data;
         this.soonFinishForm.remark = data;
         this.returnForm.remark = data;

      },
      checkRemark(){
        this.dialogRemark = true;
      },
      initForm() {
        if (this.nowItem == 'add') {
          this.initUserGroupTree()  //初始化组织机构
        } else {
          let ObCopyData = this.$tool.ObCopy(this.nowItem) //复制nowItem传来的值 处理复杂类型
          this.form = ObCopyData // 第一层查看
          this.activities = ObCopyData.commandUsers
          this.transpondForm.commanduserId = ObCopyData.commanduserId // 转发指令
          this.returnForm.commandid = ObCopyData.id //退回指令
          this.soonFinishForm.commandid = ObCopyData.id // 完成指令
          this.finishForm.commandid = ObCopyData.id // 复核指令
          this.modifyForm.commandid = ObCopyData.id // 修改指令
          this.fileData.commandid = ObCopyData.id
          let nowUserId = localStorage.getItem('userId')
          //处理按钮显示与否
          /* -1 发起人
             0 转发
             1 完成
             2 复核
             3 退回*/
          if (ObCopyData.state == '-1' || ObCopyData.state == '0') {
            this.innerBtn = true      // 转发
            this.returnBtn = true     // 退回
            this.soonFinishBtn = true  // 完成
            this.finishBtn = false     // 复核
            if (nowUserId == ObCopyData.sponsor) {
              this.soonFinishBtn = false
              this.finishBtn = false
            }
          } else if (ObCopyData.state == '3') {
            this.innerBtn = false
            this.returnBtn = false
            this.soonFinishBtn = false
            this.finishBtn = false
            if (nowUserId == ObCopyData.sponsor) {
              this.innerBtn = false
              this.returnBtn = false
              this.soonFinishBtn = false
              this.finishBtn = false
              this.modifyBtn = true
            }
          } else if (ObCopyData.state == '2') {  //待复核
            this.innerBtn = false
            this.returnBtn = false
            this.soonFinishBtn = false
            this.finishBtn = false
            if (nowUserId == ObCopyData.sponsor) {
              this.finishBtn = true
            }
          } else if (ObCopyData.state == '1') {
            this.innerBtn = false
            this.returnBtn = false
            this.soonFinishBtn = false
            this.finishBtn = false
          }
        }
      },
      initUserGroupTree() {   // 初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupTree = res.data.data
        })
      },
      userGroupOnChange(data) {   //选择标段改动
        this.orgId = data
        this.form.userGroupId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemTree = res.data.data

          this.$refs.getSelectData.labelModel = ''
        })
      },
      loadNextNode(node, resolve) {  //异步获取下一级节点数据
        if (node.level > 0) {
          project.getProjectItemFromLayer({ userGroupId: this.selectedUserGroup, pId: node.data.id }).then(res => {
            resolve(res.data.data)
          })
        }
      },
      projectItemOnClick(data) {
        // 获取分部分项id
        this.form.projectItemId = data.id
        this.initProcessByTypeId(data.id)

      },
      initProcessByTypeId(codeid) {   // 初始化新增工序通过工序类型id
        this.processSDictOption = []  //先清空
        this.processSDictOption.unshift({ process: '全部' })
        request.post('/rest/processCheck/numberSdData', { codeid: codeid }).then(res => {
          this.processSDictOption = res.data.data
        })
      },
      processTypeChangeProcess(data) {    // 点击新增工序--工序类型改变工序
        this.initProcessByTypeId(data)
      },
      receiveUserList() {  //接收人列表
        processInfo.getUsersByDepartId(this.receiveData).then(res => {
          this.total = res.data.data.totalCount
          this.receiveUsersList = res.data.data.data
        })
      },
      // 工序id拿图片详情
      actionImg(txtState) {
        this.sendDataSon.Mark = txtState
        processInfo.getPictureDetail(this.sendDataSon).then(res => {
          this.formSon = res.data.data[1] // 图片详情信息
          if (this.formSon.photoLocation == null) {
            this.formSon.photoLocation = '湖南常祁'
          }
          this.imgData = res.data.data // 内层图片数组
          console.log(this.imgData.shift(0, 1))
        })
        this.innerVisibleSon = true
      },
      handleProjectItemOnClick(data) { // 分部分项选择后的数据
        this.form.projectItemId = data.id
        this.form.projectItemName = data.name
      },
      alertAcceptUserDialog(state) {  //弹出接收人对话框
        this.receiveData = {}
        this.dialogState = state
        this.receiveUserList()
        this.acceptUserDialog = true
      },
      handleReceiveUserGroupCheckChange(data) {   //选择接收人后的组织机构弹框
        this.receiveData.userGroupId = data
        this.receiveUserList()
      },
      close() {
        this.$emit('cancel')
      },
      transpondCommand() {  // 转发指令
        if (this.transpondForm.transpondName == '') {
          this.$message({
            showClose: true,
            message: '请输入指定人',
            type: 'warning'
          })
          return false
        }
        if (this.modifyForm.transpondName == '') {
          this.$message({
            showClose: true,
            message: '请输入指定人',
            type: 'warning'
          })
          return false
        }
        instructApi.InstructionCommand(this.transpondForm).then(res => {
          let _message = res.data.message
          if (_message == '成功') {
            this.answer = 'success'
          } else {
            this.answer = 'error'
          }
          this.$message({
            type: this.answer,
            message: _message
          })
          this.$emit('cancel')
          this.reload()
        })
      },
      returnCommand(returnForm) {  // 退回指令
        this.$refs[returnForm].validate((valid) => {
          let that = this;
          if (valid) {
              instructApi.returnCommand(that.returnForm).then(res => {
                if (res.data.ok) {
                  that.fileData.commandsendid = res.data.data;
                  that.$refs.uploadReturn.submit();
                  that.$emit('cancel')
                  that.reset()
              }
                
          });
          //this.$emit("cancel");
          //this.reload();

            // this.$refs.uploadReturn.submit()
            // this.$emit('cancel')
            // this.reset()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      soonFinishCommand() {  // 完成指令
          instructApi.soonFinishCommand(this.soonFinishForm).then(res => {
                if (res.data.ok) {
                  this.fileData.commandsendid = res.data.data;
                  this.$refs.uploadSoonFinish.submit();
                  this.$emit('cancel')
                  this.reset()
              }
          })
        // this.$refs.uploadSoonFinish.submit()
        // this.$emit('cancel')
        // this.reset()
      },
      finishCommand() {  // 完成指令
           instructApi.finishCommand(this.finishForm).then(res => {
                if (res.data.ok) {
                  this.fileData.commandsendid = res.data.data;
                  this.$refs.uploadFinish.submit();
                  this.$emit('cancel')
                  this.reset()
              }
          })

        // this.$refs.uploadFinish.submit()
        // this.$emit('cancel')
        // this.reset()
      },
      modifyCommand() {  // 完成指令
         instructApi.finishCommand(this.modifyForm).then(res => {
                if (res.data.ok) {
                  this.fileData.commandsendid = res.data.data;
                  this.$refs.uploadModify.submit();
                  this.$emit('cancel')
                  this.reset()
              }
          })


        // this.$refs.uploadModify.submit()
        // this.$emit('cancel')
        // this.reset()
      },
      handleCurrentChange(val) {   //确认接收人
        if (this.dialogState === 'receive') {
          this.form.ReceiveUserid = val.id // 新增传接收人id
          this.modifyForm.ReceiveUserid = val.id // 新增传接收人id
          this.form.receiveUserName = val.username // 新增接收人id名回填
          this.modifyForm.receiveUserName = val.username // 新增接收人id名回填
        } else if (this.dialogState === 'transpond') {
          this.transpondForm.zhidingren = val.id // 新增传接收人id
          this.modifyForm.zhidingren = val.id // 新增传接收人id
          this.transpondForm.transpondName = val.username // 新增接收人id名回填
          this.modifyForm.transpondName = val.username // 新增接收人id名回填
        }
        this.acceptUserDialog = false
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handlePictureCardPreviewReturn(file) {

        this.dialogImageUrlReturn = file.url
        this.dialogVisibleReturn = true
      },
      /*  beforeUpload: function(file) {
          this.commandFormData.append('files', file)
        },*/
      createUUID: function() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        return (
          S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
        )
      },
      pictureShow(node) {
        let newArr = []
        for (let i = 0; i < node.length; i++) {
          if (node[i].fileType == 'jpg' || node[i].fileType == 'png' || node[i].fileType == 'jpeg') {
            newArr.push(node[i])
          }
        }
        this.pictureOfCommand = newArr
        this.dialogcommcheck = true
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

<style lang="scss" scoped>
  .checkBox {
    height: 60vh;
    overflow-x: hidden;
    padding: 0 20px;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-carousel__item {

  img {
    width: 100%;
    height: 100%;
  }

  }
  .TimeAndType {
    height: 7vh;

  span {
    display: block;
  }

  }
  .timelineBox {
    height: 9vh;

  .el-timeline-item {
    float: left;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 15px;
    width: 8vw;
    border-top: 2px solid #e4e7ed !important;
  }

  }
  .navb {
    width: 50%;
    height: 7%;
    margin-left: 30px;
  }

  .navbc {
    width: 70%;
    height: 7%;
    margin-left: 30px;
  }

  .intervalBox {

  element.style {
    margin-left: transparent;
  }

  }
  .reverseBox {
    position: relative;

  /deep/ .el-form-item__label {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  /deep/ .el-input {
    font-size: 0.7vw;
  }

  /deep/ .el-textarea {
    margin-bottom: 5px;
  }

  /deep/ .el-input__inner {
    font-size: 14px;
  }

  /deep/ .el-timeline {

    line-height: 30px;
  }

  /deep/ .reference .el-timeline-item {
    font-size: 12px;
  }

  /deep/ .el-textarea__inner {
    height: 30px;
  }

  }
  .reference {
    width: 100%;
    margin-top: 10px;

  .el-timeline {
    margin-left: -2vw;
    font-size: 0.7vw;
    list-style: none;
  }

  .el-timeline-item {
    float: left;
    padding-bottom: 0;
    height: 3vh;
  }

  /deep/ .el-timeline-item__node--normal {
    width: 0.7vw;
    height: 0.7vw;
  }

  /deep/ .el-timeline-item__timestamp {
    font-size: 0.8vw;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 0vw;
    width: 0vw;
    height: 3vh;
    border-left: 0.1vw solid rgba(31, 68, 143, 0);
  }

  /deep/ .el-timeline-item__node--normal {
    left: 0.4vw;
  }

  /deep/ .el-timeline-item__wrapper {
    position: relative;
    padding-left: 1.2vw;
    top: -0.5vh;
  }

  }
  .accomplish {
    display: block;
    text-align: center;
    font-size: 1.2vw;
    color: #00000b;
  }

  .reverseAddBox {
    width: 100%;

  /deep/ .el-form-item__label {
    font-size: 0.7vw;
  }

  /deep/ .el-input {
    font-size: 0.7vw;
  }

  }
  .faqi,
  .wanchen {
    width: 50%;
    padding: 10px;

  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;

  li {
    list-style: none;
    float: left;
    width: 15vh;
    height: 15vh;
    padding: 1%;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  }
  }
  }
  .pictureContent {
    padding: 20px 10px;

  ul {
    padding: 0;
    margin: 0;
    min-height: 45vh;

  li {
    list-style: none;
    float: left;
    width: 20vh;
    height: 20vh;
    padding: 1%;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  }
  }
  }
  .elhr {
    position: absolute;
    width: 1px;
    height: 50vh;
    bottom: 0;
    left: 50%;
    background: #ccc;
  }

  /deep/ .reverseBox[data-v-d793087e] .el-textarea__inner {
    height: 60px;
    min-height: 60px;
  }

  li {
    list-style-type: none;
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
    cursor: pointer
  }
  /deep/.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    margin-top: 10px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
/deep/.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    line-height: 100px;
    vertical-align: top;
}
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
</style>
