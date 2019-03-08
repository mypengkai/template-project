<template>
    <div class="acceptzh">
        <el-row>
            <el-col :span="22">
                <el-form inline>
                    <el-form-item label="组织机构：">
                        <select-tree :options="options" :props="defaultProp" v-on:noDe="noDe" v-model="value"/>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="chaxun()">查询</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" height="70vh" v-if="tableData.length!=0">
            <el-table-column prop="name1" label="单位工程1">
            </el-table-column>
            <el-table-column prop="name2" label="子单位工程2">
            </el-table-column>
            <el-table-column prop="name3" label="分部工程3">
            </el-table-column>
            <el-table-column prop="name4" label="子分部工程4">
            </el-table-column>
            <el-table-column prop="name5" label="分部工程5">
            </el-table-column>
            <el-table-column prop="name6" label="工程6">
            </el-table-column>
            <el-table-column prop="processName" label="工序名">
            </el-table-column>
            <el-table-column prop="processType" label="工序过程">
            </el-table-column>
            <el-table-column prop="planCheckTime" label="时间">
            </el-table-column>
            <el-table-column prop="state" label="状态">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="primary" size="small" >查看</el-button>
            </template>
            </el-table-column>
        </el-table>
        <!-- 查看弹框 -->
        <el-dialog title="查看详情" :visible.sync="dialogTableVisible" width="80%">
        <imgList :chakanData='chakanData' :imgData='imgData' :imgData2='imgData2' :imgId='imgId' :zijian='zijian' :yanshou='yanshou' :imgForm='imgForm' :imgData3='imgData3' @imgLeft='imgLeft'></imgList>
        </el-dialog>
    </div>
</template>

<script>
import SelectTree from '@/components/SelectTree/selectTree.vue';
import imgList from './components/imgList'
import request from '@/utils/request'
export default {
    components:{
        SelectTree,
        imgList
    },
    data(){
        return{
            defaultProp: {
                children: "children",
                label: "departName"
            },
            imgForm:{
                describe:"",
                createTime:"",
                lat:"",
                lgt:"",
                photoDescribe:"",
                photoLocation:"",
                state:""
            },
            dialogTableVisible:false,
            value:'',
            options: [],
            tableData:[],
            chakanData:[],
            imgData:null,
            imgData2:null,
            imgData3:null,
            imgId:'',
            orgId:'',
            zijian:'',
            yanshou:'',
        }
    },
    mounted(){
        this.fn()
    },
    methods:{
        // 初始化组织机构input框数据
        fn(){
            request.get('/rest/organizate/depart').then((res)=>{
                this.options=res.data.data;
            })
        },
        // 点击组织机构节点获取ID
        noDe(data){
            this.orgId=data.id
        },
        // 查询接口
        chaxun(){
            request.post('/rest/processCheck/searchCheakDeatil',{orgId:this.orgId}).then((res)=>{
                if(res.data.respCode=='0'){
                    this.tableData=res.data.data
                }
            })
        },
          // 查看工程接口
        handleClick(row) {
            this.chakanData.length=0;
            this.dialogTableVisible=true;
            console.log(row)
            request.post('/rest/processCheck/getProcessDetail',{id:row.gongxuid}).then(res=>{
                if(res.data.respCode=="0"){
                    console.log(res)
                this.chakanData.push(res.data.data)
                this.zijian=this.chakanData.selfCheckDescribe;
                this.yanshou=this.chakanData.checkDescribe;
                this.imgData=res.data.data.pictures.selfFilePath;
                this.imgData2=res.data.data.pictures.filePath;
                this.imgId=this.chakanData[0].processLogId;
                }
            })
        },
        // 点击图片展示图片详情接口
        imgLeft(data,imgTan){
            imgTan;
            request.post('/rest/processCheck/getPictureDetail',{processLogId:this.imgId,Mark:data}).then((res)=>{
                this.imgForm.describe=res.data.data[0].describe;
                this.imgForm.createTime=res.data.data[0].createTime;
                this.imgForm.lat=res.data.data[0].lat;
                this.imgForm.lgt=res.data.data[0].lgt;
                this.imgForm.photoDescribe=res.data.data[0].photoDescribe;
                this.imgForm.photoLocation=res.data.data[0].photoLocation;
                this.imgForm.state=res.data.data[1].state=='0'?'自检':'验收';
                res.data.data.shift();
                this.imgData3=res.data.data;
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .acceptzh{
        padding: 20px;
        /deep/ .select-tree .el-input.el-input--suffix{
            width: 400px;
        }
        /deep/ .el-popper{
            width: 400px;
        }
    }
</style>
