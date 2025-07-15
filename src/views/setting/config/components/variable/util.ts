export const getVariableValue = (expression: string | [], variableConfStore) => {
  if (typeof expression !== 'string') {
    expression = expression.join('.')
  }
  const originState = expression.split(".")[0]
  return new Function(originState, `return ${expression}`)(
    variableConfStore.getState(originState as "global" | "state"),
  )
}
