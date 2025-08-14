<script setup lang="ts">
import { computed, useAttrs, watch, watchEffect, type StyleValue } from "vue";
const attrs = useAttrs();
const { props } = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  }
})

const imgUrl = computed(() => {
  return attrs.url
    ? attrs.url
    : "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp";
});
</script>

<template>
  <div
    class="bar absolute h-full w-full animate__animated flex justify-center items-center"
    :class="[props.animationName && `animate__${props.animationName}`, props.openAnimation? (props.animation as any).name: '']"
  >
    <video
      :controls="props.controls as boolean"
      :src="imgUrl as string"
      :autoplay="props.autoPlay as boolean"
      class="w-full h-full"
      :muted="props.muted as boolean"
      :loop="props.loop as boolean"
      :style="{objectFit: props.fit} as StyleValue"
      :poster="props.poster as string"
    ></video>
  </div>
</template>

<style scoped lang="less"></style>
