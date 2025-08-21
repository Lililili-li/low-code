export default function useElement(){
  /**
   *
   * @param element 元素dom
   * @returns 元素的rect信息
   */
  const getElementRect = (element: HTMLElement) => {
    const elementRect = element.getBoundingClientRect()
    return {
      width: elementRect.width,
      height: elementRect.height,
      left: elementRect.left,
      top: elementRect.top,
      right: elementRect.right,
      bottom: elementRect.bottom,
      x: elementRect.x, //元素左上角相对于视口的横坐标
      y: elementRect.y //元素左上角相对于视口的纵坐标
    }
  }

  return {
    getElementRect
  }
}
