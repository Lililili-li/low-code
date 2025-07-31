<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  withDefaults,
} from "vue";
import Ruler from "./Ruler.vue";
import useMouse from "@/hooks/useMouse";
import panzoom from "panzoom";
import { throttle } from "@/utils";
import { useThrottleFn } from "@vueuse/core";

interface Props {
  canvasWidth?: number;
  canvasHeight?: number;
  width?: number;
  height?: number;
  scale: number;
  padding?: number;
  maxScale?: number;
  minScale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canvasWidth: 1920,
  canvasHeight: 1080,
  width: 1920,
  height: 1080,
  scrollWidth: 1920,
  scrollHeight: 1080,
  scale: 1,
  padding: 20,
  minScale: 0.1,
  maxScale: 2,
});

const emits = defineEmits(["update:scale"]);
let panzoomInstance = null;
const refSketchRuleBox = ref(null);
const $app = ref<HTMLElement | null>(null);
const $container = ref(null);

const verticalRulerRef = ref<HTMLElement | null>(null);
const horizontalRulerRef = ref<HTMLElement | null>(null);
const scrollState = {
  startY: 0,
  moveY: 0,
  startX: 0,
  moveX: 0,
};

let initScrollTop = 0;
let initScrollLeft = 0;
const handleScroll = (e) => {
  if (!$app.value) return;
  if (!verticalRulerRef.value) return;
  // 是否为向上滑动
  const afterTop = e.target.scrollTop;
  const afterLeft = e.target.scrollLeft;
  const deltaX = scrollState.startX - afterLeft;
  const deltaY = scrollState.startY - afterTop;
  const isDiagonal = Math.abs(deltaX) > 1 && Math.abs(deltaY) > 1;
  if (isDiagonal) {
    console.log("斜向滑动！", `Δx: ${deltaX}, Δy: ${deltaY}`);
    // 这里可以添加斜向滑动的处理逻辑
  } else if (Math.abs(deltaX) > 1) {
    scrollState.moveX = scrollState.startX - e.target.scrollLeft;
    (horizontalRulerRef.value as any).drawSketchRuler(0, Number(scrollState.moveX));
    scrollState.startX = e.target.scrollLeft;
    initScrollLeft = afterLeft;
  } else if (Math.abs(deltaY) > 1) {
    scrollState.moveY = scrollState.startY - e.target.scrollTop;
    (verticalRulerRef.value as any).drawSketchRuler(Number(scrollState.moveY), 0);
    scrollState.startY = e.target.scrollTop;
    initScrollTop = afterTop;
  }
};
const { moveState, setMoveState, calcMouseMoveDistance } = useMouse();

const handleWheel = (e: WheelEvent) => {
  throttle(() => {
    if (Math.abs(e.deltaX) !== 0 && Math.abs(e.deltaY) !== 0)
      return console.log("没有固定方向");
    if (e.ctrlKey) {
      if (e.deltaY > 0 && props.scale <= props.maxScale) {
        emits("update:scale", props.scale + 0.1);
      }
      if (e.deltaY < 0 && props.scale >= props.minScale) {
        emits("update:scale", props.scale - 0.1);
      }
    }
  }, 50);
};

const handleMouseDown = (e: MouseEvent) => {
  setMoveState({ startX: e.x, startY: e.y, type: "move" });
};
const handleMouseMove = (e: MouseEvent) => {
  const { moveX, moveY } = calcMouseMoveDistance(e, props.scale);
  // 做操作。。。。。
  if (e.metaKey && moveState.type === "move") {
    console.log(moveY - moveState.moveY);
    (verticalRulerRef.value as any).drawSketchRuler(moveY - moveState.moveY);
  }
  setMoveState({ moveX, moveY });
};
const handleMouseUp = (e: MouseEvent) => {
  setMoveState({ moveX: 0, moveY: 0, type: null });
};
const handleMouseLeave = (e: MouseEvent) => {
  setMoveState;
};

