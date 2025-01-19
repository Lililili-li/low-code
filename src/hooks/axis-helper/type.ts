export interface ILineConfig {
  left: number
  top: number
  direction: 'horizontal' | 'vertical',
  position: IDirection,
  width?: number | string
  height?: string | number
  id: string
}
export interface IDomInfo extends DOMRect{
  centerY: number,
  centerX: number,
  offsetLeft: number,
  offsetTop: number,
  offsetRight: number,
  offsetBottom: number,
}

export type IDirection = 'left' | 'right' | 'top' | 'bottom' | 'middle'
