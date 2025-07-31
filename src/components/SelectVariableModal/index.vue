<template>
  <Modal v-model:visible="visible" title="变量绑定">
    <div class="variable-modal">
      <div class="content flex gap-3">
        <div class="list">
          <div class="title">变量列表</div>
          <div class="list-content flex" style="height: 350px">
            <div class="list-content-left pr-2 pl-2 pt-1 pb-1">
              <a-radio-group direction="vertical" @change="onVariableChange" v-model="parentValue">
                <a-radio
                  :value="item.value"
                  v-for="item in variableStore.getVariableTreeList()"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </div>
            <div class="list-content-right pr-2 pl-2 pt-1 pb-1">
              <div v-if="subTreeData.length > 0">
                <a-input-search
                  style="margin-bottom: 8px; max-width: 240px"
                  v-model="searchKey"
                  size="small"
                  placeholder="请输入变量名称"
                />
                <a-tree
                  :data="subTreeData"
                  :field-names="{
                    key: 'value',
                    title: 'label',
                  }"
                  @select="onSubVariableListSelect"
                  show-line
                  action-on-node-click="expand"
                  checked-strategy="child"
                  :virtual-list-props="{
                    height: 300,
                  }"
                  v-model:selected-keys="selectKeys"
                >
                  <template #title="nodeData">
                    {{ nodeData?.label }}
                  </template>
                </a-tree>
              </div>
              <div v-else>
                <a-empty description="请选择主变量"></a-empty>
              </div>
            </div>
          </div>
        </div>
        <div class="expression">
          <div class="title">表达式</div>
          <div class="expression-content" style="height: 350px">
            <div class="write-able pr-2 pl-2 pt-1 pb-1">
              <MonacoEditor
                ref="monacoEditorRef"
                language="javascript"
                v-model="bindVariable"
              />
            </div>
            <div class="description pr-2 pl-2 pt-1 pb-1">
              你可以通过点击左侧区域绑定变量，当然你也可以在上方输入复杂的表达式。
              <br />
              输入框内默认支持变量，写法和 JS 写法完全一致。
              <br />
              例：state.name = '张三'
              <br />
              例：global.flag = true
            </div>
          </div>
        </div>
      </div>
      <div class="footer flex justify-between mt-3 mb-2">
        <div class="remove-bind">
          <a-button
            type="outline"
            status="danger"
            size="mini"
            v-if="value"
            @click="removeVariableBind"
            >移除绑定</a-button
          >
        </div>
        <div class="flex gap-3">
          <div class="cancel">
            <a-button size="mini" @click="closeModal">取消</a-button>
          </div>
          <div class="confirm">
            <a-button type="primary" size="mini" @click="onBindVariable">确认</a-button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "../Modal/index.vue";
import { useVariableStore } from "@/stores/useVariableStore";
import MonacoEditor from "@/components/MonacoEditor/index.vue";

const props = defineProps(["value"]);
const emits = defineEmits(["change"]);
const variableStore = useVariableStore();
const visible = ref(false);
const parentValue = ref('')
const selectKeys = ref<string[]>([])
const openModal = () => {
  visible.value = true;
  initData(props.value)
};
const closeModal = () => {
  visible.value = false;
}
defineExpose({ openModal });

watch(() => props.value, (n) => {
  initData(n)
})

const searchKey = ref("");

const subTreeData = ref<
  {
    label: string;
    value: string;
    children?: any[];
  }[]
>([]);

const onVariableChange = (value: string) => {
  subTreeData.value = variableStore
    .getVariableTreeList()
    .find((item) => item.value === value)?.children!;
};


const initData = (data: string) => {
  if (!data) {
    subTreeData.value = []
    bindVariable.value = ''
    parentValue.value = ''
    selectKeys.value = []
    return
  }
  bindVariable.value = data
  parentValue.value = data.split('.')[0]
  subTreeData.value = variableStore
    .getVariableTreeList()
    .find((item) => item.value === parentValue.value)?.children!;
  selectKeys.value[0] = props.value
}

const onSubVariableListSelect = (
  _,
  {selectedNodes }
) => {
  if (selectedNodes[0] && !selectedNodes[0].children) {
    bindVariable.value = selectedNodes[0].value
  }
};

const bindVariable = ref('')

const removeVariableBind = () => {
  emits('change', '')
  closeModal()
};
const onBindVariable = () => {
  emits('change', bindVariable.value)
  closeModal()
}
</script>

<style lang="less" scoped>
.variable-modal {
  .content {
    > div {
      .title {
        font-weight: bold;
        color: #fff;
        margin-bottom: 5px;
      }
    }
    .list {
      width: 45%;
      .list-content {
        border: 1px solid #666;
        border-radius: 5px;
      }
      .list-content-left {
        width: 40%;
        border-right: 1px solid #666;
      }
      .list-content-right {
        width: 60%;
      }
    }
    .expression {
      width: 55%;
      .expression-content {
        border: 1px solid #666;
        border-radius: 5px;
        .write-able {
          height: 220px;
        }
      }
    }
  }
}
</style>
