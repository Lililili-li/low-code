<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import Empty from "@/components/Empty/index.vue";
import AddVariable from "./AddVariable.vue";
import { useVariableStore } from "@/stores/useVariableStore";
import { storeToRefs } from "pinia";
import type { IVariableType } from "@/types/variable";

const addVariableRef = ref<InstanceType<typeof AddVariable>>();
const { variableList } = storeToRefs(useVariableStore());
const { removeVariable } = useVariableStore();
const paramsDrawerVisible = ref(false);
const openType = ref("add");
const onOpenVariableModal = (type: string, item?: IVariableType) => {
  paramsDrawerVisible.value = true;
  openType.value = type;
  addVariableRef.value?.onOpenVariableDrawer(item as IVariableType, type);
};
const isFullscreen = ref(false);
const handleFullscreen = (value: boolean) => {
  isFullscreen.value = value;
};
const drawerStyle = computed(() => {
  let width: string | number = 0;
  if (isFullscreen.value) {
    width = "calc(100vw - 700px)";
  } else if (paramsDrawerVisible.value) {
    width = "400px";
  }
  return {
    width,
    opacity: paramsDrawerVisible.value ? "1" : "0",
  };
});

const queryVariableData = reactive({
  name: "",
  type: "page",
});
const showVariableList = computed(() => {
  return queryVariableData.type === "page"
    ? variableList.value.filter(
        (item) => item.isGlobal === false && item.key.indexOf(queryVariableData.name) > -1
      )
    : variableList.value.filter(
        (item) => item.isGlobal === true && item.key.indexOf(queryVariableData.name) > -1
      );
});
</script>
<template>
  <div class="variable">
    <div class="search pr-3 pl-3 pb-3">
      <a-space direction="vertical" style="width: 100%">
        <a-input-group>
          <a-select
            :options="[
              {
                label: '页面变量',
                value: 'page',
              },
              {
                label: '全局变量',
                value: 'global',
              },
            ]"
            :style="{ width: '120px' }"
            v-model="queryVariableData.type"
          />
          <a-input-search
            placeholder="请输入变量名称"
            allow-clear
            v-model="queryVariableData.name"
          />
        </a-input-group>
        <a-button @click="onOpenVariableModal('add')" class="w-full">
          <template #icon>
            <icon-plus />
          </template>
          添加变量
        </a-button>
      </a-space>
    </div>
    <div class="variable-container">
      <template v-if="showVariableList.length > 0">
        <a-scrollbar style="height: calc(100vh - 200px); overflow: auto">
          <div class="variable-list p-1">
            <div
              class="variable-item p-2"
              v-for="item in showVariableList"
              :key="item.id"
            >
              <div class="meta flex justify-between">
                <div
                  @click.stop="onOpenVariableModal('view', item)"
                  class="cursor-pointer"
                >
                  <div class="name flex items-center gap-1">
                    <span class="mr-2">{{ item.key }}</span>
                  </div>
                  <div class="description">
                    {{ item.type }}
                  </div>
                </div>
                <div class="actions">
                  <a-space>
                    <a-tooltip
                      content="修改"
                      position="bottom"
                      @click.stop="onOpenVariableModal('edit', item)"
                    >
                      <icon-edit size="15" class="cursor-pointer icon" />
                    </a-tooltip>
                    <a-tooltip
                      content="复制"
                      position="bottom"
                      @click.stop="onOpenVariableModal('copy', item)"
                    >
                      <icon-copy size="15" class="cursor-pointer icon" />
                    </a-tooltip>
                    <a-tooltip content="删除" position="bottom">
                      <a-popconfirm
                        content="是否确认删除此变量?"
                        @ok="removeVariable(item.id as number)"
                      >
                        <icon-delete size="15" class="cursor-pointer icon" />
                      </a-popconfirm>
                    </a-tooltip>
                  </a-space>
                </div>
              </div>
            </div>
          </div>
        </a-scrollbar>
      </template>
      <template v-else>
        <Empty />
      </template>
    </div>
    <div class="drawer absolute overflow-hidden" :style="drawerStyle">
      <AddVariable
        @on-close-drawer="
          () => {
            paramsDrawerVisible = false;
            isFullscreen = false;
          }
        "
        :is-fullscreen="isFullscreen"
        @on-fullscreen="handleFullscreen"
        :type="openType"
        ref="addVariableRef"
      />
    </div>
  </div>
</template>
<style scoped lang="less">
.search {
  border-bottom: 1px solid var(--color-neutral-3);
}

.variable-item {
  transition: all 0.3s;
  border-radius: 4px;
  .meta {
    .name {
      font-size: 15px;
      font-weight: bold;
      transition: all 0.3s;
      &:hover {
        color: rgb(var(--primary-6));
      }
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
}

.drawer {
  left: 100%;
  top: 0;
  width: 300px;
  height: 100%;
  background: var(--color-menu-light-bg);
  z-index: 1000;
  transition: opacity 0.3s ease, width 0.3s ease;
  color: #333;
  box-shadow: 6px 0 3px 0 rgba(0, 0, 0, 0.3);
}
</style>
