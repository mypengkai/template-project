<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <div class="topBar">
        <span>组织机构：</span>
        <select-tree
          ref="userGroupSelectTree"
          :options="options"
          v-on:noDe="noDe"
          :props="defaultProp"
        />
      </div>

      <div class="topBar">
        <span>分部分项：</span>
        <select-tree :options="data" v-on:noDe="handleNodeClick" :props="defaultProps"/>
        <!-- <el-tree style="margin-left:74px;margin-top:-15px" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      </div>
    </div>
    <!-- 右边详情列表 -->
    <div class="particularsList" v-if="treeFrom.projectType!=''&&treeFrom.projectType!=undefined">
      <div class="particulars brotherBar">
        <div style="left: 2vw;">
          <span>工程名称: {{ treeFrom.projectItem }}</span>
        </div>
        <div style="left: 21vw;">
          <span>工程类型: {{ treeFrom.projectType }}</span>
        </div>
        <div style="right: 1vw;">
          <span>代码: {{ treeFrom.projectCode }}</span>
        </div>
        <div style="left: 2vw;bottom: 0">
          <span>桩号: {{ treeFrom.zhuanghao }}</span>
        </div>
        <div style="left: 21vw;bottom: 0">
          <span v-if="childrenId!=undefined&&childrenId!=''">状态: {{ treeFrom.state1 }}</span>
          <!-- <el-input v-model="" readonly="true" v-if="childrenId!=undefined&&childrenId!=''"></el-input> -->
        </div>
        <div style="right: 1vw;bottom: 1vh">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            class="pan-btn light-blue-btn"
            @click="addGx()"
            v-if="childrenId!=undefined&&childrenId!=''"
          >添加工序</el-button>
          <!-- <el-button type="primary" class="btnSize" icon="el-icon-plus" circle @click="addGx()" v-if="childrenId!=undefined&&childrenId!=''"></el-button> -->
        </div>
      </div>
      <!-- 操作列表 -->

      <div class="Cztab" v-if="childrenId!=undefined&&childrenId!=''" >
        <el-table :data="tableData" border >
          <!-- height="65vh" -->
          <el-table-column prop="processName" label="工序过程"></el-table-column>
          <el-table-column prop="planCheckTime" label="时间"></el-table-column>
          <el-table-column prop="state2" label="状态"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="200">
            <template slot-scope="scope">
              <!-- 指定验收 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="指定工序"
                placement="top"
                v-if="scope.row.state2=='指定工序'"
              >
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-star-off"
                  circle
                  :id="scope.$index"
                  @click="tjgx(scope)"
                ></el-button>
              </el-tooltip>

              <!-- 修改指定验收 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="已指定验收计划"
                placement="top"
                v-else-if="scope.row.state2=='已指定验收计划'"
              >
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit-outline"
                  circle
                  :id="scope.$index"
                  @click="tjgx(scope)"
                ></el-button>
              </el-tooltip>

              <!-- 否则 -->
              <el-button
                type="primary"
                icon="el-icon-share"
                size="small"
                circle
                :id="scope.$index"
                @click="tjgx(scope)"
                style="display: none"
                v-else
              ></el-button>
              <!-- 查看按钮 -->
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-search"
                  circle
                  @click="handleClick(scope.row)"
                ></el-button>
              </el-tooltip>

              <!-- 删除按钮 -->
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="dlet(scope)"
                  size="small"
                  v-if="scope.row.state2=='指定工序'"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="block">
              <el-pagination 
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage4"
                  :page-sizes="[15, 30, 60, 100]"
                  :page-size="15"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableData.length+1">
              </el-pagination>
            </div> -->
      </div>
    </div>
    <!-- 添加工序弹框 -->
    <el-dialog title="指定工序" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="acceptRule" ref="addAccept">
        <el-form-item label="工序类型" label-width="120px">
          <el-select v-model="value1" :placeholder="gongxuMrz" style="width:20vw" @change="tree1">
            <el-option
              v-for="item in options1"
              :key="item.index"
              :label="item.processType"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序" label-width="120px">
          <el-select v-model="value2" placeholder="全部" style="width:20vw" @change="tree2">
            <el-option
              v-for="item in options2"
              :key="item.index"
              :label="item.process"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序验收次数" label-width="120px" prop="cishu">
          <el-input
            v-model="form.cishu"
            type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
            style="width:20vw"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="beizhu">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.beizhu"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addXzgx('addAccept')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑指定验收弹框 -->
    <el-dialog title="指定验收" :visible.sync="bjDialogFormVisible" width="35%">
      <!-- 内嵌验收人弹框 -->
      <el-dialog width="50%" title="选中验收人" :visible.sync="innerVisible" append-to-body>
        <div class="topBar">
          <span>姓名：</span>
          <el-input v-model="ysrVul" placeholder="请输入内容"></el-input>

          <span>职务：</span>
          <el-input v-model="ysrZhiwu" placeholder="请输入内容"></el-input>

          <div class="rl">
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-search"
              @click="chaxun()"
            >查询</el-button>
            <el-button
              type="primary"
              class="pan-btn light-blue-btn"
              icon="el-icon-refresh"
              @click="reset()"
            >重置</el-button>
          </div>
        </div>

        <el-table class="textList" :data="ysrData" height="40vh">
          <el-table-column fixed="left" label width="80">
            <template slot-scope="scope">
              <input type="radio" name="Fruit" @click="xzk(scope,$event)">
            </template>
          </el-table-column>
          <el-table-column property="username" label="姓名"></el-table-column>
          <el-table-column property="zhiwei" label="职务"></el-table-column>
          <el-table-column property="mobilePhone" label="电话"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[15,30,60,100]"
          :page-size="15"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageForm.total"
        ></el-pagination>

        <div slot="footer" class="dialog-footer">
          <el-button class="btnSizes" @click="innerVisible = false">取 消</el-button>
          <el-button class="btnSizes" type="primary" @click="qdysr()">确 定</el-button>
        </div>
      </el-dialog>

      <el-form :model="bjFrom" :rules="accept" ref="deleAccept">
        <el-form-item label="监理验收人" label-width="125px" prop="jlysr">
          <el-input v-model="bjFrom.name" :readonly="true" autocomplete="off" style="width:50%"></el-input>&nbsp;&nbsp;&nbsp;
          <span class="ysr" @click="jlYsr('3')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="监理验收时间" label-width="125px" prop="jlysrTime">
          <el-date-picker
            :editable="false"
            v-model="bjFrom.time"
            type="date"
            placeholder="选择日期"
            style="width:253px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="施工验收人" label-width="125px" prop="sgysr">
          <el-input v-model="bjFrom.names" :readonly="true" autocomplete="off" style="width:50%"></el-input>&nbsp;&nbsp;&nbsp;
          <span class="ysr" @click="jlYsr('4')">[选择验收人]</span>
        </el-form-item>
        <el-form-item label="施工验收时间" label-width="125px" prop="sgysrTime">
          <el-date-picker
            :editable="false"
            v-model="bjFrom.times"
            type="date"
            placeholder="选择日期"
            style="width:253px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bjDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="zdys()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" width="80%">
      <imgList
        :chakanData="chakanData"
        :imgData="imgData"
        :imgData2="imgData2"
        :imgId="imgId"
        :zijian="zijian"
        :yanshou="yanshou"
        :imgForm="imgForm"
        :imgData3="imgData3"
        @imgLeft="imgLeft"
      ></imgList>
    </el-dialog>
  </div>
