<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import MonacoEditor from "../MonacoEditor/index.vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { cloneDeep, merge } from "lodash-es";
import { usePageConfigStore } from "@/stores/usePageConfigStore";

const componentConfigStore = useComponentConfigStore();
const pageConfigStore = usePageConfigStore();
const option = ref("");

watch(
  () => componentConfigStore.activeComponent!.props.option,
  (newValue) => {
    if (newValue) {
      const copyOption = cloneDeep(newValue)
      delete copyOption.dataset
      option.value = JSON.stringify(copyOption, null, 2);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const onOptionChange = (value) => {
  componentConfigStore.activeComponent!.props.option = toRef({...componentConfigStore.activeComponent?.props.option, ...JSON.parse(value)});
};

const extendScreenVisible = ref(false);


const copyCode = ref("")
const onExtendScreen = () => {
  copyCode.value = cloneDeep(option.value)
  extendScreenVisible.value = true
};
const handleOk = () => {
  onOptionChange(copyCode.value)
  pageConfigStore.getCurrentPage()?.componentList
  extendScreenVisible.value = false
}
</script>
<template>
  <div class="container relative">
    <div
      class="extend-screen absolute top-1 right-4 z-50 cursor-pointer hover:text-blue-500"
    >
      <a-tooltip content="放大" @click="onExtendScreen">
        <a-icon size="18">
          <icon-fullscreen />
        </a-icon>
      </a-tooltip>
    </div>
    <MonacoEditor v-model="option" language="json" @update:model-value="onOptionChange" />
  </div>
  <a-drawer
    :width="600"
    :visible="extendScreenVisible"
    @ok="handleOk"
    @cancel="extendScreenVisible = false"
    :header="false"
    ok-text="保存"
  >
    <MonacoEditor v-model="copyCode" language="json" />
  </a-drawer>
</template>

<style scoped lang="less">
.container {
  :deep(.monaco-editor-container) {
    border: none;
  }
}
</style>
