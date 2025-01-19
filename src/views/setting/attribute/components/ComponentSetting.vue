<script setup lang="ts">
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import { componentConfigMap } from '@/components'

const { optionData } = defineProps(['optionData'])

const componentSettingStore = useComponentSettingStore()
const { props, name, style } = componentSettingStore?.selectComponent
</script>

<template>
  <div class="component-setting p-3" style="height: calc(100vh - 70px); width: 320px; overflow: hidden;">
    <n-tabs type="segment" animated>
      <n-tab-pane name="1" tab="属性">
        <n-scrollbar style="height: calc(100vh - 140px)">
          <n-flex vertical style="gap: 18px 12px">
            <n-flex align="center" justify="center" class="w-full">
              <n-text style="width: 60px">组件名称</n-text>
              <n-input
                type="text"
                placeholder="请输入名称"
                style="flex: 1"
                size="small"
                v-model:value="name"
              ></n-input>
            </n-flex>
            <n-flex class="w-full" align="center" justify="center">
              <n-text style="width: 60px">组件尺寸</n-text>
              <div style="flex: 1" class="flex justify-between">
                <n-input-number
                  placeholder="请输入"
                  style="width: 49%"
                  size="small"
                  v-model:value="style.width"
                >
                  <template #prefix>
                    <span style="font-size: 13px">宽</span>
                  </template>
                </n-input-number>
                <n-input-number
                  placeholder="请输入"
                  style="width: 49%"
                  size="small"
                  v-model:value="style.height"
                >
                  <template #prefix>
                    <span style="font-size: 13px">高</span>
                  </template>
                </n-input-number>
              </div>
            </n-flex>
            <n-flex class="w-full" align="center" justify="center">
              <n-text style="width: 60px">组件位置</n-text>
              <div style="flex: 1" class="flex justify-between">
                <n-input-number
                  placeholder="请输入"
                  style="width: 49%"
                  size="small"
                  v-model:value="style.top"
                >
                  <template #prefix>
                    <span style="font-size: 13px">上</span>
                  </template>
                </n-input-number>
                <n-input-number
                  placeholder="请输入"
                  style="width: 49%"
                  size="small"
                  v-model:value="style.left"
                >
                  <template #prefix>
                    <span style="font-size: 13px">左</span>
                  </template>
                </n-input-number>
              </div>
            </n-flex>
            <n-flex class="w-full" align="center" justify="space-between">
              <n-text style="width: 60px">是否渲染</n-text>
              <n-switch size="small" v-model:value="props.visible" />
            </n-flex>
          </n-flex>
          <div class="component-config">
            <Component
              :is="componentConfigMap[componentSettingStore?.selectComponent?.componentConfigName!]"
            />
          </div>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="2" tab="动画"> </n-tab-pane>
      <n-tab-pane name="3" tab="样式"> </n-tab-pane>
      <n-tab-pane name="4" tab="事件"> </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped lang="less">
:deep(.n-input__placeholder) {
  font-size: 12px;
}
</style>
