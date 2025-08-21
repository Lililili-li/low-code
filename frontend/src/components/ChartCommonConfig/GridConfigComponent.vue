<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { computed, ref, watch } from "vue";

const props = defineProps(["option"]);
const emits = defineEmits(["change"]);

const option = ref({
  top: "14%",
  bottom: "8%",
  left: "10%",
  right: "10%",
  containLabel: true,
});

watch(
  () => props.option,
  () => {
    option.value = { ...option.value, ...cloneDeep(props.option) };
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <a-row :gutter="[12, 12]" style="width: 100%">
    <a-col :span="12">
      <a-row :gutter="8" align="center">
        <a-col :span="8">
          <a-typography-text>上</a-typography-text>
        </a-col>
        <a-col :span="16">
          <a-input placeholder="上边距" size="small" v-model="option.top" @input="emits('change', option)"/>
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="12">
      <a-row :gutter="8" align="center">
        <a-col :span="8">
          <a-typography-text>下</a-typography-text>
        </a-col>
        <a-col :span="16">
          <a-input placeholder="下边距" size="small" v-model="option.bottom" @input="emits('change', option)"/>
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="12">
      <a-row :gutter="8" align="center">
        <a-col :span="8">
          <a-typography-text>左</a-typography-text>
        </a-col>
        <a-col :span="16">
          <a-input placeholder="左边距" size="small" v-model="option.left" @input="emits('change', option)"/>
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="12">
      <a-row :gutter="8" align="center">
        <a-col :span="8">
          <a-typography-text>右</a-typography-text>
        </a-col>
        <a-col :span="16">
          <a-input placeholder="右边距" size="small" v-model="option.right" @input="emits('change', option)"/>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped lang="less"></style>
