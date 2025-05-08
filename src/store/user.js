import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null,
    isLogin: false
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.isLogin = true
    },
    setToken(token) {
      this.token = token
    },
    logout() {
      this.userInfo = null
      this.token = null
      this.isLogin = false
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage
      }
    ]
  }
}) 