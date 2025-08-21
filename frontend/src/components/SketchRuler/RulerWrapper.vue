<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :scale="scale"
      :width="width"
      :height="height"
      :start="start"
      :selectStart="selectStart"
      :selectLength="selectLength"
      :canvasConfigs="canvasConfigs"
      @onAddLine="handleNewLine"
      @onIndicatorShow="handleIndicatorShow"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorHide="handleIndicatorHide"
    />
    <div class="lines" v-show="isShowReferLine">
      <LineRuler
        v-for="(v, i) in lines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        :scale="scale"
        :start="start"
        :thick="thick"
        :palette="palette"
        :vertical="vertical"
        :isShowReferLine="isShowReferLine"
        @onRemove="handleLineRemove"
        @onMouseDown="handleLineDown"
        @onRelease="handleLineRelease"
      />
    </div>
    <div class="indicator" :style="indicatorStyle" v-show="showIndicator">
      <div class="value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import LineRuler from "./Line.vue";
import CanvasRuler from "./CanvasRuler.vue";

// Props 类型定义
interface Props {
  vertical?: boolean;
  scale: number;
  width: number;
  thick: number;
  height: number;
  start: number;
  lines: number[];
  selectStart: number;
  selectLength: number;
  canvasConfigs?: {
    ratio: number;
    bgColor: string;
    fontColor: string;
    shadowColor: string;
    longfgColor: string;
    shortfgColor: string;
  };
  palette: {
    lineColor: string;
  };
  isShowReferLine: boolean;
  onShowRightMenu?: () => void;
  handleShowReferLine?: () => void;
}

// Props 定义
const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  scale: 1,
  width: 200,
  thick: 20,
  height: 200,
  start: 0,
  lines: () => [],
  selectStart: 0,
  selectLength: 0,
  canvasConfigs: () =>
    ({} as {
      ratio: number;
      bgColor: string;
      fontColor: string;
      shadowColor: string;
      longfgColor: string;
      shortfgColor: string;
    }),
  palette: () => ({
    lineColor: "#DADADC",
  }),
  isShowReferLine: true,
});

// Emits 定义
const emit = defineEmits<{
  (e: "onLineChange", lines: number[], vertical: boolean): void;
}>();

// Refs
const isDraggingLine = ref(false);
const showIndicator = ref(false);
const value = ref(0);

// Computed
const rwClassName = computed(() => (props.vertical ? "v-container" : "h-container"));

const rwStyle = computed(() => {
  if (props.vertical) {
    return {
      width: `${props.thick + 1}px`,
      height: `calc(100% - ${props.thick}px)`,
      top: `${props.thick}px`,
    };
  }
  return {
    width: `calc(100% - ${props.thick}px)`,
    height: `${props.thick + 1}px`,
    left: `${props.thick}px`,
  };
});

const lineStyle = computed(() => ({
  borderTop: `1px solid ${props.palette.lineColor}`,
  cursor: props.isShowReferLine ? "ns-resize" : "none",
}));

const indicatorStyle = computed(() => {
  const indicatorOffset = (value.value - props.start) * props.scale;
  const positionKey = props.vertical ? "top" : "left";
  const borderKey = props.vertical ? "borderBottom" : "borderLeft";

  return {
    [positionKey]: indicatorOffset + "px",
    [borderKey]: `1px solid ${props.palette.lineColor}`,
  };
});

// Methods
const handleNewLine = (newValue: number) => {
  const newLines = [...props.lines, newValue];
  emit("onLineChange", newLines, props.vertical);
};

const handleIndicatorShow = (newValue: number) => {
  if (!isDraggingLine.value) {
    showIndicator.value = true;
    value.value = newValue;
  }
};

const handleIndicatorMove = (newValue: number) => {
  if (showIndicator.value) {
    value.value = newValue;
  }
};

const handleIndicatorHide = () => {
  showIndicator.value = false;
};

const handleLineDown = () => {
  isDraggingLine.value = true;
};

const handleLineRelease = (newValue: number, index: number) => {
  isDraggingLine.value = false;

  const offset = newValue - props.start;
  const maxOffset = (props.vertical ? props.height : props.width) / props.scale;

  if (offset < 0 || offset > maxOffset) {
    handleLineRemove(index);
  } else {
    const newLines = [...props.lines];
    newLines[index] = newValue;
    emit("onLineChange", newLines, props.vertical);
  }
};

const handleLineRemove = (index: number) => {
  const newLines = [...props.lines];
  newLines.splice(index, 1);
  emit("onLineChange", newLines, props.vertical);
};
</script>

<style lang="less" scoped>
.line {
  position: absolute;
}

.h-container,
.v-container {
  position: absolute;
  .lines {
    pointer-events: none;
  }
  &:hover .lines {
    pointer-events: auto;
  }
}

.h-container {
  top: 0;
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
  .indicator {
    top: 0;
    height: 100vw;
    .value {
      padding: 0 2px;
      width: auto;
      margin-left: 4px;
      margin-top: 4px;
    }
  }
}

.v-container {
  left: 0;
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
  .indicator {
    width: 100vw;
    .value {
      padding: 0 2px;
      width: auto;
      left: 0px;
      margin-left: 2px;
      margin-top: -5px;
      transform-origin: 0 0;
      transform: rotate(-90deg);
    }
  }
}
</style>
