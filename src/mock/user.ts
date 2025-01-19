import Mock from 'mockjs';

Mock.mock('/api/login', 'post', {
  code: 200,
  message: '登录成功',
  data: {
    token: '@guid',
    user: {
      id: '@id',
      username: '@name',
      email: '@email',
    },
  },
});