<script setup lang="ts">
const data = defineModel("data");
const { columns, variableTreeList } = defineProps(["columns", "variableTreeList"]);

enum EParams {
  Normal = "normal",
  JSExpression = "JSExpression",
}
const onCreateParams = () => {
  (data.value as any)!.push({
    id: new Date().getTime(),
    key: "",
    value: {
      type: EParams.Normal,
      value: "",
    },
  });
};
const onDeleteParams = (id: string) => {
  data.value = (data.value as any)!.filter((item) => item.id !== id);
};
const onKeyChange = (record, value: string) => {
  if(!value) return
  record.key = value;
};
</script>
<template>
  <div class="table">
    <a-table
      :columns="columns"
      :data="data"
      :pagination="false"
      class="w-full"
      :bordered="{ cell: true }"
    >
      <template #keyBlock="{ record }">
        <a-input
          placeholder="请输入key"
          allow-clear
          :default-value="record.key"
          @change="(value: string) => onKeyChange(record, value)"
          ref="inputRefs![rowIndex]"
        />
      </template>
      <template #keyBlockCommon="{ record }">
        <a-input
          placeholder="请输入key"
          :default-value="record.key"
          @change="(value: string) => { if(value) record.key = value }"
          allow-clear
        />
      </template>
      <template #valueBlock="{ record }">
        <div class="flex items-center gap-2">
          <a-input
            v-if="record.value.type === EParams.Normal"
            placeholder="请输入value"
            v-model="record.value.value"
            allow-clear
          />
          <a-cascader
            :options="variableTreeList"
            placeholder="请选择变量"
            check-strictly
            allow-clear
            v-else
            style="min-width: 200px"
            :format-label="
              (options) => {
                const labels = options.map((option) => option.label);
                return labels.join('.');
              }
            "
            v-model="record.value.value"
          />
          <a-switch
            v-model="record.value.type"
            :checked-value="EParams.JSExpression"
            :unchecked-value="EParams.Normal"
            @change="(value: string | number | boolean) => record.value.type = ''"
            style="width: 80px"
          >
            <template #checked> 变量 </template>
            <template #unchecked> 常量 </template>
          </a-switch>
        </div>
      </template>
      <template #actionBlock="{ record, rowIndex }">
        <div class="flex gap-2">
          <a-button @click="onCreateParams">
            <template #icon>
              <icon-plus-circle class="cursor-pointer" size="18" />
            </template>
          </a-button>
          <a-button @click="onDeleteParams(record.id)" v-if="rowIndex > 0">
            <template #icon>
              <icon-minus-circle class="cursor-pointer" size="18" />
            </template>
          </a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less"></style>
