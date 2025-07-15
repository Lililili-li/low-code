import type { IDataSource, IEvent } from "@/types/dataSource"
import { getFunctionBody } from "@/utils"
import { cloneDeep } from "lodash-es"
import { toRaw } from "vue"
import { useVariableStore } from "@/stores/useVariableStore"
import { getVariableValue } from "../variable/util"
enum EParams {
  Normal = "normal",
  JSExpression = "JSExpression",
}
export const interfaceEventMap = {
  handleParams: {
    type: "JSFunction",
    value:
      "function handleParams(params) { \n //务必要将params返回 \n  console.log('处理参数.....');\n  return params; \n}",
  },
  handleSuccess: {
    type: "JSFunction",
    value:
      "function handleSuccess(res, state) { \n //如需查看结果，需将res返回 \n  console.log('处理返回后的结果.....');\n  return res; \n}",
  },
  handleError: {
    type: "JSFunction",
    value:
      "function handleError(error, message) { \n //如需查看结果，需将error返回 \n  console.log('处理错误结果.....');\n  return error; \n}",
  },
};

// 将vo中的数组元素转化为对象元素
const handleTransformHeaders2Obj = (headers: any) => {
  if (!headers) return {}
  return headers.reduce((acc, item) => {
    acc[item.key] = {
      type: item.value.type,
      value: item.value.value,
    }
    return acc
  }, {})
}
const handleTransformParams2Arr = (params: any) => {
  if (!params) return []
  const result = [] as any
  for (let key in params) {
    result.push({
      key,
      value: {
        type: params[key].type,
        value: params[key].value,
      }
    })
  }
  return result
}


export const handleTransformParams2Schema = (params: any) => {
  const copyParams = cloneDeep(params)
  copyParams.base.headers = handleTransformHeaders2Obj(copyParams.base.headers)
  copyParams.options.headers = handleTransformHeaders2Obj(copyParams.options.headers)
  return copyParams
}

export const handleTransformSchema2Params = (params: any) => {
  const copyParams = cloneDeep(params)
  copyParams.base.headers = handleTransformParams2Arr(copyParams.base.headers)
  copyParams.options.headers = handleTransformParams2Arr(copyParams.options.headers)
  copyParams.options.params = handleTransformParams2Arr(copyParams.options.params)
  return copyParams
}



// 测试连接处理函数
export const handleParamsForSend = (params: any, eventMap: (IEvent & { name: string })[]) => {
  const copyParams = cloneDeep(params)
  const variableStore = useVariableStore()
  let result = {
    url: '',
    method: '',
    headers: {},
    timeout: 0,
    params: {},
    data: undefined
  }
  for (let key in result) {
    result[key] = copyParams[key]
    if (key === 'url') {
      result[key] = params.base.url.type === EParams.JSExpression ? getVariableValue(params.base.url.value, variableStore) + copyParams.options.url : params.base.url.value + copyParams.options.url
      console.log(result[key]);
    }
    if (key === 'headers') {
      result[key] = handleTransformParams([...toRaw(params.base.headers), ...copyParams.options.headers])
    }
    if (key === 'params') {
      result[key] = handleTransformParams(copyParams.options.params)
    }
  }
  handleDataType(result, copyParams)
  if (result.method === 'GET') {
    delete result.data
  }
  const eventData = eventMap.find(item => item.name === 'handleParams')
  if (eventData) {
    const handleParams = new Function('params', getFunctionBody(eventData?.value!));
    result.params = handleParams({ ...result.params, ...(result.data || {}) })
  }
  return result
}
const handleDataType = (result, originData) => {
  switch (originData.dataType) {
    case 'none':
      result['data'] = {}
      break;
    case 'json':
      result['data'] = JSON.parse(originData['body'].json)
      break;
    case 'form-data':
      result['data'] = handleTransformParams(originData['body']['form-data'])
      break;
    case 'x-www-form-urlencoded':
      result['data'] = handleTransformParams(originData['body']['x-www-form-urlencoded'])
      break;
    default:
      break;
  }
}

/**
 *
 * @param originData 原始数据
 * 数组元素转对象，针对headers等等
 */
const handleTransformParams = (originData) => {
  const variableStore = useVariableStore()
  return originData.reduce((acc, item) => {
    if (item.key) {
      acc[item.key] = item.value.type === EParams.JSExpression ? variableStore.state[item.value.value] : item.value.value
    }
    return acc;
  }, {})
}

// 提取函数体部分
export const parseParams = (params: any) => {

}
