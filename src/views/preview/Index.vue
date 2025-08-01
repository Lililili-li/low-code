<script setup lang="ts">
import VerticalBar from "@/packages/bar/vertical-bar/Index.vue"
import useHandleEvent from "@/hooks/useHandleEvent.ts"
import {
  type Component,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue"
import { Local } from "@/utils/storage"
import type { IComponentType, IProps } from "@/types/component.d"
import { getVariableValue } from "../setting/config/components/variable/util"
import { useVariableStore } from "@/stores/useVariableStore"
import { useProjectStore } from "@/stores/useProjectStore"
import { usePageConfigStore } from "@/stores/usePageConfigStore"
import jsonPack from "jsonpack"
import {
  handleParamsForSend,
  interfaceEventMap,
} from "../setting/config/components/dataSource/handleParams"
import { getFunctionBody } from "@/utils"
import type { IDataSource } from "@/types/dataSource"
import message from "@/utils/message"
import useHandleInterface from "@/hooks/useHandleInterface"

const projectStore = useProjectStore()
const pageConfigStore = usePageConfigStore()
const variableConfStore = useVariableStore()
const { handleLoopFetch, handleFetch } = useHandleInterface()

interface IComponentsMap {
  [index: string]: Component
}

const componentsMap: IComponentsMap = {
  "vertical-bar": VerticalBar,
}
const pageStyle = ref<any>({})

// 初始化页面样式
const initPageStyle = () => {
  const scaleWidth = window.innerWidth / pageConfigStore.pageSetting?.style?.width
  pageStyle.value = {
    width: pageConfigStore.pageSetting?.style?.width + "px",
    height: pageConfigStore.pageSetting?.style?.height + "px",
    background:
      pageConfigStore.pageSetting?.style?.useImage === 1
        ? `url(${pageConfigStore.pageSetting?.style?.backgroundUrl})`
        : `${pageConfigStore.pageSetting?.style?.backgroundColor}`,
    transform: `scale(${scaleWidth}, ${scaleWidth})`,
  }
}
const initPageConfig = () => {
  pageConfigStore.setPageConfig(jsonPack.unpack(Local.get("pageConfig")))
}
const initGlobalConfig = () => {
  const stateObj = jsonPack.unpack(Local.get("globalConfig")).state
  const states = {}
  for (let key in stateObj) {
    if (!stateObj[key]) return
    states[key] = stateObj[key].value
  }
  variableConfStore.setState(states, "global")
}
// 初始化变量
const initPageVariable = (state, type) => {
  const states = {}
  for (let key in state) {
    if (!state[key]) return
    states[key] = state[key].value
  }
  variableConfStore.setState(states, type)
}
const initData = async () => {
  pageConfigStore.setPageConfig(jsonPack.unpack(Local.get("pageConfig")))
  initPageVariable(pageConfigStore.pageSetting.state, "state")
  initPageVariable(jsonPack.unpack(Local.get("globalConfig")).state, "global")
  console.log(variableConfStore.getState('global'));

  handleInterface(pageConfigStore.pageSetting.dataSource)
  handleChartData(pageConfigStore.pageSetting.componentList)
  initPageStyle()
}
const listenResize = () => {
  const scaleWidth = window.innerWidth / pageConfigStore.pageSetting?.style?.width
  pageStyle.value.transform = `scale(${scaleWidth}, ${scaleWidth})`
}

// 计算组件是否显示
const compVisible = (props: IProps) => {
  if (props.visible.type === "Normal") return props.visible.value
  return getVariableValue(props.visible.value as string, variableConfStore)
}
const handleChartData = (componentList: IComponentType[]) => {
  componentList.forEach((item) => {
    if(item.props.render.type === 'JSExpression') {
      item.props.option.dataset.source = getVariableValue(item.props.render.value, variableConfStore)

    } else {
      item.props.option.dataset.source = item.props.render.defaultValue
    }
  })
}
watch(() => variableConfStore.state, (newVal) => {
  console.log(newVal, 'newVal');

  handleChartData(pageConfigStore.pageSetting.componentList)
}, {
  deep: true
})
const handleInterface = async (dataSource: IDataSource[]) => {
  dataSource.forEach(async (item) => {
    const preAppendEventList: any[] = []
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(interfaceEventMap, key)) {
        preAppendEventList.push({ name: key, ...item[key] })
      }
    }
    try {
      const params = handleParamsForSend(item, preAppendEventList)
      console.log(params, 'params');

      // 判断是否为轮询接口
      const isLoop = item.options.loopTime?.type === 'normal' ? item.options.loopTime.value : getVariableValue(item.options.loopTime.value, variableConfStore)
      // 获取超时时间
      const timeout = item.options.timeout?.type === 'normal' ? item.options.timeout.value : getVariableValue(item.options.timeout.value, variableConfStore)
      let res: any = null
      if (isLoop) {
        res = await handleLoopFetch(params, timeout)
      } else {
        res = await handleFetch(params, timeout)
      }
      const exitItem = preAppendEventList.find((item) => item.name === "handleSuccess")
      if (exitItem) {
        const handleResult = new Function("res", "state", getFunctionBody(exitItem.value))
        handleResult(res, variableConfStore.state)
      }
    } catch (error) {
      const exitItem = preAppendEventList.find((item) => item.name === "handleError")
      if (exitItem) {
        const handleResult = new Function("error", "message", getFunctionBody(exitItem.value))
        const result = handleResult(error, message)
        error = result || error
      }
    } finally {
    }
  })
}


onMounted(() => {
  initData()
  window.addEventListener("resize", listenResize)
})
onUnmounted(() => {
  window.removeEventListener("resize", listenResize)
})
</script>

<template>
  <div class="preview-container w-full h-dvh overflow-auto" data-type="page" >
    <div
      class="wrap"
      :style="pageStyle"
    >
      <div
        v-for="(item, index) in pageConfigStore.pageSetting?.componentList"
        :key="index"
        :style="{
          zIndex: item.style?.zIndex,
          top: item.style?.top + 'px',
          left: item.style?.left + 'px',
          width: item.style?.scaleWidth + 'px',
          height: item.style?.scaleHeight + 'px',
        }"
        class="relative"
      >
        <component
          :is="componentsMap[item?.componentName]"
          v-bind="item.props"
          :width="item.style.width"
          :height="item.style.height"
          class="cursor-pointer"
          v-if="compVisible(item.props)"
          style="padding: 20px"
        ></component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.preview-container {
  position: relative;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  transform-origin: left top;
  .wrap {
    transform-origin: left top;
  }
}
</style>
