<script setup lang="ts">
import { ref } from 'vue'
import { animationList } from './animation.config.js'
import { useComponentConfigStore } from '@/stores/useComponentConfigStore.js'
import Title from '@/components/Title/index.vue'

const componentConfigStore = useComponentConfigStore()
const hoverPreviewAnimate = ref('')
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="animation-page pr-3 pl-3">
      <div v-for="item in animationList" :key="item.label">
        <Title :title="item.label"></Title>
        <div class="flex flex-wrap justify-between gap-2 mb-3">
          <div
            class="item"
            :class="[hoverPreviewAnimate === an.value && `animate__animated animate__${an.value}`]"
            v-for="an in item.children"
            :key="an.label"
            @click="componentConfigStore.setComponentClassName(an.value as string)"
            @mouseenter="hoverPreviewAnimate = an.value"
          >
            {{ an.label }}
          </div>
        </div>
      </div>
    </div>
  </a-scrollbar>
</template>
<style lang="less" scoped>
.item {
  width: 31%;
  border: 1px solid #666;
  padding: 10px 2px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}
:deep(.arco-collapse-item-content) {
  padding-left: 0;
  padding-right: 0;
  background: transparent;
}
</style>
