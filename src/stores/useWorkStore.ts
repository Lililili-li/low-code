/**
 * 后期增加回退功能
 */

import type { WorkType } from "@/types/work.d"
import { computed, ref } from "vue"
import { usePageConfigStore } from "./usePageConfigStore"
import { defineStore } from "pinia"
import type { IComponentType } from "@/types/component.d"


export const useWorkStore = defineStore('workStore', () => {
  const historyList = ref<WorkType[]>([])
  const redoList = ref<WorkType[]>([])
  const pageConfigStore = usePageConfigStore()
  const componentList = computed(() => pageConfigStore.getCurrentPage()?.componentList)
  const addHistory = (item: WorkType) => {
    // 如果已满100条，移除最早的一条
    if (historyList.value.length === 100) {
      historyList.value.pop();
    }
    historyList.value.unshift(item);
  }
  // 撤销
  const undo = (id?: string | number) => {
    if (id) {
      const index = historyList.value.findIndex(item => item.id === id)
      if (index !== -1) {
        const item = historyList.value[index]
        historyList.value.splice(index, 1)
        redoList.value.push(item)
        handleCompChange(item, 'undo')
      }
    } else {
      const item = historyList.value.shift()
      if (item) {
        redoList.value.push(item)
        handleCompChange(item!, 'undo')
      }
    }
  }
  const handleCompChange = (item: WorkType, type: 'undo' | 'redo') => {
    switch (item.type) {
      case 'create':
        if (type === 'redo') {
          return pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
        }
        pageConfigStore.getCurrentPage()!.componentList = componentList.value!.filter(comp => comp.id !== item.componentId)
        break;
      case 'delete':
        if (type === 'redo') {
          return pageConfigStore.getCurrentPage()!.componentList = componentList.value!.filter(comp => comp.id !== item.componentId)
        }
        pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
        break;
      case 'move':
        const activeComp = pageConfigStore.getCurrentPage()!.componentList.find(comp => comp.id === item.componentId)
        if (type === 'redo') {
          return activeComp!.style = (item.props as any).end
        }
        activeComp!.style = {
          ...activeComp!.style,
          ...(item.props as any).start
        }
        break;
      default:
        break;
    }
  }
  // 恢复
  const redo = () => {
    const item = redoList.value.pop()
    if (item) {
      historyList.value.unshift(item)
      handleCompChange(item!, 'redo')
    }
  }
  return {
    historyList,
    redoList,
    addHistory,
    undo,
    redo
  }
})
