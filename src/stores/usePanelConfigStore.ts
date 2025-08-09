import { defineStore } from 'pinia'
import type { PanelSettingType, panelScaleConfType } from '@/types/panel'

export const usePanelConfigStore = defineStore('panelConfig', {
  state: () => {
    return {
      panelSetting: {
        thick: 20,
        width: 0,
        height: 0,
        paddingRatio: 0.05,
        showRuler: true,
        gridRatio: 1,
        showShadowText: false,
        startX: 0,
        startY: 0,
        palette: {
          bgColor: "transparent",
          longfgColor: "#4d4d4d",
          shortfgColor: "#4d4d4d",
          fontColor: "#999",
          shadowColor: "#18181c",
          borderColor: "#18181c",
          cornerActiveColor: "#18181c",
        },
        isShowReferLine: true,
        panzoomOption: {
          canvas: true,
          animate: true,
          maxScale: 2,
          minScale: 0.1,
          disableZoom: false,
          step: 0.05,
        },
      } as PanelSettingType,
      panelScaleConf: {
        scale: 1,
      } as panelScaleConfType,
      // 默认配置
      canvasSetting: {
        width: 1920,
        height: 1080,
        backgroundColor: '#232324',
        useImage: 2,
        thumbnailUrl: undefined as undefined | string,
        backgroundUrl: undefined as undefined | string
      }
    }
  },
  getters: {
    getPanelScale: (state) => state.panelScaleConf.scale,
    getCanvasSetting: (state) => state.canvasSetting
  },
  actions: {
    updatePanelSetting(immediately = false) {
      if (immediately) {
        const { width, height } = document.querySelector('#screens')?.getBoundingClientRect() as DOMRect
        this.panelSetting.width = width
        this.panelSetting.height = height
      } else {
        setTimeout(() => {
          const { width, height } = document.querySelector('#screens')?.getBoundingClientRect() as DOMRect
          this.panelSetting.width = width
          this.panelSetting.height = height
        }, 500)
      }
    },
    // 在后端获取到配置然后
    setCanvasSetting(setting: object) {
      this.panelSetting = {
        ...this.panelSetting,
        ...setting
      }
    },

    lockRatio() {
      this.panelScaleConf.disableZoom = !this.panelScaleConf.disableZoom
    },
    setPanelScale(scale: number) {
      this.panelScaleConf.scale = scale
    }

  }
})
