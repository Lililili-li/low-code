<script setup lang="ts">
import { computed, ref } from "vue";
// import RenderDataConfigModal from "@/components/render-data-config/index.vue";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore.ts";
import { cloneDeep, xor } from "lodash-es";
import MessageApi from "@/utils/message.ts";
import type { EChartsOption } from "echarts";
import {
  AxisComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
} from "@/components/ChartCommonConfig";
import { ERenderData } from "./interface.ts";
import type { SeriesData } from "echarts/types/dist/shared";
import type { AxisBaseOption } from "echarts/types/src/coord/axisCommonTypes.js";
import { IconSettings, IconPlusCircle, IconDelete } from "@arco-design/web-vue/es/icon";
import CustomConfig from "@/components/ChartCommonConfig/CustomConfig.vue";

const componentConfigStore = useComponentConfigStore();
const option = computed(() => componentConfigStore.activeComponent!.props.option);
const componentProps = computed(() => componentConfigStore.activeComponent!.props);

const sheetData = ref({});
const onOpenRenderDataConfigModal = () => {
  if (componentConfigStore.activeComponent!.props.render.type === "Normal") {
    // sheetData.value = charData2TableData(
    //   componentConfigStore.activeComponent!.props.render.defaultValue,
    // )
    // renderDataConfigModalRef.value?.open()
  } else {
    // selectParamModalRef.value?.open({
    //   id: componentProps.value.render.id,
    //   param: componentProps.value.render.param!,
    // })
  }
};

const currentSeries = ref<number | undefined>(0);
const seriesConfigList = computed(() => {
  return option.value.series!.map((item: never, index: number) => ({
    label: "系列" + (index + 1),
    value: index,
  }));
});
const onAddSeries = () => {
  const cloneSeries = cloneDeep(option.value.series![0]);
  cloneSeries.name = cloneSeries.name + "_copy";
  (option.value.series as SeriesData[]).push(cloneSeries);
  currentSeries.value = (option.value.series as SeriesData[]).length - 1;
};
const onRemoveSeries = () => {
  if (option.value.series.length === 1) return MessageApi.error("最少含有一个系列配置");
  option.value.series = (option.value.series as []).filter(
    (_: never, index: number) => index !== currentSeries.value
  );
  currentSeries.value = option.value.series.length ? 0 : undefined;
};

// 柱状图宽度修改用于全局
const onBarWidthChange = (value: string) => {
  option.value.series.forEach((item: EChartsOption) => {
    item.barWidth = value;
  });
};
// 柱状图圆角修改用于全局
const onBarBorderChange = (value: string) => {
  option.value.series.forEach((item: EChartsOption) => {
    (item.itemStyle as any).borderRadius = value;
  });
};
const axisConfigList = computed(() => {
  return (option.value.yAxis as AxisBaseOption[]).map((item, index: number) => ({
    label: "坐标轴" + (index + 1),
    value: index,
  }));
});
const expandedPanelConfig = ref(["1", "2", "3", "4", "5", "6", "7"]);
const onCollapseMenu = (index: string) => {
  expandedPanelConfig.value = expandedPanelConfig.value.filter((item) => item !== index);
};

const onChangeTitleConf = (value) => {
  option.value.title = { ...option.value.title, ...value };
};
const onChangeLegendConf = (value) => {
  option.value.legend = {
    ...option.value.legend,
    ...value
  };
};
const onChangeGridConf = (value) => {
  option.value.grid = { ...option.value.grid, ...value };
};
const onChangeAxisConf = (type: "x" | "y", value) => {
  // if (type === 'x') {
  //   option.value.xAxis = [ ...option.value.xAxis, ...value]
  // } else {
  //   option.value.yAxis = [ ...option.value.yAxis, ...value ]
  // }
};
</script>

