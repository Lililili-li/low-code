import { EVariableData } from "./../types/variable.d";
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import type { IStateType, IVariableType } from '@/types/variable'
import { Message } from '@arco-design/web-vue'
import { usePageConfigStore } from './usePageConfigStore'
import { generateUUID } from "@/utils";
import { useProjectStore } from "./useProjectStore";

export const useVariableStore = defineStore('variable', () => {
  // 页面state用于存储变量 供外部使用
  const state = ref({})
  const globalState = ref({})
  const setState = (data: Record<string, any>, type: 'global' | 'state' = 'state') => {
    if (type === 'global') {
      globalState.value = {
        ...globalState.value,
        ...data
      }
    } else {
      state.value = {
        ...state.value,
        ...data
      }
    }
  }

  const getState = (type: 'global' | 'state' = 'state') => {
    return type === 'state' ? state.value : globalState.value
  }

  watch(state, (n) => {
    console.log('state变化------', n);
    // 和之前数据进行比较
    // 动态更新数结构，列表结构以及page的schema结构
  }, {
    deep: true
  })

  const variableList = ref<IVariableType[]>([])
  // 设置变量列表
  const setVariableList = async (stateObject: IStateType, type: 'global' | 'state' = 'state') => {
    let states = {}
    for (let key in stateObject) {
      if (!stateObject[key]) return
      variableList.value.push({
        type: stateObject[key].type,
        key: key,
        value: stateObject[key].type === EVariableData.OBJECT ? JSON.stringify(stateObject[key].value, null, 2) : stateObject[key].value,
        id: stateObject[key].id,
        isGlobal: type === 'global',
      })
      states[key] = stateObject[key].value
    }
    setState(states, type)
  }
  // 添加变量
  const addVariable = (variable: IVariableType) => {
    if (variableList.value.find(item => item.key === variable.key && item.isGlobal === variable.isGlobal)) return Message.error('变量名称已存在')
    variableList.value.push(variable)
    saveVariable()
    Message.success('添加成功')
  }
  // 删除变量
  const removeVariable = (id: number) => {
    variableList.value = variableList.value.filter(item => item.id !== id)
    Message.success('删除成功')
  }
  // 修改变量
  const editVariable = (variable: IVariableType) => {
    variableList.value = variableList.value.map(item => item.id === variable.id ? variable : item)
    saveVariable()
    Message.success('修改成功')
  }
  // 保存变量到state中，在存到pageSchema或者globalSchema中
  const saveVariable = async () => {
    const pageConfigStore = usePageConfigStore()
    const projectStore = useProjectStore()
    const result = {} as IStateType
    const globalResult = {} as IStateType
    variableList.value.forEach(variable => {
      let states = {}
      const obj = {
        id: variable.id,
        isGlobal: variable.isGlobal,
        type: variable.type as EVariableData,
        value: variable.type === 'object' ? JSON.parse(variable.value) : variable.value,
      }
      if (!variable.isGlobal) {
        result[variable.key] = obj
      } else {
        globalResult[variable.key] = obj
      }
      states[variable.key] = variable.type === 'object' ? JSON.parse(variable.value) : variable.value
      setState(states, variable.isGlobal ? 'global' : 'state')
    })
    pageConfigStore.setState(result)
    projectStore.setState(globalResult)
  }
  const traverseObject = (data: Record<string, any>, container: any[]) => {
    for (let key in data) {
      const value = data[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        const child = {
          label: key,
          value: key,
          children: []
        };
        container.push(child);
        traverseObject(value, child.children);
      } else {
        container.push({
          label: key,
          value: key,
        });
      }
    }
  };
  const getVariableTreeList = () => {
    const result = [
      {
        label: 'global',
        value: 'global',
        children: []
      },
      {
        label: 'state',
        value: 'state',
        children: []
      }
    ] as {
      label: string
      value: string
      children?: any[]
    }[]
    variableList.value.forEach(item => {
      const obj = {
        label: item.key,
        value: item.key,
      } as {
        label: string
        value: string
        children?: any[]
      }
      if (item.type === 'object') {
        obj.children = []
        traverseObject(JSON.parse(item.value), obj.children)
      }
      item.isGlobal ? result.find(item => item.value === 'global')!['children']!.push(obj) : result.find(item => item.value === 'state')!['children']!.push(obj)
    })
    return result
  }

  return {
    variableList,
    setVariableList,
    addVariable,
    removeVariable,
    editVariable,
    saveVariable,
    state,
    setState,
    getState,
    getVariableTreeList
  }
})
