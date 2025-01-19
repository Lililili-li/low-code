<script setup lang="ts">
import Echart from '@/components/e-chart/Index.vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <div class="bar absolute h-full w-full">
    <Echart :option="attrs.option"/>
  </div>
</template>

<style scoped lang="less">

</style>
