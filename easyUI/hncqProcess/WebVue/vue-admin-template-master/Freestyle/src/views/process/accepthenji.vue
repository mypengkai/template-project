<template>
  <div class="acceptzh">
    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>组织机构:</span>
          <select-tree :options="options" :props="defaultProp" v-on:noDe="noDe"/>
        </el-col>
        <el-col :span="6">
          <span>分部分项:</span>
          <select-tree :options="options1" :props="defaultProps" v-on:noDe="noDes"/>
        </el-col>
        <el-col :span="6">
          <span>姓名:</span>
          <el-input v-model="form.userName" placeholder="请输入内容" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <span>验收类型:</span>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="topBar">
      <el-row>
        <el-col :span="6">
          <span>工序状态</span>
          <el-select v-model="value1" placeholder="请选择" size="small">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <span>创建日期:</span>
          <el-date-picker
            v-model="form.starttime"
            type="datetime"
            placeholder="选择开始日期时间"
            size="small"
            style="min-width:200px"
          ></el-date-picker>-
          <el-date-picker
            v-model="form.endtime"
            type="datetime"
            placeholder="选择结束日期时间"
            size="small"
            style="min-width:200px"
          ></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            icon="el-icon-search"
            @click="chaxun()"
          >查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            class="pan-btn light-blue-btn"
            icon="el-icon-refresh"
            @click="reset()"
          >重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table class="textList" :data="tableData" border style="width: 100%;" height="55vh">
      <el-table-column prop="name1" label="分部分项"></el-table-column>
      <el-table-column prop="zhuanghao" label="桩号"></el-table-column>
      <el-table-column prop="processName" label="工序名"></el-table-column>
      <!-- <el-table-column prop="processType" label="工序过程"></el-table-column> -->
      <el-table-column prop="planCheckTime" label="创建时间"></el-table-column>
      <el-table-column prop="shijiyanshouren" label="验收人员"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
            <el-button
              @click="handleClick(scope.row)"
              type="primary"
              circle
              icon="el-icon-search"
              v-if="tableData.length!=0"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->

    <el-pagination
      class="pageList mt1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[15,30,60,100]"
      :page-size="15"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" width="80%"  class="dialogBox">
      <processCheck :realList="chakanData"></processCheck>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from "@/components/SelectTree/selectTree.vue";
// import imgList from "./components/imgList";
import request from "@/utils/request";
import processCheck from "@/views/process/components/processCheck";
export default {
   inject: ["reload"],
  components: {
    SelectTree,
    // imgList,
    processCheck
  },
  data() {
    return {
      defaultProp: {
        children: "children",
        label: "name"
      },
      defaultProps: {
        children: "children",
        label: "projectItem"
      },
      form: {
        // 开始时间
        starttime: "",
        // 结束时间
        endtime: "",
        // 姓名
        userName: "",
        // 当前页
        pageNo: 1,
        // 每页条数
        pageSize: 15
      },
      imgForm: {
        describe: "",
        createTime: "",
        lat: "",
        lgt: "",
        photoDescribe: "",
        photoLocation: "",
        state: ""
      },
      options2: [
        {
          value: "0",
          label: "任务验收"
        },
        {
          value: "1",
          label: "自主验收"
        }
      ],
      options3: [
        {
          value: "0",
          label: "未指定"
        },
        {
          value: "1",
          label: "指定"
        },
        {
          value: "2",
          label: "已完成"
        }
      ],
      dialogTableVisible: false,
      value: "",
      value1: "",
      options: [],
      options1: [],
      tableData: [],
      table: [],
      chakanData: [],
      imgData: null,
      imgData2: null,
      imgData3: null,
      imgId: "",
      orgId: "",
      zijian: "",
      yanshou: "",
      currentPage4: 1, // 当前页数 默认1
      total: 0
    };
  },
  created() {
    this.chaxun();
  },
  mounted() {
    this.fn();
  },
  methods: {
    // 初始化组织机构input框数据
    fn() {
      request.get("/rest/organizate/depart").then(res => {
        this.options = res.data.data;
      });
    },
    // 点击组织机构节点展示分部分项
    noDe(data) {
      console.log(data, "daata");
      this.options1 = [];
      this.orgId = data.id;
      request
        .post("/rest/projectItemInfo/getList", { orgId: this.orgId })
        .then(res => {
          this.options1 = res.data.data;

          // console.log(res)
        });
    },
    // 获取分部分项id
    noDes(data) {
      this.fbfxId = data.id;
    },
    //重置
    reset() {
      
      this.reload()
    },
    // 查询接口
    chaxun() {
      this.tableData.length = 0;
      let time = new Date(this.form.starttime);

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
      let times = new Date(this.form.endtime);
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
      let formData = {
        orgId: this.orgId,
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        starttime: timeDate,
        endtime: timesDate,
        projectId: this.fbfxId,
        personid: this.form.userName,
        checkType: this.value,
        state: this.value1
      };
      // console.log(formData)
      request.post("/rest/processCheck/searchHenJi", formData).then(res => {
        if (res.data.respCode == "0") {
          console.log(res, "res");

          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.data;
          // this.formData.pageNo = res.data.data.nextPage
          this.tableData.forEach(i => {
            if (i.planCheckTime == "null") {
              i.planCheckTime = "";
            }
            i.state == "0"
              ? (i.state = "指定工序")
              : (i.state = "已指定验收计划");
          });
          // console.log(this.tableData)
        }
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.chaxun();
    },
    // 页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.form.pageNo = val;
      this.chaxun();
    },
    // 查看工程接口
    handleClick(row) {
      this.chakanData.length = 0;
      this.dialogTableVisible = true;
      request
        .post("/rest/processCheck/getProcessDetail", { id: row.gongxuid })
        .then(res => {
          if (res.data.respCode == "0") {
            let array = []
            array.push(res.data.data)
            this.chakanData = array
            console.log(this.chakanData,'chakanData')
            // this.chakanData.push(res.data.data);
            // this.chakanData.forEach(i => {
            //   i.projectType =
            //     i.projectType == "1"
            //       ? "单位工程"
            //       : i.projectType == "2"
            //       ? "子单位工程"
            //       : i.projectType == "3"
            //       ? "分部工程"
            //       : i.projectType == "4"
            //       ? "子分部工程"
            //       : i.projectType == "5"
            //       ? "分部项程"
            //       : i.projectType == "6"
            //       ? "子分项工程"
            //       : "";
            //   i.state1 = i.state1 == 1 ? "已指定验收" : "未指定验收";
            //   i.state2 == 0
            //     ? (i.state2 = "指定工序")
            //     : i.state2 == 1
            //     ? (i.state2 = "已指定验收计划")
            //     : i.state2 == 2
            //     ? (i.state2 = "自检完成")
            //     : (i.state2 = "验收完成");
            // });
            // this.zijian = this.chakanData.selfCheckDescribe;
            // this.yanshou = this.chakanData.checkDescribe;
            // this.imgData = res.data.data.selfFilePath;
            // this.imgData2 = res.data.data.filePath;
            // this.imgId = this.chakanData[0].processLogId;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.acceptzh {
  padding: 20px;
  height: 100%;
  .elBoutton {
    // float: right;
  }
  /deep/.el-input__inner {
    line-height: 30px !important;
    // height: 4vh;
  }
}
</style>
