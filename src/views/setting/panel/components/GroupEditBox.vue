<script setup lang="ts">
import { computed } from "vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import AxisHelper from "./AxisHelper.vue";
import type { IComponentType } from "@/types/component.d";
import type { MoveStateType } from "@/types/panel";
import useLayers from "@/hooks/useLayers";

const { onLayerHover, onLayerLeave } = useLayers();
const componentConfigStore = useComponentConfigStore();
const { componentInfo, moveState } = defineProps<{
  componentInfo: IComponentType;
  moveState: MoveStateType;
}>();

const isSelect = computed(() =>
  componentConfigStore.selectIds?.includes(componentInfo.id)
);
</script>

<template>
  <div
    class="group-edit-box absolute"
    data-type="component"
    :data-comp-id="componentInfo.id"
    :style="{
      zIndex: componentInfo.style.zIndex,
      top: componentInfo.style.top + 'px',
      left: componentInfo.style.left + 'px',
      width:
        typeof componentInfo.style.width !== 'string'
          ? componentInfo.style.width + 'px'
          : componentInfo.style.width,
      height:
        typeof componentInfo.style.height !== 'string'
          ? componentInfo.style.height + 'px'
          : componentInfo.style.height,
    }"
    @mouseenter="() => onLayerHover(componentInfo.id)"
    @mouseleave="() => onLayerLeave(componentInfo.id)"
  >
    <div class="w-full h-full" data-type="component" :data-comp-id="componentInfo.id">
      <div class="box absolute h-full w-full">
        <slot></slot>
      </div>
      <div
        class="mask absolute h-full w-full"
        data-type="component"
        :data-comp-id="componentInfo.id"
        :class="componentConfigStore.hoverIds.includes(componentInfo.id) ? 'hover' : ''"
      ></div>
      <div
        :class="['change-box absolute h-full w-full', isSelect ? 'active' : '']"
        v-show="isSelect"
        data-type="component"
        :data-comp-id="componentInfo.id"
      ></div>

      <!-- 轴辅助线 -->
      <AxisHelper :componentId="componentInfo.id" :moveState="moveState" />
    </div>
  </div>
</template>

<style scoped lang="less">
.box {
  z-index: 1;
}
.mask {
  z-index: 2;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 0, 0, 0.05);
  }
}
.hover {
  background-color: rgba(255, 0, 0, 0.05);
}
.change-box {
  z-index: 3;
  cursor: grab;
}

.active {
  border: 2px dashed red;
  background: rgba(255, 0, 0, 0.1);
}
.direction-box {
  z-index: 3;
  position: absolute;
  border: 2px solid red;
  border-radius: 4px;
  background-color: #fff;
}
</style>
