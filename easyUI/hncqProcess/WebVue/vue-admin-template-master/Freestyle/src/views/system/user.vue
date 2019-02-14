<template>
    <div>
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
                <el-button type="primary" icon="el-icon-search">查询</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
            :data="tableData"
            style="width: 100%;padding-left:15px">
            <el-table-column
            label="日期"
            width="180">
            <template slot-scope="scope">
                <span>{{ scope.row.date }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="姓名"
            width="180">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <!-- 点击显示侧边栏 -->
                <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true" >收起</el-radio-button>
                </el-radio-group>
                <el-menu default-active="2" class="el-menu-vertical-demo" @click="open(1)" @open="handleOpen" @close="handleClose" :collapse="isCollapse" v-if="isCollapse==false">
                <el-menu-item index="1">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span>导航二</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span>导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span>导航四</span>
                </el-menu-item>
                </el-menu>
                <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看类型</el-button> -->
            </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block" style="padding-left:15px" id="blockTop">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="15"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
            </el-pagination>
        </div>
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                    <el-radio-button :label="false">展开</el-radio-button>
                    <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group>
                <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="abc" :collapse="isCollapse">
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span slot="title">导航一</span>
                        </template>
                        <el-menu-item-group>
                        <span slot="title">分组一</span>
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                        <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                        <span slot="title">选项4</span>
                        <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu> -->
    </div>
</template>

<script>
export default {
    data(){
        return{
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
            isCollapse: true,
            form:{
            // 条数
            pageNo:1,
            // 页数
            pageSize:4,
            // 姓名值
            userName: '',
            // 开始时间
            startTime:'',
            // 结束时间
            endTime:'',
        },
        }
    },
    methods: {
        // 查看类型按钮
      handleEdit(index, row) {
        console.log(index, row);
      },
        // 删除按钮
      handleDelete(index, row) {
        console.log(index, row);
      },
    //   分页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
    //   分页页数
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
       handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    //    abc(key, keyPath) {
    //     console.log(key, keyPath);
    //   },
    }
}
</script>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
