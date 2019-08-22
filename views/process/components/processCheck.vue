<template>
  <div class="demo-image__preview" style="overflow-y: auto; width: 100%; ">
    <table border="0" cellspacing="0" cellpadding="0"
           style="width: 100%; text-align: center; line-height: 28px;border-collapse:collapse;border:none;">
      <tr>
        <th width=5% height="35px">编码</th>
        <th width=20%>分部分项</th>
        <th width=10%>桩号</th>
        <th width=10%>工序名称</th>
        <th width=5%>状态</th>
      </tr>
      <tr>
        <td>{{currentProcess.projectid.split('_')[1]}}</td>
        <td>{{currentProcess.projectItem}}</td>
        <td>{{currentProcess.zhuanghao}}</td>
        <td>{{currentProcess.processName}}</td>
        <td>{{currentProcess.iscomplete == '1' ? '已完成' : '未完成'}}</td>
      </tr>
    </table>
    <br/>
    <table cellspacing="0" cellpadding="0"
           style="width: 100%; text-align: center; line-height: 28px; margin-top: 5px;border-collapse:collapse;border:none;">
      <tr>
        <th width="10%"></th>
        <th colspan="2" width="45%" height="35px">自检资料</th>
        <th colspan="2" width="45%" height="35px">验收资料</th>
      </tr>
      <tr>

        <td rowspan="2">计划</td>
        <td>时间</td>
        <td>自检人</td>
        <td>时间</td>
        <td>验收人</td>
      </tr>
      <tr>
        <td>{{currentProcess.planSelfCheckTime===null ? '&nbsp;': currentProcess.planSelfCheckTime}}</td>
        <td>{{currentProcess.planSelfCheckPerson===null ? '&nbsp;': currentProcess.planSelfCheckPerson}}</td>
        <td>{{currentProcess.planCheckTime===null ? '&nbsp;': currentProcess.planCheckTime}}</td>
        <td>{{currentProcess.planCheckPerson===null ? '&nbsp;': currentProcess.planCheckPerson}}</td>
      </tr>
      <tr>
        <td>实际</td>
        <td>{{currentProcess.realitySelfCheckTime===null ? '&nbsp;': currentProcess.realitySelfCheckTime}}</td>
        <td>{{currentProcess.realitySelfCheckPerson===null ? '&nbsp;': currentProcess.realitySelfCheckPerson}}</td>
        <td>{{currentProcess.realityCheckTime===null ? '&nbsp;': currentProcess.realityCheckTime}}</td>
        <td>{{currentProcess.realityCheckPerson===null ? '&nbsp;': currentProcess.realityCheckPerson}}</td>
      </tr>
      <tr>
        <td>描述</td>
        <td colspan="2">{{currentProcess.selfCheckDescribe===null ? '&nbsp;': currentProcess.selfCheckDescribe}}</td>
        <td colspan="2">{{currentProcess.checkDescribe===null ? '&nbsp;': currentProcess.checkDescribe}}</td>
      </tr>
      <tr>
        <td colspan="3" height="400px">
          <template v-if="currentProcess.SelfCheckFile!==null">
            <template v-for="(item, index) in currentProcess.SelfCheckFile">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="(node, file) in item.infolist">
                  <el-image
                    fit="fill"
                    :src="node.filePath"
                  ></el-image>
                </el-carousel-item>
              </el-carousel>
              <el-button type="primary" @click="pictureShows(item.infolist, 0)">点击查看大图
              </el-button>
            </template>
          </template>

          <template v-else>
            没有自检照片
          </template>
        </td>
        <td colspan="2">
          <template v-if="currentProcess.CheckFile!==null">
            <template v-for="(item, index) in currentProcess.CheckFile">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="(node, file) in item.infolist">
                  <el-image
                    fit="fill"
                    :src="node.filePath"
                  ></el-image>
                </el-carousel-item>
              </el-carousel>
              <el-button type="primary" @click="pictureShows(item.infolist, 0)">点击查看大图</el-button>
            </template>
          </template>


          <template v-else>
            没有验收照片
          </template>
        </td>
      </tr>
    </table>
    <br/>
    <div style="text-align: center;">
      <el-button v-if="currentProcess.previousPage==='yes'" size="mini" type="primary" icon="el-icon-arrow-left"
                 class="pan-btn light-blue-btn" @click="processPageOne('0')">上一道工序
      </el-button>
      <el-button v-if="currentProcess.nextPage==='yes'" size="mini" type="primary" icon="el-icon-arrow-right"
                 class="pan-btn light-blue-btn" @click="processPageOne('1')">下一道工序
      </el-button>
    </div>

    <!-- 图片详情弹出层 -->
    <el-dialog title="图片详情" fullscreen :visible.sync="imginnerVisible" append-to-body>
      <viewer :imgList="processPicture"></viewer>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import viewer from '@/components/viewer'

  export default {
    props: ['realList', 'processInfoId'],
    components: {
      viewer
    },
    data() {
      return {
        imginnerVisible: false,
        processPicture: [],
        CheckFile: [],
        SelfCheckFile: [],
        currentProcess: {},
        currentProcessInfoId: this.processInfoId
      }
    },
    watch: {
      realList: {
        handler(newVal, oldVal) {
          this.currentProcess = newVal
        },
        deep: true
      }
    },
    created() {
    },
    methods: {
      pictureShows(item, index) {
        this.processPicture = item
        this.imginnerVisible = true
      },
      showProjectTypeLabel(type) {
        switch (type) {
          case '1':
            return '单位工程'
            break
          case '2':
            return '子单位工程'
            break
          case '3':
            return '分部工程'
            break
          case '4':
            return '子分部工程'
            break
          case 5:
            return '分部工程'
            break
          case '6':
            return '子分部工程'
            break
        }
      },
      changeStateLabel(val, state) {
        if (state === null || state === '' || state === undefined) {
          if (val === 0) {
            return '已指定工序,待指定计划'
          } else if (val === 1) {
            return '已指定计划,待自检'
          } else if (val === 2) {
            return '已自检,待验收'
          }
        } else {
          if (val === 2 && state === '0') {
            return '不通过,待自检'
          } else {
            if (val === 3 && state === '1') {
              return '已验收,通过'
            }
          }
        }
      },
      processPageOne(state) {   //工序翻页
        request.post('/rest/processCheck/getProcessNextDetail', {
          id: this.currentProcessInfoId,
          isNext: state
        }).then(res => {
          let that = this
          if (res.data.data) {
            this.currentProcess = res.data.data
            this.currentProcessInfoId = res.data.data.infoId
          }

        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    color: #000;
    border: 1px solid #ddd;
  }

  td {
    border: 1px solid #ddd;

  }
</style>
