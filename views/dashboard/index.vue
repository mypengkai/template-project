<template>
  <div class="homeLayout ">
    <div class="a">
      <broken></broken>
    </div>
    <div class="c">
      <cookie></cookie>
    </div>
    <div class="b">
      <photograph></photograph>
    </div>
  </div>
</template>

<script>
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
    /*overflow: hidden;*/

    .a {
      position: absolute;
      width: 100%;
      height: 50%;
      bottom: 0
    }

    .b {
      position: absolute;
      width: 50%;
      height: 100%;
      right: 0;
      top: 10px
    }

    .c {
      position: absolute;
      width: 50%;
      height: 50%;
      left: 0;
      top: 10px
    }

  }

</style>
