<script lang="tsx" setup>
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { Keyboard20Regular } from "@vicons/fluent";
import { onMounted, ref } from "vue";
import Modal from "@/components/Modal/index.vue";
import leftMouseIcon from "@/assets/images/common/left-mouse.svg";
import Empty from "@/components/Empty/index.vue";
import { useWorkStore } from "@/stores/useWorkStore";

interface SelectOptionData {
  value: number;
  label: string;
}
const emits = defineEmits(["onChangePanelScale"]);

const panelConfigStore = usePanelConfigStore();
const workStore = useWorkStore();

const hotkeysModalVisible = ref(false);

const columns = [
  {
    title: "功能",
    dataIndex: "function",
  },
  {
    title: "Mac快捷键",
    dataIndex: "mac",
    render: ({ record }) => {
      const { mac } = record;
      const parts = mac.split(/(Command|鼠标左键)/gi);
      return (
        <div class={`flex gap-1 items-center`}>
          {parts.map((part, idx) => {
            if (/command/i.test(part)) {
              return <icon-command />;
            }
            if (/鼠标左键/i.test(part)) {
              return <img src={leftMouseIcon} alt="" />;
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      );
    },
  },
  {
    title: "Windows快捷键",
    dataIndex: "windows",
    render: ({ record }) => {
      const { windows } = record;
      const parts = windows.split(/(鼠标左键)/gi);
      return (
        <div class={`flex gap-1 items-center`}>
          {parts.map((part, idx) => {
            if (/鼠标左键/i.test(part)) {
              return <img src={leftMouseIcon} alt="" />;
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      );
    },
  },
];
const hotkeysList = [
  {
    function: "锁定 / 解锁",
    mac: "L",
    windows: "L",
  },
  {
    function: "展示 / 隐藏",
    mac: "Command + P",
    windows: "Ctrl + P",
  },
  {
    function: "删除",
    mac: "Backspace",
    windows: "Backspace",
  },
  {
    function: "复制",
    mac: "Command + C",
    windows: "Ctrl + C",
  },
  {
    function: "粘贴",
    mac: "Command + V",
    windows: "Ctrl + V",
  },
  {
    function: "剪切",
    mac: "Command + X",
    windows: "Ctrl + X",
  },
  {
    function: "多选",
    mac: "shift + 鼠标左键",
    windows: "shift + 鼠标左键",
  },
  {
    function: "创建分组 / 解除分组",
    mac: "command + G",
    windows: "ctrl + G",
  },
  {
    function: "撤销",
    mac: "command + Z",
    windows: "ctrl + Z",
  },
  {
    function: "恢复",
    mac: "command + Y",
    windows: "ctrl + Y",
  },
];

onMounted(() => {});
</script>

<template>
  <div class="flex justify-between pl-5 pr-5 items-center h-full config">
    <div class="flex gap-3">
      <a-button @click="hotkeysModalVisible = true">
        <template #icon>
          <a-icon size="20" style="color: rgba(255, 255, 255, 0.4)">
            <Keyboard20Regular />
          </a-icon>
        </template>
        快捷键
      </a-button>

      <a-dropdown
        position="top"
        :popup-max-height="200"
        :hide-on-select="false"
        trigger="hover"
      >
        <a-button>
          <template #icon>
            <a-tooltip content="最多存储100条记录">
              <icon-question-circle />
            </a-tooltip>
          </template>
          操作记录
        </a-button>

        <template #content>
          <template
            v-if="Array.isArray(workStore.historyList) && workStore.historyList.length"
          >
            <!-- <a-popconfirm
              content="是否确认回退？"
              v-for="item in workStore.historyList"
              :key="item.id"
            >

            </a-popconfirm> -->
            <div v-for="item in workStore.historyList" :key="item.id">
              <a-doption>
                <div class="flex gap-2 items-center">
                  <icon-computer />
                  <div>{{ item.label }}</div>
                  <div>{{ item.time }}</div>
                </div>
              </a-doption>
            </div>
          </template>
          <Empty v-else content="暂无记录" />
        </template>
      </a-dropdown>

      <a-tooltip content="撤销">
        <a-button :disabled="!workStore.historyList.length" @click="workStore.undo()">
          <template #icon>
            <icon-undo />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="恢复">
        <a-button :disabled="!workStore.redoList.length" @click="workStore.redo()">
          <template #icon>
            <icon-redo />
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <div class="flex gap-3 items-center">
      <div class="select">
        <a-select
          v-model="panelConfigStore.panelScaleConf.scale"
          :format-label="(data: SelectOptionData) => `${Math.round(data.value * 100)}%`"
          :fallback-option="(value: number) => ({value, label: '自适应'})"
          :disabled="panelConfigStore.panelSetting.panzoomOption.disableZoom"
          @change="(value: number) => emits('onChangePanelScale', value)"
        >
          <a-option :value="0.5">50%</a-option>
          <a-option :value="1">100%</a-option>
          <a-option :value="1.5">150%</a-option>
          <a-option :value="2">200%</a-option>
        </a-select>
      </div>
      <div class="lock">
        <a-tooltip
          :content="
            panelConfigStore.panelSetting.panzoomOption.disableZoom
              ? '解锁当前比例'
              : '锁定当前比例'
          "
        >
          <a-button
            @click="
              panelConfigStore.panelSetting.panzoomOption.disableZoom = !panelConfigStore
                .panelSetting.panzoomOption.disableZoom
            "
          >
            <template #icon>
              <icon-unlock
                v-if="panelConfigStore.panelSetting.panzoomOption.disableZoom"
              />
              <icon-lock v-else />
            </template>
          </a-button>
        </a-tooltip>
      </div>
      <div class="slider">
        <a-slider
          v-model="panelConfigStore.panelScaleConf.scale"
          :step="panelConfigStore.panelSetting.panzoomOption.step"
          @change="(value: number) => emits('onChangePanelScale', value)"
          :format-tooltip="(value: number) => (Math.round(value * 100) + '%')"
          :min="panelConfigStore.panelSetting.panzoomOption.minScale"
          :max="panelConfigStore.panelSetting.panzoomOption.maxScale"
          :style="{ width: '120px' }"
          :disabled="panelConfigStore.panelSetting.panzoomOption.disableZoom"
        />
      </div>
    </div>
    <Modal
      v-model:visible="hotkeysModalVisible"
      title="快捷键说明"
      :width="800"
      top="20%"
      :body-style="{ padding: '0' }"
      :contentStyle="{
        padding: 0,
      }"
    >
      <div class="hotkey-list-container">
        <a-table
          :columns="columns"
          :data="hotkeysList"
          :pagination="false"
          :bordered="{ cell: true }"
        />
      </div>
    </Modal>
  </div>
</template>

<style scoped lang="less">
/* 组件样式 */
.config {
  border-top: 1px solid var(--color-neutral-3);
}
:deep(.arco-table-container) {
  border: none !important;
}
:deep(.arco-card-body) {
  padding: 0 !important;
}
</style>
