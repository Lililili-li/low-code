<script setup lang="ts">
import { ref, watch, toRaw, onMounted } from "vue";
import { axisHelperConfigList, AxisHelperDirectionEnum } from "../config";
import type { AxisHelperType } from "@/types/panel";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import type { IComponentType } from "@/types/component";
import bus from "@/utils/bus";
import { throttle } from "@/utils";

const compConfigStore = useComponentConfigStore();
const pageConfigStore = usePageConfigStore();
const axisHelperList = ref<AxisHelperType[]>(axisHelperConfigList);
const threshold = 5;

// 优化：预计算组件的关键坐标点，减少重复计算
interface ComponentBounds {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const getComponentBounds = (comp: IComponentType): ComponentBounds => {
  const style = comp.style as Record<string, number>;
  return {
    id: comp.id,
    left: style.left,
    right: style.left + style.width,
    top: style.top,
    bottom: style.top + style.height,
    centerX: style.left + style.width / 2,
    centerY: style.top + style.height / 2,
    width: style.width,
    height: style.height,
  };
};

// 优化：使用更高效的距离计算
const calcDistance = (
  currentBounds: ComponentBounds,
  otherBounds: ComponentBounds,
  direction: "left" | "right" | "top" | "bottom"
): number => {
  switch (direction) {
    case "left":
      return Math.abs(currentBounds.left - otherBounds.right);
    case "right":
      return Math.abs(otherBounds.left - currentBounds.right);
    case "top":
      return Math.abs(currentBounds.top - otherBounds.bottom);
    case "bottom":
      return Math.abs(otherBounds.top - currentBounds.bottom);
    default:
      return Infinity;
  }
};

// 优化：统一的对齐检测函数，减少代码重复
interface AlignmentCheck {
  condition: boolean;
  snapPosition?: number;
  distance: number;
  label: number;
  direction: AxisHelperDirectionEnum;
  axisPosition: "top" | "middle" | "bottom";
}

const checkAlignment = (
  currentBounds: ComponentBounds,
  otherBounds: ComponentBounds,
  direction: "left" | "right" | "top" | "bottom"
): AlignmentCheck[] => {
  const alignments: AlignmentCheck[] = [];

  if (direction === "left" || direction === "right") {
    // 水平方向检测垂直对齐
    const labelBase = direction === "right" ? 4 : 1;
    const distance = calcDistance(currentBounds, otherBounds, direction);

    // 中心对齐
    const centerDiff = Math.abs(otherBounds.centerY - currentBounds.centerY);
    if (centerDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.centerY - currentBounds.height / 2,
        distance,
        label: labelBase,
        direction: AxisHelperDirectionEnum.HORIZONTAL,
        axisPosition: "middle"
      });
    }

    // 顶边对齐
    const topDiff = Math.abs(otherBounds.top - currentBounds.top);
    if (topDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.top,
        distance,
        label: labelBase + 1,
        direction: AxisHelperDirectionEnum.HORIZONTAL,
        axisPosition: "top"
      });
    }

    // 底边对齐
    const bottomDiff = Math.abs(otherBounds.bottom - currentBounds.bottom);
    if (bottomDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.bottom - currentBounds.height,
        distance,
        label: labelBase + 2,
        direction: AxisHelperDirectionEnum.HORIZONTAL,
        axisPosition: "bottom"
      });
    }
  } else {
    // 垂直方向检测水平对齐
    const labelBase = direction === "top" ? 7 : 10;
    const distance = calcDistance(currentBounds, otherBounds, direction);

    // 中心对齐
    const centerDiff = Math.abs(otherBounds.centerX - currentBounds.centerX);
    if (centerDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.centerX - currentBounds.width / 2,
        distance,
        label: labelBase,
        direction: AxisHelperDirectionEnum.VERTICAL,
        axisPosition: "middle"
      });
    }

    // 左边对齐
    const leftDiff = Math.abs(otherBounds.left - currentBounds.left);
    if (leftDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.left,
        distance,
        label: labelBase + 1,
        direction: AxisHelperDirectionEnum.VERTICAL,
        axisPosition: "top"
      });
    }

    // 右边对齐
    const rightDiff = Math.abs(otherBounds.right - currentBounds.right);
    if (rightDiff < threshold) {
      alignments.push({
        condition: true,
        snapPosition: otherBounds.right - currentBounds.width,
        distance,
        label: labelBase + 2,
        direction: AxisHelperDirectionEnum.VERTICAL,
        axisPosition: "bottom"
      });
    }
  }

  return alignments.filter(a => a.condition);
};

