<template>
  <div class="acceptzh">
    <div class="topBar">
      <span>组织机构</span>
      <select-tree :options="options" :props="defaultProp" v-on:noDe="noDe" />

      <span>分部分项</span>
      <select-tree :options="options1" :props="defaultProps" v-on:noDe="noDes" />

      <span>姓名</span>
      <el-input v-model="form.userName" placeholder="请输入内容"></el-input>

      <span>验收类型</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="topBar">
      <span>工序状态</span>
      <el-select v-model="value1" placeholder="请选择">
        <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <span>日期</span>
      <el-date-picker v-model="form.starttime" type="datetime" placeholder="选择开始日期时间">
      </el-date-picker> -
      <el-date-picker v-model="form.endtime" type="datetime" placeholder="选择结束日期时间">
      </el-date-picker>

      <el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button>
    </div>

    <!-- <el-row>
      <el-col :span="6">
        <el-form :inline="true">
          <el-form-item label="组织机构">
            <select-tree :options="options" :props="defaultProp" v-on:noDe="noDe" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form :inline="true">
          <el-form-item label="分部分项">
            <select-tree :options="options1" :props="defaultProps" v-on:noDe="noDes" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        姓名
        <el-input v-model="form.userName" placeholder="请输入内容" style="width:70%"></el-input>
      </el-col>
      <el-col :span="6">
        验收类型
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        工序状态
        <el-select v-model="value1" placeholder="请选择">
          <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        日期
        <el-date-picker v-model="form.starttime" type="datetime" placeholder="选择开始日期时间">
        </el-date-picker> -
        <el-date-picker v-model="form.endtime" type="datetime" placeholder="选择结束日期时间">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button>
      </el-col>
    </el-row> -->

    <el-table class="textList" :data="tableData" border style="width: 100%;" height="56vh" v-if="tableData.length!=0">
      <el-table-column prop="name1" label="单位工程1">
      </el-table-column>
      <el-table-column prop="processName" label="工序名">
      </el-table-column>
      <el-table-column prop="processType" label="工序过程">
      </el-table-column>
      <el-table-column prop="planCheckTime" label="计划验收时间">
      </el-table-column>
      <el-table-column prop="state" label="状态">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pageList pt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[15,30,45,60]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 查看弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible" width="80%">
      <imgList :chakanData='chakanData' :imgData='imgData' :imgData2='imgData2' :imgId='imgId' :zijian='zijian' :yanshou='yanshou' :imgForm='imgForm' :imgData3='imgData3' @imgLeft='imgLeft'></imgList>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from "@/components/SelectTree/selectTree.vue";
import imgList from "./components/imgList";
import request from "@/utils/request";
export default {
  components: {
    SelectTree,
    imgList
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
      chakanData: [],
      imgData: null,
      imgData2: null,
      imgData3: null,
      imgId: "",
      orgId: "",
      fbfxId: "",
      zijian: "",
      yanshou: "",
      currentPage4: 1,
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
      this.options1 = [];
      this.orgId = data.id;
      request
        .post("/rest/projectItemInfo/getList", { orgId: this.orgId })
        .then(res => {
          if (res.data.data == null) return false;
          this.options1 = res.data.data;
        });
    },
    // 获取分部分项id
    noDes(data) {
      this.fbfxId = data.id;
    },
    // 查询接口
    chaxun() {
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
        starttime: "",
        endtime: "",
        projectId: this.fbfxId,
        personid: this.form.userName,
        checkType: this.value,
        state: this.value1
      };
      request
        .post("/rest/processCheck/searchCheakDeatil", formData)
        .then(res => {
          if (res.data.respCode == "0") {
            console.log(res);
            this.tableData = res.data.data.data;
            this.tableData.forEach(i => {
              // if(i.planCheckTime=="null"){
              //     i.planCheckTime=''
              // }
              i.state == "0"
                ? (i.state = "指定工序")
                : (i.state = "已指定验收计划");
            });
            this.total = res.data.data.totalCount;
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
      this.form.pageNo = val;
      this.chaxun();
    },
    // 查看工程接口
    handleClick(row) {
      this.chakanData.length = 0;
      this.dialogTableVisible = true;
      console.log(row);
      request
        .post("/rest/processCheck/getProcessDetail", { id: row.gongxuid })
        .then(res => {
          console.log(res);
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
                          : i.projectType == "6" ? "子分项工程" : "";
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
    }
  }
};
</script>

<style lang="scss" scoped>
.acceptzh {
  padding: 20px;
  // /deep/ .select-tree .el-input.el-input--suffix{
  //     width: 200px;
  // }
  // /deep/ .el-popper{
  //     width: 200px;
  //  }
}
</style>
