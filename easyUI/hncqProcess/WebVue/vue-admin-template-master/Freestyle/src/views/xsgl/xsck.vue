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
              日期:  
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期">
          </el-date-picker> - 
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间">
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
            border
            style="width: 100%;margin-left: 20px;">
            <el-table-column
              label="姓名"
              width="300"
              align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.name }}</p>
          </template>
          </el-table-column>
          <el-table-column
                  label="发起时间"
                  align="center"
                  width="500">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
                  label="计划时间"
                  align="center"
                  width="500">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        </template>
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
      <!-- 弹框 -->
        <el-dialog title="查看详情" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="姓名" label-width="120px">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="发起时间" label-width="120px">
              <el-input v-model="form.date" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="计划时间" label-width="120px">
              <el-input v-model="form.date" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  data(){
    return{
      // 日期值
      value1: '',
      // 日期时间值
      value2: '',
      // 下拉框显示值
      bookType:'',
      // 遍历下拉框数值
      options: ['xlsx', 'csv', 'txt'],
      form: {
          name: '',
          date:''
        },
      // 弹出隐藏框首先隐藏
      dialogFormVisible:false,
      // 表单值
      tableData: [{
          date: '2016-05-02',
          name: '王小虎1',
        }, {
          date: '2016-05-04',
          name: '王小虎2',
        }, {
          date: '2016-05-01',
          name: '王小虎3',
        }, {
          date: '2016-05-03',
          name: '王小虎4',
        }],
        // 分页数量
        currentPage4:4
    }
  },
  methods:{
    // 表格查看按钮
    handleEdit(index, row) {
      this.form.name=row.name;
      this.form.date=row.date
      this.dialogFormVisible=true
      },
    // 分页按钮
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
    margin-bottom: 15px
  //    /deep/ .el-input__inner{
  //   height: 30px;
  //   line-height: 30px
  // }
  }
 
</style>


