<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import Modal from "@/components/Modal/index.vue";
import zhCN from "./zh-cn.js";
import { charData2TableData, tableData2ChartData } from "@/utils";

const props = defineProps(["value"]);
const emit = defineEmits(["update:value"]);

const visible = ref(false);

const openModal = async () => {
  visible.value = true;
  await nextTick();
  // 确保每次打开都重新初始化表格
  if (spreadsheet.value) {
    spreadsheet.value.reRender()
  }
  initSpreadsheet();
  await nextTick();
  renderDataToTable();
};

const close = () => {
  visible.value = false;
  // 关闭时销毁表格实例
  spreadsheet.value = null;

};

defineExpose({
  openModal,
  close,
});

const renderDataToTable = () => {
  const tableData = charData2TableData(props.value);
  spreadsheet.value.loadData(tableData);
};

const spreadsheet = ref<any>(null);

const initSpreadsheet = () => {
  // 设置中文语言包
  (window as any).x_spreadsheet.locale("zh-cn", zhCN);
  // 创建实例
  spreadsheet.value = (window as any).x_spreadsheet("#x-spreadsheet-demo", {
    view: {
      height: () => document.querySelector("#x-spreadsheet-demo")?.clientHeight!,
      width: () => document.querySelector("#x-spreadsheet-demo")?.clientWidth!,
    },
    showToolbar: false, // 隐藏顶部工具栏
    showGrid: true,
    showContextmenu: true,
    showBottomBar: false, // 隐藏底部状态栏
    style: {
      // 背景颜色
      // bgcolor: "#fff",
      // 水平对齐方式
      align: "left",
      // 垂直对齐方式
      valign: "middle",
      // 是否需要换行
      textwrap: false,
      // 虚线边框
      strike: false,
      // 下画线
      underline: false,
      // 文字颜色
      color: "#333",
      // 字体设置
      font: {
        // 字体
        name: "Helvetica",
        // 字号大小
        size: 10,
        // 是否加粗
        bold: false,
        // 斜体
        italic: false,
      },
    },
  });
};

const onCancel = () => {
  close();
};

const onSave = () => {
  const tableData = spreadsheet.value.getData();
  const chartData = tableData2ChartData(tableData[0]?.rows);
  emit("update:value", chartData);
  close();
};
</script>
<template>
  <Modal v-model:visible="visible" title="静态数据" :width="850">
    <div class="static-table" id="x-spreadsheet-demo" v-if="visible"></div>
    <div class="footer flex justify-end mt-3 mb-2 gap-2" >
      <a-button @click="onCancel" size="small">取消</a-button>
      <a-button type="primary" @click="onSave" size="small">保存</a-button>
    </div>
  </Modal>
</template>

<style scoped lang="less">
.static-table {
  width: 100%;
  height: 500px;
  overflow: hidden;

  :deep(.x-spreadsheet-editor) {
    .x-spreadsheet-editor-area {
      textarea {
        color: #333 !important;
      }
    }
  }
}
</style>
