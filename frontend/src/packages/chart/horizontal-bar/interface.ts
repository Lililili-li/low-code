import type { IComponentType } from '@/types/component'
import staticData from './data.json'
import * as echarts from 'echarts'
import { ERenderData } from '../../shared/index'

export default {
  id: '2',
  componentName: 'horizontal-bar',
  componentConfigName: 'horizontal-bar-config',
  componentType: 'chart',
  name: '渐变色柱状图',
  props: {
    visible: {
      value: 'state.visible',
      type: ERenderData.JSExpression,
    },
    emptyConfig: {
      imageUrl:
        'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original',
      tip: '暂无数据',
    },
    render: {
      type: 'Normal', //初始为使用静态数据
      value: staticData,
      defaultValue: staticData,
    },
    animationName: '',
    option: {
    },
  },
  eventConfig: [
    {
      // 事件绑定
      type: ERenderData.JSFunction,
      id: 'onClick',
      name: '点击事件',
      value: "function onClick(state, global, dataSource, methods) {\n\n}",
    },
  ],
  method: [
    {
      name: 'getState',
      type: ERenderData.JSFunction,
      code: "console.log('getState')",
    },
  ],
  style: {
    left: 100,
    top: 100,
    width: 500,
    height: 300,
    scaleWidth: 500,
    scaleHeight: 300,
    zIndex: 1,
  },
} as IComponentType
