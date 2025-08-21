<template>
  <div class="style-ruler mb-ruler" id="mb-ruler">
    <!-- 水平方向 -->
    <RulerWrapper
      :vertical="false"
      :width="width"
      :height="thick"
      :isShowReferLine="isShowReferLine"
      :thick="thick"
      :start="startX"
      :lines="horLineArr"
      :selectStart="shadow.x"
      :selectLength="shadow.width"
      :scale="scale"
      :palette="palette"
      :canvasConfigs="canvasConfigs"
      @onLineChange="handleLineChange"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :vertical="true"
      :width="thick"
      :height="height"
      :isShowReferLine="isShowReferLine"
      :thick="thick"
      :start="startY"
      :lines="verLineArr"
      :selectStart="shadow.y"
      :selectLength="shadow.height"
      :scale="scale"
      :palette="palette"
      :canvasConfigs="canvasConfigs"
      @onLineChange="handleLineChange"
    />
    <a
      class="corner"
      :class="cornerActiveClass"
      :style="cornerStyle"
      @click="onCornerClick"
    />
  </div>
</template>
<script lang="ts">
// 默认菜单配置
export const DEFAULTMENU = {
  bgColor: "#fff",
  dividerColor: "#DBDBDB",
  listItem: {
    textColor: "#415058",
    hoverTextColor: "#298DF8",
    disabledTextColor: "rgba(65, 80, 88, 0.4)",
    bgColor: "#fff",
    hoverBgColor: "#F2F2F2",
  },
} as const;

// Props 类型定义
export interface Props {
  scale?: number;
  ratio?: number;
  thick?: number;
  width: number;
  height: number;
  startX?: number;
  startY?: number;
  shadow?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  horLineArr?: number[];
  verLineArr?: number[];
  cornerActive?: boolean;
  lang?: string;
  isOpenMenuFeature?: boolean;
  handleShowRuler?: () => void;
  isShowReferLine?: boolean;
  handleShowReferLine?: () => void;
  palette?: {
    bgColor: string;
    longfgColor: string;
    shortfgColor: string;
    fontColor: string;
    shadowColor: string;
    lineColor: string;
    borderColor: string;
    cornerActiveColor: string;
    menu?: typeof DEFAULTMENU;
  };
}
</script>
<script setup lang="ts">
import { computed } from "vue";
import RulerWrapper from "./RulerWrapper.vue";

// Props 默认值
const props = withDefaults(defineProps<Props>(), {
  scale: 1,
  ratio: window.devicePixelRatio || 1,
  thick: 16,
  startX: 0,
  startY: 0,
  shadow: () => ({
    x: 200,
    y: 100,
    width: 200,
    height: 400,
  }),
  horLineArr: () => [100, 200],
  verLineArr: () => [100, 200],
  cornerActive: false,
  isOpenMenuFeature: false,
  isShowReferLine: true,
  handleShowRuler: () => {},
  handleShowReferLine: () => {},
  palette: () => ({
    bgColor: "rgba(225,225,225, 0)",
    longfgColor: "#BABBBC",
    shortfgColor: "#C8CDD0",
    fontColor: "#7D8694",
    shadowColor: "#E8E8E8",
    lineColor: "#EB5648",
    borderColor: "#DADADC",
    cornerActiveColor: "rgb(235, 86, 72, 0.6)",
    menu: DEFAULTMENU,
  }),
});

// Emits 定义
const emit = defineEmits<{
  (e: "onCornerClick", event: MouseEvent): void;
  (e: "handleLine", lines: { h: number[]; v: number[] }): void;
}>();

// Computed
const cornerActiveClass = computed(() => (props.cornerActive ? " active" : ""));

const cornerStyle = computed(() => ({
  backgroundColor: props.palette.bgColor,
  width: props.thick + "px",
  height: props.thick + "px",
  borderRight: `1px solid ${props.palette.borderColor}`,
  borderBottom: `1px solid ${props.palette.borderColor}`,
}));

const canvasConfigs = computed(() => {
  const {
    bgColor,
    longfgColor,
    shortfgColor,
    fontColor,
    shadowColor,
    lineColor,
    borderColor,
    cornerActiveColor,
  } = props.palette;

  return {
    ratio: props.ratio,
    bgColor,
    longfgColor,
    shortfgColor,
    fontColor,
    shadowColor,
    lineColor,
    borderColor,
    cornerActiveColor,
  };
});

// Methods
const onCornerClick = (e: MouseEvent) => {
  emit("onCornerClick", e);
};

const handleLineChange = (arr: number[], vertical: boolean) => {
  const newLines = vertical
    ? { h: props.horLineArr, v: [...arr] }
    : { h: [...arr], v: props.verLineArr };
  emit("handleLine", newLines);
};
</script>

<style lang="less" scoped>
.style-ruler {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  font-size: 12px;
  overflow: hidden;

  span {
    line-height: 1;
  }
}

.corner {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;

  &.active {
    background-color: v-bind("palette.cornerActiveColor");
  }
}

.indicator {
  position: absolute;
  pointer-events: none;

  .value {
    position: absolute;
    background: white;
  }
}

.ruler {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
