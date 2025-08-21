<script setup lang="ts">
const visible = defineModel<boolean>("visible");
const { title, headerStyle, contentStyle, width } = defineProps([
  "title",
  "headerStyle",
  "contentStyle",
  "width",
]);
</script>

<template>
  <a-modal
    v-model:visible="visible"
    v-bind="$attrs"
    simple
    :width="width || 800"
    :modal-style="{ padding: '0' }"
    :footer="false"
    hide-title
    :alignCenter="false"
  >
    <template #footer> 底部 </template>
    <a-card
      :style="{ width: `${width || 800}px` }"
      :header-style="{
        padding: '5px 10px',
        background: '#212121',
        fontSize: '14px',
        fontWeight: 'normal',
        height: 'auto',
        ...headerStyle,
      }"
      :body-style="{
        padding: '5px 10px',
        background: '#333',
        ...contentStyle,
      }"
    >
      <template #title>
        <span style="font-size: 14px">{{ title }}</span>
      </template>
      <template #extra>
        <div class="cursor-pointer" @click="visible = false">
          <icon-close-circle style="color: #eee; font-size: 18px" />
        </div>
      </template>
      <slot></slot>
    </a-card>
  </a-modal>
</template>

<style scoped lang="less"></style>
