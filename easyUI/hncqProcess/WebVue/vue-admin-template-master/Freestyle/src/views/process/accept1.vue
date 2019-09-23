<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <div class="topBar">
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
            <div style="height:66vh;overflow-y:auto;border:1px solid #ccc; width:19vw;border-radius: 5px">
              <el-tree :data="projectItemTree" :props="defaultProjectItemProps" lazy :load="loadNextNode"
                       highlight-current @node-click="handleNodeClick"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 右边详情列表    -->
    <div v-if="treeFrom.projectItem!='' && treeFrom.projectItem!=undefined" class="particularsList">
      <div class="particulars brotherBar">
        <div style="left: 2vw;top:.7vw">
          <span>分部分项: {{treeFrom.projectItem }}</span>
        </div>
        <!--  <div style="left: 15vw;top:.7vw">
            <span>工程类型: {{ treeFrom.projectType }}</span>
          </div>-->
        <div style="right: 16vw;top:.7vw">
          <span>编码: {{ treeFrom.id.split('_')[1] }}</span>
        </div>
        <div style="right: 0.5vw;top:.7vw">
          <!--          <span>桩号: {{ treeFrom.zhuanghao=='null_null'? '' : treeFrom.zhuanghao }}</span>-->
          <span>桩号: {{ treeFrom.startStation}}-{{treeFrom.endStation }}</span>
        </div>
        <div class="btnDiv" style="right: 1vw;bottom: 1vh">
          <!--          v-if="projectItemId!==''"-->
          <el-button v-if="addProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn" @click="addProcess()">添加工序
          </el-button>
          <el-button v-if="addProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn"
                     @click="backupProcess()">补录工序
          </el-button>
          <el-button v-if="overProcessBtn" type="primary" icon="el-icon-circle-plus-outline"
                     class="pan-btn light-blue-btn"
                     @click="overProcess()">完成工序
          </el-button>
        </div>
      </div>
      <!-- 操作列表 -->
      <div v-if="true" class="Cztab">
        <el-table border :data="tableData" height="68vh" class="textList">
          <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
          <el-table-column prop="processName" label="工序名称" align="center"/>
          <el-table-column prop="planSelfCheckTime" label="自检时间" align="center"/>
          <el-table-column prop="planCheckTime" label="验收时间" align="center"/>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.adopt===null || scope.row.adopt==='' || scope.row.adopt===undefined">
                <template v-if="scope.row.state2===0">已指定工序,待指定计划</template>
                <template v-else-if="scope.row.state2===1">已指定计划,待自检</template>
                <template v-else-if="scope.row.state2===2">已自检,待验收</template>
              </template>
              <template v-else>
                <template v-if="scope.row.state2===2 && scope.row.adopt==='0'">不通过,待自检</template>
                <template v-else-if="scope.row.state2===3 && scope.row.adopt==='1'">已验收,通过</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <!-- 指定验收 -->
              <el-tooltip v-if="scope.row.state2===0" class="item" effect="dark" content="指定验收计划" placement="top">
                <el-button :id="scope.$index" type="warning" size="small" icon="el-icon-edit" circle
                           @click="appointCheckPlan(scope)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.state2===1" class="item" effect="dark" content="修改验收计划" placement="top">
                <el-button :id="scope.$index" type="warning" size="small" icon="el-icon-edit" circle
                           @click="appointCheckPlan(scope)"/>
              </el-tooltip>
              <!-- 查看按钮 -->
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <el-button type="primary" size="small" icon="el-icon-search" circle @click="handleClick(scope.row)"/>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button v-ltx="'acceptDelete'" v-if="scope.row.state2===0" type="danger" icon="el-icon-delete" circle
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
        <!--   <el-form-item label="工序类型" prop="processMDictId">
             <el-select v-model="form.processMDictId" placeholder="请选择工序类型" @change="processTypeChangeProcess">
               <el-option v-for="item in processMDictOption" :key="item.id" :label="item.processType" :value="item.id"/>
             </el-select>
           </el-form-item>-->

        <el-form-item label="工序名称" prop="processSDictId">
          <el-select v-model="form.processSDictId" placeholder="请选择工序">
            <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="工序验收序号" prop="seq">
          <el-input-number v-model="seq" controls-position="right" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="工序验收次数" prop="checkNum">
          <el-input-number v-model="checkNum" controls-position="right" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :rows="4" v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProcessFunction('addProcessForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 补录工序弹框 -->
    <el-dialog :visible.sync="dialogFormVisibleBL" title="补录工序" width="60%" center>
      <el-form ref="addProcessForm" :model="formData" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构:">
              <!--              <el-select v-model="userGroupIdBL" placeholder="请选择" @change="userGroupOnChangeBL">-->
              <!--                <el-option v-for="item in userGroupOptionBL" :key="item.id" :label="item.departname"-->
              <!--                           :value="item.id"></el-option>-->
              <!--              </el-select>-->
              <el-input v-model="departname" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部分项:">

              <!--    <select-tree clearable :options="projectItemOptions" ref="getSelectData" :props="projectItemDefaultProps"
                               v-on:noDe="projectItemOnClick"/>-->
              <el-input v-model="projectItem" readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工序:" prop="processSDictId">
              <el-select v-model="formData.processDictId" placeholder="请选择工序">
                <el-option v-for="item in processSDictOption" :key="item.id" :label="item.process" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--  <el-form-item label="桩号:">
                <el-input v-model="treeFrom.startStation-treeFrom.endStation"/>

              </el-form-item>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起始桩号:">
              <el-input v-model="treeFrom.startStation" readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束桩号:">
              <el-input v-model="treeFrom.endStation" readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="false">
          <el-col :span="12">
            <el-form-item label="验收序号:" prop="seq">
              <el-input-number v-model="formData.seq" controls-position="right" :min="1" :max="100"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收次数:" prop="checkNum">
              <el-input-number v-model="formData.checkNum" controls-position="right" :min="1"
                               :max="100"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!--      <el-row>
                <el-col :span="12">
                  <el-form-item label="起始桩号:">
                    <el-input v-model="formData.startStation"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束桩号:">
                    <el-input v-model="formData.endStation"/>
                  </el-form-item>
                </el-col>
              </el-row>-->
        <!--     <el-row>
               <el-col :span="12">
                 <el-form-item label="计划自检人:" prop="planSelfCheckPerson">
                   <el-input  v-model="formData.planSelfCheckPerson" :readonly="true"
                             autocomplete="off"/>&nbsp;&nbsp;&nbsp;
                   <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('construction')"></el-button>
                   </el-input>

                 </el-form-item>
               </el-col>
               <el-col :span="12">
                 <el-form-item label="计划验收人:" prop="planSelfCheckPerson">
                   <el-input v-model="formData.planCheckPerson" :readonly="true" autocomplete="off"/>&nbsp;&nbsp;&nbsp;
                   <el-button slot="append" icon="el-icon-search" @click="selectCheckPerson('construction')"></el-button>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划自检时间:" prop="planTime">
              <el-date-picker v-model="formData.planSelfCheckTime" type="date" placeholder="选择日期:"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划验收时间:" prop="planTime">
              <el-date-picker v-model="formData.planCheckTime" type="date" placeholder="选择日期:"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="自检描述:">
              <el-input :rows="2" v-model="formData.selfCheckDescribe" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收描述:">
              <el-input :rows="2" v-model="formData.checkDescribe" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自检图片:">
              <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers"
                         list-type="picture-card"
                         :auto-upload="false" :on-preview="handlePictureSelf" :data="form">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisibleS">
                <img width="50%" :src="filesSelfCheck" alt="图片">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收图片:">
              <el-upload class="avatar-uploader" ref="upload" :action="uploadUrl" name="files" :headers="headers"
                         list-type="picture-card"
                         :auto-upload="false" :on-preview="handlePictureCheck" :data="form">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisibleC">
                <img width="50%" :src="filesCheck" alt="图片">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注:">
              <el-input :rows="2" v-model="formData.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <!--  <el-col :span="12">
              <el-form-item label="验收照片描述">
                <el-input :rows="2" v-model="formData.remark" type="textarea" placeholder="请输入内容"/>
              </el-form-item>
            </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleBL = false">取 消</el-button>
        <el-button type="primary" @click="addProcessFunction('addProcessForm')">确 定</el-button>
      </div>

    </el-dialog>


    <!-- 编辑指定验收弹框 -->
    <el-dialog :visible.sync="appointCheckDialogFormVisible" title="指定验收" width="35%">
      <!-- 设置验收或者自检人弹框 -->
      <el-dialog :visible.sync="setCheckPersonDialogFormVisible" width="50%" title="选中验收人" append-to-body>
        <div class="topBar">
          <span>姓名:</span>
          <el-input v-model="pageForm.realname" placeholder="请输入内容"/>
          <span>职务:</span>
          <el-input v-model="pageForm.position" placeholder="请输入内容"/>
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
                       :current-page.sync="pageForm.pageNo" background layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange" @current-change="selectCheckPerson(currentSelectedState)"/>

        <div slot="footer" class="dialog-footer">
          <el-button class="btnSizes" @click="setCheckPersonDialogFormVisible = false">取 消</el-button>
          <el-button class="btnSizes" type="primary" @click="comfirmSelectedPerson()">确 定</el-button>
        </div>
      </el-dialog>

      <el-form ref="apponitCheckFrom" :model="apponitCheckFrom" :rules="apponitCheckFromRules" label-width="125px">
        <el-form-item label="施工验收人" prop="planSelfCheckPerson">
          <el-input v-model="apponitCheckFrom.planSelfCheckPerson" :readonly="true" autocomplete="off"
                    style="width:50%"/>&nbsp;&nbsp;&nbsp;
          <span class="ysr" @click="selectCheckPerson('construction')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="施工验收时间" prop="planSelfCheckTime">
          <el-date-picker :editable="false" v-model="apponitCheckFrom.planSelfCheckTime" type="date" placeholder="选择日期"
                          style="width:50%" value-format="yyyy-MM-dd" format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="监理验收人" prop="planCheckPerson">
          <el-input v-model="apponitCheckFrom.planCheckPerson" :readonly="true" autocomplete="off" style="width:50%"/>&nbsp;&nbsp;&nbsp;
          <span class="ysr" @click="selectCheckPerson('supervisor')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="监理验收时间" prop="planCheckTime">
          <el-date-picker :editable="false" v-model="apponitCheckFrom.planCheckTime" type="date" placeholder="选择日期"
                          style="width:50%" value-format="yyyy-MM-dd" format="yyyy-MM-dd"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appointCheckDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCheckPlan('apponitCheckFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看弹框 -->
    <el-dialog :visible.sync="dialogTableVisible" title="查看详情" fullscreen>
      <processCheck :real-list="chakanData" :processInfoId="processInfoId"/>
    </el-dialog>
  </div>
</template>

<script>
  import imgList from './components/imgList'
  import request from '@/utils/request'
  // import SelectTree from '@/components/SelectTree/selectTree.vue'
  import SelectTree from '@/components/SelectTree/syncSelectTree.vue'
  import processCheck from '@/views/process/components/processCheck'
  import Organization from '@/api/Organization.js'

  export default {
    inject: ['reload'],
    components: {
      // SelectTree,
      SelectTree,
      imgList,
      processCheck
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
          // zhuanghao: '',  // 桩号
          startStation: '',  // 桩号
          endStation: '',  // 桩号
          projectCode: '',  // 编码
          projectType: '',  // 工程类型
          state1: ''  // 上面状态值
        },
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
          processMDictId: [{ required: true, message: '请选择工序类型', trigger: 'change' }],
          processSDictId: [{ required: true, message: '请选择工序', trigger: 'change' }]
          // remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
        },
        // 指定验收校验
        apponitCheckFromRules: {
          planCheckPersonId: [{ required: true, trigger: 'blur', message: '请选择监理验收人' }],
          planCheckTime: [{ required: true, trigger: 'change', message: '请选择监理验收时间' }],
          planSelfCheckPersonId: [{ required: true, trigger: 'blur', message: '请选择施工单位自检人' }],
          planSelfCheckTime: [{ required: true, trigger: 'change', message: '请选择施工单位自检时间' }]
        },
        apponitCheckFrom: {   //指定验收提交内容
          planCheckPerson: '',   // 监理验收人
          planCheckPersonId: '',   //监理验收人id
          planCheckTime: '',   //监理验收时间
          planSelfCheckPerson: '',  //施工自检人
          planSelfCheckPersonId: '',  //施工自检人id
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
        formData: {
          userGroupId: '',
          processDictId: '',
          projectItemId: '',
          planSelfCheckTime: '',
          planSelfCheckPerson: '',
          planCheckTime: '',
          planCheckPerson: '',
          selfCheckDescribe: '',
          checkDescribe: '',
          adopt: '',
          startStation: '',
          endStation: '',
          seq: 1,
          remark: '',
          checkType: '2',
          checkNum: 1,
          createTime: '',
          photoDescribe: '',
          filesSelfCheck: '',
          filesCheck: ''
        },
        dialogVisibleS: false,
        dialogVisibleC: false,
        overProcessBtn: false,
        iscomplete: ''

      }
    },
    created() {
    },
    mounted() {
      this.initUserGroup()
      this.initUserGroupBL()
      // this.itemComplete()
    },
    methods: {
      initUserGroupBL() {   // 初始化组织机构树
        Organization.userGroupSelect().then(res => {
          this.userGroupOptionBL = res.data.data
        })
      },
      userGroupOnChangeBL(data) {  // 组织机构下拉树
        this.orgId = data
        Organization.getProjectItemFromLayer({ userGroupId: data, pId: '0' }).then(res => {
          this.projectItemOptions = res.data.data
          this.$refs.getSelectData.labelModel = ''
        })
      },
      loadNextNode(node, resolve) {  //异步获取下一级节点数据
        if (node.level > 0) {
          Organization.getProjectItemFromLayer({ userGroupId: this.selectedUserGroup, pId: node.data.id }).then(res => {
            resolve(res.data.data)
          })
        }
      },

      projectItemOnClick(data) {  // 分部分项选择后的数据
        this.formData.projectItemId = data.id
      },

      initUserGroup() {  //初始化组织机构树
        request.post('/rest/processCheck/groupEqualRank').then(res => {
          this.userGroupOption = res.data.data
        })
      },
      initProcessTypeDict() {  // 初始化新增工序类型input框数据
        request.post('/rest/processType/getList').then(res => {
          this.processMDictOption = res.data.data.data
          console.log('processMD', this.processMDictOption)
          this.initProcessByTypeId(this.processMDictOption[0].id)
        })
      },
      initProcessByTypeId(codeid) {   // 初始化新增工序通过工序类型id
        this.processSDictOption = []  //先清空
        this.processSDictOption.unshift({ process: '全部' })
        request.post('/rest/processCheck/numberSdData', { codeid: codeid }).then(res => {
          this.processSDictOption = res.data.data
        })
      },
      userGroupOnChange(data) {   //选择标段改动
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
          this.treeFrom = res.data.data
          this.treeFrom.state1 = res.data.data.state1 === '1' ? '已指定验收' : '未指定验收'
          this.iscomplete = res.data.data.iscomplete
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
        this.overState(data.id)
        this.showSelectedProjectItemInfo(data.id)   //展示选中的分部分项
        this.projectItemId = data.id
        if (this.projectItemId.split('_')[1].length == 18) {
          this.addProcessBtn = true
        } else {
          this.addProcessBtn = false
        }
        this.querydata.projectItemId = data.id
        // this.itemComplete
        this.loadAppointProcessList()
        // }
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
        // this.initProcessTypeDict()
        this.initProcessByTypeId(this.treeFrom.id)
        this.showSelectedProjectItemInfo(this.treeFrom.id)
      },
      addProcessFunction(formName) {  // 新增工序
        const fromData = {
          userGroupId: this.userGroupId,
          // processMDictId: this.form.processMDictId,
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
        this.apponitCheckFrom = {}
        this.appointCheckDialogFormVisible = true
        this.apponitCheckFrom.processId = data.row.id
        if (data.row.state2 === '1') {
          request.post('/rest/processCheck/searchProcessCheckPersons', { processId: this.apponitCheckFrom.processId }).then(res => {
            this.apponitCheckFrom = res.data.data
          })
        }
      },
      selectCheckPerson(type) {  // 验收人弹框数据
        this.checkPersonData = []
        if (type === 'supervisor') {   //监理
          this.currentSelectedState = 'supervisor'
          request.post('/rest/processCheck/notDeletedUser', {
            pageNo: this.pageForm.pageNo,
            pageSize: this.pageForm.pageSize,
            userGroupId: this.selectedUserGroup.parentdepartid,
            realname: this.pageForm.realname,
            position: this.pageForm.position
          }).then(res => {
            this.pageForm.total = res.data.data.totalCount
            this.checkPersonData = res.data.data.data
          })
        } else if (type === 'construction') {  //施工
          this.currentSelectedState = 'construction'
          request.post('/rest/processCheck/notDeletedUser', {
            pageNo: this.pageForm.pageNo, pageSize: this.pageForm.pageSize,
            userGroupId: this.selectedUserGroup.id, realname: this.pageForm.realname, position: this.pageForm.position
          }).then(res => {
            this.pageForm.total = res.data.data.totalCount
            this.checkPersonData = res.data.data.data
          })
        }
        this.setCheckPersonDialogFormVisible = true
      },
      // 监听总条数
      handleSizeChange(val) {
        this.pageForm.pageSize = val
        this.selectCheckPerson(this.currentSelectedState)
      },
      listenCheck(data, e) {  // 监听验收人单选框
        this.even = e
        if (this.currentSelectedState === 'supervisor') {
          this.apponitCheckFrom.planCheckPerson = data.row.username
          this.apponitCheckFrom.planCheckPersonId = data.row.id
        } else if (this.currentSelectedState === 'construction') {
          this.apponitCheckFrom.planSelfCheckPerson = data.row.username
          this.apponitCheckFrom.planSelfCheckPersonId = data.row.id
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
      },
      // 编辑指定验收接口
      submitCheckPlan(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/rest/processCheck/appointProcessCheckPersons', {
              processId: this.apponitCheckFrom.processId,
              planSelfCheckTime: this.apponitCheckFrom.planSelfCheckTime,
              planSelfCheckPerson: this.apponitCheckFrom.planSelfCheckPersonId,
              planCheckTime: this.apponitCheckFrom.planCheckTime,
              planCheckPerson: this.apponitCheckFrom.planCheckPersonId
            }).then(res => {
              this.$message({
                message: '指定验收计划成功',
                type: 'success'
              })
              this.appointCheckDialogFormVisible = false
              this.loadAppointProcessList()
            })
          } else {
            return false
          }
        })
      },
      // 删除接口
      deleteMainProcess(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
        // this.reload()
        this.pageForm.realname = ''
        this.pageForm.position = ''

      },
      backupProcess() {   //补录工序
        this.dialogFormVisibleBL = true
        /*    this.checkNum = 1
            this.seq = 1*/
        this.formData = {} //清空
        // this.initProcessTypeDict()
        this.initProcessByTypeId(this.treeFrom.id)
      },
      handlePictureSelf(file) {
        this.dialogImageUrl = file.url
        this.dialogVisibleS = true
      },
      handlePictureCheck(file) {
        this.dialogImageUrl = file.url
        this.dialogVisibleC = true
      },
      overState(codeid) {  // 查看接口
        let that = this
        request.post('/rest/processCheck/processComplete', { codeid: codeid }).then(res => {
          if (res.data.data.complete && that.iscomplete == '0') {
            this.overProcessBtn = true
            this.addProcessBtn = true
          } else if (res.data.data.complete && that.iscomplete == '1') {
            this.overProcessBtn = false
            this.addProcessBtn = false
          } else if (!res.data.data.complete && that.iscomplete == '0') {
            this.overProcessBtn = false
            this.addProcessBtn = true
          }
        })
      },
      overProcess(codeid) {
        codeid = this.projectItemId
        request.post('/rest/processCheck/itemComplete', { codeid: codeid }).then(res => {
          if (res.data.data != 'false') {
            this.overProcessBtn = false
            this.addProcessBtn = false
          }

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


  .acceptLayout {
    max-height: 100vh;
    padding: 10px;

  /deep/ .select-tree .el-input.el-input--suffix {
    width: 19vw;
  }

  /deep/ .el-popper {
    width: 19vw;
  }

  .ysr {
    margin-left: 100px;
    color: blue;
    font-size: 18px;
    cursor: pointer;
  }

  .ysr:hover {
    color: red;
  }

  .section {
    float: left;
    width: 35%;
  }

  .particularsList {
    float: left;
    width: 65%;
    height: 75vh;

  .particulars {
    height: 10vh;
    border: 1px solid #ccc;
    border-radius: 10px;
    position: relative;

  .btnDiv {
    position: absolute;
    width: 35%;
    height: 4.5vh;
  }

  div {
    position: absolute;
    width: 30%;
    height: 4.5vh;
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
  .btnSizes {
    font-size: 0.8vw !important;
    padding: 0.8vw !important;
  }

  .navBar {
    display: flex;
    justify-content: space-between;
  }

  /deep/ .el-button + .el-button {
    margin-left: 0;
  }

  /deep/ .el-dialog__body .el-form .el-input__inner,
  /deep/ .el-dialog__body .el-form .el-textarea__inner,
  .el-input-number--mini,
  .el-input-number {
    width: 19vw;
  }
</style>
