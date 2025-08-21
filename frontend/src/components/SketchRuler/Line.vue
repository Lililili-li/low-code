<template>
  <div
    class="line"
    v-show="showLine"
    :style="[offset, borderCursor]"
    @mousedown="handleDown"
  >
    <div class="action" :style="actionStyle">
      <span class="del" @click="handleRemove">&times;</span>
      <span class="value">{{ startValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props 类型定义
interface Props {
  index: number;
  start: number;
  vertical: boolean;
  scale: number;
  value: number;
  palette: {
    lineColor: string;
  };
  isShowReferLine: boolean;
  thick: number;
}

// Props 定义
const props = withDefaults(defineProps<Props>(), {
  index: 0,
  start: 0,
  vertical: false,
  scale: 1,
  value: 0,
  palette: () => ({
    lineColor: '#DADADC'
  }),
  isShowReferLine: true,
  thick: 0
});

// Emits 定义
const emit = defineEmits<{
  (e: 'onMouseDown'): void;
  (e: 'onRelease', value: number, index: number): void;
  (e: 'onRemove', index: number): void;
}>();

// Refs
const startValue = ref(props.value);
const showLine = ref(true);

// Computed
const offset = computed(() => {
  const offset = (startValue.value - props.start) * props.scale;
  showLine.value = offset >= 0;

  const positionValue = offset + "px";
  return props.vertical
    ? { top: positionValue }
    : { left: positionValue };
});

const borderCursor = computed(() => {
  const borderValue = `1px solid ${props.palette.lineColor}`;
  const border = props.vertical
    ? { borderTop: borderValue }
    : { borderLeft: borderValue };

  const cursorValue = props.isShowReferLine
    ? props.vertical
      ? "ns-resize"
      : "ew-resize"
    : "none";

  return {
    cursor: cursorValue,
    ...border,
  };
});

const actionStyle = computed(() => {
  return props.vertical
    ? { left: props.thick + "px" }
    : { top: props.thick + "px" };
});

// Methods
const handleDown = (e: MouseEvent) => {
  const startD = props.vertical ? e.clientY : e.clientX;
  const initValue = startValue.value;
  emit('onMouseDown');

  const onMove = (e: MouseEvent) => {
    const currentD = props.vertical ? e.clientY : e.clientX;
    const newValue = Math.round(initValue + (currentD - startD) / props.scale);
    startValue.value = newValue;
  };

  const onEnd = () => {
    emit('onRelease', startValue.value, props.index);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
};

const handleRemove = () => {
  emit('onRemove', props.index);
};

// 生命周期
onMounted(() => {
  startValue.value = props.value;
});
</script>

<style lang="less" scoped>
.line {
  position: absolute;
  .action {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    pointer-events: none;
    transform: scale(0.83);
  }
  .del {
    cursor: pointer;
    padding: 3px 5px;
    visibility: hidden;
  }
  &:hover .del {
    visibility: visible;
  }
}

.h-container {
  .line {
    height: 100vh;
    top: 0;
    padding-left: 5px;
    .action {
      transform: translateX(-24px);
      .value {
        margin-left: 4px;
      }
    }
  }
}

.v-container {
  .line {
    width: 100vw;
    left: 0;
    padding-top: 5px;
    .action {
      transform: translateY(-24px);
      flex-direction: column;
      .value {
        margin-top: 4px;
      }
    }
  }
}
</style>
