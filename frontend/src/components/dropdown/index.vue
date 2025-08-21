<script setup lang="ts">
import { ref, provide, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";

const emits = defineEmits(["onContextmenu"]);
const style = reactive({
  x: 0,
  y: 0,
});
const dropdownVisible = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const onContextmenu = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  dropdownVisible.value = true;
  nextTick(() => {
    const menu = dropdownRef.value;
    const menuWidth = menu?.offsetWidth || 0;
    const menuHeight = menu?.offsetHeight || 0;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    let x = event.clientX;
    let y = event.clientY;
    if (x + menuWidth > winWidth) {
      x = winWidth - menuWidth - 8;
    }
    if (y + menuHeight > winHeight) {
      y = winHeight - menuHeight - 8;
    }
    x = Math.max(0, x);
    y = Math.max(0, y);
    style.x = x;
    style.y = y;
  });
  emits("onContextmenu", event);
};

// 全局点击关闭菜单
const onGlobalClick = (event: MouseEvent) => {
  // 如果点击在菜单内部，不关闭
  if (dropdownRef.value && dropdownRef.value.contains(event.target as Node)) return;
  dropdownVisible.value = false;
};

onMounted(() => {
  document.addEventListener("mousedown", onGlobalClick);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onGlobalClick);
});

provide("dropdownEvent", {
  close: () => {
    dropdownVisible.value = false;
  },
});
</script>
<template>
  <div class="dropdown-container w-full h-full relative" @contextmenu="onContextmenu">
    <div
      class="dropdown-content"
      v-if="dropdownVisible"
      :style="{
        left: style.x + 'px',
        top: style.y + 'px',
        zIndex: 1000,
        position: 'fixed',
      }"
      ref="dropdownRef"
      @mousedown.stop
      @contextmenu.stop
    >
      <slot name="content" />
    </div>
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
.dropdown-content {
  background: #48484d;
  color: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  padding: 4px;
  font-size: 14px;
  transition: box-shadow 0.2s;
}
:deep(.dropdown-content) > * {
  padding: 6px 8px;
  cursor: pointer;
  transition: background 0.2s;
}
:deep(.dropdown-content) > *:hover {
  background: #353b48;
}
</style>
