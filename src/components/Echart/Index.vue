<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  PieChart,
  BarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { useTemplateRef, watch } from 'vue'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
]);
const props = defineProps(['option'])

const vChartRef = useTemplateRef('vChartRef')
watch(() => props.option, (value) => {
  vChartRef.value?.setOption(value, true, true)
}, {
  immediate: true,
  deep: true
})


</script>

<template>
  <v-chart class="w-full h-full" :option="option" autoresize ref="vChartRef" :manual-update="true" />
</template>

<style scoped lang="less">

</style>
