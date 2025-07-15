<script setup lang="ts">
import {  ref } from 'vue'
import { AddCircle16Regular } from '@vicons/fluent'
import { useRouter } from 'vue-router'
import CreateProject from './components/CreateProject.vue'

const router = useRouter()
const createProjectRef = ref<InstanceType<typeof CreateProject>>()

const selectKey = ref(['List'])
const openKeys = ref(['1'])
const handleChange = (key: string) => {
  router.push({
    name: key,
  })
}

const onOpenCreateProjectModal = () => {
  createProjectRef.value?.openCreateProjectModal()
}
</script>
<template>
  <div class="project-container">
    <a-layout style="height: 100%" has-sider>
      <a-layout-sider show-trigger hide-trigger :width="220">
        <div class="crate-btn flex justify-center items-center">
          <a-button type="primary" @click="onOpenCreateProjectModal" size="small">
            <template #icon>
              <a-icon>
                <AddCircle16Regular />
              </a-icon>
            </template>
            新建项目
          </a-button>
        </div>
        <a-menu @menu-item-click="handleChange" v-model:selected-keys="selectKey" v-model:open-keys="openKeys">
          <a-sub-menu key="1">
            <template #icon>
              <icon-apps />
            </template>
            <template #title>我的项目</template>
            <a-menu-item key="List">
              <template #icon>
                <icon-computer />
              </template>
              全部项目
            </a-menu-item>
            <a-menu-item key="Template">
              <template #icon>
                <icon-desktop />
              </template>
              我的模板
            </a-menu-item>
            <a-menu-item key="Collect">
              <template #icon>
                <icon-star />
              </template>
              我的收藏
            </a-menu-item>
            <a-menu-item key="Trash">
              <template #icon>
                <icon-delete :size="16" />
              </template>
              回收站
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="Market">
            <template #icon>
              <icon-common />
            </template>
            模板市场</a-menu-item
          >
        </a-menu>
      </a-layout-sider>
        <RouterView />
    </a-layout>
    <CreateProject ref="createProjectRef" />
  </div>
</template>

<style scoped lang="less">
.project-container {
  background-color: #101014;
  height: 100vh;

  .crate-btn {
    height: 50px;
    border-bottom: 1px solid #333;
  }
}
</style>
