<script setup lang="tsx">
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import noImage from "@/assets/images/upload/noImage.png";
import Title from "@/components/Title/index.vue";
import { ref } from "vue";

const panelConfigStore = usePanelConfigStore();
const pageConfigStore = usePageConfigStore();

const customRequest = (options) => {
  const { onProgress, onError, onSuccess, fileItem, name } = options;
  try {
    panelConfigStore.canvasSetting.thumbnailUrl = panelConfigStore.canvasSetting.backgroundUrl = window.URL.createObjectURL(
      fileItem.file as Blob
    );
    panelConfigStore.canvasSetting.useImage = 1;
    onSuccess();
  } catch (e) {
    onError();
  }
};
const onBackgroundChange = (value: number) => {
  if (value === 2) {
    panelConfigStore.canvasSetting.backgroundUrl = "";
  } else {
    panelConfigStore.canvasSetting.backgroundUrl =
      panelConfigStore.canvasSetting.thumbnailUrl;
  }
};
const themeList = ref([
  {
    name: "宁静蓝",
    id: 1,
    colors: [
      "#4992ff",
      "#7cffb2",
      "#fddd60",
      "#ff6e76",
      "#58d9f9",
      "#05c091",
      "#ff8a45",
      "#8d48e3",
      "#dd79ff",
    ],
  },
  {
    name: "清新绿",
    id: 2,
    colors: [
      "#00FF7F",
      "#32CD32",
      "#008000",
      "#00FF00",
      "#7FFF00",
      "#ADFF2F",
      "#F0FFF0",
      "#90EE90",
      "#8FBC8F",
    ],
  },
  {
    name: "梦幻紫",
    id: 3,
    colors: [
      "#8A2BE2",
      "#9400D3",
      "#4B0082",
      "#6A5ACD",
      "#800080",
      "#BA55D3",
      "#D8BFD8",
      "#EE82EE",
      "#FF00FF",
    ],
  },
  {
    name: "优雅蓝",
    id: 4,
    colors: [
      "#0000FF",
      "#00BFFF",
      "#1E90FF",
      "#6495ED",
      "#7B68EE",
      "#B0C4DE",
      "#D3D3D3",
      "#C0C0C0",
      "#808080",
    ],
  },
  {
    name: "复古棕",
    id: 5,
    colors: [
      "#8B4513",
      "#B8860B",
      "#A0522D",
      "#DEB887",
      "#D2B48C",
      "#BC8F8F",
      "#CD853F",
      "#F4A460",
      "#FFE4C4",
    ],
  },
  {
    name: "甜美粉",
    id: 6,
    colors: [
      "#FFC0CB",
      "#FF69B4",
      "#FFB6C1",
      "#FF1493",
      "#C71585",
      "#DB7093",
      "#F08080",
      "#FA8072",
      "#FFA07A",
    ],
  },
  {
    name: "自然绿",
    id: 7,
    colors: [
      "#228B22",
      "#3CB371",
      "#66CDAA",
      "#8FBC8F",
      "#A52A2A",
      "#B8860B",
      "#CD853F",
      "#D2B48C",
      "#DEB887",
    ],
  },
  {
    name: "宁静蓝",
    id: 8,
    colors: [
      "#FF5733",
      "#FF7F00",
      "#FFA500",
      "#FFC300",
      "#FFD700",
      "#FFF8DC",
      "#FAEBD7",
      "#FFE4B5",
      "#FFEBCD",
    ],
  },
]);
const changeTheme = (item) => {
  pageConfigStore.setPageTheme(item);
};
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="page-setting pr-3 pl-3">
      <Title title="页面配置" />
      <a-space direction="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-input-number
              placeholder="请输入"
              :min="500"
              v-model="panelConfigStore.canvasSetting.width"
            >
              <template #prefix> 宽度</template>
            </a-input-number>
          </a-col>
          <a-col :span="12">
            <a-input-number
              placeholder="请输入"
              :min="500"
              v-model="panelConfigStore.canvasSetting.height"
            >
              <template #prefix> 高度</template>
            </a-input-number>
          </a-col>
        </a-row>
        <a-row>
          <a-upload :custom-request="customRequest" draggable :show-file-list="false">
            <template #upload-button>
              <div
                style="margin-bottom: 8px; border: 1px dashed #444"
                class="flex flex-col items-center justify-center w-full; p-3"
              >
                <img
                  :src="
                    panelConfigStore.canvasSetting.thumbnailUrl
                      ? panelConfigStore.canvasSetting.thumbnailUrl
                      : noImage
                  "
                  alt=""
                  style="height: 150px"
                  fetchpriority="low"
                />
                <a-typography-text type="info">
                  图片格式为png/gif/jpg/jpeg格式
                </a-typography-text>
              </div>
            </template>
          </a-upload>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div
              style="display: flex; justify-content: space-between; align-items: center"
            >
              <span style="width: 80px">背景颜色</span>
              <a-color-picker
                v-model="panelConfigStore.canvasSetting.backgroundColor"
                format="hex"
                showText
              >
                <a-tag
                  class="flex-1 cursor-pointer"
                  style="border: 1px solid #333; height: 28px"
                  :color="panelConfigStore.canvasSetting.backgroundColor"
                >
                  <template #icon>
                    <icon-bg-colors style="color: #fff" />
                  </template>
                  {{ panelConfigStore.canvasSetting.backgroundColor }}
                </a-tag>
              </a-color-picker>
            </div>
          </a-col>
          <a-col :span="24" style="margin-top: 8px">
            <div class="flex justify-between items-center">
              <span style="width: 80px">应用类型</span>
              <a-select
                :options="[
                  {
                    label: '应用背景',
                    value: 1,
                  },
                  {
                    label: '应用颜色',
                    value: 2,
                  },
                ]"
                :disabled="!panelConfigStore.canvasSetting.thumbnailUrl"
                v-model="panelConfigStore.canvasSetting.useImage"
                @change="onBackgroundChange"
                size="small"
                style="flex: 1"
              ></a-select>
            </div>
          </a-col>
        </a-row>
      </a-space>
      <Title title="主题颜色" style="margin: 8px 0 16px 0" />
      <div class="flex flex-col gap-4">
        <a-card
          :style="{
            borderRadius: '10px',
            border:
              item.id === pageConfigStore.currentPage?.props?.theme.id
                ? `1px dashed ${item.colors[0]}`
                : '',
          }"
          :body-style="{ padding: '10px' }"
          v-for="item in themeList"
          :key="item.id"
          class="cursor-pointer"
          @click="changeTheme(item)"
        >
          <div class="list flex">
            <a-typography-text type="info" style="margin-right: 10px">
              {{ item.name }}</a-typography-text
            >
            <div class="color-list flex justify-between flex-1 items-center">
              <div
                class="color-item"
                v-for="(color, index) in item.colors"
                :key="index"
                :style="{ background: `${color}` }"
              ></div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </a-scrollbar>
</template>

<style scoped lang="less">

.color-item {
  width: 22px;
  height: 20px;
  border-radius: 2px;
}
</style>