// 计算默认滚动距离，并设置正确的top和left值
const middleTop = ref(0);
const middleLeft = ref(0);
const clacScrollDistance = () => {
  nextTick(() => {
    const { height, width } = $app.value!.getBoundingClientRect();
    middleLeft.value = (width - props.canvasWidth! * props.scale) / 2;
    middleTop.value = (height - props.canvasHeight! * props.scale) / 2;
    ($app.value as any).scrollTop = 1000 - middleTop.value;
    scrollState.startY = 1000 - middleTop.value;
    ($app.value as any).scrollLeft = 1000 - middleLeft.value;
    scrollState.startX = 1000 - middleLeft.value;
  });
};

// 计算缩放倍数
const computedScale = () => {
  if (!$app.value) return 0;
  const app = $app.value as HTMLDivElement;
  const { width } = app.getBoundingClientRect();
  emits(
    "update:scale",
    Number(((width - props.padding * 2) / props.canvasWidth!).toFixed(2)) as number
  );
  // if (panzoomInstance) {
  //   panzoomInstance!.zoom(
  //     Number(((width - props.padding * 2) / props.canvasWidth!).toFixed(2)) as number
  //   );
  // }
};

watch(
  () => props.scale,
  () => {
    clacScrollDistance();
  }
);

const handleResize = () => {
  nextTick(() => {
    (verticalRulerRef.value as any).drawSketchRuler();
    (horizontalRulerRef.value as any).drawSketchRuler();
    computedScale();
    clacScrollDistance();
  });
};

onMounted(() => {
  clacScrollDistance();
  computedScale();
  window.addEventListener("resize", handleResize);
  // panzoomInstance = panzoom(document.getElementById("canvas-ruler"));
  // console.log(panzoomInstance);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
<template>
  <div class="l-ruler-container">
    <div class="horzontal-ruler">
      <Ruler
        layout="horizontal"
        :scale="props.scale as number"
        ref="horizontalRulerRef"
        :left="20"
      />
    </div>
    <div class="vertical-ruler">
      <Ruler
        layout="vertical"
        :scale="props.scale as number"
        ref="verticalRulerRef"
        :top="middleTop"
      />
    </div>
    <div class="line-visible"></div>
    <div
      ref="$app"
      class="edit-screens"
      style="height: calc(100% - 20px); width: calc(100% - 20px)"
      @scroll="handleScroll"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
      @wheel="(e) => handleWheel(e)"
    >
      <div
        ref="$container"
        class="edit-screen-container"
        style="width: 10000px; height: 10000px"
      >
        <!-- :style="{

            width: canvasWidth + 'px',
            height: canvasHeight + 'px',
            left: `1000px`,
            top: `1000px`,
          }" -->
        <div
          ref="refSketchRuleBox"
          class="canvas"
          id="canvas-ruler"
          :style="{
            transform: `scale(${props.scale}, ${props.scale})`,
            width: canvasWidth + 'px',
            height: canvasHeight + 'px',
            left: `1000px`,
            top: `1000px`,
          }"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.l-ruler-container {
  position: relative;
  width: 100%;
  height: calc(100% - 45px);
  .horzontal-ruler {
    width: calc(100% - 20px);
    height: 20px;
    position: absolute;
    left: 20px;
    top: 0;
  }
  .vertical-ruler {
    position: absolute;
    left: 0;
    top: 20px;
    height: calc(100% - 20px);
    width: 20px;
  }
}
.canvas {
  transform-origin: top left;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  cursor: crosshair;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  transition: all .3s;
}

.edit-screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  user-select: none;
  padding-bottom: 0px;
  top: 20px;
  left: 20px;
  z-index: 999;

  /* firefox */
  scrollbar-color: rgba(144, 146, 152, 0.3) transparent;
  scrollbar-width: thin;

  /* chrome */
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(144, 146, 152, 0.3);
  }
  // 修复右下角白点用的
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
}
:deep(.sketch-ruler) {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  pointer-events: none;
  top: 0;
  left: 0;
}
.edit-screen-container {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
