import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import { h } from 'vue'

export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}
export const generateUUID = (): string => {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

let prev = Date.now()
export const throttle = (fn: Function, delay: number) => {
  let now = Date.now()
  if (now - prev >= delay) {
    fn()
    prev = now
  }
}

export const formatNumber = (value: number, digits: number = 0) => {
  return Number(Number(value).toFixed(digits))
}

interface IChartData {
  [key: string]: string | number
}
export const charData2TableData = (chartData: IChartData[]) => {
  if (chartData.length === 0)  return [];
  let tableData = {
    rows: {
      0: {}
    }
  }
  let keyList = Object.keys(chartData[0])
  keyList.unshift('键名')
  tableData.rows[0]['cells'] = {}
  chartData.forEach((item, pIndex) => {
    let obj:IChartData = {}
    tableData.rows[pIndex+1] = {}
    tableData.rows[pIndex+1]['cells'] = {}
    keyList.forEach((key, index) => {
      tableData.rows[0]['cells'][index] = {text: key}
      if (!item[key]) {
        obj[key] = '键值'
      }else {
        obj[key] = item[key]
      }
      tableData.rows[pIndex+1]['cells'][index] = {text: obj[key]}
    })
    return obj
  })
  return tableData
}
export function tableData2ChartData(data: IChartData) {
  const startTime = performance.now();
  delete data.len
  let result: IChartData[] = [];
  let dimension: string[] = []
  let header = data[0]?.cells;
  for (let i = 1; i < Object.keys(data).length; i++) {
    let item: IChartData = {};
    let cells = data[i]?.cells;
    for (let j = 0; j < Object.keys(cells).length; j++) {
      let cell = cells[j];
      let headerCell = header[j];
      if (headerCell.text === '键名') continue
      if (!dimension.includes(headerCell.text)) dimension.push(headerCell.text)
      if (/^\d+$/.test(cell.text)) {
        // 如果文本是纯数字，将其转换为数字
        item[headerCell.text] = parseInt(cell.text);
      } else {
        item[headerCell.text] = cell.text;
      }
    }
    result.push(item);
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  console.log(`方法执行用时: ${executionTime} 毫秒`);
  return {
    source: result,
    dimension
  };
}
