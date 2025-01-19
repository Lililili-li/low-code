<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LayoutHeader from './header/Index.vue'
import LayoutAside from '@/views/setting/component-tree/Index.vue'
import Panel from './panel/Index.vue'
import Attribute  from './attribute/Index.vue'
import { usePanelSettingStore } from '@/stores/panelSettingStore.ts'

const panelSettingStore = usePanelSettingStore()
onMounted(() => {})
const leftCollapsedOpen = ref(false)
const rightCollapsedOpen = ref(false)
</script>

<template>
  <n-layout>
    <n-layout-header bordered>
      <LayoutHeader />
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="90"
        :width="300"
        :native-scrollbar="false"
        show-trigger="arrow-circle"
        v-model:collapsed="leftCollapsedOpen"
        @updateCollapsed="panelSettingStore.updatePanelSetting()"
      >
        <LayoutAside :collapsed="leftCollapsedOpen" />
      </n-layout-sider>
      <n-layout class="flex-1" has-sider sider-placement="right">
        <n-layout-content>
          <Panel></Panel>
        </n-layout-content>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="0"
          :width="320"
          :native-scrollbar="false"
          show-trigger="arrow-circle"
          v-model:collapsed="rightCollapsedOpen"
          @updateCollapsed="panelSettingStore.updatePanelSetting()"
        >
          <div class="layout-setting h-full">
            <Attribute />
          </div>
        </n-layout-sider>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style scoped lang="less"></style>
