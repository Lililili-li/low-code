<script setup lang="ts">
import { inject } from "vue";

const dropdownEvent = inject<{ close: () => void }>("dropdownEvent", { close: () => {} });

function handleClick(event: MouseEvent | KeyboardEvent) {
  dropdownEvent.close();
  // 透传 click 事件
  // @ts-ignore
  // if (typeof $attrs.onClick === "function") {
  //   // @ts-ignore
  //   $attrs.onClick(event);
  // }
}
</script>

<template>
  <div
    class="dropdown-item"
    v-bind="$attrs"
    @click="handleClick"
    role="menuitem"
    tabindex="0"
    @keydown.enter="handleClick"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.dropdown-item {
  transition: background 0.3s;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 10px;
  outline: none;
  &:hover, &:focus {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