<template>
  <div class="vertical-bar-config">
    <a-collapse
      v-model:active-key="expandedPanelConfig"
      expand-icon-position="right"
      :bordered="false"
    >
      <a-collapse-item header="系列配置(Series)" key="2">
        <div class="series-list">
          <a-row :gutter="12">
            <a-col :span="18">
              <a-select
                :options="seriesConfigList"
                style="width: 100%"
                v-model="currentSeries"
                size="small"
              />
            </a-col>
            <a-col :span="6">
              <a-tooltip content="添加系列">
                <a-button type="text" @click="onAddSeries" size="small">
                  <template #icon>
                    <icon-plus-circle />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip content="删除系列">
                <a-button type="text" @click="onRemoveSeries" size="small">
                  <template #icon>
                    <icon-delete />
                  </template>
                </a-button>
              </a-tooltip>
            </a-col>
          </a-row>
          <a-space direction="vertical" style="margin-top: 12px; width: 100%">
            <a-row :gutter="12" align="center">
              <a-col :span="8">
                <a-typography-text> 系列名称</a-typography-text>
              </a-col>
              <a-col :span="16">
                <a-input
                  placeholder="系列名称"
                  style="flex: 1"
                  size="small"
                  v-model="option.series[currentSeries!].name"
                ></a-input>
              </a-col>
            </a-row>
            <a-row :gutter="12" align="center">
              <a-col :span="8">
                <a-typography-text> 取值字段</a-typography-text>
              </a-col>
              <a-col :span="16">
                <a-input
                  placeholder="取值字段"
                  style="flex: 1"
                  size="small"
                  v-model="option.series[currentSeries!].encode.y"
                ></a-input>
              </a-col>
            </a-row>
            <a-row :gutter="12" align="center">
              <a-col :span="8">
                <a-typography-text> 对应坐标轴</a-typography-text>
              </a-col>
              <a-col :span="16">
                <a-select
                  :options="axisConfigList"
                  v-model="option.series[currentSeries!].yAxisIndex"
                  size="small"
                />
              </a-col>
            </a-row>
            <a-row :gutter="12" align="center">
              <a-col :span="8">
                <a-typography-text> 显示标签</a-typography-text>
              </a-col>
              <a-col :span="16" class="flex justify-end">
                <a-switch
                  size="small"
                  v-model="option.series[currentSeries!].label.show"
                />
              </a-col>
            </a-row>
            <a-space
              direction="vertical"
              v-show="option.series[currentSeries!].label?.show"
              style="width: 100%"
            >
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 位置</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-select
                        :options="[
                          {
                            label: '上',
                            value: 'top',
                          },
                          {
                            label: '右',
                            value: 'right',
                          },
                          {
                            label: '下',
                            value: 'bottom',
                          },
                          {
                            label: '左',
                            value: 'left',
                          },
                          {
                            label: '内部',
                            value: 'inside',
                          },
                        ]"
                        style="flex: 1"
                        v-model="option.series[currentSeries!].label.position"
                      ></a-select>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="12">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 距离</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-input-number
                        placeholder="12"
                        style="flex: 1"
                        v-model="option.series[currentSeries!].label.distance"
                        :hide-button="true"
                      >
                        <template #suffix> px</template>
                      </a-input-number>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 大小</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-input-number
                        placeholder="12"
                        style="flex: 1"
                        v-model="option.series[currentSeries!].label.fontSize"
                        :hide-button="true"
                      >
                        <template #suffix> px</template>
                      </a-input-number>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="12">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 字重</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-select
                        :options="[
                          {
                            label: '加粗',
                            value: 'bold',
                          },
                          {
                            label: '正常',
                            value: 'normal',
                          },
                        ]"
                        style="flex: 1"
                        v-model="option.series[currentSeries!].label.fontWeight"
                      ></a-select>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-row :gutter="8" align="center">
                    <a-col :span="4">
                      <a-typography-text> 颜色</a-typography-text>
                    </a-col>
                    <a-col :span="20">
                      <a-color-picker
                        v-model="option.series[currentSeries!].label.color"
                        showText
                        size="small"
                        style="width: 100%"
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-divider dashed :margin="10" />
            </a-space>
            <a-row :gutter="12" align="center">
              <a-col :span="8">
                <a-typography-text> 显示背景</a-typography-text>
              </a-col>
              <a-col :span="16" class="flex justify-end">
                <a-switch
                  size="small"
                  v-model="option.series[currentSeries!].showBackground"
                />
              </a-col>
            </a-row>
            <a-space
              direction="vertical"
              v-show="option.series[currentSeries!].showBackground"
              style="width: 100%"
            >
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 背景颜色</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-color-picker
                        style="width: 100%"
                        size="small"
                        v-model="option.series[currentSeries!].backgroundStyle.color"
                        showText
                      />
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="24">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 阴影颜色</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-color-picker
                        style="width: 100%"
                        size="small"
                        v-model="option.series[currentSeries!].backgroundStyle.shadowColor"
                        showText
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 阴影模糊</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-input-number
                        placeholder="模糊度"
                        v-model="option.series[currentSeries!].backgroundStyle.shadowBlur"
                        style="flex: 1"
                        size="small"
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-row :gutter="8" align="center">
                    <a-col :span="8">
                      <a-typography-text> 透明度</a-typography-text>
                    </a-col>
                    <a-col :span="16">
                      <a-input-number
                        placeholder="透明度"
                        :min="0"
                        :max="1"
                        :step="0.1"
                        v-model="option.series[currentSeries!].backgroundStyle.opacity"
                        style="flex: 1"
                        size="small"
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-divider dashed :margin="10" />
            </a-space>
          </a-space>
          <!--          柱状图样式设置-->
          <a-space direction="vertical" style="width: 100%">
            <a-space justify="space-between" align="center">
              <div
                style="width: 100%"
                class="flex justify-center items-center flex-shrink-0"
              >
                <a-typography-text style="min-width: 40px">宽度</a-typography-text>
                <a-input
                  placeholder="宽度"
                  v-model="option.series[currentSeries!].barWidth"
                  style="flex: 1"
                  @change="onBarWidthChange"
                  size="small"
                />
              </div>
              <div
                style="width: 100%"
                class="flex justify-center items-center flex-shrink-0"
              >
                <a-typography-text style="min-width: 40px">圆角</a-typography-text>
                <a-input-number
                  placeholder="圆角大小"
                  v-model="option.series[currentSeries!].itemStyle.borderRadius"
                  style="flex: 1"
                  @change="onBarBorderChange"
                  size="small"
                />
              </div>
            </a-space>
          </a-space>
        </div>
      </a-collapse-item>
      <a-collapse-item header="标题(Title)" key="3">
        <a-space direction="vertical">
          <TitleComponent :option="option.title" @change="onChangeTitleConf" />
        </a-space>
        <a-tooltip content="折叠菜单">
          <div
            class="flex justify-center cursor-pointer h-3 line-container items-center mt-4"
            @click="onCollapseMenu('3')"
          >
            <div class="line"></div>
          </div>
        </a-tooltip>
      </a-collapse-item>
      <!-- <a-collapse-item header="坐标轴(Axis)" key="4">
        <a-collapse :default-active-key="['1', '2']">
          <a-collapse-item header="X轴" key="1">
            <AxisComponent
              :option="option.xAxis"
              :seriesData="[]"
              axis-type="x"
              @change="(value) => onChangeAxisConf('x', value)"
            />
          </a-collapse-item>
          <a-collapse-item header="Y轴" key="2">
            <AxisComponent
              :option="option.yAxis"
              :seriesData="option.series"
              axis-type="y"
              @change="(value) => onChangeAxisConf('y', value)"
            />
          </a-collapse-item>
        </a-collapse>
        <a-tooltip content="折叠菜单">
          <div
            class="flex justify-center cursor-pointer h-3 line-container items-center mt-4"
            @click="onCollapseMenu('4')"
          >
            <div class="line"></div>
          </div>
        </a-tooltip>
      </a-collapse-item> -->
      <a-collapse-item header="图例(Legend)" key="5">
        <a-space direction="vertical">
          <LegendComponent :option="option.legend" @change="onChangeLegendConf" />
        </a-space>
        <a-tooltip content="折叠菜单">
          <div
            class="flex justify-center cursor-pointer h-3 line-container items-center mt-4"
            @click="onCollapseMenu('5')"
          >
            <div class="line"></div>
          </div>
        </a-tooltip>
      </a-collapse-item>
      <a-collapse-item header="布局(Grid)" key="6" >
        <a-space>
          <GridComponent :option="option.grid" @change="onChangeGridConf" />
        </a-space>
        <a-tooltip content="折叠菜单">
          <div
            class="flex justify-center cursor-pointer h-3 line-container items-center mt-4"
            @click="onCollapseMenu('6')"
          >
            <div class="line"></div>
          </div>
        </a-tooltip>
      </a-collapse-item>
      <a-collapse-item header="自定义配置(合并到config)" key="7">
        <CustomConfig />
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<style scoped lang="less">
.line-container {
  .line {
    width: 100px;
    height: 4px;
    background: #666;
    opacity: 0;
    transition: all 0.3s;
    border-radius: 3px;
  }

  &:hover {
    .line {
      opacity: 1;
    }
  }
}
:deep(.arco-space-item) {
  &:last-child {
    margin-right: 0 !important;
  }
}
:deep(.arco-color-picker) {
  width: 100%;
}
</style>
