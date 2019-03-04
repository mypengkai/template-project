<template>
    <div class="p20">
        <!-- 选项栏 -->
        <div class="topBar">
            <span>单位:</span>
            <el-select v-model="value" clearable placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <span>工程选择:</span>
            <el-input v-model="input">
                <el-button slot="append" icon="el-icon-edit"></el-button>
            </el-input>

            <span>时间:</span>
            <el-date-picker v-model="value4" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

            <div class="rl">
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
        </div>
        <!-- 查询列表 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="address" label="相关工程">
                </el-table-column>

                <el-table-column prop="name" label="发起人">
                </el-table-column>

                <el-table-column prop="date" label="发起时间">
                </el-table-column>

                <el-table-column prop="date" label="计划时间">
                </el-table-column>

                <el-table-column prop="address" label="指令内容">
                </el-table-column>

                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="action(scope.row)">编辑</el-button>
                        <el-button type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页条 -->
        <div>
            <el-pagination :current-page="currentPage4" :page-sizes="[1, 2, 3, 4]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="4">
            </el-pagination>
        </div>
        <!-- 编辑弹框 -->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
            <checkBox :nowItem="nowItem" v-if="nowItem" @cancel="dialogFormVisible"></checkBox>
        </el-dialog>
    </div>
</template>

<script>
import checkBox from "./components/checkBox";
export default {
  components: {
    checkBox
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "一标"
        },
        {
          value: "选项2",
          label: "二标"
        }
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      nowItem: "",
      value: "",
      input: "",
      input5: "",
      value4: "",
      dialogFormVisible: false,
      currentPage4: 4
    };
  },
  methods: {
    action(val) {
      this.nowItem = val;
      this.dialogFormVisible = true;
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && (this.nowItem = "");
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
