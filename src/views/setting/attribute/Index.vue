<script setup lang="jsx">
import PageSetting from './components/PageSetting.vue'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import ComponentSetting from './components/ComponentSetting.vue'

const componentSettingStore = useComponentSettingStore()

</script>

<template>
  <div class="attribute">
    <div class="page-config" v-if="!componentSettingStore.getSelectComponent.id">
      <PageSetting />
    </div>
    <div class="component-config" v-else>
      <ComponentSetting />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
