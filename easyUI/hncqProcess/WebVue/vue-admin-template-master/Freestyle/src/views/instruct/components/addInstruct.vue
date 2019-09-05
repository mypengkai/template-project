<template>
  <div class="addInstrucet">
    <el-form :model="form" ref="form" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织机构：" prop="departname">
            <el-select
              style="width:16vw"
              v-model="form.departname"
              placeholder="请选择"
              @change="userGroupOnChange"
              size="small"
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
          <el-form-item style="width:25vw" label="分部分项：" prop="projectItemId">
            <select-tree
              clearable
              :options="projectItemTree"
              ref="getSelectData"
              :props="projectItemDefaultProp"
              size="small"
              v-on:noDe="projectItemOnClick"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工序名称：" prop="process">
            <el-select
              style="width:16vw"
              v-model="form.process"
              placeholder="请选择工序"
              size="small"
            >
              <el-option
                v-for="item in processSDictOption"
                :key="item.id"
                :label="item.process"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="width:25vw" label="处理人：" prop="nowsendusername">
            <el-input
              v-model="form.nowsendusername"
              size="small"
              @focus="alertAcceptUserDialog()"
              clearable
              placeholder="请选择"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划复核时间：" prop="planCheckTime">
            <el-date-picker
              v-model="form.planCheckTime"
              type="date"
              placeholder="选择日期："
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划处理时间：" prop="planFinishTime">
            <el-date-picker
              v-model="form.planFinishTime"
              type="date"
              placeholder="选择日期："
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="width:52vw" label="指令内容：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片选择：">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="uploadUrl"
              name="files"
              :headers="headers"
              :limit="5"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :data="form"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="50%" :src="dialogImageUrl" alt="图片" />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
        <div class="tar" style=" right:10%;position: absolute;bottom: 10px;padding: 10px">
        <el-button  @click="close()">取 消</el-button>
        <el-button type="primary"  @click="_comfirm('form')">确 定</el-button>
      </div>
    </el-form>

     <!-- 接收人弹框 -->
    <el-dialog class="dialogBox" width="45%"  title="选择处理人" :visible.sync="acceptUserDialog" append-to-body>
      <div class="topBar">
        <span>组织机构:</span>
        <el-select v-model="receiveData.userGroupId" placeholder="请选择" @change="handleReceiveUserGroupCheckChange">
          <el-option v-for="item in userGroupTree" :key="item.id" :label="item.departname"
                     :value="item.id"></el-option>
        </el-select>
         <span>姓名:</span>
         <el-input v-model="receiveData.realname" placeholder="请输入姓名"></el-input>
         <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="query()"
          >查询</el-button>
      </div>
      <el-table border :data="receiveUsersList" highlight-current-row height="50vh"
                @current-change="handleCurrentChange">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="zhiwei" label="职位"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话"></el-table-column>
      </el-table>

      <el-pagination background :current-page.sync="receiveData.pageNo" :page-sizes="[10,20,30]"
                     :page-size="receiveData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="receiveUserList()"
                     :total="total"></el-pagination>
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
    // props: ['nowItem'],
    props:{
        nowItem:{
            type:Object
        }
    },
    data() {
      return {
        formRules: {
          departname: [
            { required: true, message: '请选择组织机构', trigger: 'change' },
          ],
          projectItemId: [
            { required: true, message: '请选择分部分项', trigger: 'change' }
          ],
           process: [
            { required: true, message: '请选择工序', trigger: 'change' }
          ],
           nowsendusername: [
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
        uploadUrl: process.env.BASE_API + '/rest/command/addCommand',  // 新增
        // uploadUrlReturn: process.env.BASE_API + '/rest/command/returnCommand',
        // uploadUrlSoonFinish: process.env.BASE_API + '/rest/command/soonFinishCommand',
        // uploadUrlFinish: process.env.BASE_API + '/rest/command/finishCommand',
        // uploadUrlModify: process.env.BASE_API + '/rest/command/modifyCommand', // 修改
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
//        commandType: ""
// commandUsers: Array(2)
// commanduserId: "f6323b406cfee208016cff46901c003b"
// createTime: "2019-09-05 10:35:10"
// departname: "常祁1标"
// id: "f6323b406cfee208016cff469017003a"
// infologid: "f6323b406cfee208016cff469032003d"
// nowsendusername: "彭凯"
// planTime: "2019-09-05"
// process: "锚杆01"
// projectItem: "路基工程(K38+300-K51+975)->左侧路基防护工程(K38+300-K39+665)->->锚杆(锚索)防护"
// projectid: "030001003001_TJ01J01F01ZV01QG01"
// realname: "上海同望"
// remark: "dsds "
// sponsor: "f6323b406a9f7435016a9f89840b0014"
// state: "-1"
// userGroupId: "030001003001"

        form: {
          remark: '', // 指令内容
          userGroupId: '', // 组织机构id
          departname: '',   //组织机构名称
          processDictId: '', // 工序字典的工序id 非必传
          process:'',        // 工序名称
          projectItemId: '', // 分部分项id
          projectItem: '',  //分部分项名称
          ReceiveUserid: '', // 接收人id
          nowsendusername:'', // 接收人名称
          planCheckTime: '', // 计划检查时间
          commandType: '', // 指令类型
          batchNo: '',
          patrolId: '',  //巡视id
          planFinishTime: '',  //计划完成时间
          commandid:'',  // 指令id
        }, //表单校验规则
        // rulesform: {
        //   transpondName: {
        //     required: true,
        //     message: '请选择指定人',
        //     trigger: 'blur'
        //   }
        // },
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
    mounted(){
        if(this.nowItem==''){
            this.uploadUrl =  process.env.BASE_API + '/rest/command/addCommand'
        }else {
            this.form = this.nowItem;
            this.form.planCheckTime = this.nowItem.createTime;
            this.form.planFinishTime = this.nowItem.planTime;
            this.$refs.getSelectData.placeholder=this.nowItem.projectItem;
            this.form.projectItemId = this.nowItem.projectid;
            this.form.commandid = this.nowItem.id;
            this.uploadUrl =  process.env.BASE_API + '/rest/command/modifyCommand'
        }
    },
    created() {
      this.initUserGroupTree();
      this.receiveUserList();
      this.form.batchNo = this.createUUID()  //生成批处理id
      console.log(this.nowItem,"nowItem")
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

        //   this.$refs.getSelectData.labelModel = ''
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
        this.receiveUserList();
      },
      _comfirm(form) {  //提交
           this.$refs[form].validate((valid) => {
            if (valid) {
                this.$refs.upload.submit();
                this.$emit('cancel')
                this.reload()
                
            } else {
              console.log('error submit!!');
              return false;
            }
          });
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
      returnCommand(returnForm) {  // 退回指令
        this.$refs[returnForm].validate((valid) => {
          if (valid) {
            this.$refs.uploadReturn.submit()
            this.$emit('cancel')
            this.reset()
          } else {
            console.log('error submit!!');
            return false;
          }
        });


        // this.$refs.uploadReturn.submit()
        // this.$emit('cancel')
        // this.reset()
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
          console.log(val)
        // if (this.dialogState === 'receive') {
          this.form.ReceiveUserid = val.id // 新增传接收人id
          //this.modifyForm.ReceiveUserid = val.id // 新增传接收人id
          this.form.nowsendusername = val.username // 新增接收人id名回填
          //this.modifyForm.nowsendusername = val.username // 新增接收人id名回填
        // } else if (this.dialogState === 'transpond') {
        //   this.transpondForm.zhidingren = val.id // 新增传接收人id
        //   this.modifyForm.zhidingren = val.id // 新增传接收人id
        //   this.transpondForm.transpondName = val.username // 新增接收人id名回填
        //   this.modifyForm.transpondName = val.username // 新增接收人id名回填
        // }
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
  .addInstrucet {
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

</style>
