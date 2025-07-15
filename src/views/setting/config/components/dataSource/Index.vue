<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import AddDataSource from "./AddDataSource.vue"
import type { IDataSource } from "@/types/dataSource"
import { useVariableStore } from "@/stores/useVariableStore"
import { usePageConfigStore } from "@/stores/usePageConfigStore"
import Empty from "@/components/Empty/index.vue";
import { useDataSourceStore } from "@/stores/useDataSourceStore"
import message from "@/utils/message"
import { getVariableValue } from "../variable/util"
const addDataSourceRef = ref<InstanceType<typeof AddDataSource>>();

const variableConfStore = useVariableStore()
const pageConfigStore = usePageConfigStore()
const dataSourceStore = useDataSourceStore()

const paramsDrawerVisible = ref(false)
const drawerStyle = computed(() => ({
  width: paramsDrawerVisible.value ? "700px" : "0",
  opacity: paramsDrawerVisible.value ? "1" : "0",
}))
const openType = ref('')
const onOpenInterfaceModal = (type: "add" | "edit" | "check" | "copy", item?: IDataSource) => {
  openType.value = type
  paramsDrawerVisible.value = true
  addDataSourceRef.value?.onOpenVariableDrawer(item as IDataSource, type);
}
const removeInterface = (id: number | string) => {
  dataSourceStore.removeDataSource(id)
  message.success('删除成功')
}


onMounted(() => {
  variableConfStore.getVariableTreeList()
  dataSourceStore.setDataSourceList(pageConfigStore.getPageDataSource())
})
</script>
<template>
  <div class="search pr-3 pl-3 pb-3">
    <a-space direction="vertical" style="width: 100%">
      <a-input placeholder="搜索接口">
        <template #suffix>
          <icon-search />
        </template>
      </a-input>
      <a-button class="w-full" @click="onOpenInterfaceModal('add')">
        <template #icon>
          <icon-plus />
        </template>
        添加接口
      </a-button>
    </a-space>
  </div>
  <div class="list p-1 pt-0">
    <a-scrollbar style="height: calc(100vh - 220px); overflow: auto">
      <div class="interface-list p-1" v-if="dataSourceStore.dataSourceList.length > 0">
        <div
          class="interface-item p-2 flex flex-col gap-1"
          v-for="item in dataSourceStore.dataSourceList"
          :key="item.id"
        >
          <div class="meta flex justify-between items-center">
            <div class="name flex items-center gap-1">
              {{ item.name }}
            </div>
            <div class="actions">
              <a-space>
                <a-tooltip
                  content="修改"
                  position="bottom"
                  @click="onOpenInterfaceModal('edit', item)"
                >
                  <icon-edit size="15" class="cursor-pointer icon" />
                </a-tooltip>
                <a-tooltip
                  content="复制"
                  position="bottom"
                  @click="onOpenInterfaceModal('copy', item)"
                >
                  <icon-copy size="15" class="cursor-pointer icon" />
                </a-tooltip>
                <a-tooltip content="删除" position="bottom">
                  <a-popconfirm content="是否确认删除此变量?" @ok="removeInterface(item.id)">
                    <icon-delete size="15" class="cursor-pointer icon" />
                  </a-popconfirm>
                </a-tooltip>
              </a-space>
            </div>
          </div>
          <div class="description flex justify-between">
            <span style="max-width: 80%" class="overflow-hidden text-ellipsis whitespace-normal">{{
              item.base.url.type === "normal"
                ? (item.base.url.value?item.base.url.value: '/') + item.options.url
                : getVariableValue(item.base.url.value, variableConfStore) + item.options.url
            }}</span>
            <span :class="item.options.method">{{ item.options.method }}</span>
          </div>
        </div>
      </div>
      <Empty v-else/>
    </a-scrollbar>
  </div>
  <div class="drawer absolute overflow-hidden" :style="drawerStyle">
    <AddDataSource @onCloseDrawer="paramsDrawerVisible = false" :type="openType" ref="addDataSourceRef"/>
  </div>
</template>
<style scoped lang="less">
.search {
  border-bottom: 1px solid var(--color-neutral-3);
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
.drawer {
  left: 100%;
  top: 0;
  width: 300px;
  height: 100%;
  background: var(--color-menu-light-bg);
  z-index: 1000;
  transition:
    opacity 0.3s ease,
    width 0.3s ease;
  color: #333;
  box-shadow: 6px 0 3px 0 rgba(0, 0, 0, 0.3);
}
</style>
