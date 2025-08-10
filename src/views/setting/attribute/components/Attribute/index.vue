<script setup lang="tsx">
import { componentConfigMap } from "@/packages";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import { computed, ref, watch } from "vue";
import BindVariableModal from "@/components/BindVariableModal/index.vue";
import StaticTable from "@/components/StaticTable/index.vue";

const pageConfigStore = usePageConfigStore();
const componentConfigStore = useComponentConfigStore();
const compConfig = computed(() => componentConfigStore?.activeComponent!);

const expandedPanelConfig = ref(["1"]);

const BindVariableModalRef = ref<InstanceType<typeof BindVariableModal>>();
const StaticTableRef = ref<InstanceType<typeof StaticTable>>();
const onOpenRenderDataConfigModal = () => {
  if (renderType.value === "JSExpression") {
    BindVariableModalRef.value?.openModal();
  } else {
    StaticTableRef.value?.openModal();
  }
};
const onVariableBindChange = (value: string) => {
  const activeComp = pageConfigStore
    .getCurrentPage()
    ?.componentList.find((item) => item.id === compConfig.value.id);
  if (!activeComp) return;
  if (value) {
    activeComp.props.render!.type = "JSExpression";
    activeComp.props.render!.value = value;
    renderType.value = "JSExpression";
  } else {
    activeComp.props.render!.type = "Normal";
    activeComp.props.render!.value = activeComp.props.render!.defaultValue as [];
    renderType.value = "Normal";
  }
};

const renderType = ref("");

watch(
  () => compConfig.value.props.render,
  (newVal) => {
    if (compConfig.value.type === 'component') {
      renderType.value = newVal!.type;
    }
  },
  {
    immediate: true,
    deep: true,
    once: true,
  }
);

const onBindStaticData = (value: any) => {
  renderType.value = "Normal";
  if (!compConfig.value.props.render) return
  compConfig.value.props.render.type = "Normal";
  compConfig.value.props.render.defaultValue = value.source;
  compConfig.value.props.render.value = value.source;
  compConfig.value.props.option.dataset.dimensions = value.dimension;
};
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="pr-3 pl-3 attribute-container">
      <a-input
        type="text"
        placeholder="请输入组件名称"
        v-model="compConfig.name"
      ></a-input>
      <a-collapse
        expand-icon-position="right"
        :bordered="false"
        v-model:active-key="expandedPanelConfig"
        v-if="compConfig?.componentType === 'chart'"
      >
        <a-collapse-item
          header="数据渲染(Source)"
          key="1"
          style="border-bottom: 1px solid var(--color-neutral-3)"
        >
          <a-row :gutter="12" align="center">
            <a-col :span="20">
              <a-select
                :options="[
                  {
                    label: '静态数据',
                    value: 'Normal',
                  },
                  {
                    label: '动态数据',
                    value: 'JSExpression',
                  },
                ]"
                placeholder="请选择渲染数据"
                v-model="renderType"
                size="small"
              >
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-button type="text" shape="circle" @click="onOpenRenderDataConfigModal">
                <template #icon>
                  <a-icon size="18">
                    <icon-settings />
                  </a-icon>
                </template>
              </a-button>
            </a-col>
          </a-row>
        </a-collapse-item>
      </a-collapse>
      <div class="component-config">
        <Component :is="componentConfigMap[compConfig!.componentConfigName!]" />
      </div>
    </div>
  </a-scrollbar>
  <BindVariableModal
    ref="BindVariableModalRef"
    :value="compConfig.props.render?.value"
    @change="onVariableBindChange"
    v-if="(renderType as string) === 'JSExpression'"
  />
  <StaticTable
    ref="StaticTableRef"
    :value="compConfig.props.render?.defaultValue"
    @update:value="(value) => onBindStaticData(value)"
  />
</template>
<style lang="less" scoped>
.attribute-container {
  :deep(.arco-input-wrapper) {
    input {
      text-align: center;
    }
  }
  :deep(.arco-collapse-item-content) {
    padding: 0 12px;
  }
}
</style>
