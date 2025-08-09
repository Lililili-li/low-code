<template>
  <canvas
    class="ruler"
    ref="canvasRef"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { drawHorizontalRuler, drawVerticalRuler } from "./utils";

// Props 定义
interface Props {
  vertical?: boolean;
  start?: number;
  scale?: number;
  width?: number;
  height?: number;
  canvasConfigs?: {
    ratio: number;
    bgColor: string;
    fontColor: string;
    shadowColor: string;
    longfgColor: string;
    shortfgColor: string;
  };
  selectStart?: number;
  selectLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  start: 0,
  scale: 1,
  width: 200,
  height: 20,
  canvasConfigs: () => ({
    ratio: window.devicePixelRatio || 1,
    bgColor: '#ffffff',
    fontColor: '#4d4d4d',
    shadowColor: '#18181c',
    longfgColor: '#4d4d4d',
    shortfgColor: '#4d4d4d'
  }),
  selectStart: 0,
  selectLength: 0
});

// Emits 定义
const emit = defineEmits<{
  (e: 'onAddLine', value: number): void;
  (e: 'onIndicatorShow', value: number): void;
  (e: 'onIndicatorMove', value: number): void;
  (e: 'onIndicatorHide'): void;
}>();

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null);
let canvasContext: CanvasRenderingContext2D | null = null;

// 工具函数
const getValueByOffset = (offset: number, start: number, scale: number) =>
  Math.round(start + offset / scale);

// 方法定义
const updateCanvasContext = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const { ratio } = props.canvasConfigs;

  // 设置比例宽高
  canvas.width = props.width * ratio;
  canvas.height = props.height * ratio;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.font = `${12 * ratio}px -apple-system,
              "Helvetica Neue", ".SFNSText-Regular",
              "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
              "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`;
  ctx.lineWidth = 1;
  ctx.textBaseline = 'middle';
  canvasContext = ctx;
};

const drawRuler = () => {
  if (!canvasContext) return;

  const options = {
    scale: props.scale,
    width: props.width,
    height: props.height,
    canvasConfigs: props.canvasConfigs,
  };

  if (props.vertical) {
    drawVerticalRuler(
      canvasContext,
      props.start,
      { y: props.selectStart, height: props.selectLength },
      options
    );
  } else {
    drawHorizontalRuler(
      canvasContext,
      props.start,
      { x: props.selectStart, width: props.selectLength },
      options
    );
  }
};

// 事件处理
const handleClick = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX;
  const value = getValueByOffset(offset, props.start, props.scale);
  emit('onAddLine', value);
};

const handleEnter = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX;
  const value = getValueByOffset(offset, props.start, props.scale);
  emit('onIndicatorShow', value);
};

const handleMove = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX;
  const value = getValueByOffset(offset, props.start, props.scale);
  emit('onIndicatorMove', value);
};

const handleLeave = () => {
  emit('onIndicatorHide');
};

// 监听属性变化
watch(() => props.start, () => {
  drawRuler();
});

watch(() => props.width, () => {
  updateCanvasContext();
  drawRuler();
});

watch(() => props.height, () => {
  updateCanvasContext();
  drawRuler();
});

// 生命周期
onMounted(() => {
  updateCanvasContext();
  drawRuler();
});

// 暴露方法给父组件
defineExpose({
  drawRuler
});
</script>

<style scoped>
.ruler {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
