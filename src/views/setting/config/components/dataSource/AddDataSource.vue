<script setup lang="tsx">
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import MonacoEditor from "@/components/MonacoEditor/index.vue"
import axios, { type AxiosRequestConfig } from "axios"
import { interfaceEventMap } from "./handleParams"
import Table from "./Table.vue"
import {
  handleTransformParams2Schema,
  handleParamsForSend,
  handleTransformSchema2Params,
} from "./handleParams"
import type { IDataSource, IDataType, IEvent } from "@/types/dataSource"
import { generateUUID, getFunctionBody } from "@/utils"
import message from "@/utils/message"
import { useVariableStore } from "@/stores/useVariableStore"
import { cloneDeep } from "lodash-es"
import { useDataSourceStore } from "@/stores/useDataSourceStore"
import useObject from "@/hooks/useObject"

const variableConfStore = useVariableStore()
const dataSourceStore = useDataSourceStore()

enum EParams {
  Normal = "normal",
  JSExpression = "JSExpression",
}
const props = defineProps({
  type: {
    type: String,
    default: "add",
  },
})
const emits = defineEmits(["onCloseDrawer"])

const headerColumns = [
  {
    title: "Key",
    dataIndex: "key",
    slotName: "keyBlock",
  },
  {
    title: "Value",
    dataIndex: "value",
    slotName: "valueBlock",
  },
  {
    title: "操作",
    dataIndex: "action",
    slotName: "actionBlock",
  },
]

const commonColumns = [
  {
    title: "Key",
    dataIndex: "key",
    slotName: "keyBlockCommon",
  },
  {
    title: "Value",
    dataIndex: "value",
    slotName: "valueBlock",
  },
  {
    title: "操作",
    dataIndex: "action",
    slotName: "actionBlock",
  },
]
// 事件列表
const preAppendEventList = ref<(IEvent & { name: string })[]>([])

const { model: apiModel, reset } = useObject({
  base: {
    url: {
      type: EParams.Normal,
      value: "",
    },
    headers: [
      {
        key: "Accept",
        value: {
          type: EParams.Normal,
          value: "*/*",
        },
      },
    ],
  },
  name: "",
  description: "",
  options: {
    url: "",
    loopTime: {
      type: EParams.Normal,
      value: 0 as number | string,
    },
    method: "GET",
    headers: [
      {
        key: "",
        value: {
          type: EParams.Normal,
          value: "",
        },
      },
    ],
    timeout: {
      type: EParams.Normal,
      value: 5000 as number | string,
    },
    params: [
      {
        key: "",
        value: {
          type: EParams.Normal,
          value: "",
        },
      },
    ],
    dataType: "none" as IDataType,
    body: {
      json: "",
      "form-data": [
        {
          key: "",
          value: {
            type: EParams.Normal,
            value: "",
          },
        },
      ],
      "x-www-form-urlencoded": [
        {
          key: "",
          value: {
            type: EParams.Normal,
            value: "",
          },
        },
      ],
    },
  },
})

const handleAddFunction = (value: string) => {
  if (preAppendEventList.value.find((item) => item.name === value)) return
  preAppendEventList.value.push({ name: value, ...interfaceEventMap[value] })
}
const handleRemoveFunc = (index: number) => {
  preAppendEventList.value.splice(index, 1)
}

const apiFormRef = ref(null)
const validateForm = async () => {
  const res = await (apiFormRef.value as any).validate()
  if (!res) return true
  return false
}
const onSaveData = async () => {
  if (!(await validateForm())) return
  const dataSource = handleTransformParams2Schema(apiModel.value)
  preAppendEventList.value.forEach((event) => {
    dataSource[event.name] = {
      type: event.type,
      value: event.value,
    }
  })
  console.log(dataSource.base.headers, 'dataSource');
  if (props.type !== "edit") {
    dataSourceStore.addDataSourceList(dataSource)
    message.success("保存成功")
  } else {
    dataSourceStore.editDataSource(dataSource)
    message.success("修改成功")
  }
  reset()
  emits("onCloseDrawer")
}

