<script setup lang="ts">
import { onMounted, reactive, watch, ref, computed } from 'vue'
import type { Component } from 'vue'
import VerticalBar from '@/components/vertical-bar/Index.vue'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import { usePanelSettingStore } from '@/stores/panelSettingStore.ts'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import useAxisHelper from '@/hooks/axis-helper/useAxisHelper.ts'
import { formatNumber, generateUUID, throttle } from '@/utils'
import AxisHelper from '@/views/setting/panel/components/AxisHelper.vue'
import EditBox from '@/views/setting/panel/components/EditBox.vue'

interface IComponentsMap {
  [index: string]: Component
}

const componentsMap: IComponentsMap = {
  'vertical-bar': VerticalBar,
}
const componentSettingStore = useComponentSettingStore()
const panelStore = usePanelSettingStore()
onMounted(() => {
  window.addEventListener('resize', () => {
    panelStore.updatePanelSetting()
  })
})

watch(
  () => panelStore.panelScale,
  (n) => {
    if (n > 2) {
      panelStore.panelScale = 2
    }
  },
)
const moveState = reactive({
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  isMoving: false,
})
const { setTargetDom, makeDirectionLine, lineList } = useAxisHelper(panelStore.getPanelScale)
const onMousedown = (event: MouseEvent, item) => {
  if (event.button === 2) return
  event.preventDefault()
  event.stopPropagation()
  componentSettingStore.selectComponent = item
  moveState.startX = event.x
  moveState.startY = event.y
  moveState.isMoving = true
  setTargetDom(document.getElementById(item.id)!, item.id, item)
}

const onMousemove = (event: MouseEvent) => {
  if (moveState.isMoving) {
    const moveX = (event.x - moveState.startX) / panelStore.getPanelScale
    const moveY = (event.y - moveState.startY) / panelStore.getPanelScale
    componentSettingStore.selectComponent.style.left += formatNumber(moveX - moveState.moveX)
    componentSettingStore.selectComponent.style.top += formatNumber(moveY - moveState.moveY)
    moveState.moveX = moveX
    moveState.moveY = moveY
  }
}
const onMouseup = (event: MouseEvent) => {
  event.stopPropagation()
  event.preventDefault()
  moveState.isMoving = false
  moveState.moveX = 0
  moveState.moveY = 0
}
const onComponentDrop = (event: Event) => {
  let componentInfo = JSON.parse(event.dataTransfer.getData('component'))
  componentInfo.style.top = event.offsetY - componentInfo.style.height / 2
  componentInfo.style.left = event.offsetX - componentInfo.style.width / 2
  componentInfo.id = generateUUID()
  componentSettingStore.selectComponent = componentInfo
  componentSettingStore.getCurrentPage!.componentList.push(componentInfo!)
}
const onPanelClick = (e: Event) => {
  if (e?.target!.dataset.type !== 'component') componentSettingStore.selectComponent = {}
}

// 画布背景设置
const canvasSize = computed(() => {
  return {
    width: panelStore.$state.canvasSetting.width + 'px',
    height: panelStore.$state.canvasSetting.height + 'px',
    background: panelStore.$state.canvasSetting.useImage
      ? `url(${panelStore.$state.canvasSetting.imageUrl})`
      : `${panelStore.$state.canvasSetting.backgroundColor}`,
  }
})

setTimeout(() => {})

onMounted(() => {
  panelStore.updatePanelSetting(true)
})
</script>

<template>
  <div
    class="panel"
    style="height: calc(100vh - 60px); padding: 10px"
    @dragover="(e) => e.preventDefault()"
    @drop="onComponentDrop"
    @click="onPanelClick"
  >
    <SketchRule
      v-model:scale="panelStore.panelScale"
      ref="sketchRule"
      v-bind="panelStore.$state.panelSetting"
      :palette="panelStore.$state.panelSetting.palette"
      :canvasWidth="panelStore.$state.canvasSetting.width"
      :canvasHeight="panelStore.$state.canvasSetting.height"
      @mousemove="onMousemove($event)"
      @mouseup="onMouseup($event)"
    >
      <template #default>
        <div
          data-type="page"
          :style="{
            width: panelStore.$state.canvasSetting.width + 'px',
            height: panelStore.$state.canvasSetting.height + 'px',
            background: panelStore.$state.canvasSetting.useImage === 1
              ? `url(${panelStore.$state.canvasSetting.backgroundUrl})`
              : `${panelStore.$state.canvasSetting.backgroundColor}`,
          }"
          class="canvas"
        >
          <EditBox
            v-for="(item, index) in componentSettingStore.getCurrentPage!.componentList"
            :key="index"
            :active="item.id === componentSettingStore.selectComponent.id"
            :style="item.style"
            :componentId="item.id"
            @mousedown="onMousedown($event, item)"
          >
            <component
              :is="componentsMap[item?.componentName]"
              v-bind="item.props"
              :width="item.style.width"
              :height="item.style.height"
              class="cursor-pointer"
              v-if="item.props.visible"
            ></component>
          </EditBox>
          <AxisHelper :line-list="lineList"></AxisHelper>
        </div>
      </template>
    </SketchRule>
  </div>
</template>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
  background-size:
    21px 21px,
    21px 21px;
  position: relative;
}

.canvas {
  //transform: v-bind(panelTransformRate);
  //transform-origin: top left;
  transition: all 0.4s;
  background: #232324;
  position: relative;
}
</style>
