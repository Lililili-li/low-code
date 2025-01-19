import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/Index.vue'),
    },
    {
      path: '/project',
      name: 'Project',
      component: () => import('@/views/project/Index.vue'),
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
      component: () => import('@/views/setting/Index.vue'),
    },
    {
      path: '/preview',
      name: 'Preview',
      component: () => import('@/views/preview/Index.vue'),
    },
    {
      path: '/',
      redirect: '/login',
    }
  ],
})

export default router
