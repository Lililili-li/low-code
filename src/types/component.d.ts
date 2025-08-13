export interface VisibleType {
  value: string | boolean,
  type: 'Normal' | 'JSExpression', // 1为变量，2为常量
}

export interface RenderType {
  type: 'Normal' | 'JSExpression',
  value: Record<string, any>[] | string,
  defaultValue: any[]
}

export enum EComponentType {
  COMPONENT = 'component',
  GROUP = 'group',
}

export interface IProps {
  visible: VisibleType,
  // option: Partial<EChartsOption>
  animationName: string,
}
export interface ChartIProps extends IProps {
  // option: Partial<EChartsOption>
  render?: RenderType,
  option?: any,
}
export interface ImageIProps extends IProps {
  url: string,
  openAnimation: boolean,
  fit: string,
  animation: {
    duration: number,
    name: string,
    number: number
  }
}
export interface VideoIProps extends IProps {
  poster: string,
  autoPlay: boolean,
  loop: boolean,
  muted: boolean,
  controls: boolean,
  url: string,
  fit: string,
}

export interface IComponentType {
  id: string,
  componentName: string,
  componentConfigName: string,
  componentType: string,
  groupId?: string
  name: string,
  props: ChartIProps | ImageIProps | VideoIProps,
  style: Record<string, string | number>,
  eventConfig: { value: string; name: string; id: string, type: string }[],
  type?: 'component' | 'group',
  children?: IComponentType[],
}
