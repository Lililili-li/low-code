<script setup>
import { ref } from "vue";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import MonacoEditor from "@/components/MonacoEditor/index.vue";

const pageConfigStore = usePageConfigStore();

</script>
<template>
  <div class="container" style="height: calc(100vh - 120px)">
    <a-empty></a-empty>
    <MonacoEditor
      v-model="pageConfigStore.pageConf.schema"
      language="json"
      ref="monacoEditorRef"
      :options="{ readOnly: true }"
    />
  </div>
</template>

<style scoped lang="less">
.container {
}
</style>
