<template>
  <div class="homeLayout p20">
      <div class="a">
         <broken></broken>
      </div>
      <div class="b">
        <photograph></photograph>
      </div>
      <!-- <div class="c">
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
    width: 100%;
    height: 50%;
    left: 0;
    top: 0;
  }
  .b{
     position: absolute;
    width: 100%;
    height: 50%;
    left: 0;
    
    bottom: 0;
  }

}
</style>
