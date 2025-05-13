import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'
import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../views/admin/layout/AdminLayout.vue'

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
          path: 'course/:id',
          name: 'CourseDetail',
          component: () => import('../views/CourseDetail.vue')
        },
        {
          path: 'live',
          name: 'Live',
          component: () => import('../views/LiveList.vue')
        },
        {
          path: 'live/push',
          name: 'LivePush',
          component: () => import('../views/LivePush.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'live/:id',
          name: 'LiveWatch',
          component: () => import('../views/LiveWatch.vue')
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
        },
        {
          path: 'video/:id',
          name: 'VideoPlayer',
          component: () => import('../views/VideoPlayer.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('../views/admin/Dashboard.vue')
        },
        {
          path: 'banners',
          name: 'AdminBanners',
          component: () => import('../views/admin/Banners.vue')
        },
        {
          path: 'courses',
          name: 'AdminCourses',
          component: () => import('../views/admin/Courses.vue')
        },
        {
          path: 'lives',
          name: 'AdminLives',
          component: () => import('../views/admin/Lives.vue')
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/admin/Users.vue')
        },
        {
          path: 'roles',
          name: 'AdminRoles',
          component: () => import('../views/admin/Roles.vue')
        },
        {
          path: 'permissions',
          name: 'AdminPermissions',
          component: () => import('../views/admin/Permissions.vue')
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: () => import('../views/admin/Settings.vue')
        },
        {
          path: 'menus',
          name: 'AdminMenus',
          component: () => import('../views/admin/Menus.vue')
        },
        {
          path: 'logs',
          name: 'AdminLogs',
          component: () => import('../views/admin/Logs.vue')
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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 如果未登录，跳转到登录页
    if (!userStore.isLogin) {
      next('/login')
      return
    }
    
    // 如果已登录但未加载用户信息，先加载用户信息
    if (!userStore.userInfo) {
      try {
        await userStore.loadUserInfo()
      } catch (error) {
        console.error('加载用户信息失败:', error)
        userStore.logoutAction()
        next('/login')
        return
      }
    }
    
    // 检查管理员权限
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      next('/')
      return
    }
  }
  
  next()
})

export default router 