<script setup lang="ts">
const { lineList } = defineProps(['lineList'])
</script>

<template>
  <div
    data-id="axis"
    :class="[item.direction === 'vertical' ? 'v-line' : 'h-line', 'line']"
    v-for="item in lineList"
    :key="item.id"
    :style="{
      height: item.height + 'px',
      width: item.width + 'px',
      left: item.left + 'px',
      top: item.top + 'px',
    }"
    v-show="item.visible"
  >
    <span :class="item.direction === 'vertical' ? 'v-line-text' : 'h-line-text'">
      {{ item.width }}
    </span>
  </div>
</template>

<style scoped lang="less">
.h-line-text {
  position: absolute;
  bottom: -110%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
