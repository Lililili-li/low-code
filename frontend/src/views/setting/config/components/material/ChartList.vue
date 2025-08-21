<script setup lang="ts">
import CollapsiblePanel from "@/components/CollapsiblePanel/index.vue";
import { ref } from "vue";
import componentList from "./component-config.js";
import type { IComponentType } from "@/types/component.d";

type ComponentListType = {
  config: IComponentType;
  logo: string;
  name: string;
  type: string;
};

const componentsList = ref(componentList);
const onComponentDragStart = (event: DragEvent, data: ComponentListType) => {
  event.dataTransfer?.setData("component", JSON.stringify(data.config));
};
</script>
<template>
  <div class="chart-list flex flex-col gap-4 pr-3 pl-3">
    <div
      class="chart-item"
      v-for="item in componentsList.filter((item) => item.type === 'Chart')"
      :key="item.id"
    >
      <CollapsiblePanel>
        <template #header>
          <span style="color: rgb(var(--primary-6)); font-weight: 600; font-size: 15px">
            {{ item.name }}
          </span>
        </template>
        <div class="component-list flex justify-between gap-2 pt-2 flex-wrap">
          <div
            class="component-item flex"
            v-for="chart in item.children"
            :key="chart.name"
            style="width: calc(50% - 4px)"
          >
            <div
              class="flex flex-col items-center"
              style="border-radius: 3px; background: #303031; overflow: hidden"
            >
              <a-image
                height="100"
                :src="chart.logo"
                class="logo"
                draggable="true"
                @dragstart="onComponentDragStart($event, chart)"
              />
              <div class="name mt-2 mb-2">{{ chart.name }}</div>
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  </div>
</template>
<style scoped lang="less">
.component-item {
  cursor: grab;

  .name {
    color: #999;
  }
}
</style>
