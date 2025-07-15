import { reactive } from "vue"

interface MoveStateType {
  startX: number,
  startY: number,
  moveX: number,
  moveY: number,
  isMoving: boolean,
  isResize: boolean,
  type?: 'move' | 'resize' | 'frameSelect' | null,
  componentType?: 'component' | 'group' | null,
}
export default function useMouse() {
  const moveState = reactive<MoveStateType>({
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    isMoving: false,
    isResize: false,
    type: null,
  })
  /**
   *
   * @param state 要更新的数据
   */
  const setMoveState = (state: Partial<MoveStateType>) => {
    for (const key in state) {
      moveState[key] = state[key]
    }
  }
  /**
   *
   * @param event 鼠标事件参数
   * @param scale 画布的缩放倍数
   */
  const calcMouseMoveDistance = (event: MouseEvent, scale?: number) => {
    const moveX = (event.x - moveState.startX) / scale!;
    const moveY = (event.y - moveState.startY) / scale!;
    return { moveX, moveY }
  }
  return {
    moveState,
    setMoveState,
    calcMouseMoveDistance
  }
}