const testResponse = ref("")
const testLoading = ref(false)
const scrollbarRef = ref(null)
const onTestInterface = async () => {
  if (!(await validateForm())) return
  try {
    testLoading.value = true
    const params = handleParamsForSend(apiModel.value, preAppendEventList.value)
    const res = await axios(params as unknown as AxiosRequestConfig)
    const exitItem = preAppendEventList.value.find((item) => item.name === "handleSuccess")
    if (exitItem) {
      const handleResult = new Function("res", "state", getFunctionBody(exitItem.value))
      res.data = handleResult(res.data, cloneDeep(variableConfStore.state)) || res.data
    }
    testResponse.value = JSON.stringify(res.data, null, 2);
    nextTick(() => {
      (scrollbarRef.value as any)?.scrollTo({top: 99999, behavior: 'smooth'})
    })
  } catch (error) {
    console.log(error, "-----res")
    const exitItem = preAppendEventList.value.find((item) => item.name === "handleError")
    if (exitItem) {
      const handleResult = new Function("error", "message", getFunctionBody(exitItem.value))
      const result = handleResult(error, message)
      error = result || error
    }
    testResponse.value = JSON.stringify(error, null, 2)
  } finally {
    testLoading.value = false
  }
}

const onOpenVariableDrawer = (item: IDataSource, type: "add" | "edit" | "check" | "copy") => {
  reset()
  if (!item) return
  const result = handleTransformSchema2Params(JSON.parse(JSON.stringify(item)))
  if (type === "add") return
  if (type === "copy") {
    result.id = generateUUID()
    result.name = result.name + "_copy"
  }
  apiModel.value = {
    ...apiModel.value,
    ...result,
    options: { ...apiModel.value.options, ...result.options },
    base: result.base,
  }
}

