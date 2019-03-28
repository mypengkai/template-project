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
        <div class="gaodu">
              <el-table
            :data="tableData"
            height="75vh"
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
          width="280">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="success"
                @click="handleEdit(scope.row)">查看详情</el-button>
            </template>
    </el-table-column>
      </el-table>
      </div>
      <!-- 分页 -->
      <div class="block" style="padding-left:15px" id="blockTop">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[15,30,45,60]"
        :page-size="15"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>

      <!-- 日志查看弹框 -->
      <el-dialog :title="'日志详情'" :visible.sync="dialogFormVisible" class="dialogBox">
        <!-- 照片详情信息查看 -->
      <chaKanList :formList="formList"></chaKanList>
    </el-dialog>
    </div>
</template>
<script>
import chaKanList from "./components/chakanList";
import request from '@/utils/request'
export default {
  components: {
    chaKanList
  },
  data(){
    return{
      form:{
        // 当前页
        pageNo:1,
        // 每页条数
        pageSize:15,
        // 姓名值
        userName: '',
        // 开始时间
        startTime:'',
        // 结束时间
        endTime:'',
      },
      formList:{
        // 时间
        createTime:'',
        // 描述
        describe:'',
        // 名字
        realname:'',
        // 图片
        pictures:[],
        // 经度
        lat:'',
        // 纬度
        lgt:'',
        // 地址
        photoLocation:''
      },
      dialogFormVisible:false,
      total:0,
      bookType:'',
      tableData:null,
      currentPage4:15,
      noType:''
    }
  },
  methods:{
     handleSizeChange(val) {
       this.form.pageSize=val
       this.fn()
      },
      handleCurrentChange(val) {
        this.form.pageNo=val;
        this.fn()
      },
      fn(){
      let objFrom={pageNo:this.form.pageNo,pageSize:this.form.pageSize,userName:this.form.userName,startTime:this.form.startTime,endTime:this.form.endTime}
      return request.post('/rest/processInfoLog/everyDayLogPageList',objFrom).then(res=>{
        if(res.status==200){
          console.log(res)
          var data=res.data.data.data;
          this.total=res.data.data.totalCount;
          this.tableData=data;
        }
      })
    },
    handleEdit(data){
      this.formList.pictures.length=0;
      request.post(`/rest/processInfoLog/findLog/${data.id}`).then(res=>{
        console.log(res)
        this.formList.realname=res.data.data.realname;
        this.formList.createTime=res.data.data.createTime;
        this.formList.describe=res.data.data.describe;
        this.formList.lat=res.data.data.lat;
        this.formList.lgt=res.data.data.lgt;
        this.formList.photoLocation=res.data.data.photoLocation;
        this.formList.pictures.push(res.data.data.pictures)
        console.log(this.formList.pictures)
      })
      this.dialogFormVisible=true;
    },
    chaxun(){
      this.fn()
    }
  },
  mounted(){
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
</style>


