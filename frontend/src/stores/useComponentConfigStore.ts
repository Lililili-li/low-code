import { defineStore } from 'pinia'
import type { ChartIProps, IComponentType } from '@/types/component.d'
import { usePageConfigStore } from './usePageConfigStore';

export const useComponentConfigStore = defineStore('componentConfig', {
  state: () => ({
    activeComponent: {} as IComponentType | undefined,
    selectIds: [] as string[],
    hoverIds: [] as string[],
  }),
  getters: {

  },
  actions: {
    setActiveComponent(componentInfo: IComponentType) {
      const pageConfigStore = usePageConfigStore()
      if (componentInfo.componentType === 'chart') {
        if (componentInfo.type === 'component') {
          (componentInfo.props as ChartIProps).option.color = pageConfigStore.currentPage?.props.theme.colors
        }
      }
      // 将所有组件的active状态设置为false
      this.activeComponent = componentInfo
      this.selectIds = this.selectIds.filter(id => id === componentInfo.id)
    },
    removeActiveComponent() {
      this.activeComponent = undefined
    },
    setComponentClassName(name: string) {
      this.activeComponent!.props.animationName = name
    },
    handleSelectGroupComponent(area: { left: number, top: number, width: number, height: number }, componentList: IComponentType[]) {
      componentList.forEach(item => {
        const compLeft = item.style.left as number
        const compTop = item.style.top as number
        const compWidth = item.style.width as number
        const compHeight = item.style.height as number
        const leftBound = area.left <= compLeft
        const topBound = area.top <= compTop
        const rightBound = compLeft + compWidth <= area.left + area.width
        const bottomBound = compTop + compHeight <= area.top + area.height
        if (leftBound && topBound && rightBound && bottomBound) {
          if (!this.selectIds.includes(item.id)) this.selectIds.push(item.id)
        } else {
          this.selectIds = this.selectIds?.filter(data => data !== item.id)
        }
      })
      if (this.selectIds.length === 1) {
        this.activeComponent = componentList.find(item => item.id === this.selectIds[0])!
        this.selectIds = []
      } else {
        this.removeActiveComponent()
      }
    },
    clearSelectGroupComponent() {
      this.selectIds = []
    },

  },
})
