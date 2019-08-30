<template>
  <div class=" checkBox">
    <el-form :model="form" label-width="120px">
      <!-- 新增 -->
      <div :class="{reverseAddBox:nowItem=='add'}">

        <el-row>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="组织机构：" v-if="nowItem =='add'">
              <!--              <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps" v-on:noDe="handleCheckChange"/>-->

              <el-select v-model="form.userGroupId" placeholder="请选择" @change="userGroupOnChange">
                <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="分部分项：" v-if="nowItem =='add'">
              <select-tree clearable :options="projectItemTree" ref="getSelectData" :props="projectItemDefaultProp"
                           v-on:noDe="projectItemOnClick"/>
              <!--              <select-tree :options="projectItemTree" :props="projectTree" v-on:noDe="handleProjectItemOnClick"/>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!--    <el-form-item label="工序类型：" prop="processMDictId" v-if="nowItem =='add'">
                  <el-select v-model="form.processMDictId" placeholder="请选择工序类型" @change="processTypeChangeProcess">
                    <el-option v-for="item in processMDictOption" :key="item.id" :label="item.processType"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>-->
            <el-form-item label="工序类型：" prop="processSDictId" v-if="nowItem =='add'">
              <!--     <el-select v-model="form.processDictId" placeholder="请选择工序">
                     <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
                   </el-select>-->
              <el-select v-model="form.processDictId" placeholder="请选择工序" style="width: 40%;">
                <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item style="width:20vw" label="接收人：" v-if="nowItem =='add'" prop="receiveUserName">
              <el-input v-model="form.receiveUserName" :disabled="true">
                <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('receive')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="计划检查时间：" v-if="nowItem =='add'" prop="planTime">
              <el-date-picker v-model="form.planCheckTime" type="date" placeholder="选择日期："
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间：" v-if="nowItem =='add'" prop="planTime">
              <el-date-picker v-model="form.planFinishTime" type="date" placeholder="选择日期："
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item style="width:28vw" label="指令内容：" v-if="nowItem =='add'">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>

          </el-row>


          <el-col :span="12">
            <el-form-item label="图片选择：" v-if="nowItem =='add'" prop>
              <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers"
                         list-type="picture-card"
                         :auto-upload="false" :on-preview="handlePictureCardPreview" :data="form">
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
        <!--  <el-row>
          </el-row>-->
        <div style="overflow:auto;">
          <el-row>
            <el-col :span="18">
              <el-form-item style="width:100%;" label="分部分项：" v-if="nowItem !=='add'">
                <el-input type="textarea" readonly v-model="form.projectItem" style="min-height: 60px;"></el-input>
              </el-form-item>
              <el-form-item style="width:22vw" label="计划检查时间：" v-if="nowItem !=='add'">
                <el-input autosize readonly v-model="form.planTime"></el-input>
              </el-form-item>
              <el-form-item style="width:22vw" label="创建时间：" v-if="nowItem !=='add'">
                <el-input readonly v-model="form.createTime"></el-input>
              </el-form-item>
              <el-form-item label="指令时间轴：" v-if="nowItem !=='add'">
                <div class="reference">
                  <el-timeline>
                    <el-timeline-item v-for="(activity, index) in activities2" :key="index" :icon="activity.icon"
                                      :type="activity.type" :color="activity.color"
                                      :size="activity.size" :timestamp="activity.timestamp">{{activity.content}}
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <div class="pta">
                  <el-timeline :reverse="reverse">
                    <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                      :icon="convertIcon(activity, 'icon')"
                                      :type="convertIcon(activity, 'type')" :size="convertIcon(activity,'size')">
                      <!--                      :timestamp="activity.createTime"-->
                      <div style="font-weight: bolder"> {{activity.createTime}}</div>
                      <div>
                        指令操作人: {{activity.realname}}
                      </div>
                      <div>
                        指令描述: {{ activity.remark }}
                      </div>
                      <div>
                        <span>音像资料:</span>
                        <template>
                          <ul v-if="activity.files !== mull" v-for="(node, key) in activity.files" :key="key">
                            <li style="margin-left:10px;float: left">
                              <template v-if="node.fileType==='jpg' ||node.fileType == 'png' ||node.fileType == 'jpeg'">
                                <el-image style="width: 100px; height: 100px" :src="node.filePath" fit="fill"
                                          @click="pictureShows(activity.files)"></el-image>
                              </template>
                              <template v-else-if="node.fileType==='mp4' || node.fileType==='mov'">
                                <div class="video-box">
                                  <video id="video" style="width:100px;height:100px">
                                    <source :src="node.filePath" type="video/mp4">
                                  </video>
                                  <div class="video-img" @click="videoPlayerShow(node)"></div>
                                </div>

                                <el-dialog title="影像资料" width="50%" :visible.sync="vedioinnerVisible" append-to-body>
                                  <!--      <viewer :imgList="processPicture"></viewer>-->
                                  <video-player class="video-player vjs-custom-skin"
                                                ref="videoPlayer" :playsinline="true" :options="playerOptions"
                                  ></video-player>
                                </el-dialog>

                              </template>
                            </li>

                          </ul>
                          <div style="clear:both"></div>
                        </template>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <div style="overflow:hidden;" v-if="finishPictureOfCommand.length>100 ">
                <div class="fl faqi">
                  <span class="accomplish">发起指令</span>
                  <el-tabs v-model="activeName">
                    <el-tab-pane label="影像资料" name="first">
                      <ul>
                        <li v-for="(item,index) in form.pictureOfCommand" :key="index" @click="actionImg(item,index)">
                          <img :src="item.picture" style="cursor:pointer">
                        </li>
                      </ul>
                    </el-tab-pane>
                    <el-tab-pane label="拍照地点" name="second">
                      <div style="height:45vh">
                        <instructMap :nowItem="nowItem"></instructMap>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="elhr"></div>
                <div class="rl wanchen">
                  <span class="accomplish">完成指令</span>
                  <el-tabs v-model="activeName1">
                    <el-tab-pane label="影像资料" name="first">
                      <ul>
                        <li v-for="(item,index) in finishPictureOfCommand" :key="index" @click="actionImgs(item,index)">
                          <img :src="item.picture" style="cursor:pointer">
                        </li>
                      </ul>
                    </el-tab-pane>
                    <el-tab-pane label="拍照地点" name="second">
                      <div style="height:45vh">
                        <Map :nowItem="nowItem"></Map>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <!-- 指令发送 -->
              <div v-if="nowItem !=='add' && finishPictureOfCommand.length===100 " class="pictureContent">
                <el-tabs type="border-card" v-model="tabPosition">
                  <el-tab-pane label="影像资料" name="first">
                    <div class="imgContation">
                      <ul>
                        <li v-for="(item,index) in pictureOfCommand" :key="index" @click="actionImg(item,index)">
                          <img :src="item.picture" alt style="width:100%;height:100%">
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="所在位置" name="second">
                    <div style="height:45vh">
                      <instructMap :nowItem="nowItem"></instructMap>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-col>

          </el-row>
        </div>

      </div>
      <div class="tar" style=" right: 40%;position: absolute;bottom: 10px;padding: 10px">
        <el-button type="primary"
                   v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="innerBtn"
                   @click="innerTranspondDialog = true">转发指令
        </el-button>
        <el-button type="primary"
                   v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="returnBtn"
                   @click="returnDialog=true">退回指令
        </el-button>
        <el-button type="primary"
                   v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="soonFinishBtn"
                   @click="soonFinishDialog=true">完成指令
        </el-button>
        <el-button type="primary"
                   v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="finishBtn"
                   @click="finishDialog=true">复核指令
        </el-button>
        <el-button type="primary"
                   v-if="nowItem !=='add' && $route.name=='instructReceive'" v-show="modifyBtn"
                   @click="modifyDialog=true">修改指令
        </el-button>
        <el-button v-if="nowItem=='add'" @click="close()">取 消</el-button>
        <el-button type="primary" v-if="nowItem=='add'" @click="_comfirm('userFrom')">确 定</el-button>
      </div>
    </el-form>


    <!-- 接收人弹框 -->
    <el-dialog class="dialogBox" width="45%" title="选择接收人" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>组织机构筛选:</span>
        <el-select v-model="receiveData.userGroupId" placeholder="请选择" @change="handleReceiveUserGroupCheckChange">
          <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname"
                     :value="item.id"></el-option>
        </el-select>

        <!-- <select-tree clearable :options="userGroupTree" :props="userGroupDefaultProps"
                      v-on:noDe="handleReceiveUserGroupCheckChange"/>-->
      </div>
      <el-table border :data="receiveUsersList" highlight-current-row style="width: 100%" height="50vh"
                @current-change="handleCurrentChange">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="departname" label="职务"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>

      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[10,20,30]"
                     :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()"
                     :total="total"></el-pagination>
    </el-dialog>
    <!-- 转发信息 -->
    <el-dialog class="dialogBox" width="40%" title="指令转发" :visible.sync="innerTranspondDialog" append-to-body>
      <el-form :model="transpondForm" :rules="rulesform" label-width="130px">
        <el-form-item label="指定人：" prop="transpondName">
          <el-input readonly v-model="transpondForm.transpondName">
            <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('transpond')"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="计划完成时间：" prop="planTime">
          <el-date-picker v-model="transpondForm.planFinishTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

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
      <el-form :model="returnForm" label-width="130px">
        <!-- <el-form-item label="指定人：" prop="transpondName">
           <el-input readonly v-model="transpondForm.transpondName">
             <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('transpond')"></el-button>
           </el-input>
         </el-form-item>-->

        <el-form-item label="计划完成时间：" prop="planTime">
          <el-date-picker v-model="returnForm.planFinishTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="returnForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="图片选择：" prop>
          <el-upload class="avatar-uploader" ref="uploadReturn" :action="uploadUrlReturn" name="files"
                     :headers="headers"
                     list-type="picture-card"
                     :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="returnForm">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleReturn">
            <img width="50%" :src="dialogImageUrlReturn" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="returnDialog = false">取 消</el-button>
        <el-button type="primary" @click="returnCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令完成modifytBtn -->
    <el-dialog class="dialogBox" width="40%" title="指令完成" :visible.sync="soonFinishDialog" append-to-body>
      <el-form :model="soonFinishForm" label-width="130px">
        <!--  <el-form-item label="指定人：" prop="transpondName">
            <el-input readonly v-model="transpondForm.transpondName">
              <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('transpond')"></el-button>
            </el-input>
          </el-form-item>-->
        <el-form-item label="计划完成时间：" prop="planTime">
          <el-date-picker v-model="soonFinishForm.planFinishTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="soonFinishForm.remark"></el-input>
        </el-form-item>

        <el-form-item label="图片选择：" prop>
          <el-upload class="avatar-uploader" ref="uploadSoonFinish" :action="uploadUrlSoonFinish" name="files"
                     :headers="headers"
                     list-type="picture-card"
                     :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="soonFinishForm">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleSoonFinish">
            <img width="50%" :src="dialogImageUrlSoonFinish" alt="图片">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="tar">
        <el-button @click="soonFinishDialog = false">取 消</el-button>
        <el-button type="primary" @click="soonFinishCommand">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指令复核 -->
    <el-dialog class="dialogBox" width="40%" title="指令复核" :visible.sync="finishDialog" append-to-body>
      <el-form :model="finishForm" label-width="130px">
        <!--  <el-form-item label="指定人：" prop="transpondName">
            <el-input readonly v-model="transpondForm.transpondName">
              <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('transpond')"></el-button>
            </el-input>
          </el-form-item>-->
        <!-- <el-form-item label="计划完成时间：" prop="planTime">
           <el-date-picker v-model="finishForm.planFinishTime" type="date" placeholder="选择日期时间："
                           value-format="yyyy-MM-dd"></el-date-picker>
         </el-form-item>-->
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="finishForm.remark"></el-input>
        </el-form-item>

        <el-form-item label="图片选择：" prop>
          <el-upload class="avatar-uploader" ref="uploadFinish" :action="uploadUrlFinish" name="files"
                     :headers="headers"
                     list-type="picture-card"
                     :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="finishForm">
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
        <el-form-item label="指定人：" prop="transpondName">
          <el-input readonly v-model="modifyForm.receiveUserName">
            <el-button slot="append" icon="el-icon-search" @click="alertAcceptUserDialog('receive')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="计划检查时间：" prop="planTime">
          <el-date-picker v-model="modifyForm.planCheckTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划完成时间：" prop="planTime">
          <el-date-picker v-model="modifyForm.planFinishTime" type="date" placeholder="选择日期时间："
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="modifyForm.remark"></el-input>
        </el-form-item>

        <el-form-item label="图片选择：" prop>
          <el-upload class="avatar-uploader" ref="uploadModify" :action="uploadUrlModify" name="files"
                     :headers="headers"
                     list-type="picture-card"
                     :auto-upload="false" :on-preview="handlePictureCardPreviewReturn" :data="modifyForm">
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

    <!-- 图片预览 接收人-->
    <el-dialog title="图片预览" :visible.sync="dialogcommchecks" width="50%" append-to-body>
      <viewer :photo="commcheckList" :imgList="finishPictureOfCommand"></viewer>
    </el-dialog>

  </div>
