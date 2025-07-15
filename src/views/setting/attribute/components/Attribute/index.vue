<script setup lang="tsx">
import { componentConfigMap } from "@/packages";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { computed } from "vue";

const componentConfigStore = useComponentConfigStore();
const compConfig = computed(() => componentConfigStore?.activeComponent!);
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="pr-3 pl-3 attribute-container">
      <a-input
        type="text"
        placeholder="请输入组件名称"
        v-model="compConfig.name"
      ></a-input>
      <div class="component-config">
        <Component :is="componentConfigMap[compConfig!.componentConfigName!]" />
      </div>
    </div>
  </a-scrollbar>
</template>
<style lang="less" scoped>
.attribute-container {
  :deep(.arco-input-wrapper) {
    input {
      text-align: center;
    }
  }
  :deep(.arco-collapse-item-content) {
    padding: 0 12px;
  }
}
</style>
