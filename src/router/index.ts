import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/project',
      name: 'Project',
      redirect: '/project/list',
      component: () => import('@/views/project/index.vue'),
      children: [
        {
          path: 'list',
          name: 'List',
          component: () => import('@/views/project/list/Index.vue'),
        },
        {
          path: 'template',
          name: 'Template',
          component: () => import('@/views/project/template/Index.vue'),
        }
      ]
    },
    {
      path: '/setting/:id?',
      name: 'Setting',
      component: () => import('@/views/setting/index.vue'),
    },
    {
      path: '/preview/:id?',
      name: 'Preview',
      component: () => import('@/views/preview/index.vue'),
    },
    {
      path: '/',
      redirect: '/login',
    }
  ],
})

export default router