</template>

<script>
import imgList from "./components/imgList";
import request from "@/utils/request";
import SelectTree from "@/components/SelectTree/selectTree.vue";
export default {
  inject: ["reload"],
  components: {
    SelectTree,
    imgList
  },
  data() {
    const validatejlysr = (rule, value, callback) => {
      if (this.bjFrom.name == "") {
        callback(new Error("请选择验收人"));
      } else {
        callback();
      }
    };
    const validatejlTime = (rule, value, callback) => {
      if (this.bjFrom.time == "") {
        callback(new Error("请选择时间"));
      } else {
        callback();
      }
    };
    const validatesgysr = (rule, value, callback) => {
      if (this.bjFrom.names == "") {
        callback(new Error("请选择验收人"));
      } else {
        callback();
      }
    };
    const validatesgTime = (rule, value, callback) => {
      if (this.bjFrom.times == "") {
        callback(new Error("请选择时间"));
      } else {
        callback();
      }
    };
    return {
      // 组织机构树
      options: [],
      // 新增工序类型下拉框
      options1: [],
      // 新增工序下拉框
      options2: [],
      // 查看框初验图片
      imgData: null,
      // 查看框验收图片
      imgData2: null,
      // 点击图片详情的图片
      imgData3: null,
      // 分部分项树
  
      data: [],
      // 操作列表table值
      tableData: null,
      // 查看弹框列表值
      chakanData: [],
      // processName:'',
      // 验收人table值
      ysrData: [],
      treeFrom: {
        // 工程名称
        projectItem: "",
        // 桩号
        zhuanghao: "",
        // 代码
        projectCode: "",
        // 工程类型
        projectType: "",
        // 上面状态值
        state1: "",
        // 下面状态值
        state2: ""
      },
      // 图片详情弹框数据
      imgForm: {
        describe: "",
        createTime: "",
        lat: "",
        lgt: "",
        photoDescribe: "",
        photoLocation: "",
        state: ""
      },
      form: {
        // 添加工序次数
        cishu: "",
        // 添加工序备注
        beizhu: ""
      },
      // 新增校验
      acceptRule: {
        cishu: [{ required: true, message: "请输入工序次数", trigger: "blur" }],
        beizhu: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      // 指定验收校验
      accept: {
        jlysr: [
          { required: true, trigger: "change", validator: validatejlysr }
        ],
        jlysrTime: [
          { required: true, validator: validatejlTime, trigger: "blur" }
        ],
        sgysr: [
          { required: true, validator: validatesgysr, trigger: "change" }
        ],
        sgysrTime: [
          { required: true, validator: validatesgTime, trigger: "blur" }
        ]
      },
      bjFrom: {
        // 监理验收人
        name: "",
        // 监理验收人ID
        nameId: "",
        // 监理验收时间
        time: "",
        // 施工验收人时间
        names: "",
        // 施工验收人ID
        namesId: "",
        // 施工验收时间
        times: "",
        // 工序Id
        processId: ""
      },
      pageForm: {
        // 当前页
        pageNo: 1,
        // 每页条数
        pageSize: 15,
        // 验收人
        Mark: "",
        // 总条数
        total: 0,
        // 姓名值
        userName: "",
        // 开始时间
        startTime: "",
        // 结束时间
        endTime: ""
      },
      // 组织机构树参数展示
      defaultProps: {
        children: "children",
        label: "projectItem"
      },
      // 分部分项树参数展示
      defaultProp: {
        children: "children",
        label: "name"
      },
      // 添加工序弹框
      dialogFormVisible: false,
      // 编辑指定验收弹框
      bjDialogFormVisible: false,
      // 验收人弹框
      innerVisible: false,
      // 查看弹框
      dialogTableVisible: false,
      // 当前组织机构名字
      value: "",
      // 新增工序类型名
      value1: "",
      // 新增工序名
      value2: "",
      // 验收人姓名查询
      ysrVul: "",
      // 验收人职务查询
      ysrZhiwu: "",
      // 获取组织机构ID
      valId: "",
      // 分部分项ID
      treeId: "",
      // 工序ID
      gongxuId: "",
      // 分部分项最子节点ID
      childrenId: "",
      // 工序类型第一个name
      gongxuMrz: "",
      // 组织机构ID
      userGroupId: "",
      // 新增工序类型ID
      processMDictId: "",
      // 新增工序ID
      processDictId: "",
      // 编辑回填自检人ID
      xgzdjlId: "",
      // 编辑回填施工人ID
      xgzdsgId: "",
      // 单选框选中
      even: null,
      // 查看弹框自检描述
      zijian: "",
      // 查看弹框验收描述
      yanshou: "",
      imgId: "",
      // 默认当前分页
      currentPage4: 1
    };
  },
  mounted() {
    this.fn();
  },
  methods: {
    fnc(obj) {
      // console.log('传入的值',obj)
      if (obj.children.length > 0) {
        for (var i = 0; i < obj.children.length; i++) {
          return this.fnc(obj.children[i]);
        }
      } else {
        // console.log(obj.description)
        return obj.description;
      }
    },
    // 初始化合同段input框数据
    fn() {
      request.get("/rest/organizate/depart").then(res => {
        this.options = res.data.data;
        for (var i = 0; i < this.options.length; i++) {
          let a = this.fnc(this.options[i]);
          //  console.log('查到的值',a)
        }
      });
    },
    // 初始化新增工序类型input框数据
    fnLei() {
      request.post("/rest/processType/getList").then(res => {
        this.options1 = res.data.data.data;
        this.fnGong(this.options1[0].id);
        this.processMDictId = this.options1[0].id;
        this.gongxuMrz = this.options1[0].processType;
      });
    },
    // 初始化新增工序input框数据
    fnGong(id) {
      request.post("/rest/process/getList", { processTypeId: id }).then(res => {
        this.options2 = res.data.data.data;
        this.options2.unshift({ process: "全部" });
      });
    },
    // 根据input ID获取树形结构
    noDe(data) {
      if (data.children.length === 0) {
        this.value = data.description;
        this.valId = data.id;
        this.userGroupId = data.id;
        // this.processName='';
        this.treeFrom.projectItem = "";
        request
          .post("/rest/projectItemInfo/getList", { orgId: this.data.id })
          .then(res => {
            this.data = res.data.data;
          });
      } else {
        this.$message({
          message: "组织机构只能选择标段",
          type: "warning"
        });
      }
    },
    // 点击树节点展示右边详情接口
    ztrrFrom() {
      request
        .post("/rest/processCheck/getProject_Process", {
          projectItemId: this.treeId
        })
        .then(res => {
          let type = res.data.data.projects.projectType;
          this.treeFrom.projectItem = res.data.data.projects.projectItem;
          this.treeFrom.projectType =
            type == "1"
              ? "单位工程"
              : type == "2"
              ? "子单位工程"
              : type == "3"
              ? "分部工程"
              : type == "4"
              ? "子分部工程"
              : type == "5"
              ? "分部项程"
              : type == "6"
              ? "子分项工程"
              : "";
          this.treeFrom.projectCode = res.data.data.projects.projectCode;
          this.treeFrom.zhuanghao = res.data.data.projects.zhuanghao;
          this.tableData = res.data.data.detail;
          this.tableData.forEach(i => {
            if (i.planCheckTime == "null") {
              i.planCheckTime = "";
            }
            i.state2 == 0
              ? (i.state2 = "指定工序")
              : i.state2 == 1
              ? (i.state2 = "已指定验收计划")
              : i.state2 == 2
              ? (i.state2 = "自检完成")
              : (i.state2 = "验收完成");
          });
          this.treeFrom.state1 =
            res.data.data.projects.state1 != null ? "已指定验收" : "未指定验收";
          this.tableData.reverse();
        });
    },
    // 点击树形节点展示右边详情列表
    handleNodeClick(data) {
      this.childrenId = "";
      this.treeId = data.id;
      this.ztrrFrom();
      if (data.children.length > 0) {
        this.$message({
          message: "分部分项只能选施工单位"
        });
        return false;
      }
      if (data.children.length == 0) {
        this.childrenId = data.id;
      }
    },
    // 新增弹框获取input框数据
    addGx() {
      this.dialogFormVisible = true;
      this.value1 = "";
      this.value2 = "";
      this.fnLei();
    },
    // 点击新增工序类型获取工序框数据
    tree1(data) {
      this.processMDictId = data.id;

      this.value1 = data.processType;
      this.gongxuId = data.id;
      request
        .post("/rest/process/getList", { processTypeId: this.gongxuId })
        .then(res => {
          this.options2 = res.data.data.data;
          this.options2.unshift({ process: "全部" });
        });
    },
    // 监听工序窗口
    tree2(data) {
      this.processDictId = data.id;
      this.value2 = data.process;
    },
    // 新增工序接口
    addXzgx(formName) {
      const reg = /^(10|[1-9])$/; // 验收次数限制
      let fromData = {
        userGroupId: this.userGroupId,
        processMDictId: this.processMDictId,
        processDictId: this.processDictId,
        projectItemId: this.treeId,
        remark: this.form.beizhu,
        checkNum: this.form.cishu
      };
      if (this.value1 == "") {
        this.$message({
          message: "工序类型不能为空"
        });
        return false;
      }
      if (this.value2 == "") {
        this.$message({
          message: "工序名不能为空"
        });
        return false;
      }
      if (this.form.cishu == "") {
        this.$message({
          message: "验收次数不能为空"
        });
        return false;
      }
      if (!reg.test(this.form.cishu)) {
        this.$message({
          message: "验收次数只能1到10"
        });
        return false;
      }
      request.post("/rest/processCheck/addProcess", fromData).then(res => {
        if (res.data.respCode == 0) {
          this.$message({
            message: "恭喜你，新增成功",
            type: "success"
          });
          this.form.beizhu = "";
          this.form.cishu = "";
          this.ztrrFrom();
          this.dialogFormVisible = false;
        }
      });
    },
    // 编辑指定验收弹框
    tjgx(data) {
      this.bjFrom.name = "";
      this.bjFrom.names = "";
      this.bjFrom.time = "";
      this.bjFrom.times = "";
      this.bjDialogFormVisible = true;
      this.treeFrom.state2 = data.row.state2;
      this.bjFrom.processId = data.row.id;
      if (data.row.state2 == "已指定验收计划") {
        request
          .post("/rest/processCheck/searchProcessCheckPersons", {
            processId: this.bjFrom.processId
          })
          .then(res => {
            this.bjFrom.name = res.data.data.planSelfCheckPerson;
            this.bjFrom.time = res.data.data.planSelfCheckTime;
            this.bjFrom.names = res.data.data.planCheckPerson;
            this.bjFrom.times = res.data.data.planCheckTime;
            this.xgzdsgId = res.data.data.planSelfCheckPersonId;
            this.xgzdjlId = res.data.data.planCheckPersonId;
          });
      }
    },
    // 获取验收人接口
    fnYsr() {
      let ysr = {
        pageNo: this.pageForm.pageNo,
        pageSize: this.pageForm.pageSize,
        Mark: this.pageForm.Mark,
        name: this.ysrVul,
        work: this.ysrZhiwu,
        orgId: this.valId
      };
      request.post("/rest/processCheck/getCheckPerson", ysr).then(res => {
        this.ysrData = res.data.data.data;
        this.pageForm.total = res.data.data.totalCount;
        this.innerVisible = true;
      });
    },
    // 验收人弹框数据
    jlYsr(data) {
      this.pageForm.pageNo = 1;
      this.ysrVul = "";
      this.ysrZhiwu = "";
      this.pageForm.Mark = data;
      this.fnYsr();
    },
    // 验收人查询接口
    chaxun() {
      this.pageForm.pageNo = 1;
      this.fnYsr();
    },
    // 监听总条数
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.fnYsr();
    },
    // 监听总页数
    handleCurrentChange(val) {
      this.pageForm.pageNo = val;

      this.fnYsr();
    },
    // 监听验收人单选框
    xzk(data, e) {
      this.even = e;
      this.pageForm.Mark == "3"
        ? (this.bjFrom.name = data.row.username)
        : (this.bjFrom.names = data.row.username);
      this.pageForm.Mark == "3"
        ? (this.bjFrom.nameId = data.row.id)
        : (this.bjFrom.namesId = data.row.id);
    },
    // 选择验收人显示表框中
    qdysr(data) {
      if (this.even == null) {
        this.innerVisible = false;
        return false;
      }
      this.even.target.checked = false;
      this.innerVisible = false;
    },
    // 编辑指定验收接口
    zdys() {
      let time = new Date(this.bjFrom.time);
      let timeDate =
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1) +
        "-" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds();
      let times = new Date(this.bjFrom.times);
      let timesDate =
        times.getFullYear() +
        "-" +
        (times.getMonth() + 1) +
        "-" +
        times.getDate() +
        " " +
        times.getHours() +
        ":" +
        times.getMinutes() +
        ":" +
        times.getSeconds();
      let bjysForm = {
        processId: this.bjFrom.processId,
        planSelfCheckTime: timeDate,
        planSelfCheckPerson:
          this.treeFrom.state2 == "指定工序"
            ? this.bjFrom.nameId
            : this.bjFrom.nameId != ""
            ? this.bjFrom.nameId
            : this.xgzdsgId,
        planCheckTime: timesDate,
        planCheckPerson:
          this.treeFrom.state2 == "指定工序"
            ? this.bjFrom.namesId
            : this.bjFrom.namesId != ""
            ? this.bjFrom.namesId
            : this.xgzdjlId
      };
      this.$refs.deleAccept.validate(valid => {
        if (valid) {
          request
            .post("/rest/processCheck/appointProcessCheckPersons", bjysForm)
            .then(res => {
              if (res.data.respCode == 0) {
                this.$message({
                  message:
                    this.treeFrom.state2 == "指定工序"
                      ? "恭喜你，指定验收成功"
                      : "恭喜你，修改指定验收成功",
                  type: "success"
                });
                if (this.treeFrom.state2 == "指定工序") {
                  this.ztrrFrom();
                  this.bjDialogFormVisible = false;
                  return false;
                }
                this.bjDialogFormVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    },
    // 删除接口
    dlet(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request.get("/rest/processCheck/delete/" + data.row.id).then(res => {
          if (res.data.respCode == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.ztrrFrom();
          }
        });
      });
    },
    // 查看接口
    handleClick(row) {
      this.chakanData.length = 0;
      this.dialogTableVisible = true;
      request
        .post("/rest/processCheck/getProcessDetail", { id: row.id })
        .then(res => {
          if (res.data.respCode == "0") {
            if (res.data.data == null && !res.data.data.length) return false;
            this.chakanData.push(res.data.data);
            this.chakanData.forEach(i => {
              i.projectType =
                i.projectType == "1"
                  ? "单位工程"
                  : i.projectType == "2"
                  ? "子单位工程"
                  : i.projectType == "3"
                  ? "分部工程"
                  : i.projectType == "4"
                  ? "子分部工程"
                  : i.projectType == "5"
                  ? "分部项程"
                  : i.projectType == "6"
                  ? "子分项工程"
                  : "";
              i.state1 = i.state1 == 1 ? "已指定验收" : "未指定验收";

              i.state2 == 0
                ? (i.state2 = "指定工序")
                : i.state2 == 1
                ? (i.state2 = "已指定验收计划")
                : i.state2 == 2
                ? (i.state2 = "自检完成")
                : (i.state2 = "验收完成");
            });
            this.zijian = this.chakanData.selfCheckDescribe;
            this.yanshou = this.chakanData.checkDescribe;
            this.imgData = res.data.data.selfFilePath;
            this.imgData2 = res.data.data.filePath;
            this.imgId = this.chakanData[0].processLogId;
          }
        });
    },
    // 点击图片展示图片详情接口
    imgLeft(data, imgTan) {
      imgTan;
      request
        .post("/rest/processCheck/getPictureDetail", {
          processLogId: this.imgId,
          Mark: data
        })
        .then(res => {
          this.imgForm.describe = res.data.data[0].describe;
          this.imgForm.createTime = res.data.data[0].createTime;
          this.imgForm.lat = res.data.data[0].lat;
          this.imgForm.lgt = res.data.data[0].lgt;
          this.imgForm.photoDescribe = res.data.data[0].photoDescribe;
          this.imgForm.photoLocation = res.data.data[0].photoLocation;
          this.imgForm.state = res.data.data[1].state == "0" ? "自检" : "验收";
          res.data.data.shift();
          this.imgData3 = res.data.data;
        });
    },
    // 重置按钮
    reset() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped >
.dwmc {
  margin-left: 170px;
  font-weight: 900;
  
}
.fz {
  margin-left: 198px;
  font-weight: 900;
}
.el-select {
  width: 260px;
}
.acceptLayout {
  max-height: 100vh;
  padding: 20px;
  /deep/ .select-tree .el-input.el-input--suffix {
    width: 19vw;
  }
  /deep/ .el-popper {
    width: 15vw;
  }
  .ysr {
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
      div {
        position: absolute;
        width: 30%;
        height: 4.5vh;
        // background-color: rgb(134, 42, 42);
      }
    }
    .Cztab {
      margin-top: 10px;
      height: 60vh;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow-x:hidden;
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
/deep/.el-button+.el-button {
    margin-left:0
}
</style>