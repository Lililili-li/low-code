
export interface IVariableType {
  key: string
  type: string
  value: any
  id: number | string,
  isGlobal: boolean
}
export interface IVariableValue {
  type: EVariableData;
  value: any;
  isGlobal: boolean
  id: number | string,
}

export interface IStateType {
  [key: string]: IVariableValue;
}


// 变量类型枚举
export enum EVariableData {
  OBJECT = 'object',
  STRING = 'string', // 字符串
  ARRAY = 'array', // 数组
  BOOLEAN = 'boolean', // 布尔值
  NUMBER = 'number', // 数字
}
