<script setup lang="ts">
import { computed, ref, type StyleValue } from 'vue'
import { CubeOutline, Images, StatsChartOutline, Search } from '@vicons/ionicons5'
import { generateUUID, renderIcon } from '@/utils'
import '@/views/setting/component-config'
import componentList  from '@/views/setting/component-config'

const { collapsed } = defineProps(['collapsed'])
const menuOptions = ref([
  {
    label: '容器',
    icon: renderIcon(CubeOutline),
    key: 'Box',
  },
  {
    label: '图表',
    icon: renderIcon(StatsChartOutline),
    key: 'Chart',
  },
  {
    label: '图片',
    icon: renderIcon(Images),
    key: 'Image',
  },
])
const menuOptions2 = ref([
  {
    label: '页面变量',
    icon: CubeOutline,
    key: 'Box',
  },
  {
    label: '全局变量',
    icon: StatsChartOutline,
    key: 'Chart',
  },
  {
    label: '接口配置',
    icon: Images,
    key: 'Image',
  },
])
const activeKey = ref('Chart')

const asideMenuStyle = computed<StyleValue>(() => {
  return {
    width: collapsed ? '0' : '100%',
    padding: collapsed ? 0 : '12px',
    boxSizing: 'border-box',
  }
})
const componentsList = ref(componentList)
const onComponentDragStart = (event: Event, data: Object) => {
  event.dataTransfer.setData('component', JSON.stringify(data.config))
}
</script>

<template>
  <div class="layout-aside">
    <n-scrollbar style="height: calc(100vh - 60px)">
      <div class="content flex h-full">
        <div
          class="aside-menu h-full pl-1 pr-1 flex-col justify-between flex flex-shrink-0"
          :style="{
            width: '90px',
            borderRight: collapsed ? 'none' : `1px solid rgba(255, 255, 255, 0.09)`,
          }"
        >
          <n-menu v-model:value="activeKey" :options="menuOptions" />
          <div class="setting-list">
            <div
              class="setting-item flex flex-col mb-3"
              v-for="item in menuOptions2"
              :key="item.key"
            >
              <n-button quaternary class="h-16">
                <div class="flex flex-col items-center justify-center h-full">
                  <n-icon :component="item.icon" size="24" />
                  <span style="margin-top: 8px">{{ item.label }}</span>
                </div>
              </n-button>
            </div>
          </div>
        </div>
        <div class="aside-menu-component h-full" :style="asideMenuStyle">
          <div class="search" style="height: 35px">
            <n-input placeholder="搜索组件">
              <template #suffix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>
          <div class="component-list" style="margin-top: 10px">
            <div
              class="component-item"
              v-for="item in componentsList.filter((item) => item.type === activeKey)"
              :key="item.id"
            >
              <n-card
                :title="item.name"
                :content-style="{
                  padding: '10px',
                  paddingTop: '0px',
                }"
                :header-style="{
                  padding: '5px 10px',
                  fontSize: '14px',
                }"
                class="cursor-pointer"
              >
                <img
                  :src="item.logo"
                  class="logo"
                  draggable="true"
                  @dragstart="onComponentDragStart($event, item)"
                />
              </n-card>
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
.layout-aside {
  :deep(.n-scrollbar-content) {
    height: 100%;
  }
  :deep(.n-menu-item) {
    height: auto !important;
    margin-bottom: 20px;
    .n-menu-item-content {
      display: flex;
      flex-direction: column;
      padding: 6px 12px !important;
      justify-content: center;
      align-items: center;
      font-size: 13px;
    }
    .n-menu-item-content-header {
      opacity: 1 !important;
      margin-top: 5px;
    }
    .n-menu-item-content__icon {
      margin-right: 0 !important;
      font-size: 24px !important;
    }
  }
  .aside-menu-component {
    transition: all 0.4s;
  }
  .logo {
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
