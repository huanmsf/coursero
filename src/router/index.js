import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/courses',
      component: () => import('../views/CourseList.vue')
    },
    {
      path: '/course/:id',
      component: () => import('../views/CourseDetail.vue')
    },
    {
      path: '/live',
      component: () => import('../views/LiveList.vue')
    },
    {
      path: '/live/:id',
      component: () => import('../views/LiveDetail.vue')
    },
    {
      path: '/live/:id/push',
      name: 'LivePush',
      component: () => import('../views/LivePush.vue'),
      meta: {
        requiresAuth: true,
        requiresTeacher: true
      }
    },
    {
      path: '/vip',
      component: () => import('../views/Vip.vue')
    }
  ]
})

export default router 