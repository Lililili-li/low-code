import type { IDataSource, IEvent } from "@/types/dataSource"
import { getFunctionBody } from "@/utils"
import { cloneDeep } from "lodash-es"
import { toRaw } from "vue"
import { useVariableStore } from "@/stores/useVariableStore"
import { getVariableValue } from "../variable/util"
enum EParams {
  Normal = "Normal",
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


export const handleTransformParams2Schema = (params: any) => {
  const copyParams = cloneDeep(params)
  return copyParams
}

export const handleTransformSchema2Params = (params: any) => {
  const copyParams = cloneDeep(params)
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
    result[key] = copyParams.options[key]
    if (key === 'url') {
      result[key] = copyParams.base.url.type === EParams.JSExpression ? getVariableValue(copyParams.base.url.value, variableStore) + copyParams.options.url : params.base.url.value + copyParams.options.url
    }
    if (key === 'headers') {
      result[key] = handleTransformParams([...copyParams.base.headers, ...copyParams.options.headers])
    }
    if (key === 'params') {

      result[key] = handleTransformParams(copyParams.options.params)
    }
  }
  handleDataType(result, copyParams.options)
  if (result.method === 'GET') {
    Reflect.deleteProperty(result, 'data')
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
      acc[item.key] = item.value.type === EParams.JSExpression ? getVariableValue(item.value.value, variableStore) : (item.value.value ? item.value.value : undefined)
    }
    return acc;
  }, {})
}
