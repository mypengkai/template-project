<template>
  <div id="cookie">
    <span class="trackTitle">我的任务</span>
    <el-row>
      <el-col :span="6">
        <div class="grid-content" @click="pollRouter">
          <div class="noComplete1">
            <p class="p1 ng-binding">{{data.toBeSelfChecked}}</p>
            <p class="p2">工序待自检</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" @click="pollRouter">
          <div class="noComplete2">
            <p class="p1 ng-binding">{{data.toBeChecked}}</p>
            <p class="p2">工序待验收</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" @click="comandRouter">
          <div class="noComplete3">
            <p class="p1 ng-binding">{{data.toBeProcessed}}</p>
            <p class="p2">指令待处理</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" @click="meetRouter">
          <div class="noComplete4">
            <p class="p1 ng-binding">{{data.toBeMeeting}}</p>
            <p class="p2">会议待处理</p>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import homePage from '@/api/homePage.js'

  export default {
    mounted() {
      this.record()
    },
    data() {
      return {
        data: {
          toBeSelfChecked: '',
          toBeChecked: '',
          toBeProcessed: '',
          toBeMeeting: ''
        }
      }
    },
    methods: {
      record() {
        homePage.getMytask().then(res => {
          this.data = res.data.data[0]
        })
      },
      pollRouter(){
          this.$router.push({path:"/accept/accept"})
      },
      comandRouter(){
           this.$router.push({path:"/instruct/instructReceive"})
      },
      meetRouter(){
           this.$router.push({path:"/meeting/receiveMeeting"})
      }
    }
  }
</script>

<style>
  #cookie {
    width: 100%;
    height: 90%;
  }


  .p1 {
    padding-top: 25px;
    font-size: 20px;
    color: #fff;
  }

  .p2 {
    font-size: 14px;
    color: #fff;
  }

  .noComplete1, .noComplete2, .noComplete3, .noComplete4 {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    margin: 0 auto;
    /*cursor: pointer;*/
    text-align: center;
  }

  .noComplete1 {
    background: linear-gradient(45deg, #4895F6, #4E5EF6);
  }

  .noComplete2 {
    background: linear-gradient(45deg, #f6b51a, #ffe92c);
  }

  .noComplete3 {
    background: linear-gradient(45deg, #4dd0e1, #10eab4);
  }

  .noComplete4 {
    background: linear-gradient(45deg, #ff7e63, #ff4d55);

  }

  .trackTitle {
    font-size: 18px;
    font-weight: 600;
    left: 0.5vw;
    top: -2vw;
    margin-left: 10px;
    font-family: 雅黑;
  }
</style>
