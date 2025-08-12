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
import { getVariableValue } from "../config/components/variable/util";
import { useVariableStore } from "@/stores/useVariableStore";
import CanvasBox from "./components/CanvasBox.vue";
import { cloneDeep } from "lodash-es";

const variableConfStore = useVariableStore();
const { panelDropdownOptions, mousePosition, initHotKeys } = useLayers();
const { addHistory } = useWorkStore();
const compConfigStore = useComponentConfigStore();
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
  compConfigStore.setActiveComponent(componentInfo);
  pageConfigStore.addComponent(compConfigStore.activeComponent as IComponentType);
  layersStore.setCutCompId(componentInfo.id);
  event.dataTransfer?.clearData();
  startPosition[componentInfo.id] = cloneDeep(componentInfo.style);
  addHistory({
    label: "新增-" + componentInfo.name,
    id: generateUUID(),
    type: "create",
    componentId: [componentInfo.id],
    props: componentInfo,
    time: dayjs().format("MM-DD HH:mm"),
  });
  bus.emit("openPage", false);
};

// 通过底部操作栏修改画板缩放
let startPosition = {};
const onComponentMousedown = (
  event: MouseEvent,
  item: IComponentType,
  type: "component" | "group"
) => {
  if (event.shiftKey) {
    // 如果点击是自己的话直接返回不做处理
    if (item.id === compConfigStore.activeComponent?.id) return;
    // 先将激活的组件放到选中状态中
    if (
      compConfigStore.activeComponent?.id &&
      !compConfigStore.selectIds.includes(compConfigStore.activeComponent?.id)
    ) {
      compConfigStore.selectIds.push(compConfigStore.activeComponent?.id);
    }
    // 然后移除激活状态
    compConfigStore.removeActiveComponent();
    // 将点击的组件放到选中状态中
    if (!compConfigStore.selectIds.includes(item.id))
      compConfigStore.selectIds.push(item.id);
    compConfigStore.selectIds.forEach((item) => {
      startPosition[item] = cloneDeep(
        pageConfigStore.currentPage?.componentList?.find((i) => i.id === item)?.style
      );
    });
    return;
  }
  if (type === "group") {
    if (!compConfigStore.selectIds?.includes(item.id)) {
      compConfigStore.removeActiveComponent();
      compConfigStore.clearSelectGroupComponent();
      compConfigStore.selectIds.push(item.id);
      layersStore.setCutCompId(item.id);
      compConfigStore.setActiveComponent(item);
    }
    startPosition[item.id] = cloneDeep(item.style);
    startPosition[item.id]["children"] = {};
    item.children?.forEach((child) => {
      startPosition[item.id]["children"][child.id] = cloneDeep(child.style);
    });
  } else {
    if (!compConfigStore.selectIds?.includes(item.id)) {
      compConfigStore.clearSelectGroupComponent();
      compConfigStore.setActiveComponent(item);
      layersStore.setCutCompId(item.id);
    }
    startPosition[item.id] = cloneDeep(item.style);
  }
  setMoveState({ startX: event.x, startY: event.y, type: "move", componentType: type });
  bus.emit("openPage", false);
};
// 画板鼠标按下事件
const onPanelMousedown = (event: MouseEvent) => {
  // 如果正在拖拽画板直接返回
  if (panelConfigStore.isMoving) return;
  if ((event?.target as HTMLElement).dataset.type !== "component") {
    compConfigStore.removeActiveComponent();
    setMoveState({ startX: event.x, startY: event.y, type: "frameSelect" });
    frameSelectDomStyle.left = event.offsetX;
    frameSelectDomStyle.top = event.offsetY;
    setTimeout(() => {
      compConfigStore.clearSelectGroupComponent();
    }, 50);
    bus.emit("openPage", true);
  }
};
// 移动组件或者圈选的组件
const handleMoveComponent = (moveX: number, moveY: number) => {
  if (compConfigStore.selectIds.length === 0 && compConfigStore.activeComponent) {
    // 1. 单个激活状态组件移动
    (compConfigStore.activeComponent!.style!.left as number) += formatNumber(
      moveX - moveState.moveX
    );
    (compConfigStore.activeComponent!.style!.top as number) += formatNumber(
      moveY - moveState.moveY
    );
  } else {
    compConfigStore.selectIds.forEach((id) => {
      const item = pageConfigStore.currentPage?.componentList?.find(
        (item) => item.id === id
      );
      if (item) {
        if (item?.type === "group") {
          item.children?.forEach((child) => {
            (child.style.left as number) += formatNumber(moveX - moveState.moveX);
            (child.style.top as number) += formatNumber(moveY - moveState.moveY);
          });
        }
        (item.style.left as number) += formatNumber(moveX - moveState.moveX);
        (item.style.top as number) += formatNumber(moveY - moveState.moveY);
      }
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
  compConfigStore.handleSelectGroupComponent(
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
  if (panelConfigStore.isMoving) return;
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
const onPanelMouseup = () => {
  if (panelConfigStore.isMoving) return;
  if (moveState.type === "frameSelect") {
    frameSelectDomStyle.width = 0;
    frameSelectDomStyle.height = 0;
    frameSelectDomStyle.left = 0;
    frameSelectDomStyle.top = 0;
  }

  if (moveState.type === "move") {
    const position = {};
    Object.keys(startPosition).forEach((key) => {
      const children = {};
      if (startPosition[key].children) {
        Object.keys(startPosition[key].children).forEach((childKey) => {
          children[childKey] = {
            start: cloneDeep(startPosition[key].children[childKey]),
            end: cloneDeep(
              pageConfigStore
                .getCurrentPage()
                .componentList.find((item) => item.id === key)
                ?.children?.find((child) => child.id === childKey)?.style
            ),
          };
        });
      }
      position[key] = {
        start: startPosition[key],
        end: cloneDeep(
          pageConfigStore.getCurrentPage().componentList.find((item) => item.id === key)
            ?.style
        ),
        children,
      };
    });
    if (compConfigStore.selectIds.length === 0 && compConfigStore.activeComponent) {
      addHistory({
        type: "shape",
        id: generateUUID(),
        componentId: [compConfigStore.activeComponent?.id!],
        position,
        label: "移动-" + compConfigStore.activeComponent?.name,
        time: dayjs().format("MM-DD HH:mm"),
      });
    } else {
      addHistory({
        type: "shape",
        id: generateUUID(),
        componentId: compConfigStore.selectIds,
        position,
        label: "移动-多个组件",
        time: dayjs().format("MM-DD HH:mm"),
      });
    }
  }
  if (moveState.type === "resize") {
    const position = {};
    Object.keys(startPosition).forEach((key) => {
      position[key] = {
        start: startPosition[key],
        end: cloneDeep(
          pageConfigStore.getCurrentPage().componentList.find((item) => item.id === key)?.style
        ),
      }
    });
    addHistory({
      type: "shape",
      id: generateUUID(),
      componentId: [compConfigStore.activeComponent?.id!],
      position,
      label: "缩放-" + compConfigStore.activeComponent?.name,
      time: dayjs().format("MM-DD HH:mm"),
    });
    console.log(position,2);
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
  startPosition[compConfigStore.activeComponent!.id] = cloneDeep(compConfigStore.activeComponent!.style);
  setMoveState({ startX: event.x, startY: event.y, type: "resize" });
  currentDirectionLabel.value = data;
};

const onDropdownContextmenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const id = target.getAttribute("data-comp-id");
  if (id) {
    layersStore.setCurCompId(id);
    layersStore.setCutCompId(id);
    if (compConfigStore.selectIds.includes(id)) return;
    compConfigStore.setActiveComponent(
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
  initHotKeys();
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
        @mouseup.prevent="onPanelMouseup()"
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
            v-for="item in pageConfigStore.currentPage?.componentList as IComponentType[]"
            :key="item.id"
          >
            <GroupEditBox
              :componentInfo="item"
              :moveState="moveState"
              @mousedown.left.prevent="onComponentMousedown($event, item, item.type!)"
              @onResizeMouseEvent="onResizeMouseEvent"
            >
              <template v-if="item.type === 'component'">
                <component
                  :is="componentMap[item?.componentName]"
                  v-bind="item.props"
                  :width="item.style.width"
                  :height="item.style.height"
                  class="cursor-pointer"
                  v-show="compVisible(item.props)"
                ></component>
              </template>
              <template
                v-for="child in item.children"
                :key="child.id"
                v-if="item.type === 'group'"
              >
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
                  <EditBox :componentInfo="child" :moveState="moveState">
                    <component
                      :is="componentMap[child?.componentName]"
                      v-bind="child.props"
                      :width="child.style.width"
                      :height="child.style.height"
                      class="cursor-pointer"
                      v-show="compVisible(item.props)"
                    ></component>
                  </EditBox>
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
