<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, shallowRef } from "vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import { formatNumber, generateUUID } from "@/utils";
import EditBox from "@/views/setting/panel/components/EditBox.vue";
import GroupEditBox from "./components/GroupEditBox.vue";
import { componentMap } from "@/packages";
import PanelConfig from "./components/PanelConfig.vue";
import type { IComponentType, IProps } from "@/types/component.d";
import useMouse from "@/hooks/useMouse";
import type { DirectionLabelType } from "@/types/panel";
import { EComponentType } from "@/types/component.d";
import { Dropdown, DropdownItem } from "@/components/Dropdown";
import useLayers from "@/hooks/useLayers";
import { useLayersStore } from "@/stores/useLayersStore";
import { useWorkStore } from "@/stores/useWorkStore";
import { useProjectStore } from "@/stores/useProjectStore";
import bus from "@/utils/bus";
import dayjs from "dayjs";
import SketchRuler from "@/components/SketchRuler/index.vue";
import { getVariableValue } from "../config/components/variable/util";
import { useVariableStore } from "@/stores/useVariableStore";
import CanvasBox from "./components/CanvasBox.vue";

const variableConfStore = useVariableStore();
const { panelDropdownOptions, mousePosition, initHotKeys } = useLayers();
const { addHistory } = useWorkStore();
const componentConfigStore = useComponentConfigStore();
const panelConfigStore = usePanelConfigStore();
const pageConfigStore = usePageConfigStore();
const layersStore = useLayersStore();
const projectStore = useProjectStore();
const controller = new AbortController();
const { moveState, setMoveState, calcMouseMoveDistance } = useMouse();
const editBoxRef = ref<any>(null);
const frameSelectDomStyle = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  border: "1px dashed #eee",
});

// 将组件拖拽到画板
const onComponentDrop = (event: DragEvent) => {
  const componentInfo = JSON.parse(
    event.dataTransfer!.getData("component")
  ) as IComponentType;
  let { height, width } = componentInfo.style;
  componentInfo.style.top = (event.offsetY - (height as number) / 2) as number;
  componentInfo.style.left = (event.offsetX - (width as number) / 2) as number;
  componentInfo.id = generateUUID();
  componentInfo.type = EComponentType.COMPONENT;
  // 渲染数据
  if (componentInfo.props.render?.type === "JSExpression") {
    componentInfo.props.option.dataset.source = getVariableValue(
      componentInfo.props.render.value as string,
      variableConfStore
    );
  } else {
    componentInfo.props.option.dataset.source = componentInfo.props.render?.defaultValue;
  }
  componentConfigStore.setActiveComponent(componentInfo);
  pageConfigStore.addComponent(componentConfigStore.activeComponent as IComponentType);
  layersStore.setCutCompId(componentInfo.id);
  event.dataTransfer?.clearData();
  addHistory({
    label: "新增-" + componentInfo.name,
    id: generateUUID(),
    type: "create",
    componentId: componentInfo.id,
    props: componentInfo,
    time: dayjs().format("MM-DD HH:mm"),
  });
  bus.emit("openAttribute", true);
};

// 通过底部操作栏修改画板缩放

