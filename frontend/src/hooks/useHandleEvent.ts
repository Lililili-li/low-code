import { useVariableStore } from '@/stores/useVariableStore'
import type { IDataSource } from '@/types/dataSource'
import { handleParamsForSend, interfaceEventMap } from '@/views/setting/config/components/dataSource/handleParams'
import { getVariableValue } from '@/views/setting/config/components/variable/util'
import useHandleInterface from './useHandleInterface'
import { getFunctionBody } from '@/utils'
import message from '@/utils/message'
import { usePageConfigStore } from '@/stores/usePageConfigStore'

const eventMap = {
  onClick: 'click',
  onChange: 'change',
  onInput: 'input',
  onSelect: 'select',
  onSubmit: 'submit',
}

const handleDataSource = (dataSource: IDataSource[], variableConfStore: any) => {
  const result = {}
  const { handleFetch } = useHandleInterface()

  dataSource.map(async (item) => {
    result[item.name] = () => {
      return (async function () {
        const preAppendEventList: any[] = []
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(interfaceEventMap, key)) {
            preAppendEventList.push({ name: key, ...item[key] })
          }
        }
        try {
          const params = handleParamsForSend(item, preAppendEventList)

          // 判断是否为轮询接口
          const isLoop = item.options.loopTime?.type === 'Normal' ? item.options.loopTime.value : getVariableValue(item.options.loopTime.value, variableConfStore)
          // 获取超时时间
          const timeout = item.options.timeout?.type === 'Normal' ? item.options.timeout.value : getVariableValue(item.options.timeout.value, variableConfStore)
          let res: any = null
          if (isLoop) {
            // res = await handle(params, timeout)
          } else {
            res = await handleFetch(params, timeout)
          }
          const exitItem = preAppendEventList.find((item) => item.name === "handleSuccess")
          if (exitItem) {
            const handleResult = new Function("res", "state", getFunctionBody(exitItem.value))
            debugger
            handleResult(res, variableConfStore.getState('state'))
          }
        } catch (error) {
          const exitItem = preAppendEventList.find((item) => item.name === "handleError")
          if (exitItem) {
            const handleResult = new Function("error", "message", getFunctionBody(exitItem.value))
            const result = handleResult(error, message)
            error = result || error
          }
        }
      })()
    }
  })
  return result
}

export default function useHandleEvent(
  events: { value: string; name: string; id: string, type: string }[],
): Record<string, (event?) => void> {
  const variableStore = useVariableStore()
  const pageConfigStore = usePageConfigStore()
  const state = variableStore.getState('state')
  const globalState = variableStore.getState('global')

  const dataSource = handleDataSource(pageConfigStore.pageSetting.dataSource, variableStore)
  const methods = {}
  const onEvent = {}
  events.forEach(item => {
    if (eventMap[item.id]) {
      const match = item.value.match(/function\s*\w*\s*\(([^)]*)\)\s*{([\s\S]*)}/);
      onEvent[eventMap[item.id]] = () => {
        if (!match) return
        const args = match[1].split(',').map(s => s.trim())
        const body = match[2]
        const event = new Function(...args, body)
        return event(state, globalState, dataSource, methods)
      }
    }
  })
  return onEvent
}
