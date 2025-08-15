<script setup lang="ts">
import { ref, watch, toRaw, onMounted } from "vue";
import { axisHelperConfigList, AxisHelperDirectionEnum } from "../config";
import type { AxisHelperType } from "@/types/panel";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import type { IComponentType } from "@/types/component";
import bus from "@/utils/bus";
import { throttle } from "@/utils";

const { componentId } = defineProps(["componentId", "moveState"]);
const compConfigStore = useComponentConfigStore();
const pageConfigStore = usePageConfigStore();
const axisHelperList = ref<AxisHelperType[]>(axisHelperConfigList);
const threshold = 5;

const calcLeftDistance = (
  style: Record<string, number>,
  otherStyle: Record<string, number>
) => {
  return Math.abs(style.left - (otherStyle.left + otherStyle.width));
};
const calcRightDistance = (
  style: Record<string, number>,
  otherStyle: Record<string, number>
) => {
  return Math.abs(otherStyle.left - (style.left + style.width));
};
const calcTopDistance = (
  style: Record<string, number>,
  otherStyle: Record<string, number>
) => {
  return Math.abs(style.top - (otherStyle.top + otherStyle.height));
};
const calcBottomDistance = (
  style: Record<string, number>,
  otherStyle: Record<string, number>
) => {
  return Math.abs(otherStyle.top - (style.top + style.height));
};
const directionMethodMap = {
  left: calcLeftDistance,
  right: calcRightDistance,
  top: calcTopDistance,
  bottom: calcBottomDistance,
};

const calcAxisHelperStyle = (
  label: number,
  positionData,
  direction: "left" | "right" | "top" | "bottom",
  axisPosition: "middle" | "bottom" | "top",
  style,
  otherStyle,
  position: AxisHelperDirectionEnum
) => {
  const existItem = axisHelperList.value.find(
    (item) => item.direction === position && item.label === label
  );
  positionData[axisPosition] = Math.min(
    directionMethodMap[direction](style, otherStyle),
    positionData[axisPosition]
  );
  existItem!.visible = true;
  existItem!.distance = positionData[axisPosition];
  existItem!.style[position === AxisHelperDirectionEnum.HORIZONTAL ? "width" : "height"] =
    existItem!.distance + "px";
  existItem!.style[direction] = -existItem!.distance + "px";
};

