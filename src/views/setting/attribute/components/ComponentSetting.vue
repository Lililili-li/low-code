<script setup lang="ts">
import { ref } from 'vue'
import VerticalBarConfig from '@/components/vertical-bar/Config.vue'
const { optionData } = defineProps(['optionData'])
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import { componentConfigMap } from '@/components'

const componentSettingStore = useComponentSettingStore()
const value = ref(true)
</script>

<template>
  <div class="component-setting p-3" style="height: calc(100vh - 60px); width: 320px">
    <n-scrollbar style="height: 100%; overflow: auto">
      <n-tabs type="segment" animated>
        <n-tab-pane name="1" tab="属性">
          <n-flex vertical style="gap: 18px 12px">
            <n-flex align="center" justify="center" class="w-full">
              <n-text style="width: 60px;">名称</n-text>
              <n-input type="text" placeholder="请输入名称" style="flex: 1"></n-input>
            </n-flex>
            <n-flex class="w-full" align="center" justify="center">
              <n-text style="width: 60px;">尺寸</n-text>
              <div style="flex: 1" class="flex justify-between">
                <n-input-number placeholder="请输入" style="width: 49%" size="medium">
                  <template #prefix>
                    <span style="font-size: 13px">宽度</span>
                  </template>
                </n-input-number>
                <n-input-number placeholder="请输入" style="width: 49%" size="medium">
                  <template #prefix>
                    <span style="font-size: 13px">高度</span>
                  </template>
                </n-input-number>
              </div>
            </n-flex>
            <n-flex class="w-full" align="center" justify="center">
              <n-text style="width: 60px;">位置</n-text>
              <div style="flex: 1" class="flex justify-between">
                <n-input-number placeholder="请输入" style="width: 49%" size="medium">
                  <template #prefix>
                    <span style="font-size: 13px;">上</span>
                  </template>
                </n-input-number>
                <n-input-number placeholder="请输入" style="width: 49%" size="medium">
                  <template #prefix>
                    <span style="font-size: 13px">左</span>
                  </template>
                </n-input-number>
              </div>
            </n-flex>
            <n-flex class="w-full" align="center" justify="space-between">
              <n-text style="width: 60px;">是否渲染</n-text>
              <n-switch size="medium" v-model:value="value"/>
            </n-flex>
          </n-flex>
          <n-divider />
          <div class="component-config">
            {{componentConfigMap[componentSettingStore?.selectComponent]}}
            <Component :is="componentConfigMap[componentSettingStore?.selectComponent?.componentConfigName!]" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="2" tab="动画">

        </n-tab-pane>
        <n-tab-pane name="3" tab="事件">

        </n-tab-pane>
      </n-tabs>
    </n-scrollbar>

  </div>
</template>

<style scoped lang="less">
:deep(.n-input__placeholder) {
  font-size: 12px;
}
</style>
