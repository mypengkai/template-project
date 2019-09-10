<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <div class="topBar" id="departInput">
        <span>组织机构:</span>
        <el-select v-model="userGroupId" placeholder="请选择" @change="userGroupOnChange" style="width:19vw;">
          <el-option v-for="item in userGroupOption" :key="item.id" :label="item.departname"
                     :value="item.id"></el-option>
        </el-select>
      </div>
      <div v-show="isShowProjectItem" class="topBar">
        <el-form :inline="true" class="grid-content">
          <span>分部分项:</span>
          <el-form-item>
            <div style="height:70vh;overflow-y:auto;border:1px solid #DCDFE6; width:19vw;border-radius: 5px">
              <el-tree :data="projectItemTree" :props="defaultProjectItemProps" lazy :load="loadNextNode"
                       highlight-current @node-click="handleNodeClick"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 右边详情列表    -->
    <!--  -->
    <div v-if="leftTopDetils" class="particularsList">
         <div>
            <el-row>
              <el-col :span="6">
                    <span style="font-size:14px;">分部分项: {{ treeFrom.projectItem }}</span>
              </el-col>
              <el-col :span="6">
                  <span style="font-size:14px;">桩号: {{ treeFrom.startStation}}-{{treeFrom.endStation }}</span>
                </el-col>
              <el-col :span="8">
                  <span style="font-size:14px;">编码: {{ treeFrom.id.split('_')[1] }}</span>
                </el-col>
              <el-col :span="4">
                <span style="font-size:14px;">状态: {{ treeFrom.iscomplete=='0'?'未完成':'已完成'}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="btnDiv" style="text-align: right;">
          <el-button v-if="addProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn" @click="addProcess()">添加工序
          </el-button>
          <el-button v-if="addProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn"
                     @click="backupProcess()">补录工序
          </el-button>
          <el-button v-if="overProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn"
                     @click="overProcess()">完成分项
          </el-button>
        </div>
     
      <!-- 操作列表 -->
      <!--   state1   adopt
         0       null   已指定工序，待指定计划
         1       null   已指定计划,待自检
         2       null   已自检,待验收
         2        0     不通过,待自检
         3        0     已验收,通过-->
      <div v-if="leftTopDetils" class="Cztab">
        <el-table border :data="tableData" height="68vh" class="textList">
          <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
          <el-table-column prop="processName" label="工序名称" align="center"/>
          <el-table-column prop="planSelfCheckTime" label="自检时间" align="center"/>
          <el-table-column prop="planCheckTime" label="验收时间" align="center"/>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined">
                <template v-if="scope.row.state1===0">已指定工序,待指定计划</template>
                <template v-else-if="scope.row.state1===1">已指定计划,待自检</template>
                <template v-else-if="scope.row.state1===2">已自检,待验收</template>
              </template>
              <template v-else>
                <template v-if="scope.row.state1===2 && scope.row.adopt==='0'">不通过,待自检</template>
                <template v-else-if="scope.row.state1===3 && scope.row.adopt==='1'">已验收,通过</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="创建类型" align="center" width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.checktype==4">补录</template>
              <template v-else>新增</template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <!-- 指定验收 -->
              <el-tooltip v-if="scope.row.adopt===null && scope.row.state1===0" class="item" effect="dark"
                          content="指定验收计划" placement="top">
                <el-button :id="scope.$index" type="success" size="small" icon="el-icon-edit-outline" circle
                           @click="appointCheckPlan(scope.row)"/>
              </el-tooltip>
              
              <el-tooltip v-if="scope.row.adopt===null && scope.row.state1===1" class="item" effect="dark"
                          content="修改验收计划" placement="top">
                <el-button :id="scope.$index" type="warning" size="small" icon="el-icon-edit" circle
                           @click="appointCheckPlan(scope.row)"/>
              </el-tooltip>
              <!-- 查看按钮 -->
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <el-button type="primary" size="small" icon="el-icon-search" circle @click="handleClick(scope.row)"/>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button v-ltx="'acceptDelete'" v-if="scope.row.state1===0" type="danger" icon="el-icon-delete" circle
                           size="small" @click="deleteMainProcess(scope)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--  分页 -->
        <el-pagination :page-sizes="[10,20,30]" :page-size="10" :total="querydata.total"
                       :current-page.sync="querydata.pageNo" background layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleAppointProcessSizeChange" @current-change="loadAppointProcessList"/>
      </div>

    </div>
    <!-- 添加工序弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="指定工序">
      <el-form ref="addProcessForm" :model="form" :rules="acceptRule" label-width="120px">
        <el-form-item label="工序名称" prop="processSDictId">
          <el-select v-model="form.processSDictId" placeholder="请选择工序" size="small">
            <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="工序验收序号" prop="seq">
          <el-input-number v-model="seq" controls-position="right" :min="1" :max="100" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="工序验收次数" prop="checkNum">
          <el-input-number v-model="checkNum" controls-position="right" :min="1" :max="100" size="small"></el-input-number>
        </el-form-item>
         <!-- <el-button type="success" class="checkButton" style="padding:2px;margin-left:50px;"  @click="checkRemark">快捷回复</el-button> -->
        <el-form-item label="备注" prop="remark">
          <el-input :rows="4" v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
       
      <div style="margin-left:60%;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProcessFunction('addProcessForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 补录工序弹框 -->
    <el-dialog :visible.sync="dialogFormVisibleBL" title="补录工序" width="70%" lock-scroll >
      <div class="blgx">
        <el-dialog :visible.sync="setCheckPersonDialogFormVisible" width="50%" title="选中验收人" :append-to-body="true">
          <div class="topBar">
            <span>姓名:</span>
            <el-input style="width: 150px;" v-model="pageForm.realname" placeholder="请输入内容" size="small"/>
            <span>职务:</span>
            <el-input style="width: 150px;" v-model="pageForm.position" placeholder="请输入内容" size="small"/>
            <div class="rl">
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-search"
                         @click="selectCheckPerson(currentSelectedState)">查询
              </el-button>
              <el-button type="primary" class="pan-btn light-blue-btn" icon="el-icon-refresh" @click="reset()">重置
              </el-button>
            </div>
          </div>
          <el-table border :data="checkPersonData" class="textList" height="40vh">
            <el-table-column fixed="left" label width="80">
              <template slot-scope="scope">
                <input type="radio" name="Fruit" @click="listenCheck(scope, $event)">
              </template>
            </el-table-column>
            <el-table-column property="username" label="姓名"/>
            <el-table-column property="zhiwei" label="职务"/>
            <el-table-column property="mobilePhone" label="电话"/>
          </el-table>
          <!-- 分页 --->
          <el-pagination :page-sizes="[10,20,30]" :page-size="10" :total="pageForm.total"
                         :current-page.sync="pageForm.pageNo" background
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="handleSizeChange" @current-change="selectCheckPerson(currentSelectedState)"/>

          <div slot="footer" class="dialog-footer">
            <el-button class="btnSizes" @click="setCheckPersonDialogFormVisible = false">取 消</el-button>
            <el-button class="btnSizes" type="primary" @click="comfirmSelectedPerson()">确 定</el-button>
          </div>
        </el-dialog>
        <el-form ref="supplementProcessForm" :rules="supplementProcessRules" :model="formData" label-width="120px"
                 size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织机构:">
                <el-input v-model="departname" :disabled="true" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分部分项:">
                <el-input v-model="projectItem" :disabled="true" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起始桩号:">
                <el-input v-model="treeFrom.startStation" :disabled="true" size="small"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束桩号:">
                <el-input v-model="treeFrom.endStation" :disabled="true" size="small"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工序:" prop="processDictId">
                <el-select v-model="formData.processDictId" placeholder="请选择工序" style="width: 100%;">
                  <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划自检人:">
                <el-input :readonly="true" v-model="formData.planSelfCheckPersonName"  size="small"
                          style="width:100%">
                  <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('construction')"></el-button>
                </el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划验收人:" >
                <el-input :readonly="true" v-model="formData.planCheckPersonName"  size="small"
                          style="width:100%">
                  <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('supervisor')"></el-button>
                </el-input>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划自检时间:" prop="planSelfCheckTime">
                <el-date-picker v-model="formData.planSelfCheckTime" type="date" placeholder="选择日期时间:"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:100%" size="small"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划验收时间:" prop="planCheckTime">
                <el-date-picker v-model="formData.planCheckTime" type="date" placeholder="选择日期时间:"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:100%" size="small"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="实际自检时间:" prop="SelfCheckTime">
                <el-date-picker v-model="formData.SelfCheckTime" type="datetime" placeholder="选择日期时间:"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%" size="small"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际验收时间:" prop="CheckTime">
                <el-date-picker v-model="formData.CheckTime" type="datetime" placeholder="选择日期时间:"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%" size="small"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
                     <el-button type="success"  style="padding:2px;margin-left:50px;"  @click="checkSelf">快捷回复</el-button>
                     <el-form-item label="自检描述:" prop="selfCheckDescribe">
                        <el-input :rows="2" v-model="formData.selfCheckDescribe" type="textarea" placeholder="请输入内容"
                                  style="width: 100%;"/>
                    </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="success"  style="padding:2px;margin-left:50px;"  @click="checkPlan">快捷回复</el-button>
              <el-form-item label="验收描述:" prop="checkDescribe">
                <el-input :rows="2" v-model="formData.checkDescribe" type="textarea" placeholder="请输入内容"
                          style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="自检图片:">
                <el-upload class="avatar-uploader" ref="uploadSelf" :action="leakRepairProcessUrl" name="files"
                           :headers="headers" accept=".jpg, .png"
                           list-type="picture-card" :auto-upload="false" :before-upload="selfBeforeUplad"
                           :data="filesSelfCheckParamData">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验收图片:">
                <el-upload class="avatar-uploader" ref="uploadCheck" :action="leakRepairProcessUrl" name="files"
                           :headers="headers" accept=".jpg, .png"
                           list-type="picture-card" :auto-upload="false" :before-upload="checkBeforeUplad"
                           :data="filesCheckParamData">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input :rows="4" v-model="formData.remark" type="textarea" placeholder="请输入内容"/>
              </el-form-item>
            </el-col>  
          </el-row>
        </el-form>
        <div style="margin-left:60%;">
          <el-button @click="dialogFormVisibleBL = false">取 消</el-button>
          <el-button type="primary" @click="subimitSupplementProcessFunction('supplementProcessForm')">确 定</el-button>
        </div>

      </div>
    </el-dialog>


    <!-- 编辑指定验收弹框 -->
    <el-dialog :visible.sync="appointCheckDialogFormVisible" title="指定验收计划" width="40%">
      <!-- 设置验收或者自检人弹框 -->
      <el-dialog :visible.sync="setCheckPersonDialogFormVisible" width="50%" :title="title" :append-to-body="true">
        <div class="topBar">
          <span>姓名:</span>
          <el-input style="width: 150px;" v-model="pageForm.realname" placeholder="请输入内容" size="small"/>
          <span>职务:</span>
          <el-input style="width: 150px;" v-model="pageForm.position" placeholder="请输入内容" size="small"/>
          <div class="rl">
            <el-button type="primary" size="small" class="pan-btn light-blue-btn" icon="el-icon-search"
                       @click="selectCheckPerson(currentSelectedState)">查询
            </el-button>
            <el-button type="primary" size="small" class="pan-btn light-blue-btn" icon="el-icon-refresh"
                       @click="reset()">重置
            </el-button>
          </div>
        </div>
        <el-table border :data="checkPersonData" class="textList" height="45vh">
          <el-table-column fixed="left" label width="80">
            <template slot-scope="scope">
              <input type="radio" name="Fruit" @click="listenCheck(scope, $event)">
            </template>
          </el-table-column>
          <el-table-column property="username" label="姓名"/>
          <el-table-column property="zhiwei" label="职务"/>
          <el-table-column property="mobilePhone" label="电话"/>
        </el-table>
        <!-- 分页 --->
        <el-pagination :page-sizes="[10,20,30]" :page-size="10" :total="pageForm.total"
                       :current-page.sync="pageForm.pageNo" background layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange" @current-change="selectCheckPerson(currentSelectedState)"/>

        <div style="margin-left:70%">
          <el-button class="btnSizes" @click="setCheckPersonDialogFormVisible = false">取 消</el-button>
          <el-button class="btnSizes" type="primary" @click="comfirmSelectedPerson()">确 定</el-button>
        </div>
      </el-dialog>

      <el-form ref="apponitCheckFrom" :model="apponitCheckFrom" :rules="apponitCheckFromRules" label-width="120px">
        <!-- prop="planSelfCheckPerson" -->
        <el-form-item label="自检人" >
          <el-input :readonly="true" v-model="apponitCheckFrom.planSelfCheckPersonName"  style="width:80%" size="small">
            <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('construction')"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="自检时间"  prop="planSelfCheckTime">
          <el-date-picker :clearable="false" :editable="false" v-model="apponitCheckFrom.planSelfCheckTime" type="date"
                          placeholder="选择日期"
                          style="width:80%" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                          :picker-options="startTime"  size="small"/>
        </el-form-item>
        <!-- prop="planCheckPerson" -->
        <el-form-item label="验收人">
          <el-input :readonly="true" v-model="apponitCheckFrom.planCheckPersonName"  style="width:80%" size="small">
            <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('supervisor')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="验收时间" prop="planCheckTime">
          <el-date-picker :clearable="false" :editable="false" v-model="apponitCheckFrom.planCheckTime" type="date"
                          placeholder="选择日期"
                          style="width:80%" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="endTime"
          size="small" />
        </el-form-item>
      </el-form>
      <div style="margin-left:60%;">
        <el-button @click="appointCheckDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCheckPlan('apponitCheckFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看弹框 -->
    <el-dialog :visible.sync="dialogTableVisible" title="查看详情" fullscreen>
      <processCheck :real-list="chakanData" :processInfoId="processInfoId"/>
    </el-dialog>

    <!-- 自动回复(自检) -->
     <el-dialog :visible.sync="dialogSelfRemark" title="自动回复">
        <remark @setRemark="getRemarkSelf" @cancel="dialogSelfRemark=false" :type="'selfcheck'"></remark>
    </el-dialog>
   <!-- 验收 -->
      <el-dialog :visible.sync="dialogPlanRemark" title="自动回复">
        <remark @setRemark="getRemarkPlan" @cancel="dialogPlanRemark=false" :type="'realcheck'"></remark>
    </el-dialog> 
  </div>
</template>

<script>
  import imgList from './components/imgList'
  import request from '@/utils/request'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import processCheck from '@/views/process/components/processCheck'
  import { getToken } from '@/utils/auth'
  import remark from "@/components/remark"
  export default {
    inject: ['reload'],
    components: {
      SelectTree,
      imgList,
      processCheck,
      remark
    },
    data() {
      const validateSeq = (rule, value, callback) => {
        const reg = /^(10|[1-9])$/ // 验收次数限制
        if (!reg.test(value)) {
          callback(new Error('验收次数只能1到10'))
        } else {
          callback()
        }

      }
      return {
        startTime: {//结束时间不能大于开始时间
          disabledDate: (time) => {
            if (this.apponitCheckFrom.planCheckTime) {
              return time.getTime() > new Date(this.apponitCheckFrom.planCheckTime).getTime()

            } else {//还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
              return time.getTime() < Date.now() - 8.64e7
            }

          }
        },
        endTime: {
          disabledDate: (time) => {
            if (this.apponitCheckFrom.planSelfCheckTime) {
              return time.getTime() < new Date(this.apponitCheckFrom.planSelfCheckTime).getTime() - 1 * 24 * 60 * 60 * 1000//可以选择同一天

            }
          }
        },
        title:'选择验收人',
        remarkType:'',
        userGroupDefaultProps: {   // 组织机构树显示
          children: 'children',
          label: 'name'
        },
        projectItemDefaultProps: {  // 工程分项树显示
          children: 'children',
          label: 'projectItem'
        },
        userGroupTree: [], // 组织机构树
        projectItemTree: [], // 分部分项树
        projectItemOptions: [], // 分部分项树
        dialogSelfRemark:false,
        dialogPlanRemark:false,
        addProcessBtn: false,
        isShowProjectItem: false, // 默认工程分部分项不显示
        userGroupOption: [], // 组织机构树
        userGroupOptionBL: [], // 组织机构树
        defaultProjectItemProps: {   //工程分部分项
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        },
        defaultProjectItemPropsBL: {   //工程分部分项
          children: 'id',
          label: 'projectItem',
          isLeaf: 'leaf'
        },
        processMDictOption: [],  // 新增工序类型下拉框
        processSDictOption: [],  // 新增工序下拉框
        projectItemId: '',  //工程分部分项id
        userGroupId: '',  //从下拉列表中选中的usergroupid
        userGroupIdBL: '',  //从下拉列表中选中的usergroupid
        selectedUserGroup: '',  //选中的用户组织机构
        selectedUserGroupBL: '',  //选中的用户组织机构
        tableData: [],  // 操作列表table值
        chakanData: {},  // 查看弹框列表值
        processInfoId: '',  //当前操作的工序id
        checkPersonData: [],
        treeFrom: {
          projectItem: '',  // 工程名称
          id: '',
          startStation: '',  // 桩号
          endStation: '',  // 桩号
          projectCode: '',  // 编码
          projectType: '',  // 工程类型
          state1: ''  // 上面状态值
        },
        codeid:'',
        // 图片详情弹框数据
        imgForm: {
          describe: '',
          createTime: '',
          lat: '',
          lgt: '',
          photoDescribe: '',
          photoLocation: '',
          state: ''
        },
        checkNum: 1,  // 添加工序次数
        seq: 1,  //工序顺序号
        form: {
          remark: '',  // 添加工序备注
          processMDictId: '',   //工序类型名称
          processSDictId: ''   //工序名称
        },
        // 新增校验
        acceptRule: {
          processMDictId: [{ required: true, message: '请选择工序类型', trigger: 'blur' }],
          processSDictId: [{ required: true, message: '请选择工序', trigger: 'blur' }],
          remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
        },
        // 指定验收校验

        apponitCheckFromRules: {
          planCheckPerson: [{ required: true, trigger: 'blur', message: '请选择监理验收人' }],
          planCheckTime: [{ required: true, trigger: 'blur', message: '请选择监理验收时间' }],
          planSelfCheckPerson: [{ required: true, trigger: 'blur', message: '请选择施工单位自检人' }],
          planSelfCheckTime: [{ required: true, trigger: 'blur', message: '请选择施工单位自检时间' }]
        },
        
        apponitCheckFrom: {   //指定验收提交内容
          planCheckPerson: '',   // 监理验收人id
          planCheckPersonName: '',   //监理验收人名称
          planCheckTime: '',   //监理验收时间
          planSelfCheckPerson: '',  //施工自检人id
          planSelfCheckPersonName: '',  //施工自检人名称
          planSelfCheckTime: '',  // 施工自检时间
          processId: ''  // 工序Id
        },
        pageForm: {
          pageNo: 1,  // 当前页
          pageSize: 10,  // 每页条数
          total: 0,  // 总条数
          realname: '',  // 姓名值
          position: ''   // 职位
        },
        querydata: {   //指定工序列表
          projectItemId: '',
          pageNo: 1,
          pageSize: 10,
          total: 0   //总条数
        },
        dialogFormVisible: false,   // 添加工序弹框
        dialogFormVisibleBL: false,   // 添加工序弹框
        appointCheckDialogFormVisible: false,  // 编辑指定验收弹框
        setCheckPersonDialogFormVisible: false,   //设置验收人弹框
        currentSelectedState: '',  //用户当前选择的是施工单位还是监理
        dialogTableVisible: false,  // 查看弹框
        even: null,  // 单选框选中
        imgId: '',
        checkType: '',
        orgId: '',
        departname: '',
        projectItem: '',
        leakRepairProcessUrl: process.env.BASE_API + '/rest/processCheck/processAddImage',  //补录工序url
        headers: {
          'X-AUTH-TOKEN': getToken()
        },
        leakRepairUploadForm: new FormData(),   // 一个formdata
        formData: {   //补录工序form
          userGroupId: '',  //组织机构id
          processDictId: '',  //工序id
          projectItemId: '',  //分部分项id
          planSelfCheckTime: '',
          SelfCheckTime: '',
          planCheckTime: '',
          CheckTime: '',
          planSelfCheckPersonName: '',
          planCheckPersonName: '',
          planSelfCheckPerson: '',
          planCheckPerson: '',
          selfCheckDescribe: '',
          checkDescribe: '',
          remark: '',
          filesSelfCheckUrl: '',  //自检文件预览
          filesCheckUrl: ''  //验收文件预览
        },
        supplementProcessRules: {
          userGroupId: [{ required: true, trigger: 'change', message: '请选择组织机构' }],
          projectItemId: [{ required: true, trigger: 'change', message: '请选择分部分项' }],
          processDictId: [{ required: true, trigger: 'change', message: '请选择工序' }],
          planSelfCheckTime: [{ required: true, trigger: 'change', message: '请选择计划自检时间' }],
          planCheckTime: [{ required: true, trigger: 'change', message: '请选择计划验收时间' }],
          SelfCheckTime: [{ required: true, trigger: 'change', message: '请选择实际自检时间' }],
          CheckTime: [{ required: true, trigger: 'change', message: '请选择实际验收时间' }],
          planSelfCheckPersonName: [{ required: true, trigger: 'change', message: '请选择施工单位自检人' }],
          planCheckPersonName: [{ required: true, trigger: 'change', message: '请选择监理验收人' }],
          selfCheckDescribe: [{ required: true, trigger: 'change', message: '请输入自检描述' }],
          checkDescribe: [{ required: true, trigger: 'change', message: '请输入验收描述' }],
          remark:[{ required: true, trigger: 'change', message: '请填写备注'}]
        },
       

        dialogVisibleSelf: false,  //自检图片预览
        dialogVisibleCheck: false,   //验收图片预览
        supplementProcessId: '',  //补录数据最后返回的id
        filesSelfCheckParamData: {
          state: '0',
          processId: ''
        },
        filesCheckParamData: {
          state: '1',
          processId: ''
        },
        overProcessBtn: false,
        leftTopDetils: false,
        iscomplete: ''
      }
    },
    watch:{
        dialogFormVisibleBL: function (val,oldVla) {
                    if (this.$refs['supplementProcessForm'] != undefined) {
                        this.$refs["supplementProcessForm"].resetFields();
                    }
                },
        appointCheckDialogFormVisible:function(val,oldVla){
               if (this.$refs['apponitCheckFrom'] != undefined) {
                        this.$refs["apponitCheckFrom"].resetFields();
                 }
        },   
         dialogFormVisible:function(val,oldVla){
               if (this.$refs['addProcessForm'] != undefined) {
                        this.$refs["addProcessForm"].resetFields();
                 }
        },             
      },

    mounted() {
      this.initUserGroup();
    },
    created() {
      let nowUserId = localStorage.getItem('userId')
      request.post('/rest/sysuser/chakan', { id: nowUserId }).then(res => {
        let data = res.data.data.departid
        this.userGroupOnChange(data)
        this.userGroupId = res.data.data.departName;

      })
    },
    methods: {
      initUserGroup() {  //初始化组织机构树
        request.post('/rest/processCheck/groupEqualRank').then(res => {
          this.userGroupOption = res.data.data
        })

      },
      initProcessByTypeId(codeid) {   // 初始化新增工序通过工序类型id
        this.processSDictOption = []  //先清空
        this.processSDictOption.unshift({ process: '全部' })
        request.post('/rest/processCheck/numberSdData', { codeid:codeid }).then(res => {
          this.processSDictOption = res.data.data
        })
      },
      userGroupOnChange(data) {
        //选择标段改动
        this.selectedUserGroup = data  //选中的用户
        request.post('/rest/projectItemInfo/getProjectBQItemById', { userGroupId: data, pId: '0' }).then(res => {
          this.projectItemTree = res.data.data
        })
        this.isShowProjectItem = true
      },
      loadNextNode(node, resolve) {  //异步获取下一级节点数据
        if (node.level > 0) {
          request.post('/rest/projectItemInfo/getProjectBQItemById', {
            userGroupId: this.selectedUserGroup,
            pId: node.data.id,
            iskey: '1'
          }).then(res => {
            resolve(res.data.data)
          })
        }
      },
      showSelectedProjectItemInfo(itemId) { // 点击树节点展示右边详情接口
        request.post('/rest/projectItemInfo/getProjectItemById/' + itemId).then(res => {
          this.projectItem = res.data.data.projectItem
          this.departname = res.data.data.departname
          this.treeFrom = res.data.data;
          this.iscomplete = res.data.data.iscomplete
          this.treeFrom.state1 = res.data.data.state1 === '1' ? '已指定验收' : '未指定验收'
        })
      },
      loadAppointProcessList() {   //加载指定工序列表
        request.post('/rest/processCheck/getProject_ProcessPage', this.querydata).then(res => {
          this.querydata.total = res.data.data.totalCount
          this.tableData = res.data.data.data
        })
      },
      handleAppointProcessSizeChange(val) {   //分页时使用
        this.querydata.pageSize = val
        this.loadAppointProcessList()
      },
      handleNodeClick(data) {
        this.projectItemId = ''
        //展示选中的分部分项
        this.codeid = data.id
        this.showSelectedProjectItemInfo(data.id)
        this.projectItemId = data.id;
        if (data.id.split('_')[1].length == 18) {
          this.addProcessBtn = true
        } else {
          this.addProcessBtn = false
        }
        this.querydata.projectItemId = data.id
        this.formData.projectItemId = data.id
        this.overState(data.id);
        this.loadAppointProcessList()
      },
      addProcess() {   // 新增弹框获取input框数据
        this.dialogFormVisible = true
        this.checkNum = 1
        this.seq = 1
        this.form = {
          remark: '',  // 添加工序备注
          processMDictId: '',   //工序类型名称
          processSDictId: ''   //工序名称
        } //清空
        this.initProcessByTypeId(this.treeFrom.id)
        this.showSelectedProjectItemInfo(this.treeFrom.id)
      },
       backupProcess() {   //补录工序
        this.dialogFormVisibleBL = true;
        this.initProcessByTypeId(this.treeFrom.id);
        // this.clearUploadedImage();
        this.formData = {}; //清空
      },
      addProcessFunction(formName) {  // 新增工序
        const fromData = {
          userGroupId: this.userGroupId,
          processDictId: this.form.processSDictId,
          projectItemId: this.projectItemId,
          remark: this.form.remark,
          checkNum: this.checkNum,
          seq: this.seq
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/rest/processCheck/addProcess', fromData).then(res => {
              if (res.data.ok) {
                this.$message({
                  message: '恭喜你，新增成功',
                  type: 'success'
                })
                this.loadAppointProcessList()
                this.dialogFormVisible = false
              }
            })
          }
        })
      },
      appointCheckPlan(data) {   // 编辑指定验收弹框
        this.appointCheckDialogFormVisible = true
        this.apponitCheckFrom.processId = data.id;
        if (data.state1 == '1') {
          request.post('/rest/processCheck/searchProcessCheckPersons', { processId: data.id }).then(res => { 
           this.apponitCheckFrom.planSelfCheckPersonName = res.data.data.selfCheckUser;
           this.apponitCheckFrom.planSelfCheckPerson = res.data.data.planSelfCheckPerson;
           this.apponitCheckFrom.planCheckPersonName = res.data.data.checkUser;
           this.apponitCheckFrom.planCheckPerson = res.data.data.planCheckPerson;
           this.apponitCheckFrom.planSelfCheckTime = res.data.data.planSelfCheckTime;
           this.apponitCheckFrom.planCheckTime = res.data.data.planCheckTime;
          })
        }
      },
      selectCheckPerson(type) {  // 验收人弹框数据
        let that = this
        this.setCheckPersonDialogFormVisible = true
        this.checkPersonData = []
        if (type === 'supervisor') {   //监理
          this.title = "选择验收人"
          this.currentSelectedState = 'supervisor'
          request.get('/rest/organizate/depart/' + this.userGroupId).then(res => {
            request.post('/rest/processCheck/notDeletedUser', {
              pageNo: that.pageForm.pageNo,
              pageSize: that.pageForm.pageSize,
              userGroupId: res.data.data.parentdepartid,
              realname: that.pageForm.realname,
              position: that.pageForm.position
            }).then(res => {
              that.pageForm.total = res.data.data.totalCount
              that.checkPersonData = res.data.data.data
            })
          })
        } else if (type === 'construction') {  //施工
          this.title = "选择自检人"
          this.currentSelectedState = 'construction'
          request.post('/rest/processCheck/notDeletedUser', {
            pageNo: this.pageForm.pageNo, pageSize: this.pageForm.pageSize,
            userGroupId: this.selectedUserGroup, realname: this.pageForm.realname, position: this.pageForm.position
          }).then(res => {
            this.pageForm.total = res.data.data.totalCount
            this.checkPersonData = res.data.data.data
          })
        }
      },
      // 监听总条数
      handleSizeChange(val) {
        this.pageForm.pageSize = val;
        this.selectCheckPerson(this.currentSelectedState);
      },
      listenCheck(data, e) {  // 监听验收人单选框
        this.even = e
        if (this.currentSelectedState === 'supervisor') {
          this.apponitCheckFrom.planCheckPersonName = data.row.username;
          this.apponitCheckFrom.planCheckPerson = data.row.id;
          this.formData.planCheckPersonName = data.row.username;
          this.formData.planCheckPerson = data.row.id;
        } else if (this.currentSelectedState === 'construction') {
          
          this.apponitCheckFrom.planSelfCheckPersonName = data.row.username;
          this.apponitCheckFrom.planSelfCheckPerson = data.row.id;
          this.formData.planSelfCheckPersonName = data.row.username
          this.formData.planSelfCheckPerson = data.row.id
        }
      },
      // 选择验收人显示表框中
      comfirmSelectedPerson() {
        if (this.even == null) {
          this.setCheckPersonDialogFormVisible = false
          return false
        }
        this.even.target.checked = false  //选中状态取消
        this.setCheckPersonDialogFormVisible = false
        this.pageForm.realname = ''
        this.pageForm.position = ''
      },
      // 编辑指定验收接口
      submitCheckPlan(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/rest/processCheck/appointProcessCheckPersons', this.apponitCheckFrom
             ).then(res => {
               console.log(res.data)
               if(res.data.ok){
                 this.$message({
                    message: '指定验收计划成功',
                    type: 'success'
                  })
                  this.appointCheckDialogFormVisible = false
                  this.loadAppointProcessList()
               }
            })
          } else {
            return false
          }
        })
      },
      // 删除接口
      deleteMainProcess(data) {
        this.$confirm('此操作将永久删除该工序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/rest/processCheck/delete/' + data.row.id).then(res => {
            if (res.data.ok) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadAppointProcessList()
            }
          })
        })
      },
      handleClick(row) {  // 查看接口
        this.dialogTableVisible = true
        this.processInfoId = row.id
        request.post('/rest/processCheck/getProcessDetail', { id: row.id }).then(res => {
          this.chakanData = res.data.data
        })
      },
      // 重置按钮
      reset() {
        this.pageForm.realname = '';
        this.pageForm.position = '';
        this.selectCheckPerson(this.currentSelectedState);
      },
     // 自动回复备注(自检)
     checkSelf(){
         this.dialogSelfRemark = true;
     },
     // 验收（回复）
     checkPlan(){
         this.dialogPlanRemark = true;
     },
     getRemarkSelf(data){
         this.formData.selfCheckDescribe = data;
         
     },
     getRemarkPlan(data){
          this.formData.checkDescribe = data;
     },
      selfBeforeUplad(file) {  //自检图片上传之前
        this.leakRepairUploadForm.append('files[]', file)
      },
      checkBeforeUplad(file) {  //验收图片上传之前
        this.leakRepairUploadForm.append('files[]', file)
      },
     
      subimitSupplementProcessFunction(form) {  //补录工序
        this.formData.userGroupId = this.userGroupId
        this.formData.projectItemId = this.projectItemId
        this.$refs[form].validate((valid) => {
          if (valid) {
            request.post('/rest/processCheck/leakRepair', this.formData).then(res => {
              if (res.data) {
                this.filesCheckParamData.processId = res.data.data
                this.filesSelfCheckParamData.processId = res.data.data
                this.planSelfCheckPerson = this.formData.planSelfCheckPerson
                this.planCheckPerson = this.formData.planCheckPerson
                this.$refs.uploadSelf.submit()
                this.$refs.uploadCheck.submit()
                this.loadAppointProcessList()
                this.dialogFormVisibleBL = false
                this.clearUploadedImage()

              }
            })
          }
        })
      },
      clearUploadedImage() {
        this.$refs.uploadSelf.clearFiles()
        this.$refs.uploadCheck.clearFiles()
      },
      overState(codeid) {  // 查看状态
        let that = this
        request.post('/rest/processCheck/processComplete', { codeid: codeid }).then(res => {
          if (res.data.ok) {
            request.post('/rest/projectItemInfo/getProjectItemById/' + codeid).then(ress => {
              if (ress.data.ok) {
                if (res.data.data.complete && ress.data.data.iscomplete == '0') {
                  that.overProcessBtn = true
                  that.addProcessBtn = true
                  that.leftTopDetils = true
                } else if (res.data.data.complete && ress.data.data.iscomplete == '1') {
                  that.overProcessBtn = false
                  that.addProcessBtn = false
                  that.leftTopDetils = true
                } 
                else if (!res.data.data.complete && ress.data.data.iscomplete == '0') {
                  that.overProcessBtn = false
                  //that.addProcessBtn = true
                  that.leftTopDetils = true
                }
              } else if (res.data.data = null || res.data.data == '') {
                that.overProcessBtn = true
                that.leftTopDetils = true

              } else {
                that.leftTopDetils = true
              }

            })

          }
        })
      },
      overProcess() {
        this.$confirm('此操作将完成该工序,完成后将无法新增和补录工序!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.post('/rest/processCheck/itemComplete', { codeid: this.codeid }).then(res => {
            if (res.data.data != 'false') {
              this.overProcessBtn = false
              this.addProcessBtn = false
            }

          })
        })

      }

    }
  }
