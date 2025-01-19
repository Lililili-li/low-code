<script setup lang="tsx">
import { usePanelSettingStore } from '@/stores/panelSettingStore.ts'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'
import type { UploadCustomRequestOptions } from 'naive-ui'
import noImage from '@/assets/images/upload/noImage.png'

const panelSettingStore = usePanelSettingStore()
const componentSettingStore = useComponentSettingStore()

const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) => {
  try {
    panelSettingStore.canvasSetting.thumbnailUrl = panelSettingStore.canvasSetting.backgroundUrl =
      window.URL.createObjectURL(file.file as Blob)
    panelSettingStore.canvasSetting.useImage = 1
    onFinish()
  } catch (e) {
    onError()
  }
}
const onBackgroundChange = (value: number) => {
  if (value === 2) {
    panelSettingStore.canvasSetting.backgroundUrl = ''
  }else {
    panelSettingStore.canvasSetting.backgroundUrl = panelSettingStore.canvasSetting.thumbnailUrl
  }
}
</script>

<template>
  <div class="page-setting p-3" style="height: calc(100vh - 60px); width: 320px">
    <n-scrollbar style="height: 100%; overflow: auto">
      <n-tabs type="segment" animated>
        <n-tab-pane name="1" tab="页面配置">
          <n-flex vertical>
            <n-row :gutter="16">
              <n-col :span="12">
                <n-input-number
                  placeholder="请输入"
                  :min="500"
                  v-model:value="panelSettingStore.$state.canvasSetting.width"
                >
                  <template #prefix> 宽度</template>
                </n-input-number>
              </n-col>
              <n-col :span="12">
                <n-input-number
                  placeholder="请输入"
                  :min="500"
                  v-model:value="panelSettingStore.$state.canvasSetting.height"
                >
                  <template #prefix> 高度</template>
                </n-input-number>
              </n-col>
            </n-row>
            <n-row style="width: 100%">
              <n-upload directory-dnd :custom-request="customRequest" :disabled="false">
                <n-upload-dragger>
                  <div style="margin-bottom: 12px" class="flex justify-center">
                    <img
                      :src="
                        panelSettingStore.canvasSetting.thumbnailUrl
                          ? panelSettingStore.canvasSetting.thumbnailUrl
                          : noImage
                      "
                      alt=""
                      style="height: 150px;"
                    />
                  </div>
                  <n-p depth="3" style="margin: 8px 0 0 0"> 图片格式为png/gif/jpg/jpeg格式</n-p>
                </n-upload-dragger>
              </n-upload>
            </n-row>
            <n-row>
              <n-col :span="24">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="width: 80px">背景颜色</span>
                  <n-color-picker size="small" v-model:value="panelSettingStore.canvasSetting.backgroundColor" :modes="['hex']"/>
                </div>
              </n-col>
              <n-col :span="24" style="margin-top: 8px">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="width: 80px">应用类型</span>
                  <n-select
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
                    :disabled="!panelSettingStore.canvasSetting.thumbnailUrl"
                    v-model:value="panelSettingStore.canvasSetting.useImage"
                    @change="onBackgroundChange"
                  ></n-select>
                </div>
              </n-col>
            </n-row>
          </n-flex>
        </n-tab-pane>
      </n-tabs>
      <n-tabs type="segment" animated style="margin-top: 12px">
        <n-tab-pane name="1" tab="主题颜色">
          <n-card style="border-radius: 10px" :content-style="{ padding: '10px' }">
            <div class="flex justify-between">
              <n-text type="info" style="margin-right: 10px"> 明亮</n-text>
              <div class="color-list flex justify-between flex-1 items-center">
                <div
                  class="color-item"
                  v-for="(item, index) in componentSettingStore?.getCurrentPage?.props.colors"
                  :key="index"
                  :style="{ background: `${item}` }"
                ></div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
:deep(.n-upload-file-list) {
  display: none !important;
}

.color-item {
  width: 22px;
  height: 20px;
  border-radius: 2px;
}
</style>
