<script setup lang="tsx">
import LayoutHeader from "./sundries/Index.vue";
import { defineAsyncComponent } from "vue";

const Config = defineAsyncComponent({
  loader: () => import("./config/index.vue"),
  loadingComponent: () => (
    <div
      class="flex justify-center items-center"
      style="width: 350px; height: calc(100vh - 50px)"
    >
      <a-spin dot />
    </div>
  ),
});

const Panel = defineAsyncComponent({
  loader: () => import("./panel/index.vue"),
  loadingComponent: () => (
    <div
      class="flex justify-center items-center"
      style="height: calc(100vh - 50px); width: calc(100% - 700px)"
    >
      <a-spin dot />
    </div>
  ),
});
const Attribute = defineAsyncComponent({
  loader: () => import("./attribute/index.vue"),
  loadingComponent: () => (
    <div
      class="flex justify-center items-center"
      style="width: 350px; height: calc(100vh - 50px)"
    >
      <a-spin dot />
    </div>
  ),
});
</script>

<template>
  <a-layout>
    <a-layout-header>
      <LayoutHeader />
    </a-layout-header>
    <a-layout has-sider>
      <div style="width: 350px;">
        <Config />
      </div>
      <a-layout has-sider>
        <a-layout-content style="width: calc(100% - 350px);">
          <Panel></Panel>
        </a-layout-content>
        <div style="width: 350px;">
          <Attribute />
        </div>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less"></style>
