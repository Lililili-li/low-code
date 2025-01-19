import { defineStore } from 'pinia'
import router from '../router'

export const useComponentSettingStore = defineStore('componentSetting', {
  state: () => ({
    pageSetting: [
      {
        componentName: 'Page',
        state: {},
        props: {
          colors: [
            "#4992ff",
            "#7cffb2",
            "#fddd60",
            "#ff6e76",
            "#58d9f9",
            "#05c091",
            "#ff8a45",
            "#8d48e3",
            "#dd79ff"
          ]
        },
        id: 1,
        componentList: [],
      },
    ],
    selectComponent: {},
    pageId: Number(router?.currentRoute.value.params.id) as number,
  }),
  getters: {
    getSetting: (state) => state.pageSetting,
    getSelectComponent: (state) => state.selectComponent,
    getCurrentPage: (state) => {
      return state.pageSetting.find(item => item.id === Number(router?.currentRoute.value.params.id))
    }
  },
  actions: {
    removeComponent(id: string) {
      console.log(id)
      let pageInfo = this.pageSetting.find(item => item.id === this.pageId)
      pageInfo!.componentList = pageInfo?.componentList.filter(item => item.id !== id)!
    }
  },
})
