// 绘制辅助线方法
import type { IDirection, IDomInfo, ILineConfig } from '@/hooks/axis-helper/type.ts'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { formatNumber, generateUUID, throttle } from '@/utils'

export default function useAxisHelper(panelScale: any) {
  const targetDom = ref<HTMLElement | null>(null)
  const elementId = ref<string>('')
  const targetDomInfo = ref<Partial<IDomInfo>>({})
  const elementsDomInfo = ref<Partial<IDomInfo[]>>([])
  const lineList = ref([
    {
      type: 'left-middle',
      left: 0,
      top: 0,
      direction: 'horizontal',
      visible: false,
      width: 0,
    },
    {
      type: 'left-top',
      left: 0,
      top: 0,
      direction: 'horizontal',
      visible: false,
      width: 0,
    },
    {
      type: 'left-bottom',
      left: 0,
      top: 0,
      direction: 'horizontal',
      visible: false,
      width: 0,
    },
  ])
  const targetJsonSetting = ref({})
  const isAdsorb = reactive({
    x: false,
    y: false,
  })
  const setTargetDom = (dom: HTMLElement, id: string, data) => {
    targetDom.value = dom
    elementId.value = id
    setElementDomInfo()
    targetJsonSetting.value = data
  }
  // 1.获取除目标元素外的所有元素
  const setElementDomInfo = (): void => {
    let elementList: HTMLElement[] = Array.from(
      document.querySelector('.canvas')!.children,
    ) as HTMLElement[]
    elementList = elementList.filter(
      (element: HTMLElement) =>
        element.getAttribute('id') !== elementId.value &&
        element.getAttribute('data-id') !== 'axis',
    )
    elementsDomInfo.value = elementList.map((item) => {
      return setDomInfo(item!)
    }) as IDomInfo[]
  }
  // 获取目标元素信息
  const setTargetElementDomInfo = (): void => {
    targetDomInfo.value = setDomInfo(targetDom.value!)
  }

  const makeDirectionLine = () => {
    setTargetElementDomInfo()
    elementsDomInfo.value.filter(item => {

    }).forEach((item) => {
      pitchDomDirection(item as IDomInfo)
    })
    console.log(elementsDomInfo.value)
    console.log(lineList.value)
  }
  // 判断在同一水平线的元素,在目标元素的方向
  const pitchDomDirection = (element: IDomInfo) => {
    if (element.offsetLeft < targetDomInfo.value?.offsetLeft!) {
      console.log(Math.abs(element.centerY - targetDomInfo.value?.centerY!) < 3)
      if (Math.abs(element.centerY - targetDomInfo.value?.centerY!) < 3) {
        let line = lineList.value.find((item) => item.type === 'left-middle')
        if (line) {
          line.visible = true
          line.left = element.offsetLeft + element.width
          line.width = formatNumber(targetDomInfo.value?.offsetLeft! - (element.offsetLeft + element.width))
          line.top = element.offsetTop + element.height / 2
        }
        // throttle(()=> {
        //   targetJsonSetting.value.style.top = element.offsetTop
        // },300)
      } else {
        lineList.value.forEach((item) => {
          if (item.type === 'left-middle') item.visible = false
        })
      }
      if (Math.abs(targetDomInfo.value?.offsetTop! - element.offsetTop) < 3) {
        let line = lineList.value.find((item) => item.type === 'left-top')
        if (line) {
          line.visible = true
          line.left = element.offsetLeft + element.width
          line.width = formatNumber(targetDomInfo.value?.offsetLeft! - (element.offsetLeft + element.width))
          line.top = element.offsetTop
        }
      } else {
        lineList.value.forEach((item) => {
          if (item.type === 'left-top') item.visible = false
        })
      }
      if (
        Math.abs(
          element.offsetTop +
            element.height -
            (targetDomInfo.value?.offsetTop! + targetDomInfo.value?.height!),
        ) < 3
      ) {
        let line = lineList.value.find((item) => item.type === 'left-bottom')
        if (line) {
          line.visible = true
          line.left = element.offsetLeft + element.width
          line.width = formatNumber(targetDomInfo.value?.offsetLeft! - (element.offsetLeft + element.width))
          line.top = element.offsetTop + element.height
        }
      } else {
        lineList.value.forEach((item) => {
          if (item.type === 'left-bottom') item.visible = false
        })
      }
    }
    // else if (){}
    // else if () {}
    // else if () {
    //
    // }
  }
  // 获取目标元素与同一水平线元素的距离
  const getDomDistance = (element: IDomInfo): number => {
    let distance = 0
    let isLeft =
      element.offsetLeft < targetDomInfo.value?.offsetLeft! &&
      Math.abs(element.centerY - targetDomInfo.value?.centerY!) < 3
    let isRight =
      element.offsetLeft > targetDomInfo.value?.offsetLeft! &&
      Math.abs(element.centerY - targetDomInfo.value?.centerY!) < 3
    let isTop =
      element.offsetTop > targetDomInfo.value?.offsetTop! &&
      Math.abs(element.centerX - targetDomInfo.value?.centerX!) < 3
    let isBottom =
      targetDomInfo.value?.offsetTop! > element.offsetTop &&
      Math.abs(element.centerX - targetDomInfo.value?.centerX!) < 3
    if (isLeft) {
      distance = targetDomInfo.value.offsetLeft! - (element.offsetLeft + element.width)
    } else if (isRight) {
      distance = element.offsetLeft - (targetDomInfo.value.offsetLeft! + targetDomInfo.value.width!)
    } else if (isTop) {
      distance = element.offsetTop + element.height - targetDomInfo.value.offsetTop!
    } else if (isBottom) {
      distance = targetDomInfo.value.offsetTop! + targetDomInfo.value.height! - element.offsetTop!
    }
    return distance
  }

  const onClearLine = () => {}
  onMounted(() => {})
  // 设置元素信息 通用方法
  const setDomInfo = (dom: Element): Partial<IDomInfo> => {
    let { offsetLeft, offsetTop } = dom as HTMLElement
    let { height, width } = dom.getBoundingClientRect() as DOMRect
    return {
      height: formatNumber(height / panelScale.value),
      width: formatNumber(width / panelScale.value),
      centerX: formatNumber(offsetLeft + (width / panelScale.value / 2)),
      centerY: formatNumber(offsetTop + (height / panelScale.value / 2)),
      offsetLeft,
      offsetTop,
      offsetBottom: formatNumber(offsetTop + (height / panelScale.value)),
      offsetRight: formatNumber(offsetLeft + (width / panelScale.value))
    }
  }
  return {
    setTargetDom,
    makeDirectionLine,
    onClearLine,
    lineList,
  }
}
