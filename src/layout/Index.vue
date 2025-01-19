<script setup lang="ts">
</script>

<template>
  <div>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="true"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
      </n-layout-sider>
      <n-layout>
        <span>内容</span>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped lang="less">

</style>
