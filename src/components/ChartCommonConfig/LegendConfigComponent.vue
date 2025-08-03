<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { computed, ref, watch, watchEffect } from "vue";

const props = defineProps(["option"]);
const emits = defineEmits(["change"]);

const legendIconOptions = computed(() => {
  return [
    {
      label: "圆形",
      value: "circle",
    },
    {
      label: "矩形",
      value: "rect",
    },
    {
      label: "圆角矩形",
      value: "roundRect",
    },
    {
      label: "三角形",
      value: "triangle",
    },
    {
      label: "箭头型",
      value: "arrow",
    },
    {
      label: "自定义图片",
      value: "none",
    },
  ];
});

const option = ref({
  show: true,
  type: "plain",
  left: "center",
  top: "2%",
  textStyle: {
    color: "#B9B8CE",
    fontSize: 12,
  },
  itemWidth: 25,
  itemHeight: 14,
  icon: "rect",
  iconType: "rect",
  imageUrl: "",
  orient: "horizontal",
  pageIconSize: 12,
  pageIconColor: "#2f4554",
});

watchEffect(() => {
  option.value = { ...option.value, ...cloneDeep(props.option) };
});
</script>

<template>
  <div>
    <a-row :gutter="[8, 8]" align="center">
      <a-col :span="8">
        <a-typography-text>是否显示</a-typography-text>
      </a-col>
      <a-col :span="16" class="flex justify-end">
        <a-switch size="small" v-model="option.show" @change="emits('change', option)" />
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]" align="center">
      <a-col :span="8">
        <a-typography-text>图例类型</a-typography-text>
      </a-col>
      <a-col :span="16">
        <a-select
          :options="[
            {
              label: '正常',
              value: 'plain',
            },
            {
              label: '分页',
              value: 'scroll',
            },
          ]"
          size="small"
          v-model="option.type"
          @change="emits('change', option)"
        />
      </a-col>
    </a-row>

    <a-divider
      type="dashed"
      orientation="center"
      style="font-size: 12px; color: #53f104"
    ></a-divider>

    <a-row :gutter="[8, 8]">
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>大小</a-typography-text>
          <a-input-number
            placeholder="大小"
            size="small"
            :min="12"
            v-model="option.textStyle.fontSize"
            @Change="emits('change', option)"
          />
        </a-space>
      </a-col>
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>颜色</a-typography-text>
          <a-color-picker
            size="small"
            v-model="option.textStyle.color"
            showText
            @change="emits('change', option)"
          />
        </a-space>
      </a-col>
    </a-row>

    <a-divider
      type="dashed"
      orientation="center"
      style="font-size: 12px; color: #53f104"
    ></a-divider>

    <a-row :gutter="[8, 8]">
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>x轴</a-typography-text>
          <a-input v-model="option.left" size="small" @Change="emits('change', option)" />
        </a-space>
      </a-col>
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>y轴</a-typography-text>
          <a-input v-model="option.top" size="small" @Change="emits('change', option)" />
        </a-space>
      </a-col>
    </a-row>

    <a-divider
      type="dashed"
      orientation="center"
      style="font-size: 12px; color: #53f104"
    ></a-divider>

    <a-row :gutter="[8, 8]">
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>宽</a-typography-text>
          <a-input-number
            v-model="option.itemWidth"
            size="small"
            @change="emits('change', option)"
          />
        </a-space>
      </a-col>
      <a-col :span="12">
        <a-space direction="vertical">
          <a-typography-text>高</a-typography-text>
          <a-input-number
            v-model="option.itemHeight"
            size="small"
            @change="emits('change', option)"
          />
        </a-space>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :span="option.iconType === 'none' ? 24 : 12">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>形状</a-typography-text>
          <a-row :gutter="[4, 0]">
            <a-col :span="option.iconType === 'none' ? 12 : 24">
              <a-select
                :options="legendIconOptions"
                size="small"
                v-model="option.iconType"
                @change="
                  (value: string) => {
                    if (value !== 'none') {
                      option.icon = value
                    } else {
                      option.imageUrl ? (option.icon = option.imageUrl) : (option.icon = value)
                    }
                  }
                "
              />
            </a-col>
            <a-col :span="12" v-if="option.iconType === 'none'">
              <a-input
                size="small"
                :default-value="option.imageUrl"
                placeholder="请输入图片地址"
                @change="
                  (value: string) => {
                    option.icon = value
                    option.imageUrl = value
                  }
                "
              />
            </a-col>
          </a-row>
        </a-space>
      </a-col>
      <a-col :span="12" v-if="option.iconType !== 'none'">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>对齐方式</a-typography-text>
          <a-select
            :options="[
              {
                label: '横向',
                value: 'horizontal',
              },
              {
                label: '纵',
                value: 'vertical',
              },
            ]"
            size="small"
            v-model="option.orient"
            @change="emits('change', option)"
          />
        </a-space>
      </a-col>
    </a-row>

    <template v-if="option.type === 'scroll'">
      <a-divider
        type="dashed"
        orientation="center"
        style="font-size: 12px; color: #53f104"
      ></a-divider>
      <a-row :gutter="[8, 8]">
        <a-col :span="12">
          <a-space direction="vertical">
            <a-typography-text>大小</a-typography-text>
            <a-input-number
              placeholder="大小"
              size="small"
              :min="12"
              v-model="option.pageIconSize"
              @Change="emits('change', option)"
            />
          </a-space>
        </a-col>
        <a-col :span="12">
          <a-space direction="vertical" style="width: 100%">
            <a-typography-text>颜色</a-typography-text>
            <a-color-picker
              size="small"
              v-model="option.pageIconColor"
              showText
              @change="emits('change', option)"
            />
          </a-space>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<style scoped lang="less"></style>