const onComponentMousedown = (
  event: MouseEvent,
  item: IComponentType,
  type: "component" | "group"
) => {
  if (event.shiftKey) {
    componentConfigStore.removeActiveComponent();
    componentConfigStore.selectIds.push(item.id);
  } else {
    if (type === "group") {
      componentConfigStore.removeActiveComponent();
      componentConfigStore.clearSelectGroupComponent();
      componentConfigStore.selectIds.push(item.id);
      componentConfigStore.setActiveComponent(item);
      layersStore.setCutCompId(item.id);
    } else {
      if (!componentConfigStore.selectIds?.includes(item.id)) {
        componentConfigStore.clearSelectGroupComponent();
        componentConfigStore.setActiveComponent(item);
        layersStore.setCutCompId(item.id);
      }
    }
  }
  bus.emit("openAttribute", true);
  setMoveState({ startX: event.x, startY: event.y, type: "move", componentType: type });
};
// 画板鼠标按下事件
const onPanelMousedown = (event: MouseEvent) => {
  console.log((event?.target as HTMLElement).dataset.type);

  if ((event?.target as HTMLElement).dataset.type !== "component") {
    componentConfigStore.removeActiveComponent();
    setMoveState({ startX: event.x, startY: event.y, type: "frameSelect" });
    frameSelectDomStyle.left = event.offsetX;
    frameSelectDomStyle.top = event.offsetY;
    setTimeout(() => {
      componentConfigStore.clearSelectGroupComponent();
    }, 50);
  }
};
// 移动组件或者圈选的组件
const handleMoveComponent = (moveX: number, moveY: number) => {
  if (
    componentConfigStore.activeComponent &&
    componentConfigStore.activeComponent.type === EComponentType.COMPONENT
  ) {
    (componentConfigStore.activeComponent!.style!.left as number) += formatNumber(
      moveX - moveState.moveX
    );
    (componentConfigStore.activeComponent!.style!.top as number) += formatNumber(
      moveY - moveState.moveY
    );
  } else {
    pageConfigStore.currentPage?.componentList?.forEach((item) => {
      if (!componentConfigStore.selectIds?.includes(item.id)) return;
      if (moveState.componentType === "group") {
        item.children?.forEach((child) => {
          child.style.left =
            (child.style.left as number) + formatNumber(moveX - moveState.moveX);
          child.style.top =
            (child.style.top as number) + formatNumber(moveY - moveState.moveY);
        });
      }
      item.style.left =
        (item.style.left as number) + formatNumber(moveX - moveState.moveX);
      item.style.top = (item.style.top as number) + formatNumber(moveY - moveState.moveY);
    });
  }
};
// 拖拽进行放大缩小组件
const handleResizeComponent = (moveX: number, moveY: number) => {
  if (currentDirectionLabel.value?.moveFunc) {
    currentDirectionLabel.value.moveFunc!(moveX, moveY, moveState);
  }
};
const handleFrameSelect = (moveX: number, moveY: number) => {
  frameSelectDomStyle.width += formatNumber(moveX - moveState.moveX);
  frameSelectDomStyle.height += formatNumber(moveY - moveState.moveY);
  componentConfigStore.handleSelectGroupComponent(
    {
      width: frameSelectDomStyle.width,
      height: frameSelectDomStyle.height,
      left: frameSelectDomStyle.left,
      top: frameSelectDomStyle.top,
    },
    pageConfigStore.currentPage?.componentList!
  );
};

// 画板鼠标移动事件
const onPanelMousemove = (event: MouseEvent) => {
  const { moveX, moveY } = calcMouseMoveDistance(event, panelConfigStore.getPanelScale);
  if (moveState.type === "move") {
    // 拖拽移动组件
    handleMoveComponent(moveX, moveY);
    setMoveState({ moveX, moveY });
  } else if (moveState.type === "resize") {
    // 拖拽进行放大缩小组件
    handleResizeComponent(moveX, moveY);
    setMoveState({ moveX, moveY });
  } else if (moveState.type === "frameSelect") {
    // 框选组件
    handleFrameSelect(moveX, moveY);
    setMoveState({ moveX, moveY });
  }
};
// 画板鼠标抬起事件
const onPanelMouseup = (event: MouseEvent) => {
  if (moveState.type === "frameSelect") {
    frameSelectDomStyle.width = 0;
    frameSelectDomStyle.height = 0;
    frameSelectDomStyle.left = 0;
    frameSelectDomStyle.top = 0;
  }
  if (moveState.type === "move" || moveState.type === "resize") {
    addHistory({
      type: "move",
      id: generateUUID(),
      componentId: componentConfigStore.activeComponent?.id!,
      props: {
        start: componentConfigStore.activeComponent?.style,
        end: componentConfigStore.activeComponent?.style,
      },
      label: "移动-" + componentConfigStore.activeComponent?.name,
      time: dayjs().format("MM-DD HH:mm"),
    });
    componentConfigStore.activeComponent!.style = JSON.parse(
      JSON.stringify(componentConfigStore.activeComponent?.style!)
    );
  }
  setMoveState({ moveX: 0, moveY: 0, type: null });
};

const currentDirectionLabel = ref<DirectionLabelType | null>(null);
const onResizeMouseEvent = ({
  event,
  data,
}: {
  event: MouseEvent;
  data: DirectionLabelType;
  isResize: boolean;
}) => {
  setMoveState({ startX: event.x, startY: event.y, type: "resize" });
  currentDirectionLabel.value = data;
};

const onDropdownContextmenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const id = target.getAttribute("data-comp-id");
  if (id) {
    layersStore.setCurCompId(id);
    layersStore.setCutCompId(id);
    if (componentConfigStore.selectIds.includes(id)) return;
    componentConfigStore.setActiveComponent(
      pageConfigStore.getCurrentPage()?.componentList.find((item) => item.id === id)!
    );
  } else {
    layersStore.clearCurCompId();
  }
  mousePosition.x = event.offsetX;
  mousePosition.y = event.offsetY;
};

// 计算组件是否显示
const compVisible = (props: IProps) => {
  if (props.visible.type === "Normal") return props.visible.value;
  return getVariableValue(props.visible.value as string, variableConfStore);
};

onMounted(async () => {
  await projectStore.getProjectData();
  await pageConfigStore.getPageData();
  panelConfigStore.updatePanelSetting(true);
  window.addEventListener("resize", () => panelConfigStore.updatePanelSetting(), {
    signal: controller.signal,
  });
  // initHotKeys();
});
onUnmounted(() => {
  controller.abort();
});
</script>

<template>
  <div
    class="panel relative flex flex-col"
    style="height: calc(100vh - 50px)"
    @dragover="(e) => e.preventDefault()"
    @drop="onComponentDrop"
    ref="panelRef"
    id="panel"
  >
    <div class="content flex-1">
      <Dropdown
        @onContextmenu="onDropdownContextmenu"
        @mousemove.prevent="onPanelMousemove($event)"
        @mouseup.prevent="onPanelMouseup($event)"
        @mousedown.left.prevent="onPanelMousedown($event)"
      >
        <template #content>
          <DropdownItem
            v-for="item in panelDropdownOptions"
            :key="item.key"
            class="flex gap-1 items-center"
            @click="
              () => {
                item.handle?.();
              }
            "
            :class="item['disabled'] ? 'disabled' : ''"
          >
            <component :is="item.icon" style="font-size: 12px"></component>
            {{ item.label }}
          </DropdownItem>
        </template>
        <CanvasBox>
          <template
            v-for="(item, index) in pageConfigStore.currentPage?.componentList as IComponentType[]"
            :key="index"
          >
            <EditBox
              v-if="item.type === EComponentType.COMPONENT"
              :componentInfo="item"
              @mousedown.left.prevent="onComponentMousedown($event, item, 'component')"
              @onResizeMouseEvent="onResizeMouseEvent"
              ref="editBoxRef"
              :moveState="moveState"
            >
              <component
                :is="componentMap[item?.componentName]"
                v-bind="item.props"
                :width="item.style.width"
                :height="item.style.height"
                class="cursor-pointer"
                v-show="compVisible(item.props)"
              ></component>
            </EditBox>
            <GroupEditBox
              v-if="item.type === EComponentType.GROUP"
              :componentInfo="item"
              :moveState="moveState"
              @mousedown.left.prevent="onComponentMousedown($event, item, 'group')"
            >
              <template v-for="child in item.children" :key="child.id">
                <div
                  class="absolute"
                  :style="{
                    zIndex: child.style.zIndex,
                    top: (child.style.top as number) - (item.style.top as number) + 'px',
                    left: (child.style.left as number) - (item.style.left as number) + 'px',
                    width: child.style.width + 'px',
                    height: child.style.height + 'px',
                  }"
                >
                  <component
                    :is="componentMap[child?.componentName]"
                    v-bind="child.props"
                    :width="child.style.width"
                    :height="child.style.height"
                    class="cursor-pointer"
                    v-show="compVisible(item.props)"
                  ></component>
                </div>
              </template>
            </GroupEditBox>
          </template>
          <div
            v-show="moveState.type === 'frameSelect'"
            :style="{
              width: frameSelectDomStyle.width + 'px',
              height: frameSelectDomStyle.height + 'px',
              left: frameSelectDomStyle.left + 'px',
              top: frameSelectDomStyle.top + 'px',
              border: frameSelectDomStyle.border,
            }"
            class="absolute cursor-crosshair"
          ></div>
        </CanvasBox>
      </Dropdown>
    </div>
    <div class="footer">
      <PanelConfig />
    </div>
  </div>
</template>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
  background-size: 21px 21px, 21px 21px;
  position: relative;
  overflow: hidden;
}

.footer {
  height: 45px;
  background-color: var(--color-menu-light-bg);
  // z-index: 999;
  width: 100%;
  // right: 0;
  // bottom: 0px;
  border: 1px solid #000;
  border-bottom: none;
  border-top: none;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
.lightning-container {
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
}
</style>
