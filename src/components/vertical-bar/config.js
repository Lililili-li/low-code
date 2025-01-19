export default {
  componentName: "vertical-bar",
  componentConfigName: 'vertical-bar-config',
  props: {
    event: {
      onClick: { // 事件绑定
        type: "JSFunction",
        value: "function onClick() {}"
      },
      onMousemove: {
        type: "JSFunction",
        value: "function onMousemove(e) {console.log(e)}"
      }
    },
    option: {
      color: [
        "#4992ff",
        "#7cffb2",
        "#fddd60",
        "#ff6e76",
        "#58d9f9",
        "#05c091",
        "#ff8a45",
        "#8d48e3",
        "#dd79ff"
      ],
      xAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#B9B8CE',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#B9B8CE',
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#B9B8CE',
          }
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          color: '#B9B8CE',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#B9B8CE',
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#B9B8CE',
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
            type: 'dashed'
          }
        }
      },
      dataset: {
        dimension: ['label', 'num1', 'num2'],
        source: [
          {
            label: "周一",
            num1: 10,
            num2: 15
          },
          {
            label: "周二",
            num1: 20,
            num2: 16
          },
          {
            label: "周三",
            num1: 30,
            num2: 22
          },
          {
            label: "周四",
            num1: 40,
            num2: 33
          }
        ]
      },
      series: [
        {
          type: 'bar',
          name: '测试1',
          label: {
            show: true,
            position: 'top',
            color: '#B9B8CE',
          }
        },
        // {
        //   type: 'bar',
        //   name: '测试2',
        //   label: {
        //     show: true,
        //     position: 'top',
        //     color: '#B9B8CE',
        //   }
        // }
      ],
      legend: {
        show: true,
        top: '2%',
        textStyle: {
          color: '#B9B8CE',
        }
      },
      grid: {
        top: '14%',
        bottom: '8%',
      },
      tooltip: {
        show: true,
      }
    }
  },
  style: {
    left: 100,
    top: 100,
    width: 500,
    height: 300,
    zIndex: 1
  },
}
