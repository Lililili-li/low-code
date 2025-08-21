import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useLayersStore = defineStore('layersStore', () => {
  // 页面state用于存储变量
  const layerState = reactive({
    clipboardContent: '' , // 剪切板内容
    curCompId: '' as string | null, // 当前右键选中组件id
    pasteType: 'copy', // 剪切板类型，copy或cut
    cutCompId: '' as string | null, // 剪切板组件id
  })
  const setClipboardContent = (content: string) => {
    layerState.clipboardContent = content
  }
  const getClipboardContent = () => {
    return layerState.clipboardContent
  }
  const clearClipboardContent = () => {
    layerState.clipboardContent = ''
  }
  // 设置当前右键选中组件id
  const setCurCompId = (id: string | null) => {
    layerState.curCompId = id
  }
  const clearCurCompId = () => {
    layerState.curCompId = null as null
  }
  // 获取当前右键选中组件id
  const getCurCompId = () => {
    return layerState.curCompId
  }
  const setCutCompId = (id: string | null) => {
    layerState.cutCompId = id
  }
  const getCutCompId = () => {
    return layerState.cutCompId
  }
  return {
    layerState,
    setClipboardContent,
    getClipboardContent,
    clearClipboardContent,
    clearCurCompId,
    setCurCompId,
    getCurCompId,
    setCutCompId,
    getCutCompId
  }
})
