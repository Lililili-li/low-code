<script setup lang="ts">
import EmptyIcon from '@/assets/images/empty.png'

const { content } = defineProps({
  content: {
    type: String,
    default: '暂无数据',
  },
})
</script>

<template>
  <a-empty>
    <template #image>
      <div class="flex justify-center"><img :src="EmptyIcon" alt="" /></div>
    </template>
    {{ content }}
  </a-empty>
</template>

<style scoped lang="less"></style>
