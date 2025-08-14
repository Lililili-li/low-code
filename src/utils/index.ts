import type { Component } from 'vue'
import { Icon } from '@arco-design/web-vue'
import { h } from 'vue'

// 生成图标组件
export const renderIcon = (icon: Component) => {
  return () => h(Icon, null, { default: () => h(icon) })
}
// 生成uuid
export const generateUUID = (): string => {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

// 格式化数字类型
export const formatNumber = (value: number, digits: number = 0) => {
  return Number(Number(value).toFixed(digits))
}

interface IChartData {
  [key: string]: string | number
}
// 图表数据转表格数据
export const charData2TableData = (chartData: IChartData[]) => {
  if (chartData.length === 0) return [];
  const tableData = {
    rows: {
      0: {}
    }
  }
  const keyList = Object.keys(chartData[0])
  tableData.rows[0]['cells'] = {}
  chartData.forEach((item, pIndex) => {
    const obj: IChartData = {}
    tableData.rows[pIndex + 1] = {}
    tableData.rows[pIndex + 1]['cells'] = {}
    keyList.forEach((key, index) => {
      tableData.rows[0]['cells'][index] = { text: key }
      obj[key] = item[key]
      tableData.rows[pIndex + 1]['cells'][index] = { text: obj[key] }
    })
    return obj
  })
  return tableData
}
// 表格数据转图表数据
export function tableData2ChartData(data: IChartData) {
  const startTime = performance.now();
  delete data.len
  const result: IChartData[] = [];
  const dimension: string[] = []
  const header = data[0]?.cells;
  for (let i = 1; i < Object.keys(data).length; i++) {
    const item: IChartData = {};
    const cells = data[i]?.cells;
    for (let j = 0; j < Object.keys(cells).length; j++) {
      const cell = cells[j];
      const headerCell = header[j];
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
  return {
    source: result,
    dimension
  };


}
// 获取元素类型
export const getType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 节流函数
// ... existing code ...

// 节流函数
let last = 0;
export function throttle(fn: Function, delay) {
  console.log(fn);

  const now = Date.now();
  if (now - last >= delay) {
    fn(arguments);
    last = now;
  }
}
// 防抖函数
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  }
}

// 获取函数体
export const getFunctionBody = (functionString: string) => {
  return functionString.substring(
    functionString.indexOf('{') + 1,
    functionString.lastIndexOf('}')
  ).trim();
}

// 获取数据类型
export const getDataType = (value: any): string => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
