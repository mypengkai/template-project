<template>
  <div class="homeLayout p20">
      <div class="a">
         <broken></broken>
      </div>
      <div class="b">
        <photograph></photograph>
      </div>
      <div class="c">
         <cookie></cookie>
      </div>

    <!-- 折线图 -->
    <!-- <div style="width: 70%;">
         <broken></broken>
    </div> -->
    <!-- 饼图统计 -->
    <!-- <div style="width: 30%;">
      <cookie></cookie>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import broken from "./components/broken";
import cookie from "./components/cookie";
import photograph from "./components/photograph";
export default {
  components: {
    broken,
    cookie,
    photograph
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.homeLayout {
  height: 82vh;
  position: relative;
  .a{
    position: absolute;
    width: 70%;
    height: 50%;
    left: 0;
    top: 0;
  }
  .b{
     position: absolute;
    width: 70%;
    height: 50%;
    left: 0;
    bottom: 0;
  }
  .c{
     position: absolute;
    width: 30%;
    height: 100%;
    right: 0;
    top: 0;
  }
}
</style>
