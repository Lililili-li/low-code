<script setup lang="ts">
import { useComponentConfigStore } from '@/stores/useComponentConfigStore.js'
import { computed } from 'vue'
import type { InputInst, SelectOption } from 'naive-ui'

const componentConfigStore = useComponentConfigStore()
// const TreeSelectModalRef = useTemplateRef('TreeSelectModalRef')
// const selectParamInputRef = useTemplateRef('selectParamInputRef')
const compConfig = computed(() => componentConfigStore?.activeComponent!)

const handleFocus = () => {}

const setVisibleParam = (elements: []) => {
  const type = (compConfig.value.props.visible.paramType = elements[elements.length - 1].type)
  compConfig.value.props.visible.param = ['state', ...elements.map((item) => item.key)].join('.')
  compConfig.value.props.visible.id = elements.map((item) => item.id).join('.')
  compConfig.value.props.visible.formula = '=='
  if (type == 'boolean') {
    compConfig.value.props.visible.expression = 'true'
  } else {
    compConfig.value.props.visible.expression = ''
  }
}

// 判断公式options
const formulaOptions = computed(() => {
  let options: SelectOption[] = []
  if (compConfig.value.props.visible.paramType === 'string') {
    options = [
      {
        label: '等于',
        value: '==',
      },
      {
        label: '不等于',
        value: '!=',
      },
    ]
  } else if (compConfig.value.props.visible.paramType === 'number') {
    options = [
      {
        label: '小于',
        value: '<',
      },
      {
        label: '大于',
        value: '>',
      },
      {
        label: '等于',
        value: '==',
      },
      {
        label: '不等于',
        value: '!=',
      },
    ]
  } else {
    options = [
      {
        label: '等于',
        value: '==',
      },
    ]
  }
  return options
})
const onlyAllowNumber = (value: string) => {
  return !value || /[a-zA-Z0-9]/.test(value)
}

const onChangeVisibleParam = () => {
  compConfig.value.props.visible.type === 1
    ? (compConfig.value.props.visible.type = 2)
    : (compConfig.value.props.visible.type = 1)
}
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="style-page pr-3 pl-3">
      <a-space direction="vertical">
        <a-space class="w-full" align="center" justify="center">
          <a-typography style="width: 30px">尺寸</a-typography>
          <div style="flex: 1" class="flex justify-between">
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.width"
              @change="
                (value) => {
                  compConfig.style.scaleWidth = value
                }
              "
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">宽</span>
              </template>
            </a-input-number>
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.height"
              @change="
                (value) => {
                  compConfig.style.scaleHeight = value
                }
              "
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">高</span>
              </template>
            </a-input-number>
          </div>
        </a-space>
        <a-space class="w-full" align="center" justify="center">
          <a-typography style="width: 30px">位置</a-typography>
          <div style="flex: 1" class="flex justify-between">
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.top"
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">上</span>
              </template>
            </a-input-number>
            <a-input-number
              placeholder="请输入"
              style="width: 48%"
              v-model="compConfig.style.left"
              size="small"
            >
              <template #prefix>
                <span style="font-size: 13px">左</span>
              </template>
            </a-input-number>
          </div>
        </a-space>

      </a-space>
    </div>
  </a-scrollbar>
</template>
<style lang="less" scoped>
:deep(.arco-input-wrapper) {
  input {
    text-align: center;
  }
}
</style>
