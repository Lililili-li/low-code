<script setup lang="ts">
import { useComponentConfigStore } from "@/stores/useComponentConfigStore.js";
import { computed, ref } from "vue";
import Title from "@/components/Title/index.vue";
import { animationList } from "./animation.config";

const compConfig = computed(() => componentConfigStore?.activeComponent!);
const componentConfigStore = useComponentConfigStore();
const hoverPreviewAnimate = ref("");
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="style-page pr-3 pl-3">
      <a-space direction="vertical">
        <a-space class="w-full" align="center" justify="center">
          <a-typography style="width: 30px">尺寸</a-typography>
          <div style="flex: 1" class="flex justify-between">
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.width"
              @change="
                (value) => {
                  compConfig.style.scaleWidth = value;
                }
              "
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">宽</span>
              </template>
            </a-input-number>
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.height"
              @change="
                (value) => {
                  compConfig.style.scaleHeight = value;
                }
              "
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">高</span>
              </template>
            </a-input-number>
          </div>
        </a-space>
        <a-space class="w-full" align="center" justify="center">
          <a-typography style="width: 30px">位置</a-typography>
          <div style="flex: 1" class="flex justify-between">
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.top"
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">上</span>
              </template>
            </a-input-number>
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.left"
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">左</span>
              </template>
            </a-input-number>
          </div>
        </a-space>
      </a-space>
      <div class="animation-page mt-2">
        <div v-for="item in animationList" :key="item.label">
          <Title :title="item.label"></Title>
          <div class="flex flex-wrap justify-between gap-2 mb-3">
            <div
              class="item"
              :class="[
                hoverPreviewAnimate === an.value &&
                  `animate__animated animate__${an.value}`,
              ]"
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
    </div>
  </a-scrollbar>
</template>
<style lang="less" scoped>
:deep(.arco-input-wrapper) {
  input {
    text-align: center;
  }
}
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
