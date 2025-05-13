import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  login,
  register,
  logout,
  getUserInfo,
  updateUserInfo as updateUserInfoApi,
  changePassword as changePasswordApi
} from '../api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  const isLogin = computed(() => !!token.value)
  const isTeacher = computed(() => userInfo.value?.role === 'teacher')
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 初始化加载用户信息
  const initUserInfo = async () => {
    if (token.value && !userInfo.value) {
      try {
        await loadUserInfo()
      } catch (error) {
        console.error('加载用户信息失败:', error)
        token.value = ''
        localStorage.removeItem('token')
      }
    }
  }

  // 登录
  const loginAction = async (data) => {
    try {
      const res = await login(data)
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      await loadUserInfo()
      return res
    } catch (error) {
      throw error
    }
  }

  // 注册
  const registerAction = async (data) => {
    try {
      const res = await register(data)
      return res
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  const logoutAction = async () => {
    try {
      await logout()
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
    } catch (error) {
      throw error
    }
  }

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      return res
    } catch (error) {
      throw error
    }
  }

  // 更新用户信息
  const updateUserInfoAction = async (data) => {
    try {
      const res = await updateUserInfoApi(data)
      userInfo.value = { ...userInfo.value, ...data }
      return res
    } catch (error) {
      throw error
    }
  }

  // 修改密码
  const changePasswordAction = async (data) => {
    try {
      const res = await changePasswordApi(data)
      return res
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    userInfo,
    isLogin,
    isTeacher,
    isAdmin,
    initUserInfo,
    loginAction,
    registerAction,
    logoutAction,
    loadUserInfo,
    updateUserInfoAction,
    changePasswordAction
  }
})

// 导出初始化函数
export const initUserStore = (app) => {
  const userStore = useUserStore()
  userStore.initUserInfo()
  return userStore
} 