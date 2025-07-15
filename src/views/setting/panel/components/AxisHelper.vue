<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { axisHelperConfigList, AxisHelperDirectionEnum } from "../congfig";
import type { AxisHelperType } from "@/types/panel";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import type { IComponentType } from "@/types/component.d";

const { componentId, moveState } = defineProps([
  "style",
  "active",
  "componentId",
  "moveState",
]);
const componentConfigStore = useComponentConfigStore();
const pageConfigStore = usePageConfigStore();
const axisHelperList = ref<AxisHelperType[]>(axisHelperConfigList);
const threshold = 5;

const onFindNearestAxisHelper = (style: Record<string, string | number>) => {
  if (!componentConfigStore.activeComponent) return;
  const { componentList } = pageConfigStore.currentPage as {
    componentList: IComponentType[];
  };
  const copyComponentList = componentList?.filter(
    (item) => item.id !== componentConfigStore.activeComponent?.id
  );

  if (copyComponentList.length > 0 && moveState.type === "move") {

  }
};
watch(
  () => componentConfigStore.activeComponent?.style!,
  (newStyle: Record<string, string | number>) => {
    if (!newStyle) return;
    axisHelperList.value.forEach((item) => {
      item.visible = false;
    });
    onFindNearestAxisHelper(newStyle);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div class="axis-helper-item absolute" v-for="item in axisHelperList" :key="item.name" :style="item.style">
    <template v-if="item.visible && componentConfigStore.activeComponent?.id === componentId">
      <div class="horizontal absolute h-full w-full" v-if="item.direction === AxisHelperDirectionEnum.HORIZONTAL">
        <span class="text absolute">{{ Math.abs(item.distance) }}</span>
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
      transform: translate(-50%, -150%);
      left: 50%;
      font-size: 16px;
      color: rgb(202, 17, 17);
    }

    .line {
      // background-color: red;
      border-bottom: 1px dashed red;
    }
  }

  .horizontal {
    .text {
      transform: translate(50%, 0%);
      top: 50%;
      font-size: 16px;
      color: rgb(202, 17, 17);
    }

    .line {
      // background-color: red;
      border-bottom: 1px dashed red;
    }
  }
}
</style>
