<template>
  <div class="wrapper">
    <SketchRule
      :thick="panelConfigStore.panelSetting.thick"
      v-model:scale="panelConfigStore.panelScaleConf.scale"
      :width="panelConfigStore.panelSetting.width"
      :height="panelConfigStore.panelSetting.height"
      :startX="panelConfigStore.panelSetting.startX"
      :startY="panelConfigStore.panelSetting.startY"
      :shadow="{ x: 0, y: 0, width: 0, height: 0 }"
      :cornerActive="true"
      :horLineArr="[]"
      :verLineArr="[]"
      :palette="panelConfigStore.panelSetting.palette"
    >
    </SketchRule>
    <div
      ref="screensRef"
      id="screens"
      @scroll="handleScroll"
      @wheel="handleWheel"
      :style="{
        left: panelConfigStore.panelSetting.thick + 'px',
        top: panelConfigStore.panelSetting.thick + 'px',
        cursor: panelConfigStore.isMoving ? 'grabbing' : 'default',
      }"
    >
      <div
        ref="containerRef"
        class="screen-container"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      >
        <div id="canvas" :style="canvasStyle">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SketchRule from "@/components/SketchRuler/index.vue";
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import Panzoom, { type PanzoomEventDetail } from "@panzoom/panzoom";
import useMouse from "@/hooks/useMouse";
import { throttle } from "@/utils";

const panelConfigStore = usePanelConfigStore();
const screensRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const canvasStyle = computed(() => ({
  width: panelConfigStore.canvasSetting.width + "px",
  height: panelConfigStore.canvasSetting.height + "px",
  transform: `scale(${panelConfigStore.panelScaleConf.scale})`,
  left: "50%",
  top: "50%",
  background:
    panelConfigStore.canvasSetting.useImage === 1
      ? `url(${panelConfigStore.canvasSetting.backgroundUrl})`
      : `${panelConfigStore.canvasSetting.backgroundColor}`,
}));
const handleScroll = () => {
  const screensRect = document.querySelector("#screens")!.getBoundingClientRect();
  const canvasRect = document.querySelector("#canvas")!.getBoundingClientRect();
  // 标尺开始的刻度
  const startX =
    (screensRect.left - canvasRect.left) / panelConfigStore.panelScaleConf.scale;
  const startY =
    (screensRect.top - canvasRect.top) / panelConfigStore.panelScaleConf.scale;
  panelConfigStore.panelSetting.startX = startX;
  panelConfigStore.panelSetting.startY = startY;
};
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    if (panelConfigStore.panelSetting.panzoomOption.disableZoom) return;
    const nextScale = parseFloat(
      Math.max(
        panelConfigStore.panelSetting.panzoomOption.minScale,
        panelConfigStore.panelScaleConf.scale - e.deltaY / 500
      ).toFixed(2)
    );
    if (nextScale > 2) return;
    panelConfigStore.panelScaleConf.scale = nextScale;
  }
  nextTick(() => {
    handleScroll();
  });
};
const updateScale = () => {
  const scaleX =
    (panelConfigStore.panelSetting.width - 40) / panelConfigStore.canvasSetting.width;
  panelConfigStore.panelScaleConf.scale = scaleX;
};

watch(
  () => panelConfigStore.panelSetting.width,
  () => {
    nextTick(() => {
      updateScale();
    });
  }
);

watch(
  () => panelConfigStore.panelScaleConf.scale,
  () => {
    nextTick(() => {
      handleScroll();
    });
  }
);

const { moveState, calcMouseMoveDistance, setMoveState } = useMouse()

const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  if (!panelConfigStore.isMoving) return;
  setMoveState({
    startX: e.x,
    startY: e.y,
    isMoving: true
  })
};
const handleMouseMove = (e: MouseEvent) => {
  e.preventDefault();

  if (!moveState.isMoving) return;
  if (panelConfigStore.isMoving) {
    const { moveX, moveY } = calcMouseMoveDistance(e, 1);
    screensRef.value!.scrollLeft -= moveX - moveState.moveX;
    screensRef.value!.scrollTop -= moveY - moveState.moveY;
    setMoveState({
      moveX,
      moveY
    })
  }
};

const handleMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  setMoveState({
    moveX: 0,
    moveY: 0,
    isMoving: false
  })
}

onMounted(() => {
  panelConfigStore.updatePanelSetting(true);
  nextTick(() => {
    updateScale();
    const containerRect = containerRef.value!.getBoundingClientRect();
    const screensRect = document.querySelector("#screens")!.getBoundingClientRect();
    const canvasRect = document.querySelector("#canvas")!.getBoundingClientRect();
    screensRef.value!.scrollLeft =
      containerRect.width / 2 -
      panelConfigStore.panelSetting.thick;
    screensRef.value!.scrollTop =
      containerRect.height / 2 - (screensRect.height - canvasRect.height) / 2;
  });
  window.addEventListener("resize", () => {
    panelConfigStore.updatePanelSetting();
    nextTick(() => {
      const containerRect = containerRef.value!.getBoundingClientRect();
      const screensRect = document.querySelector("#screens")!.getBoundingClientRect();
      const canvasRect = document.querySelector("#canvas")!.getBoundingClientRect();
      screensRef.value!.scrollTop =
        containerRect.height / 2 - (screensRect.height - canvasRect.height) / 2;
      handleScroll();
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === " " || event.keyCode === 32) {
      event.preventDefault(); // 阻止默认行为（页面滚动）
      panelConfigStore.isMoving = true;
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.key === " " || event.keyCode === 32) {
      event.preventDefault(); // 阻止默认行为（页面滚动）
      panelConfigStore.isMoving = false;
    }
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    panelConfigStore.updatePanelSetting();
    handleScroll();
  });
});
</script>
<style lang="less">
.wrapper {
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#screens {
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  overflow: auto;

  /* Firefox */
  scrollbar-color: #232323 transparent;
  scrollbar-width: thin;

  /* Webkit (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #232323;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 修复右下角白点 */
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

.screen-container {
  position: absolute;
  width: 10000px;
  height: 10000px;
}

#canvas {
  position: absolute;
  // left: 50%;
  transform-origin: 0% 0%;
  // top: 5000px;
}
</style>