</script>

<style lang="scss" scoped>
  .dwmc {
    margin-left: 170px;
    font-weight: 900;
  }

  .fz {
    margin-left: 198px;
    font-weight: 900;
  }

  .el-dialog {
    overflow: hidden;
  }

  .el-dialog .el-dialog__body {
    overflow: auto;
  }


  .acceptLayout {
    max-height: 100vh;
    padding: 10px;


  /deep/ .select-tree .el-input.el-input--suffix {
     width: 19vw;
  }

  /deep/ .el-popper {
     width: 19vw;
  }
/deep/.topBar .el-input {
    width: 19vw;
    margin-right: 0.8vw;
    margin-bottom: 10px;
}
  .ysr {
    margin-left: 100px;
    color: blue;
    font-size: 18px;
    cursor: pointer;
  }

  .ysrs {
    margin-left: -5px;
    color: blue;
    font-size: 18px;
    cursor: pointer;
  }

  .ysr:hover {
    color: red;
  }

  .section {
    float: left;
    width: 29%;
  }

  .particularsList {
    float: left;
    width: 71%;
    height: 75vh;

  .particulars {
    height: 10vh;
    border: 1px solid #DCDFE6;
    border-radius: 10px;

 

  }
   .btnDiv {
     .el-button{
        margin: 0 5px;
     }
  }
  .Cztab {
    margin-top: 10px;
    height: 73vh;
    overflow: hidden;

  .paging {
    padding-top: 2vh;
    padding-left: 12vw;
  }

  }
  }
  }
  /* .btnSizes {
     font-size: 0.8vw !important;
     padding: 0.8vw !important;
   }
 */
  .navBar {
    display: flex;
    justify-content: space-between;
  }

  /deep/ .el-button + .el-button {
    margin-left: 0;
  }

  

  .blgx {
    height: 60vh;
    padding: 0 20px;
    overflow: auto;
  }

  .dialog-footer {
    text-align: right;
    margin-right: 10px;
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
/deep/.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    margin-top: 10px;
}

</style>
