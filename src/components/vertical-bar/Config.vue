<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { ERenderDataType } from '@/components/vertical-bar/type.ts'
import { Construct } from '@vicons/ionicons5'
import RenderDataConfigModal from './RenderDataConfigModal.vue'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import { AddCircle,TrashOutline } from '@vicons/ionicons5'
import { cloneDeep } from 'lodash-es'
import MessageApi from '@/utils/message.ts'

const componentSettingStore = useComponentSettingStore()
const { props: {option} } = componentSettingStore.getSelectComponent
const renderDataType = ref(ERenderDataType.STATIC)

const renderDataConfigModalRef = useTemplateRef('renderDataConfigModalRef')
const onOpenRenderDataConfigModal = () => {
  renderDataConfigModalRef.value?.open(renderDataType.value)
}

const currentSeries = ref(0)
const seriesConfigList = computed(() => {
  return option.series.map((item, index) => ({
    label: '数据'+ (option.dataset.dimension[index+1]),
    value: index,
  }))
})
const onAddSeries = () => {
  // 配置的数据项不够了所以不能添加系列以免造成位置错误
  if (option.series.length === (option.dataset.dimension.length-1)) return MessageApi.error('系列长度超出所配置的数据')
  const cloneSeries = cloneDeep(option.series[0])
  cloneSeries.name = ''
  option.series.push(cloneSeries)
  currentSeries.value = option.series.length - 1
}
const onRemoveSeries = () => {
  if (option.series.length === 1) return MessageApi.error('最少含有一个系列配置')
  option.series = option.series.filter((_, index) => index !== currentSeries.value)
  currentSeries.value = option.series.length? 0: undefined
}
</script>

<template>
  <div class="vertical-bar-config">
    <n-collapse arrow-placement="right">
      <n-collapse-item title="数据渲染" name="1">
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
              <n-icon size="16"><Construct /></n-icon>
            </template>
          </n-button>
        </n-flex>
      </n-collapse-item>
      <n-collapse-item title="系列配置" name="2">
        <div class="series-list">
          <n-flex justify="space-between">
            <n-select
              :options="seriesConfigList"
              style="flex: 1"
              v-model:value="currentSeries"
            />
              <div class="flex" style="width: 30%">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button quaternary @click="onAddSeries">
                      <template #icon>
                        <n-icon size="22">
                          <AddCircle/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  添加系列
                </n-tooltip>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button quaternary @click="onRemoveSeries">
                      <template #icon>
                        <n-icon size="22">
                          <TrashOutline/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  删除系列
                </n-tooltip>
              </div>
          </n-flex>
          <n-flex vertical>

          </n-flex>
        </div>
      </n-collapse-item>
      <n-collapse-item title="黄金" name="3">
        <div>真棒</div>
      </n-collapse-item>
    </n-collapse>
    <RenderDataConfigModal ref="renderDataConfigModalRef" />
  </div>
</template>

<style scoped lang="less"></style>
