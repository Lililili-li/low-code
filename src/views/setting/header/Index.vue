<script setup lang="ts">
import { ref, h } from 'vue'
import type { Component } from 'vue'
import {
  Home as HomeIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const dropOptions = ref([
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(UserIcon)
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
    icon: renderIcon(EditIcon)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon)
  }
])
</script>

<template>
  <div class="layout-header pl-12 pr-12">
    <n-row class="flex items-center h-full">
      <n-col :span="8">
        <div class="back">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary>
                <n-icon color="#999" size="22">
                  <HomeIcon />
                </n-icon>
              </n-button>
            </template>
            回到首页
          </n-tooltip>
        </div>
      </n-col>
      <n-col :span="8">
        <div class="page-name flex justify-center">
<!--          绘制页面-->
          <n-select v-model:value="value" style="width: 240px" :options="[
            {
              label: '页面1',
              value: 2
            },
            {
              label: '页面2',
              value: 1
            }
          ]" />
          <n-button quaternary>添加页面</n-button>
        </div>
      </n-col>
      <n-col :span="8">
        <div class="info flex justify-end">
          <n-dropdown :options="dropOptions" show-arrow>
              <n-avatar
                :style="{
                  color: 'yellow',
                  backgroundColor: 'red',
                  cursor: 'pointer',
                }"
              >
                M
              </n-avatar>
          </n-dropdown>
        </div>
      </n-col>
    </n-row>
  </div>
</template>

<style scoped lang="less">
.layout-header {
  height: 59px;
}
</style>
