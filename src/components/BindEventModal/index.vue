<template>
  <Modal v-model:visible="visible" title="事件绑定" :width="1200">
    <div class="event-modal">
      <div class="content flex gap-3">
        <div class="list">
          <div class="title">响应方法</div>
          <div class="list-content flex" style="height: 500px">
            <div class="list-content-left pr-2 pl-2 pt-1 pb-1">
              <a-radio-group direction="vertical" v-model="listType">
                <a-radio :value="item.value" v-for="item in eventList" :key="item.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </div>
            <div class="list-content-right pr-2 pl-2 pt-1 pb-1 overflow-y-auto">
              <div
                v-if="variableStore.getVariableTreeList().length > 0 && listType === 1"
              >
                <a-scrollbar style="height: 485px; overflow-y: auto">
                  <div class="flex pl-2">
                    <a-typography-text type="warning">
                      数据仅供查看，不可选中！
                    </a-typography-text>
                  </div>
                  <a-tree
                    :data="variableStore.getVariableTreeList()"
                    :field-names="{
                      key: 'value',
                      title: 'label',
                    }"
                    show-line
                    action-on-node-click="expand"
                    checked-strategy="child"
                  >
                    <template #title="nodeData">
                      {{ nodeData?.label }}
                    </template>
                  </a-tree>
                </a-scrollbar>
              </div>
              <div
                v-else-if="dataSourceStore.dataSourceList.length > 0 && listType === 2"
              >
                <div class="flex pl-2">
                  <a-typography-text type="warning">
                    数据仅供参考，不可选中！
                  </a-typography-text>
                </div>

                <div
                  class="interface-item p-2 pb-1 pt-1 flex flex-col gap-1"
                  v-for="item in dataSourceStore.dataSourceList"
                  :key="item.id"
                >
                  <div class="meta flex justify-between items-center">
                    <div class="name flex items-center gap-1">
                      {{ item.name }}
                    </div>
                  </div>
                  <div class="description flex justify-between">
                    <span
                      style="max-width: 80%"
                      class="overflow-hidden text-ellipsis whitespace-normal"
                      >{{
                        (item.base.url.value ? item.base.url.value : "/") +
                        item.options.url
                      }}</span
                    >
                    <span :class="item.options.method">{{ item.options.method }}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                <a-empty description="暂无数据"></a-empty>
              </div>
            </div>
          </div>
        </div>
        <div class="expression">
          <div class="title">表达式</div>
          <div class="expression-content" style="height: 500px">
            <div class="write-able pr-2 pl-2 pt-1 pb-1">
              <MonacoEditor
                ref="monacoEditorRef"
                language="javascript"
                v-model="eventInstance.value"
              />
            </div>
            <a-scrollbar style="height: 150px; overflow-y: auto">
              <div class="description pr-2 pl-2 pt-1 pb-1 overflow-y-auto">
                左侧区域展示变量以及接口列表，你也可以在上方输入复杂的表达式达到修改变量以及调用接口。
                <br />
                输入框内默认支持变量，写法和 JS 写法完全一致。
                <br />
                例：state.name = '张三'
                <br />
                例：dataSource.getInfo()
              </div>
            </a-scrollbar>
          </div>
        </div>
      </div>
      <div class="footer flex justify-end mt-3 mb-2">
        <div class="flex gap-3">
          <div class="cancel">
            <a-button size="mini" @click="closeModal">取消</a-button>
          </div>
          <div class="confirm">
            <a-button type="primary" size="mini" @click="onBindEvent">确认</a-button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import Modal from "../Modal/index.vue";
import { useVariableStore } from "@/stores/useVariableStore";
import { useDataSourceStore } from "@/stores/useDataSourceStore";
import { eventDefaultConfig } from "@/views/setting/attribute/components/Advanced/eventConfig.js";

const MonacoEditor = defineAsyncComponent({
  loader: () => import("@/components/MonacoEditor/index.vue"),
})

const props = defineProps(["value"]);
const emits = defineEmits(["change"]);
const variableStore = useVariableStore();
const dataSourceStore = useDataSourceStore();

const visible = ref(false);
const eventId = ref(""); // 事件id
const listType = ref(1); // 1 接口列表 2 变量列表 3 自定义方法
const openType = ref("create");
const eventInstance = ref({
  id: "",
  name: "",
  value: "",
});
const openModal = (type: string, id: "onClick" | "onChange") => {
  eventId.value = id;
  openType.value = type;
  if (type === "edit") {
    eventInstance.value = props.value.find((item) => item.id === id);
  } else {
    eventInstance.value = JSON.parse(JSON.stringify(eventDefaultConfig.find((item) => item.id === id)));
  }
  visible.value = true;
};
const closeModal = () => {
  visible.value = false;
};
defineExpose({ openModal });

const eventList = ref([
  {
    label: "变量列表(state/global)",
    value: 1,
  },
  {
    label: "接口列表(dataSource)",
    value: 2,
  },
  {
    label: "自定义方法(methods)",
    value: 3,
  },
]);

const onBindEvent = () => {
  emits("change", {
    event: eventInstance.value,
    type: eventId.value,
    openType: openType.value,
  });
  closeModal();
};
</script>

<style lang="less" scoped>
.event-modal {
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
          height: 350px;
        }
      }
    }
  }
  .interface-item {
    transition: all 0.3s;
    border-radius: 4px;
    cursor: pointer;
    .meta {
      .name {
        font-size: 15px;
        font-weight: bold;
      }
    }

    .description {
      font-size: 14px;
      color: var(--color-neutral-6);
      margin-top: 3px;
    }

    .icon {
      transition: all 0.3s;

      &:hover {
        color: rgb(var(--primary-6));
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
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
  }
}
</style>
