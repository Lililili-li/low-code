import Mock from 'mockjs';

Mock.mock('/project/1', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    id: 1,
    name: 'xxx项目',
    schema: JSON.stringify({
      state: {
        "baseUrl": {
          "type": "string",
          "value": "http://localhost:8000",
          "isGlobal": true,
          "id": 1
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
        componentName: 'Page',
        state: {
          text: {
            type: "string",
            value: "你好啊",
            isGlobal: false,
            id: 2
          },
          animal: {
            type: "object",
            isGlobal: false,
            id: 3,
            value: {
              cat: {
                name: "喵喵",
                age: 18,
              },
              dog: {
                name: "汪汪",
                age: 18,
              },
            },
          },
        },
        props: {
          theme: {
            name: "宁静蓝",
            id: 1,
            colors: [
              "#4992ff",
              "#7cffb2",
              "#fddd60",
              "#ff6e76",
              "#58d9f9",
              "#05c091",
              "#ff8a45",
              "#8d48e3",
              "#dd79ff",
            ],
          },
        },
        id: 1,
        componentList: [],
        dataSource: [
          {
            base: {
              url: {
                type: "JSExpression",
                value: "global.baseUrl",
              },
              headers: {
                "Content-Type": {
                  type: "JSExpression",
                  value: "global.contentType",
                },
              },
            },
            id: 1,
            name: "getUserInfo",
            description: "获取用户信息",
            options: {
              url: "/data.json",
              method: "GET",
              dataType: 'none',
              headers: {
                "Content-Type": {
                  type: "normal",
                  value: "application/json",
                },
              },
              timeout: {
                type: 'normal',
                value: 5000
              },
              // 无论是get请求还是post请求都放到params中
              params: {
                name: {
                  type: "normal",
                  value: "张三",
                },
                age: {
                  type: "normal",
                  value: 18,
                },
              },
            },
            handleParams: {
              type: "JSFunction",
              value: "function() { \n  console.log('should fetch.....');\n  return true; \n}",
            },
          },
        ],
        methods: {},
      },
    )
  }
});
