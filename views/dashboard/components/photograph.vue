<template>
  <div id="photograph">
    <span class="trackTitle">本周轨迹</span>
    <div class="templateBox">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in weekData" :key="index">
          <h4>时间: {{ item.commandcreateTime }}</h4>
          <h4>分部分项:{{ item.projectItem }}</h4>
          <h4>桩号: {{ item.commandzhuanghao }}</h4>
          <h4>拍摄地点: {{ item.commandphotoLocation }}</h4>
          <!-- <img :src="item.commandfilePath" alt> -->
          <template v-if="item.filetype=='jpg'||item.filetype == 'png' ||item.filetype == 'jpeg'">
              <img :src="item.pollingfilePath" alt />
            </template>
             <template  v-else-if="item.filetype==='mp4'">
                <img :src="(item.pollingfilePath.replace('mp4','jpg'))" alt  />
            </template>
            <template  v-else-if="item.filetype==='mov'">
                <img :src="(item.pollingfilePath.replace('mov','jpg'))" alt  />
            </template>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
  import homePage from '@/api/homePage.js'

  export default {
    data() {
      return {
        weekData: []
      }
    },
    mounted() {
      this.shoot()
    },
    methods: {
      shoot() {
        homePage.getPicMessage().then(res => {
          this.weekData = res.data.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #photograph {
    margin-top: 2vw;
    width: 100%;
    height: 100%;
    position: relative;

  img {
    width: 20vw;
    max-width: 150px;
    height: 150px;
  }

  .templateBox {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  }
  .trackTitle {
    font-size: 18px;
    font-weight: 600;
    position: absolute;
    left: 0.5vw;
    top: -2vw;
    font-family: 雅黑;
  }
</style>
