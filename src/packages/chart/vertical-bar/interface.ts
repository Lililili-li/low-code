import type { IComponentType } from '@/types/component'
import staticData from './data.json'
import * as echarts from 'echarts'
import { ERenderData } from '../../shared/index'

export default {
  id: '1',
  componentName: 'vertical-bar',
  componentConfigName: 'vertical-bar-config',
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
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '14%',
        top: '16%',
        containLabel: true
      },
      legend: {
        right: 'center',
        top: '5%',
        textStyle: {
          color: "#fff",
          fontSize: 14
        },
        itemWidth: 12,
        itemHeight: 10,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
          },
        }
      ],

      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {}
        }
      ],
      dataset: {
        // 提供一份数据。
        dimensions: ['label', 'num1', 'num2', 'num3'],
        source: [
          { label: '2015', 'num1': 100, 'num2': 450, 'num3': 450 },
          { label: '2016', 'num1': 300, 'num2': 310, 'num3': 450 },
          { label: '2017', 'num1': 600, 'num2': 430, 'num3': 450 },
          { label: '2018', 'num1': 300, 'num2': 330, 'num3': 450 }
        ]
      },
      series: [
        {
          name: '测试一',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#fccb05'
            }, {
              offset: 1,
              color: '#f5804d'
            }]),
            radius: 2,
          },
          label: {
            show: false,
            position: 'top',
            color: '#B9B8CE',
            fontSize: 12,
            fontWeight: 'bold',
            distance: 5,
          },
          backgroundStyle: {},
          yAxisIndex: 0,
          encode: {
            x: 'label',
            y: 'num1'
          }
        },
        {
          name: '测试二', //默认配置
          type: 'bar',
          barWidth: '15%', //默认配置
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#248ff7'
            }, {
              offset: 1,
              color: '#6851f1'
            }]),
            radius: 2,
          },
          label: { //默认配置
          },
          backgroundStyle: {}, //默认配置
          yAxisIndex: 0, //默认配置
          encode: { //默认配置
            x: 'label',
            y: 'num2'
          }
        },
      ]
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
