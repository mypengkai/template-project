<template>
  <div class="roleLayout p20">
    <!-- 左边角色列表 -->
    <div class="roleList">
      <div class="inquire">
        <div class="fl">
          <span class="fl" style="padding-top: 1vh;">角色名称:</span>
          <span class="fl" style="padding-left: 0.5vw;">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </span>
        </div>

        <div class="rl">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh">重置</el-button>
          <el-button type="primary" icon="el-icon-edit-outline">录入</el-button>
        </div>
      </div>
      <!-- table表 -->
      <div style="padding-top: 3vw;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="coding" label="角色编码">
          </el-table-column>
          <el-table-column prop="name" label="角色名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <div style="padding-top: 35vh;">
        <el-pagination background layout="prev, pager, next" :total="100">
        </el-pagination>
      </div>
    </div>

    <!-- 右边树 -->
    <div class="terrBox"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          coding: "manager",
          name: "普通用户"
        },
        {
          coding: "admin",
          name: "管理员"
        },
        {
          coding: "dep_jingli",
          name: "经理角色"
        },
        {
          coding: "demo",
          name: "demo"
        }
      ],
      input: "",
      currentPage1: 1
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.roleLayout {
  .roleList {
    float: left;
    width: 60%;
    .inquire {
      span {
        display: block;
      }
    }
  }
  .terrBox {
    float: right;
    width: 38%;
    height: 78vh;
    border: 1px solid #ccc;
  }
}
</style>
