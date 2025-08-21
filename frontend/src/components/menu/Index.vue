<script setup lang="ts">
import type { Component } from "vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";

const componentConfigStore = useComponentConfigStore()

export type MenuItemType = {
  label: string;
  key: string;
  icon: Component;
  disabled?: boolean; // 添加 disabled 属性
};
const emits = defineEmits(['onChange'])
const { options, activeKey } = defineProps<{ options: MenuItemType[], activeKey: string | number | null }>();
const onChangeMenu = (item: MenuItemType) => { // 为 item 添加类型
  if (item.disabled) { // 如果禁用，则不执行
    return;
  }
  emits('onChange', item)
}
</script>
<template>
  <div class="menu-list flex flex-col gap-3 pt-2 pl-1 pr-1">
    <a-tooltip :content="item.label" v-for="item in options" :key="item.key" position="right">
      <div class="menu-item" :class="{'active': activeKey === item.key, 'disabled': item.disabled}" @click="onChangeMenu(item)">
        <component :is="item.icon" style="width: 100%;height: 20px"></component>
      </div>
    </a-tooltip>
  </div>
</template>
<style scoped lang="less">
.menu-item {
  padding: 5px 0;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: var(--color-secondary);
  }
  &.active {
    color: rgb(var(--primary-6));
    background-color: var(--color-secondary);
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    &:hover {
      background-color: transparent; // 禁用时 hover 无背景色变化
    }
  }
}
</style>
