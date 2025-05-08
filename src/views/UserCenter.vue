<template>
  <div class="user-center">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-info">
        <el-avatar :size="64" :src="userInfo.avatar" />
        <div class="info">
          <h2>{{ userInfo.nickname }}</h2>
          <p>{{ userInfo.email }}</p>
        </div>
      </div>
      <el-button type="primary" @click="handleLogout">退出登录</el-button>
    </div>

    <!-- 功能列表 -->
    <div class="function-list">
      <div class="function-item" @click="goToMyCourses">
        <el-icon><Collection /></el-icon>
        <span>我的课程</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="function-item" @click="goToMyOrders">
        <el-icon><Document /></el-icon>
        <span>我的订单</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="function-item" @click="goToSettings">
        <el-icon><Setting /></el-icon>
        <span>设置</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="version-info">
      <p>版本号：1.0.0</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { getUserInfo } from '../api/user'
import { 
  Collection, 
  Document, 
  Setting, 
  ArrowRight 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref({
  avatar: '',
  nickname: '',
  email: ''
})

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const goToMyCourses = () => {
  router.push('/user/courses')
}

const goToMyOrders = () => {
  router.push('/user/orders')
}

const goToSettings = () => {
  router.push('/user/settings')
}

onMounted(() => {
  if (!userStore.isLogin) {
    router.push('/login')
    return
  }
  loadUserInfo()
})
</script>

<style scoped>
.user-center {
  padding: 16px;
}

.user-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info h2 {
  margin: 0;
  font-size: 18px;
}

.info p {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.function-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item .el-icon {
  font-size: 20px;
  color: #666;
}

.function-item span {
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
}

.version-info {
  text-align: center;
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}
</style> 