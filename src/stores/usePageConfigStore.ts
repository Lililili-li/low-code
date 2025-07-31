import { defineStore } from 'pinia'
import type { IComponentType } from '@/types/component.d'
import type { IDataSource } from '@/types/dataSource'
import { useVariableStore } from './useVariableStore'
import type { IStateType } from '@/types/variable'
import type { IPage } from '@/types/page'
import axios from 'axios'
import { useDataSourceStore } from './useDataSourceStore'

export const usePageConfigStore = defineStore('pageConfig', {
  state: () => ({
    pageSetting: {

    } as IPage,
    pageConf: {
      projectId: '',
      pageId: 1,
      pageName: '',
      schema: '',
    }
  }),
  getters: {
    currentPage: (state) => {
      return state.pageSetting
    },
  },
  actions: {
    getCurrentPage() {
      return this.pageSetting
    },
    setPageConfig(config) {
      this.pageSetting = {...this.pageSetting, ...config}
      // this.initPageState(config.state)
    },
    addComponent(componentInfo: IComponentType) {
      const currentPage = this.getCurrentPage()
      currentPage?.componentList.push(componentInfo)
    },
    removeComponent(ids: string | string[]) {
      const currentPage = this.getCurrentPage()
      if (Array.isArray(ids)) {
        currentPage!.componentList = currentPage?.componentList.filter(item => !ids.includes(item.id))!
      } else {
        currentPage!.componentList = currentPage?.componentList.filter(item => item.id !== ids)!
      }
    },
    setPageTheme(theme) {
      let originConfig = this.getCurrentPage()
      originConfig!.props.theme = theme
      originConfig!.componentList = originConfig!.componentList.map(item => {
        if (item.props.option) {
          item.props.option.color = theme.colors
        }
        return item
      })
    },
    setState(state: IStateType) {
      let currentPage = this.getCurrentPage()
      currentPage!.state = state
      this.pageConf.schema = JSON.stringify(this.pageSetting, null, 2)
    },
    getPageState() {
      let currentPage = this.getCurrentPage()
      return currentPage!.state
    },
    setPageDataSource(source: IDataSource[]) {
      let currentPage = this.getCurrentPage()
      currentPage!.dataSource = source
      this.pageConf.schema = JSON.stringify(this.pageSetting, null, 2)
    },
    getPageDataSource() {
      let currentPage = this.getCurrentPage()
      return currentPage!.dataSource
    },
    async getPageData() {
      const variableStore = useVariableStore()
      const dataSourceStore = useDataSourceStore()
      const { data: res } = await axios.get('/project/1/page/1')
      if (res.code === 200) {
        this.pageSetting = JSON.parse(res.data.schema)
        this.pageConf = {...res.data, schema: JSON.stringify(JSON.parse(res.data.schema), null, 2)}
        variableStore.setVariableList(this.pageSetting.state)
        dataSourceStore.setDataSourceList(this.getPageDataSource())
      }
    }
  }
})
