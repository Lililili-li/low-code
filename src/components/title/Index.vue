<script setup lang="ts">
defineProps(['title'])
</script>
<template>
  <div class="title">
    <span class="pt-2 pb-2">{{ title }}</span>
  </div>
</template>
<style scoped lang="less">
.title {
  background-color: rgba(255, 255, 255, .1);
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  margin-bottom: 10px;
  span {
    width: 100%;
    height: 100%;
    background-color: #4d4d4e;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
