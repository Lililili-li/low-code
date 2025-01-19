<script setup lang="ts">
import Panel from '../setting/panel/Index.vue'
import autofit from 'autofit.js'
autofit.init()
</script>

<template>
<div class="preview-container">
<div class="box"></div>
</div>
</template>

<style scoped lang="less">
.preview-container {
  width: 100vw;
  height: 100vh;
  .box {
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
    margin: 20px;
  }
}
</style>
