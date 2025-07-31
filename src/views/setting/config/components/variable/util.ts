export const getVariableValue = (expression: string | [], variableConfStore) => {
  if (typeof expression !== 'string') {
    console.log(typeof expression, expression);
    expression = expression.join('.')
  }

  const originState = expression.split(".")[0]
  return new Function(originState, `return ${expression}`)(
    variableConfStore.getState(originState as "global" | "state"),
  )
}
// 解析图表数据
export const parseChartsData = (data: any) => {

}
// 解析接口数据
export const parseInterfaceData = (data: any) => {

}