const handleHorizontalAxis = (
  compList: IComponentType[],
  direction: "left" | "right",
  style: Record<string, number>,
  position
) => {
  compList.forEach((item) => {
    const otherStyle = item.style as Record<string, number>;
    if (
      Math.abs(otherStyle.top + otherStyle.height / 2 - (style.top + style.height / 2)) <
        threshold ||
      Math.abs(otherStyle.top - (style.top + style.height / 2)) < threshold ||
      Math.abs(otherStyle.top + otherStyle.height - (style.top + style.height / 2)) <
        threshold
    ) {
      if (
        Math.abs(
          otherStyle.top + otherStyle.height / 2 - (style.top + style.height / 2)
        ) < threshold
      ) {
        throttle(() => {
          compConfigStore.activeComponent!.style.top =
            otherStyle.top +
            otherStyle.height / 2 -
            (compConfigStore.activeComponent!.style.height as number) / 2;
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "right" ? 4 : 1,
        position,
        direction,
        "middle",
        style,
        otherStyle,
        AxisHelperDirectionEnum.HORIZONTAL
      );
    }
    if (
      Math.abs(otherStyle.top + otherStyle.height / 2 - (style.top + style.height)) <
        threshold ||
      Math.abs(otherStyle.top + otherStyle.height - (style.top + style.height)) <
        threshold ||
      Math.abs(otherStyle.top - (style.top + style.height)) < threshold
    ) {
      if (
        Math.abs(otherStyle.top + otherStyle.height - (style.top + style.height)) <
        threshold
      ) {
        throttle(() => {
          compConfigStore.activeComponent!.style.top =
            otherStyle.top +
            otherStyle.height -
            (compConfigStore.activeComponent!.style.height as number);
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "right" ? 6 : 3,
        position,
        direction,
        "bottom",
        style,
        otherStyle,
        AxisHelperDirectionEnum.HORIZONTAL
      );
    }
    if (
      Math.abs(otherStyle.top + otherStyle.height / 2 - style.top) < threshold ||
      Math.abs(otherStyle.top + otherStyle.height - style.top) < threshold ||
      Math.abs(otherStyle.top - style.top) < threshold
    ) {
      if (Math.abs(otherStyle.top - style.top) < threshold) {
        throttle(() => {
          compConfigStore.activeComponent!.style.top = otherStyle.top;
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "right" ? 5 : 2,
        position,
        direction,
        "top",
        style,
        otherStyle,
        AxisHelperDirectionEnum.HORIZONTAL
      );
    }
  });
};
const handleVerticalAxis = (
  compList: IComponentType[],
  direction: "top" | "bottom",
  style: Record<string, number>,
  position
) => {
  compList.forEach((item) => {
    const otherStyle = item.style as Record<string, number>;
    if (
      Math.abs(otherStyle.left + otherStyle.width / 2 - (style.left + style.width / 2)) <
        threshold ||
      Math.abs(otherStyle.left - (style.left + style.width / 2)) < threshold ||
      Math.abs(otherStyle.left + otherStyle.width - (style.left + style.width / 2)) <
        threshold
    ) {
      if (
        Math.abs(
          otherStyle.left + otherStyle.width / 2 - (style.left + style.width / 2)
        ) < threshold
      ) {
        throttle(() => {
          compConfigStore.activeComponent!.style.left =
            otherStyle.left +
            otherStyle.width / 2 -
            (compConfigStore.activeComponent!.style.width as number) / 2;
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "top" ? 7 : 10,
        position,
        direction,
        "middle",
        style,
        otherStyle,
        AxisHelperDirectionEnum.VERTICAL
      );
    }
    if (
      Math.abs(otherStyle.left + otherStyle.width / 2 - (style.left + style.width)) <
        threshold ||
      Math.abs(otherStyle.left + otherStyle.width - (style.left + style.width)) <
        threshold ||
      Math.abs(otherStyle.left - (style.left + style.width)) < threshold
    ) {
      if (
        Math.abs(otherStyle.left + otherStyle.width - (style.left + style.width)) <
        threshold
      ) {
        throttle(() => {
          compConfigStore.activeComponent!.style.left =
            otherStyle.left +
            otherStyle.width -
            (compConfigStore.activeComponent!.style.width as number);
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "top" ? 9 : 12,
        position,
        direction,
        "bottom",
        style,
        otherStyle,
        AxisHelperDirectionEnum.VERTICAL
      );
    }
    if (
      Math.abs(otherStyle.left + otherStyle.width / 2 - style.left) < threshold ||
      Math.abs(otherStyle.left + otherStyle.width - style.left) < threshold ||
      Math.abs(otherStyle.left - style.left) < threshold
    ) {
      if (Math.abs(otherStyle.left - style.left) < threshold) {
        throttle(() => {
          compConfigStore.activeComponent!.style.left = otherStyle.left;
        }, 50);
      }
      calcAxisHelperStyle(
        direction === "top" ? 8 : 11,
        position,
        direction,
        "top",
        style,
        otherStyle,
        AxisHelperDirectionEnum.VERTICAL
      );
    }
  });
};

const handleAxisHelper = (style: Record<string, number>) => {
  const componentList = pageConfigStore
    .getCurrentPage()
    .componentList.filter((item) => item.id !== compConfigStore.activeComponent?.id)
    ?.map(toRaw);
  const leftCompList = componentList.filter(
    (item) => (item.style.left as number) + (item.style.width as number) < style.left
  );
  const rightCompList = componentList.filter(
    (item) => (item.style.left as number) > style.left + style.width
  );
  const topCompList = componentList.filter(
    (item) => (item.style.top as number) + (item.style.height as number) < style.top
  );
  const bottomCompList = componentList.filter(
    (item) => (item.style.top as number) > style.top + style.height
  );
  const leftPosition = {
    middle: 99999999,
    bottom: 99999999,
    top: 99999999,
  };
  const topPosition = {
    middle: 99999999,
    bottom: 99999999,
    top: 99999999,
  };
  const rightPosition = {
    middle: 99999999,
    bottom: 99999999,
    top: 99999999,
  };
  const bottomPosition = {
    middle: 99999999,
    bottom: 99999999,
    top: 99999999,
  };
  handleHorizontalAxis(leftCompList, "left", style, leftPosition);
  handleHorizontalAxis(rightCompList, "right", style, rightPosition);
  handleVerticalAxis(topCompList, "top", style, topPosition);
  handleVerticalAxis(bottomCompList, "bottom", style, bottomPosition);
};

const makeAxisHelper = () => {
  if (compConfigStore.selectIds.length > 1 && compConfigStore.activeComponent) {
    return;
  }
  axisHelperList.value.forEach((item) => {
    item.visible = false;
  });
  handleAxisHelper(compConfigStore.activeComponent?.style as Record<string, number>);
};
onMounted(() => {
  bus.on("compMove", makeAxisHelper);
  bus.on("clearAxis", () => {
    makeAxisHelper();
  });
});
</script>

<template>
  <div
    class="axis-helper-item absolute"
    v-for="item in axisHelperList"
    :key="item.name"
    :style="item.style"
  >
    <template v-if="item.visible && compConfigStore.activeComponent?.id === componentId">
      <div
        class="horizontal absolute h-full w-full"
        v-if="item.direction === AxisHelperDirectionEnum.HORIZONTAL"
      >
        <span class="text absolute left-1/2 translate-x-1/2">{{
          Math.abs(item.distance)
        }}</span>
        <div class="line h-full w-full"></div>
      </div>
      <div class="vertical absolute h-full w-full" v-else>
        <span class="text absolute">{{ Math.abs(item.distance) }}</span>
        <div class="line h-full w-full"></div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.axis-helper-item {
  position: absolute;

  .vertical {
    .text {
      left: 50%;
      font-size: 16px;
      color: #ca1111;
      font-weight: bold;
      top: 50%;
      margin-left: 10px;
    }

    .line {
      // background-color: red;
      background: repeating-linear-gradient(
        to top,
        red 0,
        red 10px,
        transparent 2px,
        transparent 15px
      );
    }
  }

  .horizontal {
    .text {
      transform: translate(50%, 0%);
      top: 50%;
      font-size: 16px;
      color: rgb(202, 17, 17);
      font-weight: bold;
    }

    .line {
      // background-color: red;
      // background-color: red;
      background: repeating-linear-gradient(
        to right,
        red 0,
        red 10px,
        transparent 2px,
        transparent 15px
      );
    }
  }
}
</style>
