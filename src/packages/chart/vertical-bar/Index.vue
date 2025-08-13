<script setup lang="ts">
import Echart from "@/components/Echart/index.vue";
import { useAttrs, watch } from "vue";
import type { IProps } from "@/types/component";
import { getVariableValue } from "@/views/setting/config/components/variable/util";
import { useVariableStore } from "@/stores/useVariableStore";

const variableStore = useVariableStore();
const emits = defineEmits(["onChartClick"]);
const attrs = useAttrs();

const onChartClick = (event) => {
  emits("onChartClick", event);
};
watch(() => attrs, (newVal) => {
  if ((newVal as any).render.type === 'JSExpression') {
    (newVal as any).option.dataset.source = getVariableValue((newVal as any).render.value, variableStore)
  } else {
    (newVal as any).option.dataset.source = (newVal as any).render.defaultValue
  }
}, {
  deep: true
})

</script>

<template>
  <div
    class="bar absolute h-full w-full animate__animated flex justify-center items-center"
    :class="attrs.animationName && `animate__${attrs.animationName}`"
  >
    <Echart :option="attrs.option" @click="onChartClick" v-if="(attrs.option as any).dataset.source.length > 0" />
    <a-empty v-else class="flex justify-center items-center flex-col h-full w-full">
      <template #image>
        <img :src="(attrs.emptyConfig as any).imageUrl" alt="empty" class="mb-2"/>
      </template>
      <span >{{ (attrs.emptyConfig as any).tip }}</span>
    </a-empty>
  </div>
</template>

<style scoped lang="less"></style>
