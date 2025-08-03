import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IDataSource } from "@/types/dataSource";
import message from '@/utils/message';
import { usePageConfigStore } from './usePageConfigStore';
import { generateUUID } from '@/utils';

export const useDataSourceStore = defineStore('dataSource', () => {
  // 页面state用于存储变量 供外部使用
  const dataSourceList = ref<IDataSource[]>([])

  const setDataSourceList = (schema: IDataSource[]) => {
    dataSourceList.value = JSON.parse(JSON.stringify(schema))
  }
  const getDataSourceList = () => {
    return dataSourceList.value
  }

  const addDataSourceList = (dataSource: IDataSource) => {
    dataSource.id = generateUUID()
    if (dataSourceList.value.find(item => item.name === dataSource.name)) return message.error('数据源名称重复')
    dataSourceList.value.push(dataSource)
    updateDataSourceSchema()
  }
  const editDataSource = (dataSource: IDataSource) => {
    dataSourceList.value = dataSourceList.value.map(item => item.id === dataSource.id ? dataSource : item)
    updateDataSourceSchema()
  }

  const removeDataSource = (id: string | number) => {
    dataSourceList.value = dataSourceList.value.filter(item => item.id !== id)
    updateDataSourceSchema()
  }

  const updateDataSourceSchema = () => {
    const pageConfigStore = usePageConfigStore()
    pageConfigStore.setPageDataSource(dataSourceList.value)
  }
  return {
    dataSourceList,
    setDataSourceList,
    addDataSourceList,
    editDataSource,
    removeDataSource,
    getDataSourceList
  }
})
