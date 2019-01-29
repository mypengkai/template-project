<template>
    <div class="rzgl">
        <div class="cx">
          <!-- 帅选 -->
          <el-row>
            <el-col :span="8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;组织机构姓名：
               <el-select v-model="bookType" style="width:120px;" >
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>
            </el-col>
            <!-- 时间选择器 -->
            <el-col :span="13">
              日期: <el-date-picker
                v-model="value6"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00']">
                </el-date-picker>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" icon="el-icon-search">查询</el-button>
              </el-col>
          </el-row>
        </div>
        <!-- 表单 -->
          <el-table
            :data="tableData"
            style="width: 100%;padding-left:15px">
          <el-table-column
          prop="date"
          label="日期"
          width="280">
          </el-table-column>
            <el-table-column
            prop="name"
            label="姓名"
            width="280">
          </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="padding-left:15px">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination>
      </div>
    </div>
</template>
<script>
export default {
  data(){
    return{
      value6: '',
      bookType:'',
      options: ['xlsx', 'csv', 'txt'],
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        currentPage4:4
    }
  },
  methods:{
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
  }
}
</script>

<style lang="scss" scoped>
  .cx{
    margin-top: 15px;
  //    /deep/ .el-input__inner{
  //   height: 30px;
  //   line-height: 30px
  // }
  }
 
</style>


