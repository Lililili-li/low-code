<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { ref, watch } from "vue";

const props = defineProps(["option"]);
const emits = defineEmits(['change'])

const option = ref({
  show: false,
  text: "",
  textStyle: {
    color: "#B9B8CE",
    fontSize: 12,
  },
  left: "center",
  top: '0',
});

watch(() => props.option, () => {
  option.value = { ...option.value, ...cloneDeep(props.option) };
}, {
  immediate: true,
  deep: true
})
</script>

<template>
  <a-row :gutter="[0, 12]" style="width: 100%">
    <a-col :span="24">
      <a-row :gutter="8" align="center">
        <a-col :span="6">
          <a-typography-text>是否显示</a-typography-text>
        </a-col>
        <a-col :span="18">
          <div class="flex justify-end">
            <a-switch size="small" v-model="option.show" @change="emits('change', option)"/>
          </div>
        </a-col>
      </a-row>
    </a-col>

    <a-col :span="24">
      <a-row :gutter="8" align="center">
        <a-col :span="6">
          <a-typography-text>标题内容</a-typography-text>
        </a-col>
        <a-col :span="18">
          <a-input size="small" v-model="option.text" placeholder="标题内容" @input="emits('change', option)"/>
        </a-col>
      </a-row>
    </a-col>

    <a-col :span="24">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 0px 0 5px 0; color: #53f104"
      >
      </a-divider>
    </a-col>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>大小</a-typography-text>
          <a-input-number
            placeholder="大小"
            size="small"
            :min="12"
            v-model="option.textStyle.fontSize"
            style="width: 100%"
            model-event="input"
            @input="emits('change', option)"
          />
        </a-space>
      </a-col>

      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>颜色</a-typography-text>
          <a-color-picker size="small" v-model="option.textStyle.color" showText @change="emits('change', option)"/>
        </a-space>
      </a-col>
    </a-row>

    <a-col :span="24">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 0px 0 5px 0; color: #53f104"
      >
      </a-divider>
    </a-col>

    <a-row :gutter="12">
      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>横坐标</a-typography-text>
          <a-input v-model="option.left" size="small" style="width: 100%" @input="emits('change', option)"></a-input>
        </a-space>
      </a-col>

      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <a-typography-text>纵坐标</a-typography-text>
          <a-input v-model="option.top" size="small" style="width: 100%" @input="emits('change', option)"></a-input>
        </a-space>
      </a-col>
    </a-row>
  </a-row>
</template>

<style scoped lang="less"></style>
