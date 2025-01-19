<script setup lang="ts">
import { type Component, ref } from 'vue'
import { type MenuOption, NIcon } from 'naive-ui'
import { BookOutline as BookIcon, AddCircleOutline } from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = ref([
  {
    label: '我的项目',
    key: '1',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '全部项目',
        key: '2',
        name: 'List'
      },
      {
        label: '我的模板',
        key: '3',
        name: 'template'
      },
    ],
  },
])
const selectKey = ref('2')
</script>
<template>
  <div class="project-container">
    <n-layout has-sider style="height: 100%">
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="0" :width="240" show-trigger>
        <div class="crate-btn flex justify-center items-center">
          <n-button type="primary" ghost>
            <template #icon>
              <n-icon>
                <AddCircleOutline />
              </n-icon>
            </template>
            新建项目
          </n-button>
        </div>
        <n-menu
          :collapsed-width="0"
          :collapsed-icon-size="22"
          :options="menuOptions"
          v-model:value="selectKey"
        />
      </n-layout-sider>
      <n-layout>
        <RouterView />
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped lang="less">
.project-container {
  background-color: #101014;
  height: 100vh;

  .crate-btn {
    height: 100px;
    border-bottom: 1px solid #666;
  }
}
</style>
