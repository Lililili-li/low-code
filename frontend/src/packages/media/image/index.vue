<script setup lang="ts">
import { computed, useAttrs, type StyleValue } from "vue";
const attrs = useAttrs();

const imgUrl = computed(() => {
  return attrs.url
    ? attrs.url
    : "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp";
});
const duration = computed(() => (attrs.animation as any).duration + "s");
const number = computed(() =>
  (attrs.animation as any).number === -1 ? "infinite" : (attrs.animation as any).number
);
</script>

<template>
  <div
    class="bar absolute h-full w-full animate__animated flex justify-center items-center"
    :class="[attrs.animationName && `animate__${attrs.animationName}`, attrs.openAnimation? (attrs.animation as any).name: '']"
  >
    <img :src="imgUrl as string" alt="" class="w-full h-full" :style="{ objectFit: attrs.fit } as StyleValue"/>
  </div>
</template>

<style scoped lang="less">
@keyframes anticlockwise {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
@keyframes clockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes scale {
  from {
    transform: scale(0.5);
  }
  25% {
    transform: scale(0.75); /* 放大到1.2倍 */
  }
  50% {
    transform: scale(1); /* 放大到1.2倍 */
  }
  75% {
    transform: scale(0.75); /* 放大到1.2倍 */
  }
  to {
    transform: scale(0.5); /* 恢复原始大小 */
  }
}

@keyframes breath {
  from {
    transform: scale(0.9);
  }
  25% {
    transform: scale(0.95); /* 放大到1.2倍 */
  }
  50% {
    transform: scale(1); /* 放大到1.2倍 */
  }
  75% {
    transform: scale(0.95); /* 放大到1.2倍 */
  }
  to {
    transform: scale(0.9); /* 恢复原始大小 */
  }
}
@keyframes visible {
  from {
    opacity: 0.5;
  }
  25% {
    opacity: 0.75; /* 放大到1.2倍 */
  }
  50% {
    opacity: 1; /* 放大到1.2倍 */
  }
  75% {
    opacity: 0.75; /* 放大到1.2倍 */
  }
  to {
    opacity: 0.5; /* 恢复原始大小 */
  }
}

.anticlockwise {
  animation: anticlockwise v-bind(duration) linear v-bind(number);
}

.clockwise {
  animation: clockwise v-bind(duration) linear v-bind(number);
}

.scale {
  animation: scale v-bind(duration) linear v-bind(number);
}

.breath {
  animation: breath v-bind(duration) linear v-bind(number);
}

.visible {
  animation: visible v-bind(duration) linear v-bind(number);
}
</style>
