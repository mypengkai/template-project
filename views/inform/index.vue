<template>
    <div class="informLayout">
        <!-- 头部搜素新增 -->
        <div class="navMessage">
            <span class="fl">
                <span class="fl" style=" padding-top: 0.5vw;">通知消息:</span>
                <span class="fl">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input2"></el-input>
                </span>
                <span class="fl" style=" padding-top: 0.2vw;">
                    <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
                </span>
            </span>
        </div>

        <div class="informText">
            <span style=" font-size: 1.5vw;">
                <svg-icon icon-class="inform" />
            </span>
            <span> 通知列表</span>
            <span class="rl pr20">
                <el-button @click="outerVisible = true" type="primary" icon="el-icon-circle-plus">新增</el-button>
            </span>
        </div>

        <!-- 底部列表 -->
        <div class="informList">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name" label="通知标题">
                </el-table-column>
                <el-table-column fixed prop="date" label="发送时间">
                </el-table-column>
                <el-table-column prop="province" label="发起人">
                </el-table-column>
                <el-table-column prop="city" label="状态">
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="open7" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="infomrpaging">
                <el-pagination background layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 隐藏 -->
        <el-dialog title="发起通知" :visible.sync="outerVisible">
            <el-dialog width="30%" title="选择接收人" :visible.sync="innerVisible" append-to-body>
                <div class="microLayout">
                    <div class="navm">
                        用户类型:
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="pitch">
                        <span>选中用户列表:</span>
                        <span>
                            <el-input v-model="input" placeholder="请输入内容"></el-input>
                        </span>
                    </div>
                    <div style=" padding-top: 20px;">用户列表</div>
                    <div class="userList">
                        <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column prop="name" label="姓名">
                            </el-table-column>
                            <el-table-column prop="duty" label="地址" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div style=" padding-top: 20px;">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="100" :total="1000">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="outerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="outerVisible = false">发 送</el-button>
                </div>
            </el-dialog>
            <!-- 外部大盒子 -->
            <div class="addLayout">
                <!-- 标题栏 -->
                <div class="navBox">
                    <span class="fl" style=" padding-top: 1vh;">通知标题:</span>
                    <span class="fl">
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                    </span>
                    <span class="rl" style=" padding-top: 1vh;"> 2019-01-24 14:12:31 </span>
                    <span class="rl" style=" padding-top: 1vh;">发送时间:</span>
                </div>
                <!-- 接收人 -->
                <div class="adopt">
                    <span class="fl" style=" width: 20%;padding-top: 1vh;">接收人:</span>
                    <span class="fl" style=" width: 50%;">
                        <el-input v-model="input"></el-input>
                    </span>
                    <span class="fl">
                        <el-button type="text" @click="innerVisible = true">选择接收人</el-button>
                    </span>
                </div>
                <!-- 通知内容 -->
                <div class="leave">
                    <span class="fl" style=" width: 20%;padding-top: 1vh">通知消息:</span>
                    <span class="fl" style=" width: 70%;">
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                    </span>
                </div>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="outerVisible = false">发 送</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          zip: 200333
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          zip: 200333
        }
      ],
      options: [
        {
          value: "选项1",
          label: "业主"
        },
        {
          value: "选项2",
          label: "监理"
        },
        {
          value: "选项3",
          label: "施工单位"
        }
      ],
      tableData3: [
        {
          name: "黄斌",
          duty: "业主领导"
        },
        {
          name: "唐承铁",
          duty: "业主领导"
        },
        {
          name: "冯宇",
          duty: "业主领导"
        },
        {
          name: "方来",
          duty: "公司副经理"
        },
        {
          name: "丁学峰",
          duty: "业主领导"
        }
      ],
      currentPage1: 5,
      multipleSelection: [],
      value: "",
      input: "",
      input2: "",
      outerVisible: false,
      innerVisible: false
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    open7() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.informLayout {
  padding: 20px;
  .navMessage {
    height: 4.7vh;
    border: 1px solid #ccc;
    border-left: none;
    border-right: none;
    span {
      display: block;
      padding-top: 1px;
      padding-left: 20px;
    }
  }
  .informText {
    font-size: 0.9vw;
    margin-top: 20px;
  }
  .informList {
    margin-top: 20px;
    .infomrpaging {
      padding-top: 50px;
      // padding-left: 50vw;
    }
  }
}
</style>
