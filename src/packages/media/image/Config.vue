<script setup lang="ts">
import type { ImageIProps } from "@/types/component";
import { ref } from "vue";
import { computed } from "vue";

const { option } = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["change"]);

const options = computed({
  get: () => option as ImageIProps,
  set: (val) => {
    console.log(val);
    emits("change", val);
  },
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
</script>

<template>
  <div class="image-config mt-4">
    <a-row :gutter="[12, 12]" style="width: 100%">
      <a-col :span="24">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-typography-text>图片地址</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="upload">
              <a-upload :custom-request="customRequest" draggable :show-file-list="false">
                <template #upload-button>
                  <div
                    style="margin-bottom: 15px; border: 1px dashed #444"
                    class="flex flex-col items-center justify-center w-full; p-3"
                  >
                    <img
                      :src="options.url"
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
            <div class="flex justify-end">
              <a-textarea
                v-model="options.url"
                placeholder="请输入图片地址"
                allow-clear
                :auto-size="{
                  minRows: 2,
                  maxRows: 5,
                }"
              />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>开启动画</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-switch size="small" v-model="options.openAnimation" />
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
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>动画名称</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-select v-model="options.animation.name" placeholder="请选择动画名称">
                <a-option value="clockwise">顺时针旋转</a-option>
                <a-option value="anticlockwise">逆时针旋转</a-option>
                <a-option value="breath">呼吸</a-option>
                <a-option value="scale">缩放</a-option>
                <a-option value="visible">显隐</a-option>
              </a-select>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>动画时长</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-input-number
                placeholder="请输入动画时长"
                allow-clear
                hide-button
                :min="0"
                v-model="options.animation.duration"
              >
                <template #suffix> 秒 </template>
              </a-input-number>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="8" align="center">
          <a-col :span="6">
            <a-typography-text>动画次数</a-typography-text>
          </a-col>
          <a-col :span="18">
            <div class="flex justify-end">
              <a-input-number
                placeholder="请输入动画次数"
                allow-clear
                hide-button
                :min="-1"
                v-model="options.animation.number"
              >
                <template #suffix> 次 </template>
              </a-input-number>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" align="center" class="mt-2">
          <a-col :span="6"> </a-col>
          <a-col :span="18">
            <a-typography-text type="warning"> -1 次为无限循环</a-typography-text>
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
