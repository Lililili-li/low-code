<script setup lang="tsx">
import { usePageConfigStore } from "@/stores/usePageConfigStore"
import { useComponentConfigStore } from "@/stores/useComponentConfigStore"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref } from "vue"
import CompList from "./CompList.vue"
import { Folder, FolderOpen } from "@vicons/ionicons5"
import useLayers from "@/hooks/useLayers"
import type { IComponentType } from "@/types/component.d"
import bus from "@/utils/bus"

const { removeLayer, changeVisible, onLayerHover, onLayerLeave, dropdownOptions } = useLayers()

const { currentPage } = storeToRefs(usePageConfigStore())
const { setActiveComponent, clearSelectGroupComponent, removeActiveComponent } =
  useComponentConfigStore()
const { activeComponent, selectIds, hoverIds } = storeToRefs(useComponentConfigStore())

const componentsList = computed(() => {
  return currentPage.value?.componentList
})

const expendIds = ref<string[]>([])
const onSelectComponent = (data: IComponentType, event: MouseEvent) => {
  event.preventDefault()
  if (event.shiftKey) {
    removeActiveComponent()
    selectIds.value.push(data.id)
  } else {
    if (data.type === "group") {
      removeActiveComponent()
      setActiveComponent(data)
      selectIds.value.push(data.id)
    } else {
      clearSelectGroupComponent()
      setActiveComponent(data)
    }
  }
  bus.emit("openAttribute", true)
}
onMounted(() => {})
</script>
<template>
  <div class="layers">
    <div class="operate-list pr-3 pl-3 flex justify-between pb-3">
      <div
        class="operate-item flex gap-2 items-center cursor-pointer"
        v-for="(item, index) in dropdownOptions.filter(item => item.key !== 'delete')"
        @click="
          item.handle
            ? item.handle(componentsList.find((item) => item.id === activeComponent?.id))
            : null
        "
        v-show="
          componentsList.find((item) => item.id === activeComponent?.id)?.type === 'component'
            ? item?.key !== 'removeGroup'
            : true
        "
      >
        <a-tooltip :content="item.label">
          <component :is="item.icon" style="font-size: 18px"></component>
        </a-tooltip>
        <span class="line" v-if="index !== dropdownOptions.length - 2"></span>
      </div>
    </div>
    <div class="layers-container">
      <a-scrollbar
        style="height: calc(100vh - 145px); overflow: auto"
        class="pl-2 pr-2 flex flex-col gap-2 pt-2"
      >
        <template v-if="componentsList && componentsList.length > 0">
          <div
            class="layers-item flex items-center gap-3 cursor-pointer"
            v-for="item in componentsList"
            :key="item.id"
            :data-comp-id="item.id"
          >
            <div
              class="single-item w-full p-1 pl-2 pr-2"
              :class="[
                item.id === activeComponent?.id ? 'active' : '',
                hoverIds.includes(item.id) ? 'hover' : '',
                selectIds.includes(item.id) ? 'hover' : '',
              ]"
              v-if="item.type === 'component'"
              @click.left.stop="onSelectComponent(item, $event)"
              @mouseenter="() => onLayerHover(item.id)"
              @mouseleave="() => onLayerLeave(item.id)"
            >
              <CompList :component="item" type="single" />
            </div>
            <div
              class="group w-full p-1 pl-2 pr-2"
              @click.left.stop="onSelectComponent(item, $event)"
              :class="[
                hoverIds.includes(item.id) ? 'hover' : '',
                selectIds.includes(item.id) ? 'hover' : '',
              ]"
              @mouseenter="() => onLayerHover(item.id)"
              @mouseleave="() => onLayerLeave(item.id)"
              v-else
            >
              <div class="folder flex justify-between">
                <div class="flex items-center gap-2">
                  <button
                    @click.stop="
                      expendIds.includes(item.id)
                        ? expendIds.splice(expendIds.indexOf(item.id), 1)
                        : expendIds.push(item.id)
                    "
                  >
                    <a-icon size="18">
                      <Folder v-if="expendIds.includes(item.id)" />
                      <FolderOpen v-else />
                    </a-icon>
                  </button>
                  <span :class="selectIds.includes(item.id) ? 'active' : ''">
                    {{ item.name }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="item.children?.some((child) => child.props.visible.value)">
                    <IconEye size="16" @click.stop="changeVisible(item, false, true)" />
                  </button>
                  <button v-else>
                    <IconEyeInvisible
                      size="16"
                      style="color: rgba(var(--primary-6))"
                      @click.stop="changeVisible(item, true, true)"
                    />
                  </button>
                  <button>
                    <IconDelete size="16" @click.stop="removeLayer(item.id)" />
                  </button>
                </div>
              </div>
              <div class="children mt-2 flex flex-col gap-2" v-show="!expendIds.includes(item.id)">
                <div
                  class="children-item p-1 pl-2 pr-2"
                  v-for="child in item.children"
                  :key="child.id"
                  @click.left.stop="onSelectComponent(child, $event)"
                >
                  <CompList :component="child" type="group" />
                </div>
              </div>
            </div>
            <!-- <Dropdown>

              <template #content>
                <DropdownItem
                  v-for="option in layerDropdownOptions"
                  :key="option.key"
                  @click="option.handle ? option.handle(item) : null"
                  v-show="item.type === 'component' ? option.key !== 'removeGroup' : true"
                >
                  <div class="flex items-center gap-1">
                    <component :is="option.icon"></component>
                    <span>{{ option.label }}</span>
                  </div>
                </DropdownItem>
              </template>
            </Dropdown> -->
          </div>
        </template>
        <template v-else>
          <Empty />
        </template>
      </a-scrollbar>
    </div>
  </div>
</template>
<style scoped lang="less">
.operate-list {
  border-bottom: 1px solid var(--color-neutral-3);
  height: 30px;
  .operate-item {
    transition: all 0.3s;
    justify-content: center;
    &:hover {
      color: rgba(var(--primary-6));
    }
    .line {
      width: 1px;
      height: 15px;
      display: block;
      background-color: #666;
    }
  }
}
.single-item {
  border: 1px solid #666;
  border-radius: 4px;
  transition: all 0.3s;
  user-select: none;
}
.hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.group {
  border: 1px solid #666;
  border-radius: 4px;
  transition: all 0.3s;
  .active {
    color: rgba(var(--primary-6));
  }
  .children-item {
    border-radius: 4px;
    transition: all 0.3s;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
.disabled {
  pointer-events: none;
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
