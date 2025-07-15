<script setup lang="ts">
import Echart from '@/components/Echart/index.vue'
import { useAttrs } from 'vue'

const emits = defineEmits(['onChartClick'])
const attrs = useAttrs()

const onChartClick = (event) => {
  emits('onChartClick', event)
}
</script>

<template>
  <div
    class="bar absolute h-full w-full animate__animated"
    :class="attrs.animationName && `animate__${attrs.animationName}`"
  >
    <Echart :option="attrs.option" @click="onChartClick" />
  </div>
</template>

<style scoped lang="less"></style>
