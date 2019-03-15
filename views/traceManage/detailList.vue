<template>
  <div class="p20">
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'DetailList',
  props: {
    traceType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    title() {
      return this.traceType === 1 ? '工程痕迹管理' : '人员痕迹管理'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
