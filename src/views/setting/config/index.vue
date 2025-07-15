<script setup lang="tsx">
import {
  computed,
  defineAsyncComponent,
  ref,
  shallowRef,
  type StyleValue,
} from 'vue'
import Menu, { type MenuItemType } from '@/components/menu/index.vue'
import { Material } from './components'
import { usePanelConfigStore } from '@/stores/usePanelConfigStore'
import { BracesVariable24Regular, DatabaseLink20Regular } from '@vicons/fluent'
import { renderIcon } from '@/utils'

const Layer = defineAsyncComponent(() => import('./components/layers/index.vue'))
const Variable = defineAsyncComponent(() => import('./components/variable/index.vue'))
const DataSource = defineAsyncComponent(() => import('./components/dataSource/index.vue'))
const Schema = defineAsyncComponent(() => import('./components/schema/index.vue'))
const panelConfigStore = usePanelConfigStore()

enum MenuTypeEnum {
  MATERIAL = 'material',
  LAYER = 'layer',
  VARIABLE = 'variable',
  DataSource = 'dataSource',
  Schema = 'schema'
}

const menuOptions = shallowRef([
  {
    label: '物料',
    icon: <icon-apps />,
    key: MenuTypeEnum.MATERIAL,
    component: Material,
  },
  {
    label: '图层',
    icon: <icon-layers />,
    key: MenuTypeEnum.LAYER,
    component: Layer,
  },
  {
    label: '变量管理',
    icon: renderIcon(BracesVariable24Regular),
    key: MenuTypeEnum.VARIABLE,
    component: Variable,
  },
  {
    label: '数据源管理',
    icon: renderIcon(DatabaseLink20Regular),
    key: MenuTypeEnum.DataSource,
    component: DataSource,
  },
  {
    label: 'Schema',
    icon: <icon-code />,
    key: MenuTypeEnum.Schema,
    component: Schema,
  },
])

const activeKey = ref<string | null>('material')
const collapsed = ref(false)
const asideMenuStyle = computed<StyleValue>(() => {
  return {
    width: collapsed.value ? '0' : 'calc(100% - var(--nav-width))',
    padding: collapsed.value ? 0 : '12px 0',
    opacity: collapsed.value ? 0 : 1,
    boxSizing: 'border-box',
  }
})

const onChangeMenu = (data: MenuItemType) => {
  if (activeKey.value === data.key) {
    onCloseAside()
  } else {
    collapsed.value = false
    activeKey.value = data.key as MenuTypeEnum
    panelConfigStore.updatePanelSetting()
  }
}
const onCloseAside = () => {
  collapsed.value = true
  activeKey.value = null
  panelConfigStore.updatePanelSetting()
}
</script>

<template>
  <a-layout-sider bordered :width="collapsed ? 40 : activeKey === MenuTypeEnum.Schema? 550: 350">
    <div class="layout-aside">
      <div class="content flex h-full" style="height: calc(100vh - 50px);">
        <div class="aside-menu h-full flex-col justify-between flex flex-shrink-0">
          <Menu :options="menuOptions" :active-key="activeKey" @on-change="onChangeMenu"></Menu>
        </div>
        <div class="aside-menu-component h-full" :style="asideMenuStyle">
          <div class="title flex justify-between pb-3 items-center">
            <span style="font-size: 16px">{{
              menuOptions.find((item) => item.key === activeKey)?.label
            }}</span>
            <icon-menu-fold class="cursor-pointer close" :size="18" @click="onCloseAside" />
          </div>
          <div class="render-box overflow-hidden">
            <component
              :is="menuOptions.find((item) => item.key === activeKey)?.component"
            ></component>
          </div>
        </div>
      </div>
    </div>
  </a-layout-sider>
</template>

<style scoped lang="less">
.layout-aside {
  border-right: 1px solid var(--color-neutral-3);
  .drawer {
    left: 100%;
    top: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid var(--color-neutral-3);
    z-index: 99999;
  }
  :deep(.a-scrollbar-content) {
    height: 100%;
  }

  .aside-menu {
    width: var(--nav-width);
    border-right: 1px solid rgba(255, 255, 255, 0.09);
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

        &:hover {
          color: rgb(var(--primary-6));
        }
      }
    }
  }

  .logo {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }

  :deep(.arco-tabs-nav-button-left) {
    margin-left: 0;
  }

  :deep(.arco-tabs-nav-button-right) {
    margin-right: 0;
  }

  /* 自定义滚动条样式 */

  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
