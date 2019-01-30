<template>
    <div class="rzgl">
        <div class="cx">
          <!-- 帅选 -->
          <el-row>
            <el-col :span="8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名：
               <el-input v-model="form.userName" placeholder="请输入内容" style="width:50%"></el-input>
            </el-col>
            <!-- 时间选择器 -->
            <el-col :span="13">
              日期:  <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker> - 
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" icon="el-icon-search" @click="chaxun">查询</el-button>
              </el-col>
          </el-row>
        </div>
        <!-- 表单 -->
            <el-table
            :data="tableData"
            height="600"
            style="width: 100%;padding-left:15px">
            <el-table-column
              label="图片"
              width="280">
              <template slot-scope="scope">
                <img :src="scope.row.filePath" alt="" style="height:150px">
              </template>
            </el-table-column>
            <el-table-column
            prop="realname"
            label="姓名"
            width="280">
          <template slot-scope="scope">
            <span>{{ scope.row.realname }}</span>
          </template>
          </el-table-column>
           <el-table-column
          label="内容"
          width="280">
          <template slot-scope="scope">
            <span>{{ scope.row.describe }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="记录时间"
          width="880">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="padding-left:15px">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableLength">
        </el-pagination>
      </div>
    </div>
</template>
<script>
import request from '@/utils/request'
export default {
  data(){
    return{
      form:{
        // 条数
        pageNo:1,
        // 页数
        pageSize:15,
        // 姓名值
        userName: '',
        // 开始时间
        startTime:'',
        // 结束时间
        endTime:'',
      },
      bookType:'',
      tableData:null,
      currentPage4:4,
      tableLength:0,
    }
  },
  methods:{
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      fn(){
      let objFrom={pageNo:this.form.pageNo,pageSize:this.form.pageSize,userName:this.form.userName,startTime:this.form.startTime,endTime:this.form.endTime}
      return request.post('/rest/processInfoLog/everyDayLogPageList',objFrom).then(res=>{
        if(res.status==200){
          var data=res.data.data;
          console.log(data)
          this.tableData=data;
          this.tableLength=this.tableData.length
        }
      })
    },
    chaxun(){
      this.fn()
    }
  },
  created(){
    this.fn() 
  },
}
</script>

<style lang="scss" scoped>
  .cx{
    margin-top: 15px;
  }
  .fromScoll{
     overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
    overflow: auto;

  }
  .fromScoll::-webkit-scrollbar {
    display: none;
  }

</style>


