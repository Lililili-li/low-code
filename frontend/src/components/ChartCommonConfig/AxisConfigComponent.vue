<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { cloneDeep } from "lodash-es";
import message from "@/utils/message.ts";

// const { option, seriesData, axisType } = defineProps(['option', 'seriesData', 'axisType'])
const props = defineProps(["option", "seriesData", "axisType"]);
const emits = defineEmits(["change"]);

const option = ref([
  {
    name: "",
    nameGap: 15,
    nameLocation: "end",
    position: "bottom",
    nameTextStyle: {
      fontSize: 12,
      color: "#eee",
    },
    nameRotate: 0,
    type: "category",
    axisLabel: {
      show: true,
      color: "#B9B8CE",
      fontSize: 12,
      position: "bottom",
      rotate: 0,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#B9B8CE",
        width: 1,
        type: "solid",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#B9B8CE",
        width: 1,
        type: "solid",
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: "#B9B8CE",
        type: "solid",
        width: 1,
      },
    },
  },
] as any);
const axisType = ref("");
const seriesData = ref([] as any);
const currentAxisIndex = ref(0);
const axisOptions = computed(() => {
  const result = [] as {}[];
  for (let i = 0; i < option.value.length; i++) {
    result.push({
      label: "坐标轴" + (i + 1),
      value: i,
    });
  }
  return result;
});

const positionOptions = computed(() => {
  return axisType.value === "x"
    ? [
        {
          label: "顶部",
          value: "top",
        },
        {
          label: "底部",
          value: "bottom",
        },
      ]
    : [
        {
          label: "左侧",
          value: "left",
        },
        {
          label: "右侧",
          value: "right",
        },
      ];
});

const onAddAxis = () => {
  if (axisOptions.value.length === seriesData.value.length)
    return message.error("坐标轴数量超出所配置的数据");
  const axisData = cloneDeep(option.value[currentAxisIndex.value]);
  axisData.position = "right";
  option.value.push(axisData);
};
const onRemoveAxis = () => {};
onMounted(() => {
  option.value = [...option.value, ...cloneDeep(props.option)];
  axisType.value = props.axisType;
  seriesData.value = [...seriesData.value, ...cloneDeep(props.seriesData)];
});
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-space v-if="seriesData.length > 1">
      <a-select
        :options="axisOptions"
        placeholder="请选择坐标轴"
        v-model="currentAxisIndex"
        style="flex: 1"
        size="small"
      >
      </a-select>
      <div class="flex" style="width: 24%">
        <a-tooltip>
          <template #content>添加坐标组</template>
          <a-button type="text" @click="onAddAxis" size="small">
            <template #icon>
              <icon-plus-circle />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip>
          <template #content>删除坐标轴</template>
          <a-button type="text" @click="onRemoveAxis" size="small">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </a-space>
    <a-space align="center" style="width: 100%">
      <a-row :gutter="[12, 12]" style="width: 100%">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="9">
              <a-typography-text>坐标轴位置</a-typography-text>
            </a-col>
            <a-col :span="15">
              <a-select
                :options="positionOptions"
                placeholder="标签位置"
                v-model="option[currentAxisIndex].position"
                size="small"
                style="flex: 1"
                @change="emits('change', option)"
              >
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="9">
              <a-typography-text>坐标轴偏移</a-typography-text>
            </a-col>
            <a-col :span="15">
              <a-input-number
                placeholder="多个轴设置偏移"
                size="small"
                v-model="option[currentAxisIndex].offset"
                style="flex: 1"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 0px 0 5px 0; color: #53f104"
      >
      </a-divider>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>内容</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input
                placeholder="单位内容"
                size="small"
                v-model="option[currentAxisIndex].name"
                @change="emits('change', option)"
              ></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>颜色</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-color-picker
                size="small"
                v-model="option[currentAxisIndex].nameTextStyle.color"
                showText
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>字体大小</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="字体大小"
                size="small"
                :min="12"
                v-model="option[currentAxisIndex].nameTextStyle.fontSize"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>距离</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="距离大小"
                size="small"
                v-model="option[currentAxisIndex].nameGap"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>横向位置</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-select
                :options="[
                  {
                    label: '左',
                    value: 'start',
                  },
                  {
                    label: '中',
                    value: 'center',
                  },
                  {
                    label: '右',
                    value: 'end',
                  },
                ]"
                placeholder="横向位置"
                v-model="option[currentAxisIndex].nameLocation"
                @change="emits('change', option)"
              >
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>旋转角度</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="-90°-90°"
                size="small"
                :min="-90"
                :max="90"
                v-model="option[currentAxisIndex].nameRotate"
                :hide-button="true"
                @change="emits('change', option)"
              >
                <template #suffix> °</template>
              </a-input-number>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 16px 0 5px 0; color: #53f104"
      >
      </a-divider>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>是否显示</a-typography-text>
            </a-col>
            <a-col :span="16" class="flex justify-end">
              <a-switch
                size="small"
                v-model="option[currentAxisIndex].axisLabel.show"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>颜色</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-color-picker
                size="small"
                v-model="option[currentAxisIndex].axisLabel.color"
                showText
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>字体大小</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="字体大小"
                size="small"
                :min="12"
                v-model="option[currentAxisIndex].axisLabel.fontSize"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>旋转角度</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="-90°-90°"
                size="small"
                :min="-90"
                :max="90"
                v-model="option[currentAxisIndex].axisLabel.rotate"
                :hide-button="true"
                @change="emits('change', option)"
              >
                <template #suffix> °</template>
              </a-input-number>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 16px 0 5px 0; color: #53f104"
      >
      </a-divider>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>是否显示</a-typography-text>
            </a-col>
            <a-col :span="16" class="flex justify-end">
              <a-switch size="small" v-model="option[currentAxisIndex].axisLine.show" @change="emits('change', option)"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>线宽</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="线宽"
                size="small"
                v-model="option[currentAxisIndex].axisLine.lineStyle.width"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>颜色</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-color-picker
                size="small"
                v-model="option[currentAxisIndex].axisLine.lineStyle.color"
                @change="emits('change', option)"
                showText
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>类型</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-select
                :options="[
                  {
                    label: '—————',
                    value: 'solid',
                  },
                  {
                    label: '-----------',
                    value: 'dashed',
                  },
                ]"
                placeholder="轴线类型"
                v-model="option[currentAxisIndex].axisLine.lineStyle.type"
                size="small"
                @change="emits('change', option)"
              >
              </a-select>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-divider
        dashed
        orientation="center"
        style="font-size: 12px; margin: 16px 0 5px 0; color: #53f104"
      >
      </a-divider>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>是否显示</a-typography-text>
            </a-col>
            <a-col :span="16" class="flex justify-end">
              <a-switch size="small" v-model="option[currentAxisIndex].axisTick.show" @change="emits('change', option)"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>线宽</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-input-number
                placeholder="线宽"
                size="small"
                v-model="option[currentAxisIndex].axisTick.lineStyle.width"
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="[12, 12]">
        <a-col :span="24">
          <a-row :gutter="8" align="center">
            <a-col :span="8">
              <a-typography-text>颜色</a-typography-text>
            </a-col>
            <a-col :span="16">
              <a-color-picker
                size="small"
                v-model="option[currentAxisIndex].axisTick.lineStyle.color"
                showText
                @change="emits('change', option)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-space>
  </a-space>
</template>

<style scoped lang="less"></style>
