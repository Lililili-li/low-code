<script setup lang="ts">
import { computed, nextTick, onMounted, ref, withDefaults } from "vue";
import Ruler from "./Ruler.vue";
import useMouse from "@/hooks/useMouse";

interface Props {
  canvasWidth?: number;
  canvasHeight?: number;
  width?: number;
  height?: number;
  scale: number;
  padding?: number
}

const props = withDefaults(defineProps<Props>(), {
  canvasWidth: 1920,
  canvasHeight: 1080,
  width: 1920,
  height: 1080,
  scrollWidth: 1920,
  scrollHeight: 1080,
  scale: 1,
  padding: 20
});

const refSketchRuleBox = ref(null);
const $app = ref<HTMLElement | null>(null);
const $container = ref(null);

const verticalRulerRef = ref<HTMLElement | null>(null);
const scrollState = {
  startY: 3000,
  moveY: 0,
};
const handleScroll = (e) => {
  if (!$app.value) return;
  if (!verticalRulerRef.value) return;
  // 是否为向上滑动

  const isTop = e.target.scrollTop < 3000 ? true : false;
  if (isTop) {
    scrollState.moveY = (scrollState.startY - e.target.scrollTop) * computedScale.value!;
    (verticalRulerRef.value as any).drawSketchRuler(
      Number(scrollState.moveY)
    );
    scrollState.startY = e.target.scrollTop;
    // if (e.target.scrollTop === 0) {
    //   console.log('到顶了');
    //   (verticalRulerRef.value as any).drawSketchRuler(-middleTop.value)
    // }
  } else {
  }
};
const { moveState, setMoveState, calcMouseMoveDistance } = useMouse();

const handleMouseDown = (e: MouseEvent) => {
  setMoveState({ startX: e.x, startY: e.y, type: "move" });
}
const handleMouseMove = (e: MouseEvent) => {
  const { moveX, moveY } = calcMouseMoveDistance(e, props.scale);
  // 做操作。。。。。
  if (e.metaKey && moveState.type === 'move') {
    console.log(moveY - moveState.moveY);
    (verticalRulerRef.value as any).drawSketchRuler(moveY - moveState.moveY)
  }
  setMoveState({ moveX, moveY });

}
const handleMouseUp = (e: MouseEvent) => {
  setMoveState({ moveX: 0, moveY: 0, type: null });
}
const handleMouseLeave = (e: MouseEvent) => {
  setMoveState
}

// 计算默认滚动距离，并设置正确的top和left值
const middleTop = ref(0);
const clacScrollDistance = () => {
  nextTick(() => {
    ($app.value as any).scrollTop = 3000;
    ($app.value as any).scrollLeft = 3000;
    const { height } = $app.value!.getBoundingClientRect();
    middleTop.value = (height - props.canvasHeight! * computedScale.value!) / 2;
  });
};

// 计算缩放倍数
const computedScale = computed(() => {
  if (!$app.value) return;
  const app = $app.value as HTMLDivElement;
  const { width } = app.getBoundingClientRect();
  return Number(((width - props.padding * 2) / props.canvasWidth!).toFixed(2)) as number;
});

onMounted(() => {
  clacScrollDistance();
});
</script>
<template>
  <div class="l-ruler-container">
    <div class="horzontal-ruler">
      <Ruler
        layout="horizontal"
        :scale="computedScale as number"
        ref="horizontalRulerRef"
        :left="40"
      />
    </div>
    <div class="vertical-ruler">
      <Ruler
        layout="vertical"
        :scale="computedScale as number"
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
    >
      <div
        ref="$container"
        class="edit-screen-container"
        style="width: 10000px; height: 10000px"
      >
        <div
          ref="refSketchRuleBox"
          class="canvas"
          :style="{
            transform: `scale(${computedScale}, ${computedScale})`,
            width: canvasWidth + 'px',
            height: canvasHeight + 'px',
            left: `3020px`,
            top: `${3000 + middleTop}px`,
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
