<script setup lang="ts">
import VerticalBar from '@/packages/bar/vertical-bar/Index.vue'
import useHandleEvent from '@/hooks/useHandleEvent.ts'
import { type Component, onMounted, onUnmounted, reactive } from 'vue'
import { Local } from '@/utils/storage'
import type { IComponentType } from '@/types/component.d'

interface IComponentsMap {
  [index: string]: Component
}

const componentsMap: IComponentsMap = {
  'vertical-bar': VerticalBar,
}

const pageConfig = reactive({
  config: {
    style: {
      useImage: undefined,
      backgroundUrl: undefined,
      backgroundColor: undefined,
      width: undefined,
      height: undefined,
    },
    componentName: 'Page',
    state: {
      visible: true,
    },
    props: {
      colors: [
        '#4992ff',
        '#7cffb2',
        '#fddd60',
        '#ff6e76',
        '#58d9f9',
        '#05c091',
        '#ff8a45',
        '#8d48e3',
        '#dd79ee',
      ],
    },
    id: 1,
    componentList: [] as IComponentType[],
  },
  param: {},
})
const initData = () => {
  pageConfig.config = JSON.parse(Local.get('pageConfig'))
  pageConfig.param = JSON.parse(Local.get('pageParam'))
}
const listenResize = () => {
  pageConfig.config.componentList.forEach((item) => {
    item.style.scaleWidth =
      (item.style.width as number) * (window.innerWidth / pageConfig.config.style.width!)
    item.style.scaleHeight =
      (item.style.height as number) * (window.innerHeight / pageConfig.config.style.height!)
  })
}

const apiList = {
  base: {
    url: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  list: [
    {
      url: '/api/preview',
      method: 'get',
      data: {},
      params: {
        type: 'static',
        value: JSON.stringify({
          pageNo: 1,
          pageSize: 10
        }),
      },
      success: {
        type: 'JSExpression',
        value: 'a+=1 b+=1 return a + b'
      }, //成功后处理函数
    },
  ]
}



onMounted(() => {
  initData()
  window.addEventListener('resize', listenResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', listenResize)
})
</script>

<template>
  <div
    class="preview-container w-full h-dvh overflow-auto"
    data-type="page"
    :style="{
      background:
        pageConfig.config.style.useImage === 1
          ? `url(${pageConfig.config.style.backgroundUrl})`
          : `${pageConfig.config.style.backgroundColor}`,
    }"
  >
    <div
      class="wrap"
      :style="{
        width: pageConfig.config.style.width + 'px',
        height: pageConfig.config.style.height + 'px',
      }"
    >
      <div
        v-for="(item, index) in pageConfig.config.componentList"
        :key="index"
        :style="{
          zIndex: item.style.zIndex,
          top: item.style.top + 'px',
          left: item.style.left + 'px',
          width: item.style.scaleWidth + 'px',
          height: item.style.scaleHeight + 'px',
        }"
        class="relative"
      >
        <component
          :is="componentsMap[item?.componentName]"
          v-bind="item.props"
          :width="item.style.width"
          :height="item.style.height"
          class="cursor-pointer"
          v-if="item.props.visible.is"
          v-on="useHandleEvent(item.eventConfig)"
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
}
</style>
