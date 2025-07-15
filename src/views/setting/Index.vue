<script setup lang="ts">
import LayoutHeader from "./sundries/Index.vue";
import Config from "./config/index.vue";
import Panel from "./panel/index.vue";
import Attribute from "./attribute/Index.vue";
</script>

<template>
  <a-layout>
    <a-layout-header>
      <LayoutHeader />
    </a-layout-header>
    <a-layout has-sider>
      <Config />
      <a-layout has-sider>
        <a-layout-content>
          <Panel></Panel>
        </a-layout-content>
        <div class="layout-setting h-full">
          <Attribute />
        </div>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less"></style>
