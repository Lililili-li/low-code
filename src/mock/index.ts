import Mock from 'mockjs';

Mock.mock('/project/1', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    id: 1,
    name: 'xxx项目',
    schema: JSON.stringify({
      state: {
        baseUrl: {
          type: "string",
          value: "http://localhost:8000",
          isGlobal: true,
          id: 1
        },
        contentType: {
          type: "string",
          value: "application/json",
          isGlobal: true,
          id: 2
        }
      },
      methods: {}
    })
  }
});
Mock.mock('/project/1/page/1', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    projectId: 1,
    id: 1,
    pageName: '财务一体化平台运行监控大屏',
    schema: JSON.stringify(
      {
        "componentName": "Page",
        "adaptation": "0",
        "state": {
          "visible": {
            "type": "boolean",
            "value": true,
            "isGlobal": false,
            "id": 111
          },
          "text": {
            "type": "string",
            "value": "你好啊",
            "isGlobal": false,
            "id": 2
          },
          "animal": {
            "type": "object",
            "isGlobal": false,
            "id": 3,
            "value": {
              "cat": {
                "name": "喵喵",
                "age": 18
              },
              "dog": {
                "name": "汪汪",
                "age": 18
              },
              "house": {
                "name": "汪汪",
                "age": 18
              }
            }
          },
          "chartData": {
            "type": "array",
            "value": [],
            "isGlobal": false,
            "id": 123123123
          }
        },
        "props": {
          "theme": {
            "name": "宁静蓝",
            "id": 1,
            "colors": [
              "#4992ff",
              "#7cffb2",
              "#fddd60",
              "#ff6e76",
              "#58d9f9",
              "#05c091",
              "#ff8a45",
              "#8d48e3",
              "#dd79ff"
            ]
          }
        },
        "id": 1,
        "componentList": [
          {
            "id": "e414c371",
            "componentName": "vertical-bar",
            "componentConfigName": "vertical-bar-config",
            "componentType": "chart",
            "name": "渐变色柱状图",
            "props": {
              "visible": {
                "value": "state.visible",
                "type": "JSExpression"
              },
              "emptyConfig": {
                "imageUrl": "https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original",
                "tip": "暂无数据"
              },
              "render": {
                "type": "Normal",
                "value": [
                  {
                    "label": "周一",
                    "num1": 10,
                    "num2": 15,
                    "num3": 15
                  },
                  {
                    "label": "周二",
                    "num1": 20,
                    "num2": 16,
                    "num3": 16
                  },
                  {
                    "label": "周三",
                    "num1": 30,
                    "num2": 22,
                    "num3": 22
                  },
                  {
                    "label": "周四",
                    "num1": 40,
                    "num2": 33,
                    "num3": 33
                  }
                ],
                "defaultValue": [
                  {
                    "label": "周一",
                    "num1": 10,
                    "num2": 15,
                    "num3": 15
                  },
                  {
                    "label": "周二",
                    "num1": 20,
                    "num2": 16,
                    "num3": 16
                  },
                  {
                    "label": "周三",
                    "num1": 30,
                    "num2": 22,
                    "num3": 22
                  },
                  {
                    "label": "周四",
                    "num1": 40,
                    "num2": 33,
                    "num3": 33
                  }
                ]
              },
              "animationName": "",
              "option": {
                "tooltip": {
                  "trigger": "axis",
                  "axisPointer": {
                    "type": "line"
                  }
                },
                "grid": {
                  "left": "2%",
                  "right": "4%",
                  "bottom": "14%",
                  "top": "16%",
                  "containLabel": true
                },
                "legend": {
                  "right": "center",
                  "top": "5%",
                  "textStyle": {
                    "color": "#fff",
                    "fontSize": 14
                  },
                  "itemWidth": 12,
                  "itemHeight": 10
                },
                "xAxis": [
                  {
                    "type": "category",
                    "axisLine": {
                      "lineStyle": {
                        "color": "white"
                      }
                    },
                    "axisLabel": {}
                  }
                ],
                "yAxis": [
                  {
                    "type": "value",
                    "axisLine": {
                      "show": false,
                      "lineStyle": {
                        "color": "white"
                      }
                    },
                    "splitLine": {
                      "show": true,
                      "lineStyle": {
                        "color": "rgba(255,255,255,0.3)"
                      }
                    },
                    "axisLabel": {}
                  }
                ],
                "dataset": {
                  "dimensions": [
                    "label",
                    "num1",
                    "num2",
                    "num3"
                  ],
                  "source": [
                    {
                      "label": "周一",
                      "num1": 10,
                      "num2": 15,
                      "num3": 15
                    },
                    {
                      "label": "周二",
                      "num1": 20,
                      "num2": 16,
                      "num3": 16
                    },
                    {
                      "label": "周三",
                      "num1": 30,
                      "num2": 22,
                      "num3": 22
                    },
                    {
                      "label": "周四",
                      "num1": 40,
                      "num2": 33,
                      "num3": 33
                    }
                  ]
                },
                "series": [
                  {
                    "name": "测试一",
                    "type": "bar",
                    "barWidth": "15%",
                    "itemStyle": {
                      "color": {
                        "colorStops": [
                          {
                            "offset": 0,
                            "color": "#fccb05"
                          },
                          {
                            "offset": 1,
                            "color": "#f5804d"
                          }
                        ],
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1,
                        "type": "linear",
                        "global": false
                      },
                      "radius": 2
                    },
                    "label": {
                      "show": false,
                      "position": "top",
                      "color": "#B9B8CE",
                      "fontSize": 12,
                      "fontWeight": "bold",
                      "distance": 5
                    },
                    "backgroundStyle": {},
                    "yAxisIndex": 0,
                    "encode": {
                      "x": "label",
                      "y": "num1"
                    }
                  },
                  {
                    "name": "测试二",
                    "type": "bar",
                    "barWidth": "15%",
                    "itemStyle": {
                      "color": {
                        "colorStops": [
                          {
                            "offset": 0,
                            "color": "#248ff7"
                          },
                          {
                            "offset": 1,
                            "color": "#6851f1"
                          }
                        ],
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1,
                        "type": "linear",
                        "global": false
                      },
                      "radius": 2
                    },
                    "label": {},
                    "backgroundStyle": {},
                    "yAxisIndex": 0,
                    "encode": {
                      "x": "label",
                      "y": "num2"
                    }
                  }
                ],
                "color": [
                  "#4992ff",
                  "#7cffb2",
                  "#fddd60",
                  "#ff6e76",
                  "#58d9f9",
                  "#05c091",
                  "#ff8a45",
                  "#8d48e3",
                  "#dd79ff"
                ]
              }
            },
            "eventConfig": [
              {
                "type": "JSFunction",
                "id": "onClick",
                "name": "点击事件",
                "value": "function onClick(state, global, dataSource, methods) {\n\n}"
              }
            ],
            "method": [
              {
                "name": "getState",
                "type": "JSFunction",
                "code": "console.log('getState')"
              }
            ],
            "style": {
              "left": 7,
              "top": 146,
              "width": 502,
              "height": 280,
              "scaleWidth": 500,
              "scaleHeight": 300,
              "zIndex": 1
            },
            "type": "component"
          },
          {
            "id": "102fc0be",
            "componentName": "image",
            "componentConfigName": "image-config",
            "componentType": "image",
            "name": "图片",
            "props": {
              "visible": {
                "value": true,
                "type": "Normal"
              },
              "url": "http://127.0.0.1:8080/866407961130127360.png",
              "animationName": "",
              "openAnimation": true,
              "fit": "fill",
              "animation": {
                "name": "clockwise",
                "duration": 3,
                "number": -1
              }
            },
            "eventConfig": [
              {
                "type": "JSFunction",
                "id": "onClick",
                "name": "点击事件",
                "value": "function onClick(state, global, dataSource, methods) {\n\n}"
              }
            ],
            "style": {
              "left": 1449,
              "top": 222,
              "width": 124,
              "height": 124,
              "scaleWidth": 124,
              "scaleHeight": 124,
              "zIndex": 2
            },
            "type": "component"
          },
          {
            "id": "feaa84a0",
            "componentName": "image",
            "componentConfigName": "image-config",
            "componentType": "image",
            "name": "图片",
            "props": {
              "visible": {
                "value": true,
                "type": "Normal"
              },
              "url": "http://127.0.0.1:8080/866407389899476992%20(1).png",
              "animationName": "",
              "openAnimation": false,
              "fit": "cover",
              "animation": {
                "name": "",
                "duration": 3,
                "number": -1
              }
            },
            "eventConfig": [
              {
                "type": "JSFunction",
                "id": "onClick",
                "name": "点击事件",
                "value": "function onClick(state, global, dataSource, methods) {\n\n}"
              }
            ],
            "style": {
              "left": 1428,
              "top": 163,
              "width": 466,
              "height": 224,
              "scaleWidth": 466,
              "scaleHeight": 224,
              "zIndex": 1
            },
            "type": "component"
          },
          {
            "id": "f07bc30c",
            "componentName": "video",
            "componentConfigName": "video-config",
            "componentType": "video",
            "name": "视频",
            "props": {
              "visible": {
                "value": true,
                "type": "Normal"
              },
              "url": "http://qbi-resource.oss-cn-hangzhou.aliyuncs.com/%E8%A7%86%E9%A2%91%E7%B4%A0%E6%9D%90/10%E6%89%80%E5%A4%A7%E5%B1%8F%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91.mp4",
              "animationName": "",
              "fit": "cover",
              "poster": "blob:http://localhost:8000/434b3e86-562a-467d-a201-0b968441dabb",
              "autoPlay": true,
              "loop": true,
              "muted": true,
              "controls": false
            },
            "eventConfig": [
              {
                "type": "JSFunction",
                "id": "onClick",
                "name": "点击事件",
                "value": "function onClick(state, global, dataSource, methods) {\n\n}"
              }
            ],
            "style": {
              "left": 766,
              "top": 500,
              "width": 300,
              "height": 200,
              "scaleWidth": 300,
              "scaleHeight": 200,
              "zIndex": 1
            },
            "type": "component"
          }
        ],
        "dataSource": [
          {
            "base": {
              "url": {
                "type": "JSExpression",
                "value": "global.baseUrl"
              },
              "headers": [
                {
                  "key": "Content-Type",
                  "value": {
                    "type": "Normal",
                    "value": "application/json"
                  }
                }
              ]
            },
            "id": 1,
            "name": "getUserInfo",
            "description": "获取用户信息",
            "options": {
              "url": "/data.json",
              "method": "GET",
              "dataType": "none",
              "headers": [
                {
                  "key": "Content-Type",
                  "value": {
                    "type": "Normal",
                    "value": "application/json"
                  }
                }
              ],
              "timeout": {
                "type": "Normal",
                "value": 5000
              },
              "params": [
                {
                  "key": "name",
                  "value": {
                    "type": "Normal",
                    "value": "张三"
                  }
                }
              ]
            },
            "handleParams": {
              "type": "JSFunction",
              "value": "function(params) { \n  console.log('should fetch.....');\n  return params; \n}"
            }
          }
        ],
        "methods": {},
        "style": {
          "width": 1920,
          "height": 1080,
          "backgroundColor": "#232324",
          "useImage": 2
        }
      }
    )
  }
});
