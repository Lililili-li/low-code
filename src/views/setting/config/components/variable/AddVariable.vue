<script setup lang="tsx">
import { reactive, ref } from "vue";
import MonacoEditor from "@/components/MonacoEditor/index.vue";
import { EVariableData } from "@/types/variable.d";
import type { ExposedMethods } from "@/components/MonacoEditor/index.vue";
import { useVariableStore } from "@/stores/useVariableStore";
import { Message, type FormInstance } from "@arco-design/web-vue";
import type { IVariableType } from "@/types/variable";
import useObject from "@/hooks/useObject"

const { addVariable, editVariable } = useVariableStore();
const { type } = defineProps({
  isFullscreen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'add'
  }
});
const emits = defineEmits(["onCloseDrawer", "onFullscreen"]);
const monacoEditorRef = ref<ExposedMethods | null>(null);
const formRef = ref<FormInstance>();
const { model, reset } = useObject({
  key: "",
  type: EVariableData.STRING,
  value: '' as string | number | boolean,
  id: Math.random() * 1000000 as string | number,
  isGlobal: false
})
const rules = {
  key: [
    {
      validator: (value: string, callback: any) => {
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return callback("变量名只能包含字母、数字和下划线");
        }
        if (!value) {
          return callback("请输入变量名称");
        }
        callback();
      },
    },
  ],
  value: [
    {
      required: true,
      message: "请输入变量初始值",
      trigger: "blur",
    },
  ],
};
const onSaveVariable = async () => {
  const formValidateResult = await formRef.value?.validate();
  if (!formValidateResult) {
    if (model.value.type === EVariableData.OBJECT || model.value.type === EVariableData.ARRAY) {
      if (!monacoEditorRef.value?.validateSyntax()) {
        return Message.error("请检查初始值是否正确");
      }
    }
    type === 'edit' ? editVariable(JSON.parse(JSON.stringify(model.value))) : addVariable(JSON.parse(JSON.stringify(model.value)))
    onResetModel()
    emits('onCloseDrawer')
  }
};
const onResetModel = () => {
  formRef.value?.resetFields()
}
const onEditVariable = (result: IVariableType) => {
  model.value.id = result.id
  model.value.key = result.key
}
const onCopyVariable = (result: IVariableType) => {
  model.value.id = Math.random() * 1000000
  model.value.key = result.key + '_copy'
}
const onOpenVariableDrawer = (item: IVariableType, type: string) => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  if (!item) return
  const result = JSON.parse(JSON.stringify(item))
  model.value.type = result.type as EVariableData
  model.value.isGlobal = result.isGlobal
  if (type === 'copy') {
    onCopyVariable(result)
  } else {
    onEditVariable(result)
  }
  if (result.type === EVariableData.OBJECT || result.type === EVariableData.ARRAY) {
    try {
      model.value.value = typeof result.value === 'string' ? result.value : JSON.stringify(result.value, null, 2)
    } catch (error) {
      model.value.value = '{}'
    }
  } else {
    model.value.value = result.value
  }
}
defineExpose({
  onOpenVariableDrawer,
})
const onChangeType = (value: EVariableData) => {
  switch (value) {
    case EVariableData.OBJECT:
      model.value.value = JSON.stringify({}, null, 2)
      break;
    case EVariableData.ARRAY:
      model.value.value = JSON.stringify([], null, 2)
      break;
    case EVariableData.NUMBER:
      model.value.value = 0
      break;
    case EVariableData.STRING:
      model.value.value = ''
      break;
    case EVariableData.BOOLEAN:
      model.value.value = true
      break;
  }
}
</script>
<template>
  <div class="container pt-3">
    <div class="title flex justify-between pb-3 items-center">
      <span style="font-size: 16px">
        {{ type === "add" ? "添加变量" : type === "edit" ? "修改变量" :type === "view" ? "变量详情" : "复制变量" }}
      </span>
      <a-space>
        <a-button type="primary" size="mini" @click="onSaveVariable" :disabled="type === 'view'">保存</a-button>
        <icon-close-circle
          class="cursor-pointer close"
          :size="18"
          @click="emits('onCloseDrawer')"
        />
      </a-space>
    </div>
    <div class="content p-3 pt-0">
      <a-form ref="formRef" :model="model" :rules="rules" layout="vertical">
        <a-form-item field="key" label="变量名称" hide-asterisk validate-trigger="input">
          <a-input placeholder="只能包含数字字母下划线" v-model="model.key"/>
        </a-form-item>
        <a-form-item label="初始值类型">
          <a-space direction="vertical">
            <a-radio-group v-model="model.type" @change="onChangeType">
              <a-radio :value="EVariableData.STRING">string</a-radio>
              <a-radio :value="EVariableData.NUMBER">number</a-radio>
              <a-radio :value="EVariableData.BOOLEAN">boolean</a-radio>
              <a-radio :value="EVariableData.ARRAY">array</a-radio>
              <a-radio :value="EVariableData.OBJECT">object</a-radio>
            </a-radio-group>
          </a-space>
        </a-form-item>
        <a-form-item label="初始值" field="value" hide-asterisk>
          <div
            class="editor w-full relative"
            v-if="
              model.type === EVariableData.OBJECT || model.type === EVariableData.ARRAY
            "
            :style="{ height: isFullscreen ? '400px' : '250px' }"
          >
            <div class="fullscreen absolute top-1 right-4 z-50 cursor-pointer">
              <a-tooltip content="放大" v-if="!isFullscreen">
                <icon-fullscreen
                  size="14"
                  style="color: #eee"
                  @click="emits('onFullscreen', true)"
                />
              </a-tooltip>
              <a-tooltip content="缩小" v-if="isFullscreen">
                <icon-fullscreen-exit
                  size="14"
                  style="color: #eee"
                  @click="emits('onFullscreen', false)"
                />
              </a-tooltip>
            </div>
            <MonacoEditor v-model="(model.value) as string" language="json" ref="monacoEditorRef" />
          </div>
          <div class="number w-full" v-if="model.type === EVariableData.NUMBER">
            <a-input-number v-model="model.value" placeholder="请输入初始值" />
          </div>
          <div class="string w-full" v-if="model.type === EVariableData.STRING">
            <a-input v-model="model.value" placeholder="请输入初始值" />
          </div>
          <div class="boolean" v-if="model.type === EVariableData.BOOLEAN">
            <a-radio-group v-model="model.value">
              <a-radio :value="true">true</a-radio>
              <a-radio :value="false">false</a-radio>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item field="isGlobal" label="是否为全局变量" hide-asterisk validate-trigger="input">
          <a-switch v-model="model.isGlobal"></a-switch>
        </a-form-item>
        <a-form-item>
          <template #label> 提示<icon-exclamation-circle class="ml-1"/> </template>
          <div class="tip" style="width: 480px;">
            字符串:"string" <br />
            数字:123 <br />
            布尔值:true/false <br />
            对象:{"name":"xxx"} <br />
            数组:["1","2"] <br />
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
.title {
  border-bottom: 1px solid var(--color-neutral-3);
  margin-bottom: 10px;
  height: 30px;
  color: #eee;
  font-weight: bold;
  padding: 0 12px 12px;

  .close {
    transition: all 0.3s;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }
}
.editor {
  transition: all 0.3s linear;
}
:deep(.arco-radio) {
  margin-right: 3px;
}
.tip {
  background-color: #333;
  width: 100%;
  color: #eee;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
</style>
