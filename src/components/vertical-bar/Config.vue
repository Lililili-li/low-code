<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { ERenderDataType } from '@/components/vertical-bar/type.ts'
import { AddCircle, Construct, TrashOutline } from '@vicons/ionicons5'
import RenderDataConfigModal from './RenderDataConfigModal.vue'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import { cloneDeep } from 'lodash-es'
import MessageApi from '@/utils/message.ts'

const componentSettingStore = useComponentSettingStore()
const {
  props: { option },
} = componentSettingStore.getSelectComponent
const renderDataType = ref(ERenderDataType.STATIC)

const renderDataConfigModalRef = useTemplateRef('renderDataConfigModalRef')
const onOpenRenderDataConfigModal = () => {
  renderDataConfigModalRef.value?.open(renderDataType.value)
}

const currentSeries = ref(0)
const seriesConfigList = computed(() => {
  return option.series.map((item, index) => ({
    label: '数据' + option.dataset.dimension[index + 1],
    value: index,
  }))
})
const onAddSeries = () => {
  // 配置的数据项不够了所以不能添加系列以免造成位置错误
  if (option.series.length === option.dataset.dimension.length - 1)
    return MessageApi.error('系列长度超出所配置的数据')
  const cloneSeries = cloneDeep(option.series[0])
  cloneSeries.name = ''
  option.series.push(cloneSeries)
  currentSeries.value = option.series.length - 1
}
const onRemoveSeries = () => {
  if (option.series.length === 1) return MessageApi.error('最少含有一个系列配置')
  option.series = option.series.filter((_, index) => index !== currentSeries.value)
  currentSeries.value = option.series.length ? 0 : undefined
}
</script>

<template>
  <div class="vertical-bar-config">
    <n-divider dashed title-placement="center">图表配置</n-divider>
    <n-collapse arrow-placement="right" :default-expanded-names="['1', '2']">
      <n-collapse-item title="数据渲染(Source)" name="1">
        <n-flex justify="space-between" align="center">
          <n-select
            style="width: 84%"
            :options="[
              {
                label: '静态数据',
                value: 1,
              },
              {
                label: '动态数据',
                value: 2,
              },
            ]"
            placeholder="请选择渲染数据"
            v-model:value="renderDataType"
            size="small"
          >
          </n-select>
          <n-button tertiary circle @click="onOpenRenderDataConfigModal">
            <template #icon>
              <n-icon size="16">
                <Construct />
              </n-icon>
            </template>
          </n-button>
        </n-flex>
      </n-collapse-item>
      <n-collapse-item title="系列配置(Series)" name="2">
        <div class="series-list">
          <n-flex justify="space-between">
            <n-select
              :options="seriesConfigList"
              style="flex: 1"
              v-model:value="currentSeries"
              size="small"
            />
            <div class="flex" style="width: 24%">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary @click="onAddSeries" size="small">
                    <template #icon>
                      <n-icon size="22">
                        <AddCircle />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                添加系列
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary @click="onRemoveSeries" size="small">
                    <template #icon>
                      <n-icon size="22">
                        <TrashOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                删除系列
              </n-tooltip>
            </div>
          </n-flex>
          <n-flex vertical style="margin-top: 12px; padding: 0 15px">
            <n-flex justify="space-between" align="center">
              <n-text style="width: 60px"> 系列名称</n-text>
              <n-input
                placeholder="请输入系列名称"
                style="flex: 1"
                size="small"
                v-model:value="option.series[currentSeries].name"
              ></n-input>
            </n-flex>
            <n-flex justify="space-between" align="center">
              <n-text style="min-width: 60px"> 取值字段</n-text>
              <n-input
                placeholder="请输入取值字段"
                style="flex: 1"
                size="small"
                v-model:value="option.dataset.dimension[currentSeries + 1]"
                disabled
              ></n-input>
            </n-flex>
            <n-flex justify="space-between" align="center">
              <n-text style="min-width: 60px"> 标签文字</n-text>
              <n-switch size="small" v-model:value="option.series[currentSeries].label.show" />
            </n-flex>
            <n-flex vertical v-show="option.series[currentSeries].label.show">
              <n-divider dashed title-placement="center" style="font-size: 12px;margin: 5px 0">标签样式</n-divider>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">位置</n-text>
                <n-select :options="[
                  {
                    label: '上',
                    value: 'top'
                  },
                  {
                    label: '右',
                    value: 'right'
                  },
                  {
                    label: '下',
                    value: 'bottom'
                  },
                  {
                    label: '左',
                    value: 'left'
                  },
                  {
                    label: '内部',
                    value: 'inside'
                  }
                ]" style="flex: 1" v-model:value="option.series[currentSeries].label.position"></n-select>
              </n-flex>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">颜色</n-text>
                <n-color-picker :modes="['hex']" style="flex: 1" size="small" v-model:value="option.series[currentSeries].label.color"/>
              </n-flex>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">大小</n-text>
                <n-input-number placeholder="12" style="flex: 1" v-model:value="option.series[currentSeries].label.fontSize" :show-button="false">
                  <template #suffix>
                    px
                  </template>
                </n-input-number>
              </n-flex>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">字重</n-text>
                <n-select :options="[
                  {
                    label: '加粗',
                    value: 'bold'
                  },
                  {
                    label: '正常',
                    value: 'normal'
                  },
                ]" style="flex: 1" v-model:value="option.series[currentSeries].label.fontWeight"></n-select>
              </n-flex>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">距离</n-text>
                <n-input-number placeholder="12" style="flex: 1" v-model:value="option.series[currentSeries].label.distance" :show-button="false">
                  <template #suffix>
                    px
                  </template>
                </n-input-number>
              </n-flex>
            </n-flex>
            <n-flex vertical>
              <n-divider dashed title-placement="center" style="font-size: 12px;margin: 5px 0">柱形图样式</n-divider>
              <n-flex justify="space-between" align="center">
                <n-text style="min-width: 30px">宽度</n-text>
                <n-input placeholder="请输入%或者数字" v-model:value="option.series[currentSeries].barWidth" style="flex: 1"></n-input>
              </n-flex>
            </n-flex>
          </n-flex>
        </div>
      </n-collapse-item>
      <n-collapse-item title="坐标轴(Axis)" name="3">
        <div>真棒</div>
      </n-collapse-item>
      <n-collapse-item title="图例(Legend)" name="4">
        <div>真棒</div>
      </n-collapse-item>
    </n-collapse>
    <RenderDataConfigModal ref="renderDataConfigModalRef" />
  </div>
</template>

<style scoped lang="less"></style>
