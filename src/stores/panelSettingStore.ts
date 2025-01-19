import { defineStore  } from 'pinia'
export const usePanelSettingStore = defineStore('panelSettingStore', {
  state: () => {
    return {
      panelSetting: {
        thick: 20,
        width: 0,
        height: 0,
        showRuler: true,
        panzoomOption: {
          maxScale: 2,
          minScale: 0.1,
        },
        palette: {
          bgColor: 'transparent',
          longfgColor: '#4d4d4d',
          shortfgColor: '#4d4d4d',
          fontColor: '#4d4d4d',
          shadowColor: '#18181c',
          borderColor: '#666',
          cornerActiveColor: '#18181c'
        },
        isShowReferLine: true,
      },
      panelScale: 1,
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
    getPanelScale: (state) => state.panelScale,
    getCanvasSetting: (state) => state.canvasSetting
  },
  actions: {
    updatePanelSetting(immediately = false) {
      if (immediately) {
        const { width, height } = document.querySelector('.panel')?.getBoundingClientRect() as DOMRect
        this.panelSetting.width = width
        this.panelSetting.height = height
      }else {
        setTimeout(() => {
          const { width, height } = document.querySelector('.panel')?.getBoundingClientRect() as DOMRect
          this.panelSetting.width = width
          this.panelSetting.height = height
        }, 500)
      }
    },
    // 在后端获取到配置然后
    setCanvasSetting(setting: object) {
      this.state.panelSetting = {
        ...this.state.panelSetting,
        ...setting
      }
    }

  }
})
