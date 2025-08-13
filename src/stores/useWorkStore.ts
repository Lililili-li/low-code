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
  const undo = () => {
    const item = historyList.value.shift()
    if (item) {
      redoList.value.push(item)
      handleCompChange(item!, 'undo')
    }
  }
  const handleCompChange = (item: WorkType, type: 'undo' | 'redo') => {
    switch (item.type) {
      case 'create':
        if (type === 'redo') {
          return pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
        }
        pageConfigStore.getCurrentPage()!.componentList = componentList.value!.filter(comp => comp.id !== item.componentId[0])
        break;
      case 'delete':
        if (type === 'redo') {
          return pageConfigStore.getCurrentPage()!.componentList = componentList.value!.filter(comp => comp.id !== item.componentId[0])
        }
        pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
        break;
      case 'shape':
        if (item.componentId.length === 0) return;
        item.componentId.forEach(id => {
          const activeComp = pageConfigStore.getCurrentPage()!.componentList.find(comp => comp.id === id)
          if (activeComp?.type === 'group') {
            activeComp!.children?.forEach(child => {
              child.style = {
                ...child.style,
                ...item.position![activeComp.id]['children'][child.id][type === 'redo' ? 'end' : 'start']
              }
            })
          }
          if (type === 'redo') {
            return activeComp!.style = item.position![activeComp?.id!]['end']
          }
          activeComp!.style = {
            ...activeComp!.style,
            ...item.position![activeComp?.id!]['start']
          }
        })
        break;
      case 'group':
        if (type === 'redo') {
          pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
          pageConfigStore.getCurrentPage()!.componentList = pageConfigStore.getCurrentPage()!.componentList.filter(comp => !(item.props as IComponentType).children?.find(child => child.id === comp.id))
          return
        }
        // pageConfigStore.getCurrentPage()!.componentList.push(item.props as IComponentType)
        pageConfigStore.getCurrentPage()!.componentList = [
          ...pageConfigStore.getCurrentPage()!.componentList,
          ...(item.props as IComponentType).children!
        ]
        pageConfigStore.getCurrentPage()!.componentList = componentList.value!.filter(comp => comp.id !== item.componentId[0])
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
