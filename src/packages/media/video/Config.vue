<script setup lang="ts">
import type { VideoIProps } from "@/types/component";
import { computed } from "vue";
import noImage from "@/assets/images/upload/noImage.png";

const { option } = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["change"]);

const options = computed(() => {
  get: return option as VideoIProps;
  set: (val) => {
    emits("change", val);
  };
});
const customRequest = (data) => {
  const { onProgress, onError, onSuccess, fileItem, name } = data;

  try {
    options.value.url = window.URL.createObjectURL(fileItem.file as Blob);
    onSuccess();
  } catch (e) {
    console.log(e);
    onError();
  }
};
const customRequest2 = (data) => {
  const { onProgress, onError, onSuccess, fileItem, name } = data;

  try {
    options.value.poster = window.URL.createObjectURL(fileItem.file as Blob);
    onSuccess();
  } catch (e) {
    console.log(e);
    onError();
  }
};
</script>

<template>
  <div class="image-config mt-4">
    <a-row :gutter="[12, 12]" style="width: 100%">
      <a-col :span="24">
        <a-row :gutter="8">
          <a-col>
            <a-typography-text :heading="2">视频地址：</a-typography-text>
          </a-col>
        </a-row>
        <a-row class="mt-2">
          <a-col :span="24">
            <div class="upload">
              <a-upload :custom-request="customRequest" draggable :show-file-list="false">
              </a-upload>
            </div>
            <div class="flex justify-end mt-2">
              <a-input v-model="options.url" placeholder="请输入图片地址" allow-clear />
            </div>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>自动播放</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-switch size="small" v-model="options.autoPlay" @change="(value) => {}" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>控制器</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-switch size="small" v-model="options.controls" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>是否循环</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-switch size="small" v-model="options.loop" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>适配方式</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-select v-model="options.fit">
                <a-option value="cover">原始比例</a-option>
                <a-option value="none">原始宽高</a-option>
                <a-option value="fill">填充</a-option>
                <a-option value="contain">自适应</a-option>
              </a-select>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8">
          <a-col>
            <a-typography-text>视频封面：</a-typography-text>
          </a-col>
        </a-row>
        <a-row class="mt-2">
          <a-col :span="24">
            <div class="upload">
              <a-upload
                :custom-request="customRequest2"
                draggable
                :show-file-list="false"
              >
                <template #upload-button>
                  <div
                    style="margin-bottom: 15px; border: 1px dashed #444"
                    class="flex flex-col items-center justify-center w-full; p-3 pl-1 pr-1"
                  >
                    <img
                      :src="options.poster?options.poster:noImage"
                      alt=""
                      style="height: 150px; object-fit: cover"
                      fetchpriority="low"
                      class="mb-2"
                    />
                    <a-typography-text type="info">
                      图片格式为png/gif/jpg/jpeg格式
                    </a-typography-text>
                  </div>
                </template>
              </a-upload>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
:deep(.arco-input) {
  text-align: left !important;
}
</style>
