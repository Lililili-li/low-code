<template>
  <div class="collapsible-panel">
    <div class="panel-header" @click="togglePanel">
      <slot name="header">面板标题</slot>
      <div class="icon-right" :style="{ transform: isExpanded?'rotate(90deg)':'rotate(0deg)'  }">
        <icon-right style="color: rgb(var(--primary-6))"/>
      </div>
    </div>
    <div class="panel-content-wrapper" :style="{ maxHeight: isExpanded ? '99999999px' : '0px',opacity: isExpanded?1: 0 }">
      <div class="panel-content" ref="contentRef">
        <slot>面板内容区域</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  // 可选：默认展开状态
  defaultExpanded: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['expand', 'collapse']);

// 状态
const isExpanded = ref(props.defaultExpanded);
const contentRef = ref(null);
const contentHeight = ref(0);

// 方法
const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    updateContentHeight();
    emit('expand');
  } else {
    emit('collapse');
  }
};

const updateContentHeight = () => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.offsetHeight;
  }
};

// 监听内容区域变化
watch(() => contentRef.value?.offsetHeight, (newHeight) => {
  if (isExpanded.value && newHeight) {
    contentHeight.value = newHeight;
  }
});

// 生命周期钩子
onMounted(() => {
  updateContentHeight();
});
</script>

<style scoped lang="less">
.collapsible-panel {
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #333;
  .icon-right {
    transition: all 0.2s;
  }
}


.panel-content-wrapper {
  transition: all 0.3s;
  overflow: hidden;
  // border: 1px solid #e5e7eb;
}

</style>