// 优化：批量处理对齐检测，避免嵌套循环
const processAlignments = (
  currentBounds: ComponentBounds,
  componentBounds: ComponentBounds[],
  direction: "left" | "right" | "top" | "bottom"
) => {
  // 过滤相关组件
  const relevantComponents = componentBounds.filter(bounds => {
    switch (direction) {
      case "left":
        return bounds.right < currentBounds.left;
      case "right":
        return bounds.left > currentBounds.right;
      case "top":
        return bounds.bottom < currentBounds.top;
      case "bottom":
        return bounds.top > currentBounds.bottom;
      default:
        return false;
    }
  });

  // 收集所有对齐信息
  const allAlignments: AlignmentCheck[] = [];
  relevantComponents.forEach(bounds => {
    const alignments = checkAlignment(currentBounds, bounds, direction);
    allAlignments.push(...alignments);
  });

  // 按距离分组，找到最近的对齐
  const alignmentGroups = new Map<string, AlignmentCheck[]>();
  allAlignments.forEach(alignment => {
    const key = `${alignment.label}-${alignment.axisPosition}`;
    if (!alignmentGroups.has(key)) {
      alignmentGroups.set(key, []);
    }
    alignmentGroups.get(key)!.push(alignment);
  });
  // 处理每组对齐，选择最近的
  alignmentGroups.forEach((group) => {
    const closest = group.reduce((min, current) =>
      current.distance < min.distance ? current : min
    );
    // 更新辅助线
    const existItem = axisHelperList.value.find(
      item => item.direction === closest.direction && item.label === closest.label
    );

    if (existItem) {
      existItem.visible = true;
      existItem.distance = closest.distance;
      existItem.style[closest.direction === AxisHelperDirectionEnum.HORIZONTAL ? "width" : "height"] =
        closest.distance + "px";
      existItem.style[direction] = -closest.distance + "px";

      // 执行自动吸附 (保持与原代码相似的方式)
      if (closest.snapPosition !== undefined) {
        if (direction === "left" || direction === "right") {
          throttle(() => {
            compConfigStore.activeComponent!.style.top = closest.snapPosition!;
          }, 50);
        } else {
          throttle(() => {
            compConfigStore.activeComponent!.style.left = closest.snapPosition!;
          }, 50);
        }
      }
    }
  });
};

// 优化后的主要处理函数
const handleAxisHelper = (style: Record<string, number>) => {
  const componentList = pageConfigStore
    .getCurrentPage()
    .componentList.filter((item) => item.id !== compConfigStore.activeComponent?.id)
    ?.map(toRaw);

  // 预计算所有组件的边界信息
  const componentBounds = componentList.map(getComponentBounds);
  const currentBounds = getComponentBounds({
    id: compConfigStore.activeComponent?.id || "",
    style
  } as IComponentType);

  // 批量处理四个方向的对齐检测
  ["left", "right", "top", "bottom"].forEach(direction => {
    processAlignments(currentBounds, componentBounds, direction as any);
  });
};

const makeAxisHelper = () => {
  if (compConfigStore.selectIds.length > 1 && compConfigStore.activeComponent) {
    return;
  }

  // 重置所有辅助线
  axisHelperList.value.forEach((item) => {
    item.visible = false;
  });
  if (compConfigStore.activeComponent?.style) {
    handleAxisHelper(compConfigStore.activeComponent.style as Record<string, number>);
  }
};

onMounted(() => {
  bus.on("compMove", makeAxisHelper);
  bus.on("resetAxis", makeAxisHelper);
  bus.on("clearAxis", () => {
    axisHelperList.value.forEach((item) => {
      item.visible = false;
    });
  });
});
</script>

<template>
  <div class="axis-helper-wrapper absolute">
    <div
      class="axis-helper-item absolute"
      v-for="item in axisHelperList"
      :key="item.name"
      :style="item.style"
    >
      <template v-if="item.visible">
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
  </div>
</template>

<style scoped lang="less">
.axis-helper-item {
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
