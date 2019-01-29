<template>
  <div class="acceptLayout">
    <!-- 左边标段选择 -->
    <div class="section">
      <span>合同段:</span>
      <span style="padding-top: 10px;">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span style="padding-top: 10px;">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </span>
    </div>
    <!-- 右边详情列表 -->
    <div class="particularsList">
      <div class="particulars">
        <span>工程名称:路基填土</span>
        <span>工程类型:分析工程</span>
        <span>代码:H1Z2T10T01</span>
        <span style=" padding-top: 1vw;">桩号:AK0-AK0+688</span>
        <span style=" padding-top: 1vw;">状态:已指定工序</span>
        <span>
          <el-button type="primary" plain>添加工序</el-button>
        </span>
      </div>
      <!-- 操作列表 -->
      <div class="Cztab">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="时间">
          </el-table-column>
          <el-table-column prop="province" label="工序过程">
          </el-table-column>
          <el-table-column fixed prop="name" label="序号" width="180">
          </el-table-column>
          <el-table-column prop="city" label="状态">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
              <el-button type="primary" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条 -->
        <div class="paging">
          <el-pagination background layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "1标"
        },
        {
          value: "选项2",
          label: "2标"
        },
        {
          value: "选项3",
          label: "3标"
        },
        {
          value: "选项4",
          label: "4标"
        },
        {
          value: "选项5",
          label: "5标"
        }
      ],
      data: [
        {
          label: "长冲互通立体交叉",
          children: [
            {
              label: "匝道工程(AK0-AK0+688)",
              children: [
                {
                  label: "路基土石方(AK0-AK0+688)"
                }
              ]
            }
          ]
        },
        {
          label: "路基工程",
          children: [
            {
              label: "路基土石方工程(K0+503-K3+021)",
              children: [
                {
                  label: "土方路基(K0+503-K1+260)"
                }
              ]
            },
            {
              label: "排水工程(K0+503-K3+021)",
              children: [
                {
                  label: "边沟( K0+503-K0+910)"
                }
              ]
            }
          ]
        },
        {
          label: "九溪村中桥",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "万福亭大桥",
          children: [
            {
              label: "二级 3-1"
            }
          ]
        },
        {
          label: "分离式立体交叉",
          children: [
            {
              label: "二级 3-1"
            }
          ]
        },
        {
          label: "新屋村大桥",
          children: [
            {
              label: "二级 3-1"
            }
          ]
        }
      ],
      tableData: [
        {
          name: "1",
          province: "基底",
          date: "2016-05-03",
          city: "已指定工序"
        },
        {
          name: "2",
          province: "软基处理",
          date: "2016-05-02",
          city: "已指定工序"
        },
        {
          name: "3",
          province: "挖方段挖翻后",
          date: "2016-05-04",
          city: "已指定工序"
        },
        {
          name: "4",
          province: "土工格栅",
          date: "2016-05-01",
          city: "已指定工序"
        },
        {
          name: "1",
          province: "基底",
          date: "2016-05-03",
          city: "已指定工序"
        },
        {
          name: "2",
          province: "软基处理",
          date: "2016-05-02",
          city: "已指定工序"
        },
        {
          name: "3",
          province: "挖方段挖翻后",
          date: "2016-05-04",
          city: "已指定工序"
        },
        {
          name: "4",
          province: "土工格栅",
          date: "2016-05-01",
          city: "已指定工序"
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      value: "",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped >
.acceptLayout {
  padding: 20px;
  .section {
    float: left;
    width: 30%;
    span {
      display: block;
    }
  }
  .particularsList {
    float: left;
    width: 70%;
    height: 90vh;
    // background-color: rgb(141, 39, 39);
    .particulars {
      height: 10vh;
      border: 1px solid #ccc;
      border-radius: 10px;

      span {
        width: 30%;
        float: left;
        padding-top: 0.5vw;
        padding-left: 20px;
        display: block;
      }
    }
    .Cztab {
      margin-top: 10px;
      height: 70vh;
      border: 1px solid #ccc;
      border-radius: 10px;
      .paging {
        padding-top: 10vh;
        padding-left: 12vw;
      }
    }
  }
}
</style>
