<script setup lang="ts">
import { useComponentConfigStore } from "@/stores/useComponentConfigStore.js";
import { computed, ref } from "vue";
import { TextGrammarSettings24Regular } from "@vicons/fluent";
import BindVariableModal from "@/components/BindVariableModal/index.vue";
import BindEventModal from "@/components/BindEventModal/index.vue";

const componentConfigStore = useComponentConfigStore();

const compConfig = computed(() => componentConfigStore?.activeComponent!);

const BindVariableModalRef = ref(null);
const openModal = () => {
  (BindVariableModalRef.value as any)?.openModal();
};

const onVariableBindChange = (value: string) => {
  if (!compConfig.value) return;
  if (value) {
    compConfig.value.props.visible.type = "JSExpression";
    compConfig.value.props.visible.value = value;
  } else {
    compConfig.value.props.visible.type = "Normal";
    compConfig.value.props.visible.value = true;
  }
};

const bindEventModalRef = ref(null);

const onOpenBindEventModal = (type: string, id: "onClick" | "onChange") => {
  (bindEventModalRef.value as any)?.openModal(type, id);
};

const onDeleteEvent = (eventId: string) => {
  compConfig.value.eventConfig = compConfig.value.eventConfig.filter(
    (item) => item.id !== eventId
  );
};
const onBindEvent = ({
  event,
  type,
  openType,
}: {
  event: Record<string, any>;
  type: string;
  openType: string;
}) => {
  if (openType === "create") {
    compConfig.value.eventConfig.push(event);
  } else {
    compConfig.value.eventConfig.find((item) => item.id === type)!.value = event.value;
  }
};
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="style-page">
      <div class="flex flex-col box">
        <div class="header flex justify-between pb-2 mb-2 pr-3 pl-3">
          <a-typography style="width: 80px">是否渲染</a-typography>
          <div class="variable-bind">
            <a-tooltip
              :content="
                compConfig.props.visible.type === 'JSExpression' ? '变量绑定' : '常量渲染'
              "
              class="flex-1"
              @click="openModal"
            >
              <div class="cursor-pointer hover:text-blue-500">
                <a-icon size="18">
                  <TextGrammarSettings24Regular />
                </a-icon>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div
          class="flex gap-2 items-center justify-between flex-1 container pb-2 pr-3 pl-3"
        >
          <div
            class="normal"
            v-if="(compConfig.props.visible.type as string) === 'Normal'"
          >
            <a-switch v-model="compConfig.props.visible.value" size="small" />
          </div>
          <div v-else class="flex items-center w-full">
            <div class="flex w-full items-center">
              <span style="width: 60px">已绑定：</span>
              <span
                class="text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap"
                style="width: calc(100% - 60px); font-size: 15px"
                >{{ compConfig.props.visible.value }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col box mt-2">
        <div class="header flex justify-between pb-2 mb-2 pr-3 pl-3">
          <a-typography style="width: 80px">事件绑定</a-typography>
          <div class="event-bind">
            <a-popover position="left" :content-style="{ padding: '0px' }">
              <div class="cursor-pointer hover:text-blue-500">
                <a-icon size="18"><icon-plus-circle /></a-icon>
              </div>
              <template #content>
                <a-doption
                  @click="onOpenBindEventModal('create', 'onClick')"
                  :disabled="Boolean(compConfig.eventConfig?.find((item) => item.id === 'onClick')?.id)"
                  >onClick（点击事件）</a-doption
                >
              </template>
            </a-popover>
          </div>
        </div>
        <div class="event-list pr-3 pl-3">
          <div
            class="event-item"
            v-for="(item, key) in compConfig.eventConfig"
            :key="key"
          >
            <div class="event-name">{{ item?.name }}</div>
            <div class="event-operate flex gap-2 ">
              <a-icon
                size="18"
                class="cursor-pointer hover:text-blue-500"
                @click="onOpenBindEventModal('edit', item.id as 'onClick' | 'onChange')"
                ><icon-settings
              /></a-icon>
              <a-icon size="18" class="cursor-pointer hover:text-blue-500" @click="onDeleteEvent(item.id)"
                ><icon-delete
              /></a-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-scrollbar>
  <BindVariableModal
    ref="BindVariableModalRef"
    :value="(compConfig.props.visible.type as string) === 'JSExpression'? compConfig.props.visible.value: ''"
    @change="onVariableBindChange"
  />
  <BindEventModal
    ref="bindEventModalRef"
    :value="compConfig.eventConfig"
    @change="onBindEvent"
  ></BindEventModal>
</template>
<style lang="less" scoped>
.style-page {
  font-size: 15px;
}
.container {
  border-bottom: 1px solid var(--color-neutral-3);
}
.header {
  border-bottom: 1px dashed var(--color-neutral-3);
}
.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px dashed rgb(var(--primary-6));
  background-color: rgba(var(--primary-6), 0.1);
}
</style>
