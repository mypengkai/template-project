<template>
   <el-carousel :interval="5000" arrow="always" height="30vh">
    <el-carousel-item v-for="item in 3" :key="item">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {

}
</script>

<style>
 .el-carousel__item:nth-of-type(1) {
  background: url(../../imgs/lun1/tim1.jpg) no-repeat center;
  background-size: 100% 100%;
}

.el-carousel__item:nth-of-type(2) {
  background: url(../../imgs/lun1/tim2.jpg) no-repeat center;
  background-size: 100% 100%;
}
.el-carousel__item:nth-of-type(3) {
  background: url(../../imgs/lun1/tim3.jpg) no-repeat center;
  background-size: 100% 100%;
}
</style>