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
  render?: RenderType,
  option?: any,
  animationName: string,
}

export interface IComponentType {
  id: string,
  componentName: string,
  componentConfigName: string,
  componentType: string,
  name: string,
  props: IProps,
  style: Record<string, string | number>,
  eventConfig: { value: string; name: string; id: string, type: string }[],
  type?: 'component' | 'group',
  children?: IComponentType[],
}
