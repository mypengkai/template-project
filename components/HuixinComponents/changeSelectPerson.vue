<template>
  <div>
    <el-table ref="changeSingleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="realname" label="用户名"></el-table-column>
      <el-table-column property="mobilePhone" label="电话"></el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination class="pageList mt1" background :page-sizes="[10,20,30]" :page-size="queryParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" :current-page.sync="queryParam.pageNo" @size-change="handleNextJobSizeChange" @current-change="loadNextJobUserList()"></el-pagination>
    <div slot="footer" class="dialog-footer" style="margin-bottom: 20px; text-align: right;">
      <el-button type="primary" @click="submit">确 认</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </div>
</template>

<script>
import user from '../../api/user'
export default {
  name: "changeSelectPerson",
  data(){
    return {
      tableData:[],
      total: 0,  //数据总条数
      queryParam: {
        username: "",  //用户名
        pageNo: 1,
        pageSize: 10,
        moneyLevel: ""
      },
      currentRow: []  //获取选中的行
    }
  },
  props: {
    level: {
      type: String,
      required: true,
      default: ""
    }
  },
  watch: {
    level(newVal, oldVal){
      console.log(newVal)
      if(this.$tool.isNotEmptyStr(newVal)){  //确定初始化时显示
        this.queryParam.moneyLevel = newVal;
        this.loadNextJobUserList();
      }
    }
  },
  methods:{
    loadNextJobUserList(){  //加载下一个人员
      user.getNextJobUserByCurrentId(this.queryParam).then(res=>{
        this.total = res.data.data.totalCount;
        this.tableData = res.data.data.data;
      })
    },
    handleNextJobSizeChange(val){   //翻页时触发
      this.queryParam.pageSize=val;
      this.loadNextJobUserList();
    },
    handleCurrentChange(item){
      this.currentRowitem=item;
    },
    submit(){  //确认
      console.log(this.currentRowitem);
      this.$emit('submit', this.currentRowitem)
    },
    close(){  //关闭
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
