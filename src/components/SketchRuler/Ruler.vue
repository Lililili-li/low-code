<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { nextTick, onMounted, ref, watch } from "vue";

type Props = {
  layout?: "horizontal" | "vertical";
  scale: number;
  rulerColor?: string;
  labelColor?: string;
  scrollWidth?: number;
  scrollHeight?: number;
  top?: number;
  left?: number
};

const props = withDefaults(defineProps<Props>(), {
  layout: "horizontal",
  rulerColor: "#999",
  labelColor: "#999",
  scrollWidth: 10000,
  scrollHeight: 10000,
  top: 0,
  left: 0
});

const emits = defineEmits<{
  (event: "mousemove", position: number): void;
  (event: "click", position: number): void;
}>();

const canvasRef = ref<HTMLCanvasElement>();

onMounted(draw);
watch(props, draw);

/**
 * @description: 根据布局方向，绘制标尺
 * @return {*}
 */
function draw() {
  nextTick(() => {
    drawSketchRuler();
  })
}

/**
 * @description: 绘制刻度
 * @return {void}
 */
const state = {
  x: 0,
  y: 0
}
function drawSketchRuler(stepY = 0, stepX = 0) {
  const canvas = canvasRef.value as HTMLCanvasElement;
  if (!canvas) return;
  const containerRect = canvas?.getBoundingClientRect()!;
  const dpr = window.devicePixelRatio;
  canvas.width = Math.round(containerRect.width * dpr);
  canvas.height = Math.round(containerRect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  // 清空画布
  ctx.clearRect(0, 0, containerRect.width, containerRect.height);

  // 设置线条样式
  ctx.strokeStyle = props.rulerColor;
  ctx.lineWidth = 1;

  // 绘制标尺刻度数字
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = props.labelColor;

  const scale = props.scale;
  const rulerConfig = [
    { min: 8, max: 10, minSketch: 0.5, middleSketch: 2.5, maxSketch: 5 },
    { min: 4, max: 8, minSketch: 1, middleSketch: 5, maxSketch: 10 },
    { min: 2, max: 4, minSketch: 2, middleSketch: 10, maxSketch: 20 },
    { min: 1, max: 2, minSketch: 5, middleSketch: 25, maxSketch: 50 },
    { min: 0.5, max: 1, minSketch: 10, middleSketch: 50, maxSketch: 100 },
    { min: 0.3, max: 0.5, minSketch: 20, middleSketch: 100, maxSketch: 200 },
    { min: 0.1, max: 0.3, minSketch: 50, middleSketch: 250, maxSketch: 500 },
    { min: 0.01, max: 0.1, minSketch: 100, middleSketch: 500, maxSketch: 1000 },
  ];
  let info =
    scale >= 10
      ? rulerConfig[0]
      : rulerConfig.find((item) => item.min <= scale && scale < item.max);
  if (!info) return;

  const { minSketch, middleSketch, maxSketch } = info;
  if (props.layout === "horizontal") {
    if(stepX) {
      state.x += stepX
    } else {
      state.x = props.left
    }
    ctx.translate(state.x, 0)
    const min = -10000;
    const end = 99999;
    for (let i = min; i <= end; i += 1) {
      const point = i * scale;
      if (i % maxSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(point, 0);
        ctx.lineTo(point, 8);
        ctx.stroke();
        ctx.fillText(String(i), point + 10, 10);
      } else if (i % middleSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(point, 0);
        ctx.lineTo(point, 6);
        ctx.stroke();
      } else if (i % minSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(point, 0);
        ctx.lineTo(point, 4);
        ctx.stroke();
      }
    }
  } else {
    if(stepY) {
      state.y += stepY
    } else {
      state.y = props.top
    }
    ctx.translate(0, state.y )
    const min = -10000;
    const end = 99999;
    for (let i = min; i <= end; i += minSketch) {
      const point = i * scale;
      if (i % maxSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(0, point);
        ctx.lineTo(8, point);
        ctx.stroke();
      } else if (i % middleSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(0, point);
        ctx.lineTo(6, point);
        ctx.stroke();
      } else if (i % minSketch === 0) {
        ctx.beginPath();
        ctx.moveTo(4, point);
        ctx.lineTo(0, point);
        ctx.stroke();
      }
    }
    // 纵向标尺，绘制纵向文本
    ctx.rotate(-Math.PI / 2);
    for (let i = min; i <= end; i += minSketch) {
      const point = i * scale;
      if (i % maxSketch === 0) {
        ctx.fillText(String(i), -point - 10, 10);
      }
    }
    ctx.restore();
  }
}

/**
 * @description: 点击标尺触发
 * @param {MouseEvent} e
 * @return {void}
 */
const onClick = (e: MouseEvent) => {
  const position =
    props.layout === "horizontal" ? e.offsetX / props.scale : e.offsetY / props.scale;
  emits("click", Math.ceil(position * 10) / 10);
};

/**
 * @description:
 * @param {MouseEvent} e
 * @return {void}
 */
const onMousemove = (e: MouseEvent) => {
  const current =
    props.layout === "horizontal" ? e.layerX / props.scale : e.layerY / props.scale;
  emits("mousemove", Math.ceil(current * 10) / 10);
};

onMounted(() => {
  window.addEventListener("resize", () => {
    nextTick(() => {
      drawSketchRuler();
    });
  });
});

defineExpose({drawSketchRuler})
</script>

<template>
  <canvas
    style="width: 100%; height: 100%"
    ref="canvasRef"
    @click="onClick"
    @mousemove="onMousemove"
    class="canvas-ruler"
  />
</template>
<style lang="less" scoped>
.canvas-ruler {
  cursor: pointer;
}
</style>
