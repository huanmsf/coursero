import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('../views/CourseList.vue')
        },
        {
          path: 'live',
          name: 'Live',
          component: () => import('../views/LiveList.vue')
        },
        {
          path: 'teachers',
          name: 'Teachers',
          component: () => import('../views/TeacherList.vue')
        },
        {
          path: 'user',
          name: 'UserCenter',
          component: () => import('../views/UserCenter.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'user/orders',
          name: 'UserOrders',
          component: () => import('../views/UserOrders.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'user/favorites',
          name: 'UserFavorites',
          component: () => import('../views/UserFavorites.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next('/login')
  } else {
    next()
  }
})

export default router 