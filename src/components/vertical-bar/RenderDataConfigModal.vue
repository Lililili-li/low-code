<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ERenderDataType } from '@/components/vertical-bar/type.ts'
// @ts-ignore
import zhCN from "/public/sheet/locale/zh-cn";
import { Close } from '@vicons/ionicons5'
import { charData2TableData, tableData2ChartData } from '@/utils'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'

const componentSettingStore = useComponentSettingStore()
let sheetInstance: null | object = null
// 初始配置.没有对接后端
const sampleData = ref({
  rows: {
    //  editable: false 这个加在单元格里表示不能编辑
    0: { cells: { 0: { text: "键名" }, 1: { text: "label" }, 2: { text: "num1" }, 3: { text: "num2" } } },
    1: { cells: { 0: { text: "键值" }, 1: { text: "周一" }, 2: { text: "10" }, 3: { text: "15" } } },
    2: { cells: { 0: { text: "键值" }, 1: { text: "周二" }, 2: { text: "20" }, 3: { text: "16" } } },
    3: { cells: { 0: { text: "键值" }, 1: { text: "周三" }, 2: { text: "30" }, 3: { text: "22" } } },
    4: { cells: { 0: { text: "键值" }, 1: { text: "周四" }, 2: { text: "40" }, 3: { text: "33" } } }
  }
})
let options = {
  showToolbar: false, // 顶部工具栏
  showBottomBar: false, // 底部工具栏,用CDN引入是没生效
  view: {
    height: () => 500,
    width: () => 780
  },
  col: {
    len: 12,//表格列数
    width: 100,
    indexWidth: 60,
    minWidth: 60
  },
  row: {
    len: 100,
    height: 30
  },
  style: {
    align: "center",
    bgcolor: "#333", //有文字的单元格背景
    color: "#fff", //单元格文字颜色
  }
}

const onSaveRowData = () => {
  const { source, dimension } = tableData2ChartData(sheetInstance?.getData()[0].rows)
  componentSettingStore.selectComponent.props.option.dataset.source = source
  componentSettingStore.selectComponent.props.option.dataset.dimension = dimension
  showStaticModal.value = false
}



const showStaticModal = ref(false)
const showDynamicModal = ref(false)
const open = (type: number) => {
  if (type === ERenderDataType.STATIC) {
    showStaticModal.value = true
    nextTick().then(() => {
      sampleData.value = charData2TableData(componentSettingStore.selectComponent.props.option.dataset.source)
      window.x_spreadsheet.locale("zh-cn", zhCN);
      sheetInstance = window.x_spreadsheet("#sheet", options).loadData(sampleData.value) // load data
    })
  } else {
    showDynamicModal.value = false
  }
}

const onCloseStaticModal = () => {
  showStaticModal.value = false
}
defineExpose({ open })
onMounted(() => {

})
</script>

<template>
  <div>
    <n-modal
      v-model:show="showStaticModal"
    >
      <n-card
        style="width: 800px"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        :header-style="{
          padding: '10px',
        }"
        :content-style="{
          padding: '10px',
        }"
      >
        <template #header>
          数据配置
        </template>
        <template #header-extra>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary @click="onCloseStaticModal">
                <template #icon>
                  <n-icon>
                    <Close />
                  </n-icon>
                </template>
              </n-button>
            </template>
            关闭窗口
          </n-tooltip>
        </template>
        <div id="sheet" style="width: 780px; height: 500px; margin: 0 auto; margin-bottom: 10px"></div>
        <n-flex justify="center">
          <n-button @click="onCloseStaticModal">
            取消
          </n-button>
          <n-button type="primary" @click="onSaveRowData">
            保存
          </n-button>
        </n-flex>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showDynamicModal">
      <n-card
        style="width: 600px"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        123123
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped lang="less">
:deep(.x-spreadsheet-sheet) {
  background: #333;
}
:deep(.x-spreadsheet .x-spreadsheet-scrollbar div) {
  background: none;
}
:deep(.x-spreadsheet-editor-area) {
  textarea {
    background: #18181c;
  }
}
:deep(.x-spreadsheet-form-input ) {
  input:focus {
    border: none !important;
  }
}
</style>
