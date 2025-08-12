<script setup lang="tsx">
import { computed, defineAsyncComponent, onMounted, ref, shallowRef, type StyleValue, watch } from 'vue'
import { usePanelConfigStore } from '@/stores/usePanelConfigStore'
import { useComponentConfigStore } from '@/stores/useComponentConfigStore'
import Menu from '@/components/Menu/index.vue'
import { ColorPaletteOutline, SettingsOutline } from '@vicons/ionicons5'
import Empty from '@/components/Empty/index.vue'
import bus from '@/utils/bus'

const PageAttribute = defineAsyncComponent(() => import('./components/PageAttribute.vue'))
const Attribute = defineAsyncComponent(() => import('./components/Attribute/index.vue'))
const Style = defineAsyncComponent(() => import('./components/Style/index.vue'))
const Advanced = defineAsyncComponent(() => import('./components/Advanced/index.vue'))

const panelConfigStore = usePanelConfigStore()
const componentConfigStore = useComponentConfigStore()
const menuOptions = shallowRef([
  {
    label: '页面',
    icon: <icon-desktop />,
    key: 'page',
    component: PageAttribute,
  },
  {
    label: '属性',
    icon: <icon-layers />,
    key: 'attribute',
    component: Attribute,
  },
  {
    label: '样式',
    icon: (
      <a-icon size={18}>
        <ColorPaletteOutline />
      </a-icon>
    ),
    key: 'style',
    component: Style,
  },
  {
    label: '高级',
    icon: (
      <a-icon size={18}>
        <SettingsOutline />
      </a-icon>
    ),
    key: 'Advanced',
    component: Advanced,
  },
])
const collapsed = ref(false)
const activeKey = ref<string | null>('page')
const asideMenuStyle = computed<StyleValue>(() => {
  return {
    width: collapsed.value ? '0' : '100%',
    padding: collapsed.value ? 0 : '12px 0',
    opacity: collapsed.value ? 0 : 1,
    boxSizing: 'border-box',
  }
})
const onChangeMenu = (data) => {
  if (activeKey.value === data.key) {
    onCloseAside()
  } else {
    collapsed.value = false
    activeKey.value = data.key
    panelConfigStore.updatePanelSetting()
  }
}
const onCloseAside = () => {
  collapsed.value = true
  activeKey.value = null
  panelConfigStore.updatePanelSetting()
}
onMounted(() => {
  bus.on('openPage', (flag) => {
    flag ? activeKey.value = 'page': activeKey.value = 'attribute'
  })
})
</script>

<template>
  <div class="layout-aside" style="height: calc(100vh - 50px)">
    <div class="content flex h-full w-full">
      <div class="config-container" :style="{ width: collapsed ? '0px' : '310px' }">
        <div class="aside-menu-component h-full overflow-hidden" :style="asideMenuStyle">
          <div class="title flex justify-between pb-3 items-center">
            <icon-menu-fold
              class="cursor-pointer close"
              :size="18"
              @click="onCloseAside"
            />
            <span style="font-size: 16px">
              {{ menuOptions.find((item) => item.key === activeKey)?.label }}
            </span>
          </div>
          <div class="render-box">
            <div v-if="componentConfigStore.activeComponent?.id || activeKey === 'page'">
              <component
                :is="menuOptions.find((item) => item.key === activeKey)?.component"
              />
            </div>
            <div v-else>
              <Empty content="请选中组件" />
            </div>
          </div>
        </div>
      </div>
      <div class="attribute-list flex-shrink-0">
        <div
          class="attribute-menu h-full flex-col justify-between flex flex-shrink-0 w-full"
        >
          <Menu
            :options="menuOptions"
            :active-key="activeKey"
            @on-change="onChangeMenu"
          ></Menu>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout-aside {
  background-color: var(--color-menu-light-bg);
  border-left: 1px solid var(--color-neutral-3);
  :deep(.a-scrollbar-content) {
    height: 100%;
  }
  .config-container {
    transition: all 0.3s;
  }
  .attribute-list {
    width: var(--nav-width);
    border-left: 1px solid rgba(255, 255, 255, 0.09);
    overflow: hidden;
  }

  .aside-menu-component {
    transition: all 0.3s;

    .title {
      border-bottom: 1px solid var(--color-neutral-3);
      margin-bottom: 10px;
      height: 30px;
      color: #eee;
      font-weight: bold;
      padding: 0 12px 12px;

      .close {
        transition: all 0.3s;
        transform: rotate(180deg);
        &:hover {
          color: rgb(var(--primary-6));
        }
      }
    }
  }
}
</style>