defineExpose({ onOpenVariableDrawer })
</script>
<template>
  <div class="container pt-3" id="interface-container">
    <div class="title flex justify-between pb-3 items-center">
      <span style="font-size: 16px">
        {{ type === "create" ? "添加接口" : type === "edit" ? "修改接口" : "查看接口" }}
      </span>
      <a-space>
        <a-button
          type="text"
          size="small"
          @click="onTestInterface"
          :loading="testLoading"
        >
          <template #icon>
            <a-tooltip content="测试连接，不会修改变量值">
              <icon-exclamation-circle />
            </a-tooltip>
          </template>
          测试连接
        </a-button>
        <a-button type="primary" size="mini" @click="onSaveData">保存</a-button>
        <icon-close-circle
          class="cursor-pointer close"
          :size="18"
          @click="emits('onCloseDrawer')"
        />
      </a-space>
    </div>
    <div class="content">
      <a-scrollbar style="height: calc(100vh - 115px); overflow: auto" ref="scrollbarRef">
        <!-- {{ data }} -->
        <div class="base-config p-3 pt-0">
          <div class="name mb-2">公共配置</div>
          <a-form layout="vertical" :model="apiModel.base" ref="headerFormRef">
            <a-form-item label="BaseURL" field="baseUrl">
              <div class="flex gap-3 items-center">
                <a-input
                  v-model="apiModel.base.url.value"
                  placeholder="如未配置，则默认请求当前服务器资源"
                  allow-clear
                  style="min-width: 300px"
                  v-if="apiModel.base.url.type === EParams.Normal"
                />
                <a-cascader
                  :options="variableConfStore.getVariableTreeList()"
                  placeholder="请选择变量"
                  check-strictly
                  allow-clear
                  v-else
                  path-mode
                  style="min-width: 300px"
                  :format-label="
                    (options) => options.map((option) => option.label).join('.')
                  "
                  v-model="apiModel.base.url.value"
                  allow-search
                />
                <a-switch
                  style="width: 80px"
                  v-model="apiModel.base.url.type"
                  :checked-value="EParams.JSExpression"
                  :unchecked-value="EParams.Normal"
                  @change="apiModel.base.url.value = ''"
                >
                  <template #checked> 变量 </template>
                  <template #unchecked> 常量 </template>
                </a-switch>
              </div>
            </a-form-item>
            <a-form-item label="Header">
              <Table
                v-model:data="apiModel.base.headers"
                :columns="headerColumns"
                :variableTreeList="variableConfStore.getVariableTreeList()"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="api-config p-3">
          <a-form :model="apiModel" layout="vertical" ref="apiFormRef">
            <a-form-item
              label="接口名称"
              field="name"
              :rules="{ required: true, message: '请输入接口名称' }"
            >
              <a-input v-model="apiModel.name" placeholder="请输入接口名称" />
            </a-form-item>
            <a-form-item
              label="请求地址"
              field="options.url"
              :rules="{ required: true, message: '请输入请求地址' }"
            >
              <a-input-group class="w-full">
                <a-select
                  :options="['GET', 'POST', 'DELETE']"
                  style="max-width: 100px"
                  v-model="apiModel.options.method"
                />
                <a-input
                  placeholder="请输入url"
                  v-model="apiModel.options.url"
                  allow-clear
                >
                  <template #prepend>
                    {{ apiModel.base.url.value ? apiModel.base.url.value : "/" }}
                  </template>
                </a-input>
              </a-input-group>
            </a-form-item>
            <a-form-item label="接口描述">
              <a-input v-model="apiModel.description" placeholder="请输入接口描述" />
            </a-form-item>
            <a-form-item>
              <template #label>
                <a-row>
                  <a-col :span="12">超时时长（ms）</a-col>
                  <a-col :span="12" class="flex items-center">
                    <span>定时调用（ms）</span>
                    <a-tooltip content="定时调用时间，单位为毫秒，0为仅调用一次">
                      <icon-exclamation-circle class="cursor-pointer" :size="16" />
                    </a-tooltip>
                  </a-col>
                </a-row>
              </template>
              <a-row class="w-full" align="center">
                <a-col :span="12" class="pr-3">
                  <div class="flex gap-3 items-center">
                    <a-input-number
                      v-model="apiModel.options.timeout.value"
                      placeholder="请输入超时时间"
                      v-if="apiModel.options.timeout.type === EParams.Normal"
                    />
                    <a-cascader
                      :options="variableConfStore.getVariableTreeList()"
                      placeholder="请选择变量"
                      check-strictly
                      allow-clear
                      v-else
                      path-mode
                      style="min-width: 200px"
                      :format-label="
                        (options) => options.map((option) => option.label).join('.')
                      "
                      v-model="apiModel.options.timeout.value"
                      allow-search
                    />
                    <a-switch
                      style="width: 80px"
                      :checked-value="EParams.JSExpression"
                      :unchecked-value="EParams.Normal"
                      v-model="apiModel.options.timeout.type"
                      @change="
                        apiModel.options.timeout.type === EParams.Normal
                          ? (apiModel.options.timeout.value = 5000)
                          : (apiModel.options.timeout.value = '')
                      "
                    >
                      <template #checked> 变量 </template>
                      <template #unchecked> 常量 </template>
                    </a-switch>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="flex gap-3 items-center">
                    <a-input-number
                      v-model="apiModel.options.loopTime.value"
                      placeholder="请输入定时调用时间"
                      v-if="apiModel.options.loopTime.type === EParams.Normal"
                    />
                    <a-cascader
                      :options="variableConfStore.getVariableTreeList()"
                      placeholder="请选择变量"
                      check-strictly
                      allow-clear
                      v-else
                      path-mode
                      style="min-width: 200px"
                      :format-label="
                        (options) => options.map((option) => option.label).join('.')
                      "
                      v-model="apiModel.options.loopTime.value"
                      allow-search
                    />
                    <a-switch
                      style="width: 80px"
                      :checked-value="EParams.JSExpression"
                      :unchecked-value="EParams.Normal"
                      v-model="apiModel.options.loopTime.type"
                      @change="
                        apiModel.options.loopTime.type === EParams.Normal
                          ? (apiModel.options.loopTime.value = 0)
                          : (apiModel.options.loopTime.value = '')
                      "
                    >
                      <template #checked> 变量 </template>
                      <template #unchecked> 常量 </template>
                    </a-switch>
                  </div>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="请求参数">
              <a-tabs default-active-key="1" type="capsule" class="w-full">
                <a-tab-pane key="1" title="Params">
                  <Table
                    v-model:data="apiModel.options.params"
                    :columns="commonColumns"
                    :variable-tree-list="variableConfStore.getVariableTreeList()"
                  />
                </a-tab-pane>
                <a-tab-pane
                  key="2"
                  title="Body"
                  v-if="apiModel.options.method === 'POST'"
                >
                  <a-space direction="vertical" class="mt-1 w-full">
                    <a-radio-group v-model="apiModel.options.dataType" type="button">
                      <a-radio value="none">none</a-radio>
                      <a-radio value="form-data">form-data</a-radio>
                      <a-radio value="x-www-form-urlencoded">
                        x-www-form-urlencoded
                      </a-radio>
                      <a-radio value="json">json</a-radio>
                    </a-radio-group>
                    <div
                      class="form-data"
                      v-if="
                        apiModel.options.dataType === 'form-data' ||
                        apiModel.options.dataType === 'x-www-form-urlencoded'
                      "
                    >
                      <Table
                        v-model:data="apiModel.options.body[apiModel.options.dataType]"
                        :columns="commonColumns"
                        :variable-tree-list="variableConfStore.getVariableTreeList()"
                      />
                    </div>
                    <div class="none" v-if="apiModel.options.dataType === 'none'">
                      <a-empty description="请求体为none"></a-empty>
                    </div>
                    <div class="json" v-if="apiModel.options.dataType === 'json'">
                      <MonacoEditor
                        v-model="apiModel.options.body.json"
                        language="json"
                        ref="monacoEditorRef"
                      />
                    </div>
                  </a-space>
                </a-tab-pane>
                <a-tab-pane key="3" title="Header">
                  <Table
                    v-model:data="apiModel.options.headers"
                    :columns="headerColumns"
                    :variable-tree-list="variableConfStore.getVariableTreeList()"
                  />
                </a-tab-pane>
              </a-tabs>
            </a-form-item>
            <div class="flex justify-between w-full items-center mb-2">
              <span style="color: var(--color-text-2)">流程处理函数</span>
              <a-dropdown trigger="hover" @select="handleAddFunction">
                <template #content>
                  <a-doption value="handleParams">参数处理函数</a-doption>
                  <a-doption value="handleSuccess">成功结果处理函数</a-doption>
                  <a-doption value="handleError">失败结果处理函数</a-doption>
                </template>
                <a-button type="text" size="mini">
                  <template #icon>
                    <icon-plus-circle size="18"></icon-plus-circle>
                  </template>
                </a-button>
              </a-dropdown>
            </div>
            <a-form-item v-for="(item, index) in preAppendEventList" :key="item.name">
              <template #label>
                <div class="flex justify-between w-full items-center">
                  <span>{{ item.name }}</span>
                  <a-button type="text" size="mini" @click="handleRemoveFunc(index)">
                    <template #icon>
                      <icon-close-circle size="18" />
                    </template>
                  </a-button>
                </div>
              </template>
              <MonacoEditor
                v-model="item.value"
                language="javascript"
                ref="monacoEditorRef"
              />
            </a-form-item>
            <a-form-item label="响应数据" v-if="testResponse">
              <MonacoEditor
                v-model="testResponse"
                language="json"
                ref="monacoEditorRef"
              />
            </a-form-item>
          </a-form>
        </div>
      </a-scrollbar>
    </div>
  </div>
</template>
<style lang="less" scoped>
.base-config {
  border-bottom: 1px solid var(--color-neutral-3);
}
.name {
  color: #eee;
  font-size: 15px;
  color: rgb(var(--primary-6));
  text-align: center;
}

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
:deep(.arco-table-container) {
  border-radius: 0;
}
.GET {
  color: rgb(8, 164, 8);
}
.POST {
  color: orange;
}
.DELETE {
  color: rgb(202, 16, 16);
}
:deep(.arco-tabs-nav-type-capsule) {
  .arco-tabs-nav-tab {
    justify-content: flex-start !important;
  }
}
:deep(.arco-form-item-label) {
  width: 100%;
}
:deep(.arco-affix) {
  width: auto !important;
  left: 1020px !important;
}
</style>
