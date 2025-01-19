<script setup lang="ts">
import { ref } from 'vue'
import { renderIcon } from '@/utils'
import { Copy, Cut, Document, Trash, ArrowUpCircle, ArrowDownCircle } from '@vicons/ionicons5'
import { useComponentSettingStore } from '@/stores/componentSettingStore.ts'

const componentSettingStore = useComponentSettingStore()
const { style, active, componentId } = defineProps(['style', 'active', 'componentId'])
const showDropdown = ref(false)
const dropdownPosition = ref({
  x: 0,
  y: 0,
})
const dropdownOptions = [
  {
    label: '复制',
    icon: renderIcon(Copy),
    key: 'copy'
  },
  {
    label: '粘贴',
    icon: renderIcon(Document),
    key: 'paste'
  },
  {
    label: '剪切',
    icon: renderIcon(Cut),
    key: 'cut'
  },
  {
    label: '置顶',
    icon: renderIcon(ArrowUpCircle),
    key: 'up',
    handle: () => {
      style.zIndex = 9
    }
  },
  {
    label: '置底',
    icon: renderIcon(ArrowDownCircle),
    key: 'down'
  },
  {
    label: '删除',
    icon: renderIcon(Trash),
    key: 'delete',
    handle: () => {
      console.log(componentId, 'id')
      componentSettingStore.removeComponent(componentId)
    }
  },
]
const handleContextMenu = (e: Event) => {
  e.preventDefault()
  showDropdown.value = true
  dropdownPosition.value.x = e.clientX
  dropdownPosition.value.y = e.clientY
}
const onClickOutside = () => {
  showDropdown.value = false
}
const handleSelect = (value: string) => {
  dropdownOptions.find(item => item.key === value)!.handle()
  onClickOutside()
}
</script>

<template>
  <div
    class="component-box absolute"
    :style="{
      zIndex: style.zIndex,
      top: style.top + 'px',
      left: style.left + 'px',
      width: typeof style.width !== 'string' ? style.width + 'px' : style.width,
      height: typeof style.height !== 'string' ? style.height + 'px' : style.height,
    }"
    @contextmenu="handleContextMenu"
    data-type="component"
  >
    <div
      class="box absolute h-full w-full"
    >
      <slot></slot>
    </div>
    <div
      :class="['change-box absolute h-full w-full', active ? 'active' : '']"
      data-type="component"
      v-show="active"
    ></div>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      :options="dropdownOptions"
      :show="showDropdown"
      :on-clickoutside="onClickOutside"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped lang="less">
.box {
  z-index: 1;
}

.change-box {
  z-index: 2;
  cursor: grab;
}

.active {
  border: 2px solid red;
  background: rgba(255, 0, 0 , .1);
}
</style>
