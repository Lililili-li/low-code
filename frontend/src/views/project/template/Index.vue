<script setup lang="ts">
import { ref } from 'vue'
import Header from '../components/Header.vue'

const onSearch = (name: string) => {
  console.log(name, 'name');
}
</script>

<template>
  <div class="list-container w-full">
    <a-layout-header style="height: 50px; border-bottom: 1px solid #333">
      <Header @onSearch="onSearch" placeholder="请输入模版名称" />
    </a-layout-header>
    <a-layout-content>
      <a-empty description="暂无数据" />
    </a-layout-content>
  </div>
</template>

<style scoped lang="less">
.list-container {

  .header {
    .search {
      padding: 0 20px;
    }
  }

}
</style>
