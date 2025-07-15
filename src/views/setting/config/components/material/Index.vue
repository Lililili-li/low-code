<script setup lang="ts">
import ChartList from './ChartList.vue'

</script>
<template>
  <div class="search" style="height: 35px">
    <a-input placeholder="搜索组件">
      <template #suffix>
        <icon-search />
      </template>
    </a-input>
  </div>
  <div class="component-list">
    <a-tabs animation>
      <a-tab-pane
        key="0"
        title="图表组件"
        style="height: calc(100vh - 210px); overflow: auto"
        class="scrollbar-hidden"
      >
        <ChartList />
      </a-tab-pane>
      <a-tab-pane key="1" title="列表组件"> Content of Tab Panel 1 </a-tab-pane>
      <a-tab-pane key="2" title="图片组件"> Content of Tab Panel 1 </a-tab-pane>
      <a-tab-pane key="3" title="内置组件"> Content of Tab Panel 1 </a-tab-pane>
    </a-tabs>
  </div>
</template>
<style scoped lang="less">
.search {
  padding: 0 12px;
}
</style>
