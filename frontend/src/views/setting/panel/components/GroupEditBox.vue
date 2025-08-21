<script setup lang="ts">
import { computed, ref } from "vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import type { IComponentType } from "@/types/component.d";
import type { DirectionLabelType, MoveStateType } from "@/types/panel";
import useLayers from "@/hooks/useLayers";
import { formatNumber } from "@/utils";

const { onLayerHover, onLayerLeave } = useLayers();
const componentConfigStore = useComponentConfigStore();
const { componentInfo, moveState } = defineProps<{
  componentInfo: IComponentType;
  moveState: MoveStateType;
}>();

const isActive = computed(
  () => {
    return componentConfigStore.activeComponent?.id === componentInfo.id
  }
);
const isSelect = computed(() =>
  componentConfigStore.selectIds?.includes(componentInfo.id)
);
const emits = defineEmits(["onResizeMouseEvent"]);

const directionList = ref<DirectionLabelType[]>([
  {
    style: {
      top: 0,
      left: 0,
      cursor: "nwse-resize",
      transform: "translate(-50%, -50%)",
      width: "12px",
      height: "12px",
    },
    direction: 1,
    name: "西北",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      const moveXDiff = formatNumber(moveX - moveState.moveX);
      const moveYDiff = formatNumber(moveY - moveState.moveY);
      (componentConfigStore.activeComponent!.style.width as number) -= moveXDiff;
      (componentConfigStore.activeComponent!.style.height as number) -= moveYDiff;
      (componentConfigStore.activeComponent!.style.left as number) += moveXDiff;
      (componentConfigStore.activeComponent!.style.top as number) += moveYDiff;
    },
  },
  {
    style: {
      top: 0,
      right: 0,
      cursor: "nesw-resize",
      transform: "translate(50%, -50%)",
      width: "12px",
      height: "12px",
    },
    direction: 2,
    name: "东北",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      const moveXDiff = formatNumber(moveX - moveState.moveX);
      const moveYDiff = formatNumber(moveY - moveState.moveY);
      (componentConfigStore.activeComponent!.style.width as number) += moveXDiff;
      (componentConfigStore.activeComponent!.style.height as number) -= moveYDiff;
      (componentConfigStore.activeComponent!.style.top as number) += moveYDiff;
    },
  },
  {
    style: {
      bottom: 0,
      right: 0,
      cursor: "nwse-resize",
      transform: "translate(50%, 50%)",
      width: "12px",
      height: "12px",
    },
    direction: 3,
    name: "东南",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      (componentConfigStore.activeComponent!.style.width as number) += formatNumber(
        moveX - moveState.moveX
      );
      (componentConfigStore.activeComponent!.style.height as number) += formatNumber(
        moveY - moveState.moveY
      );
    },
  },
  {
    style: {
      bottom: 0,
      left: 0,
      cursor: "nesw-resize",
      transform: "translate(-50%, 50%)",
      width: "12px",
      height: "12px",
    },
    direction: 4,
    name: "西南",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      const moveXDiff = formatNumber(moveX - moveState.moveX);
      const moveYDiff = formatNumber(moveY - moveState.moveY);
      (componentConfigStore.activeComponent!.style.width as number) -= moveXDiff;
      (componentConfigStore.activeComponent!.style.height as number) += moveYDiff;
      (componentConfigStore.activeComponent!.style.left as number) += moveXDiff;
    },
  },
  {
    style: {
      bottom: 0,
      left: "50%",
      cursor: "ns-resize",
      transform: "translate(-50%,50%)",
      width: "30px",
      height: "12px",
    },
    direction: 5,
    name: "南",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      (componentConfigStore.activeComponent!.style.height as number) += formatNumber(
        moveY - moveState.moveY
      );
    },
  },
  {
    style: {
      top: 0,
      left: "50%",
      cursor: "ns-resize",
      transform: "translate(-50%,-50%)",
      width: "30px",
      height: "12px",
    },
    direction: 6,
    name: "北",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      const moveDiff = formatNumber(moveY - moveState.moveY);
      (componentConfigStore.activeComponent!.style.height as number) -= moveDiff;
      (componentConfigStore.activeComponent!.style.top as number) += moveDiff;
    },
  },
  {
    style: {
      top: "50%",
      left: 0,
      cursor: "ew-resize",
      transform: "translate(-50%, -50%)",
      width: "12px",
      height: "30px",
    },
    direction: 7,
    name: "西",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      const moveXDiff = formatNumber(moveX - moveState.moveX);
      (componentConfigStore.activeComponent!.style.width as number) -= moveXDiff;
      (componentConfigStore.activeComponent!.style.left as number) += moveXDiff;
    },
  },
  {
    style: {
      top: "50%",
      right: 0,
      cursor: "ew-resize",
      transform: "translate(50%, -50%)",
      width: "12px",
      height: "30px",
    },
    direction: 8,
    name: "东",
    moveFunc: (moveX: number, moveY: number, moveState: MoveStateType) => {
      (componentConfigStore.activeComponent!.style.width as number) += formatNumber(
        moveX - moveState.moveX
      );
    },
  },
]);

const onResizeMousedown = (event: MouseEvent, data: any) => {
  emits("onResizeMouseEvent", { event, data, isResize: true });
};
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
        :class="[
          'change-box absolute h-full w-full',
          isActive || isSelect ? 'active' : '',
        ]"
        v-show="isSelect || isActive"
        data-type="component"
        :data-comp-id="componentInfo.id"
      ></div>
      <!-- <div
        class="direction-box absolute"
        v-for="item in directionList"
        :key="item.direction"
        :style="item.style"
        v-show="isActive && !isSelect"
        @mousedown.stop.left="onResizeMousedown($event, item)"
        data-type="component"
        :data-comp-id="componentInfo.id"
      ></div> -->
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
