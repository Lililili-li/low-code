type ParamType<T> = {
  type: string;
  value: T;
};

type Params = {
  [key: string]: ParamType<any>;
};
export type IEvent = {
  type: 'JSFunction',
  value: string,
}
export type IDataType = 'none' | 'form-data' | 'json' | 'x-www-form-urlencoded'

export interface IDataSource {
  base: {
    url: ParamType<string>
    headers: Params
  }
  id: string | number
  name: string
  description: string
  options: {
    url: string,
    method: string,
    headers: Params,
    loopTime: ParamType,
    timeout: ParamType,
    params?: Params,
    dataType: IDataType
    body?: {
      'none': null,
      'form-data': any[],
      'x-www-form-urlencoded': any[],
      'json': any
    }
  }
  handleParams?: IEvent,
  handleSuccess?: IEvent,
  handleError?: IEvent,
}


export enum EParams {
  Normal = "Normal",
  JSExpression = "JSExpression",
}