</template>

<script>
  import request from '../../../utils/request'
  import { getToken } from '@/utils/auth'
  import instruct from '@/api/instruct.js'
  import project from '@/api/project.js'
  import Organization from '@/api/Organization.js'
  import processInfo from '@/api/process.js'
  import instructMap from './instructMap'
  import Map from './Map'
  // import SelectTree from "@/components/SelectTree/selectTree.vue";
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'

  import viewer from '@/components/viewer'

  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      instructMap,
      Map,
      viewer
    },
    // props: ['nowItem'],
    props:{
        nowItem:{
          type:Object
        }
    },
    data() {
      return {
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
          content: '发出指令',
          timestamp: '',
          type: 'primary',
          icon: 'el-icon-location-outline'
        }, {
          content: '转发指令',
          timestamp: '',
          type: 'warning',
          icon: 'el-icon-refresh'
        }, {
          content: '正在处理指令',
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
            content: '完成指令',
            timestamp: '',
            type: 'success',
            icon: 'el-icon-check'
          }, {
            content: '复核指令',
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
        uploadUrlReturn: process.env.BASE_API + '/rest/command/returnCommand',
        uploadUrlSoonFinish: process.env.BASE_API + '/rest/command/soonFinishCommand',
        uploadUrlFinish: process.env.BASE_API + '/rest/command/finishCommand',
        uploadUrlModify: process.env.BASE_API + '/rest/command/modifyCommand',
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
        rulesform: {
          transpondName: {
            required: true,
            message: '请选择指定人',
            trigger: 'blur'
          }
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
      this.initForm()
      this.receiveUserList()
      this.form.batchNo = this.createUUID()  //生成批处理id
      console.log(this.nowItem)
    },
    methods: {
      reset() {  // 重置按钮
        this.reload()
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
          // this.pictureOfCommand = ObCopyData.commandUsers[0].files
          // this.finishPictureOfCommand = ObCopyData.commandUsers[0].files
          console.log('ObCopyDataaaaaaaaaa', ObCopyData)
          let nowUserId = localStorage.getItem('userId')
          //处理按钮显示与否
          /* -1 发起人
             0 转发
             1 完成
             2 复核
             3 退回*/
          if (ObCopyData.state == '-1' || ObCopyData.state == '0') {
            this.innerBtn = true
            this.returnBtn = true
            this.soonFinishBtn = true
            this.finishBtn = false
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
          } else if (ObCopyData.state == '2') {
            this.innerBtn = false
            this.returnBtn = true
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

      /*   initProcessTypeDict() {  // 初始化新增工序类型input框数据
           request.post('/rest/processType/getList').then(res => {
             this.processMDictOption = res.data.data.data
             this.initProcessByTypeId(this.processMDictOption[0].id)
           })
         },*/
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
      convertIcon(activity, type) {
        // 发出指令的人
        /* -1 发起人
         0 转发
         1 完成
         2 复核
         3 退回*/
        if (activity.userRole == 1) {
          if (type === 'icon') {
            return this.activitiesIcon[3].icon
          } else if (type === 'type') {
            return this.activitiesIcon[3].type
          }
        } else if (activity.userRole == null) {
          //转发指令的人
          if (type === 'icon') {
            return this.activitiesIcon[2].icon
          } else if (type === 'type') {
            return this.activitiesIcon[2].type
          }
        } else if (activity.userRole == 3) {
          // 正在处理指令
          if (type === 'icon') {
            return this.activitiesIcon[1].icon
          } else if (type === 'type') {
            return this.activitiesIcon[1].type
          }
        } else if (activity.userRole == -1) {
          //完成指令的人
          if (type === 'icon') {
            return this.activitiesIcon[0].icon
          } else if (type === 'type') {
            return this.activitiesIcon[0].type
          }
        } else if (activity.userRole == 0) {
          //完成指令的人
          if (type === 'icon') {
            return this.activitiesIcon[1].icon
          } else if (type === 'type') {
            return this.activitiesIcon[1].type
          }
        } else if (activity.userRole == 2) {
          //完成指令的人
          if (type === 'icon') {
            return this.activitiesIcon[4].icon
          } else if (type === 'type') {
            return this.activitiesIcon[4].type
          }
        } else if (activity.userRole == 3) {
          //完成指令的人
          if (type === 'icon') {
            return this.activitiesIcon[5].icon
          } else if (type === 'type') {
            return this.activitiesIcon[5].type
          }
        }
      },
      /*    handleCheckChange(data) {  // 组织机构选择后的数据
            this.form.userGroupId = data.id;
            this.form.userGroupName =data.name;
            project.projectList({orgId: data.id}).then(res => {
              this.projectItemTree = res.data.data;
            });
          },*/
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
      _comfirm() {  //提交
        if (this.nowItem === 'add') {  // 新增
          if (this.form.userGroupId === null || this.form.userGroupId === '' || this.form.userGroupId === undefined) {
            this.$message({
              showClose: true,
              message: '请选择组织机构',
              type: 'warning'
            })
            return false
          }
          if (this.form.projectItemId === '' || this.form.projectItemId === '' || this.form.projectItemId === undefined) {
            this.$message({
              showClose: true,
              message: '请选择分部分项',
              type: 'warning'
            })
            return false
          }
          /*    if (this.form.processDictId === '' || this.form.processDictId === '' || this.form.processDictId === undefined) {
                this.$message({
                  showClose: true,
                  message: '请选择工序类型',
                  type: 'warning'
                })
                return false
              }*/
          if (this.form.ReceiveUserid === '' || this.form.ReceiveUserid === '' || this.form.ReceiveUserid === undefined) {
            this.$message({
              showClose: true,
              message: '请选择接收人',
              type: 'warning'
            })
            return false
          }
          if (this.form.planCheckTime === '' || this.form.planCheckTime === '' || this.form.planCheckTime === undefined) {
            this.$message({
              showClose: true,
              message: '请选择计划时间',
              type: 'warning'
            })
            return false
          }
          this.$refs.upload.submit()
        }
        this.$emit('cancel')
        this.reload()
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
        instruct.InstructionCommand(this.transpondForm).then(res => {
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
      returnCommand() {  // 退回指令
        this.$refs.uploadReturn.submit()
        this.$emit('cancel')
        this.reset()
        // })
      },
      soonFinishCommand() {  // 完成指令
        this.$refs.uploadSoonFinish.submit()
        this.$emit('cancel')
        this.reset()
      },
      finishCommand() {  // 完成指令
        this.$refs.uploadFinish.submit()
        this.$emit('cancel')
        this.reset()
      },
      modifyCommand() {  // 完成指令
        this.$refs.uploadModify.submit()
        this.$emit('cancel')
        this.reset()
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
      /*      //图片预览  (发起人)
            actionImg(item) {
              let array = []
              array.push(item)
              this.commcheckList = array
              this.dialogcommcheck = true
              this.pictureOfCommand.splice(index, 1)
              this.pictureOfCommand.unshift(item)
            },
            //图片预览(接收人)
            actionImgs(item) {
              let array = []
              array.push(item)
              this.commcheckList = array
              this.dialogcommchecks = true
              this.finishPictureOfCommand.splice(index, 1)
              this.finishPictureOfCommand.unshift(item)
            },*/
      pictureShows(node) {

        let newArr = []
        for (let i = 0; i < node.length; i++) {
          if (node[i].fileType == 'jpg' || node[i].fileType == 'png' || node[i].fileType == 'jpeg') {
            newArr.push(node[i])
          }
        }
        this.pictureOfCommand = newArr
        // this.zhuanghao = this.currentProcess.zhuanghao
        this.dialogcommcheck = true
      },
      videoPlayerShow(node) {
        this.playerOptions.sources = []
        let newArrVedio = []
        for (let i = 0; i < node.length; i++) {
          if (node.fileType == 'mp4' || node.fileType == 'mov') {
            newArrVedio.push(node)
          }
        }
        this.playerOptions.sources[0] = {
          src: node.filePath,
          type: 'video/mp4'
        }
        this.poster = node.filePath.split('.')[0] + 'jpg'
        this.vedioinnerVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkBox {
    height: 60vh;
    overflow-x: hidden;
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
</style>
