<script setup lang="ts">
import componentImageMap from "./componentImage.js";
import type { IComponentType } from "@/types/component.d";
import useLayers from '@/hooks/useLayers';

const { removeLayer, changeVisible } = useLayers();
const { component, type } = defineProps<{
  component: IComponentType;
  type: "single" | "group";
}>();

</script>

<template>
  <div class="layers-item-container flex w-full gap-3">
    <img
      :src="
        componentImageMap.find((data) => data.componentName === component.componentName)
          ?.logo
      "
      alt=""
    />
    <div class="flex items-center flex-1 justify-between">
      <div class="layers-item-name">{{ component.name }}</div>
      <div class="layers-item-action flex items-center gap-2">
        <IconEye
          size="16"
          v-if="component.props.visible.is"
          @click="changeVisible(component, false)"
        />
        <IconEyeInvisible
          size="16"
          v-else
          @click="changeVisible(component, true)"
          style="color: rgba(var(--primary-6))"
        />
        <IconDelete size="16" @click="removeLayer(component.id)" v-if="type === 'single'" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.layers-item-container {
  img {
    width: 35px;
    height: 35px;
  }
}
.active {
  .layers-item-name {
    color: rgba(var(--primary-6));
  }
}
</style>
