<script setup lang="ts">
import { ref, watch } from "vue";
import MonacoEditor from "../MonacoEditor/index.vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { cloneDeep, merge } from "lodash-es";

const componentConfigStore = useComponentConfigStore();
const option = ref("");

watch(
  () => componentConfigStore.activeComponent!.props.option,
  (newValue) => {
    if (newValue) {
      option.value = JSON.stringify(cloneDeep(newValue), null, 2);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const onOptionChange = (value) => {
  try {
    // componentConfigStore.activeComponent!.props.option = merge({}, componentConfigStore.activeComponent!.props.option, JSON.parse(value))
    componentConfigStore.activeComponent!.props.option = JSON.parse(value);
  } catch (error) {}
};
</script>
<template>
  <div class="container">
    <MonacoEditor v-model="option" language="json" @update:model-value="onOptionChange" />
  </div>
</template>

<style scoped lang="less">
.container {
  :deep(.monaco-editor-container) {
    border: none;
  }
}
</style>
