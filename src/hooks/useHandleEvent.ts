import { ref } from 'vue'
import { Local } from '@/utils/storage'

type EventsType = {
  type: string
  value: string
}
export default function useHandleEvent(
  events: Record<string, { value?: string; name?: string; id?: string }> &
    Record<string, { value?: string; name?: string; id?: string }[]>,
): Record<string, (event?) => void> {
  const { onClick, onMousemove, onChartClick } = events
  const pageParam = ref(JSON.parse(Local.get('pageParam')))
  console.log(pageParam.value)

  const onEvent = {
    click: () => {
      // TODO 待完善
      let sayHi = new Function('state', 'state.data2 = 1; state.data1 = 3')
      return sayHi(pageParam.value.state)
    },
    mousemove: () => {
      return new Function(onMousemove.value!)
    },
    onChartClick: (event) => {
      const cb = new Function('event', onChartClick.value!)
      return cb(event)
    },
  }
  return onEvent
}
