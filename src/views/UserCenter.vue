<template>
  <div class="user-center">
    <div class="page-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="user-sidebar">
            <div class="user-info">
              <el-avatar :size="80" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.username?.charAt(0) }}
              </el-avatar>
              <h3>{{ userStore.userInfo?.username }}</h3>
              <p>{{ userStore.userInfo?.email }}</p>
            </div>
            <el-menu
              :default-active="activeMenu"
              class="user-menu"
              @select="handleMenuSelect"
            >
              <el-menu-item index="profile">
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item index="orders">
                <el-icon><List /></el-icon>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="favorites">
                <el-icon><Star /></el-icon>
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="learning">
                <el-icon><VideoPlay /></el-icon>
                <span>学习记录</span>
              </el-menu-item>
              <el-menu-item index="security">
                <el-icon><Lock /></el-icon>
                <span>账号安全</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="user-content">
            <!-- 个人资料 -->
            <div v-if="activeMenu === 'profile'" class="profile-section">
              <h2>个人资料</h2>
              <el-form
                ref="profileForm"
                :model="profileData"
                :rules="profileRules"
                label-width="100px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="profileData.username" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileData.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileData.phone" />
                </el-form-item>
                <el-form-item label="个人简介" prop="bio">
                  <el-input
                    v-model="profileData.bio"
                    type="textarea"
                    :rows="4"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleUpdateProfile">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 我的订单 -->
            <div v-if="activeMenu === 'orders'" class="orders-section">
              <h2>我的订单</h2>
              <el-table :data="orders" style="width: 100%">
                <el-table-column prop="orderNo" label="订单号" width="180" />
                <el-table-column prop="courseName" label="课程名称" />
                <el-table-column prop="price" label="价格" width="100">
                  <template #default="{ row }">
                    ¥{{ row.price }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getOrderStatusType(row.status)">
                      {{ getOrderStatusText(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
              </el-table>
            </div>

            <!-- 我的收藏 -->
            <div v-if="activeMenu === 'favorites'" class="favorites-section">
              <h2>我的收藏</h2>
              <div class="course-grid">
                <div
                  v-for="course in favorites"
                  :key="course.id"
                  class="course-card"
                  @click="router.push(`/course/${course.id}`)"
                >
                  <div class="course-cover">
                    <img :src="course.cover" :alt="course.title">
                  </div>
                  <div class="course-info">
                    <h3>{{ course.title }}</h3>
                    <p class="course-desc">{{ course.description }}</p>
                    <div class="course-meta">
                      <span class="teacher">
                        <el-icon><User /></el-icon>
                        {{ course.teacher }}
                      </span>
                      <span class="students">
                        <el-icon><UserFilled /></el-icon>
                        {{ course.students }}人学习
                      </span>
                    </div>
                    <div class="course-price">
                      <span class="price">¥{{ course.price }}</span>
                      <el-button type="primary" size="small">
                        立即报名
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习记录 -->
            <div v-if="activeMenu === 'learning'" class="learning-section">
              <h2>学习记录</h2>
              <el-table :data="learningHistory" style="width: 100%">
                <el-table-column prop="courseName" label="课程名称" />
                <el-table-column prop="lessonName" label="课时名称" />
                <el-table-column prop="progress" label="学习进度" width="180">
                  <template #default="{ row }">
                    <el-progress
                      :percentage="row.progress"
                      :format="format"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="lastLearnTime" label="最后学习时间" width="180" />
                <el-table-column label="操作" width="120">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      @click="router.push(`/course/${row.courseId}`)"
                    >
                      继续学习
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 账号安全 -->
            <div v-if="activeMenu === 'security'" class="security-section">
              <h2>账号安全</h2>
              <el-form
                ref="passwordForm"
                :model="passwordData"
                :rules="passwordRules"
                label-width="100px"
              >
                <el-form-item label="当前密码" prop="oldPassword">
                  <el-input
                    v-model="passwordData.oldPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordData.newPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordData.confirmPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword">
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import {
  User,
  List,
  Star,
  VideoPlay,
  Lock,
  UserFilled
} from '@element-plus/icons-vue'
import {
  getUserOrders,
  getUserFavorites,
  getUserLearningHistory
} from '../api/user'

const router = useRouter()
const userStore = useUserStore()
const activeMenu = ref('profile')

// 个人资料
const profileForm = ref(null)
const profileData = reactive({
  username: userStore.userInfo?.username || '',
  email: userStore.userInfo?.email || '',
  phone: userStore.userInfo?.phone || '',
  bio: userStore.userInfo?.bio || ''
})

const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码修改
const passwordForm = ref(null)
const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (passwordData.confirmPassword !== '') {
      passwordForm.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordData.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
}

// 订单数据
const orders = ref([])

// 收藏数据
const favorites = ref([])

// 学习记录
const learningHistory = ref([])

// 获取订单列表
const loadOrders = async () => {
  try {
    const { data } = await getUserOrders()
    orders.value = data.list
  } catch (error) {
    console.error('获取订单列表失败:', error)
  }
}

// 获取收藏列表
const loadFavorites = async () => {
  try {
    const { data } = await getUserFavorites()
    favorites.value = data.list
  } catch (error) {
    console.error('获取收藏列表失败:', error)
  }
}

// 获取学习记录
const loadLearningHistory = async () => {
  try {
    const { data } = await getUserLearningHistory()
    learningHistory.value = data.list
  } catch (error) {
    console.error('获取学习记录失败:', error)
  }
}

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index
  switch (index) {
    case 'orders':
      loadOrders()
      break
    case 'favorites':
      loadFavorites()
      break
    case 'learning':
      loadLearningHistory()
      break
  }
}

// 更新个人资料
const handleUpdateProfile = async () => {
  if (!profileForm.value) return
  
  try {
    await profileForm.value.validate()
    await userStore.updateUserInfoAction(profileData)
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error(error.message || '更新失败')
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordForm.value) return
  
  try {
    await passwordForm.value.validate()
    await userStore.changePasswordAction({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.value.resetFields()
  } catch (error) {
    ElMessage.error(error.message || '密码修改失败')
  }
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

// 获取订单状态类型
const getOrderStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'info',
    refunded: 'danger'
  }
  return typeMap[status] || ''
}

// 格式化进度条
const format = (percentage) => {
  return percentage === 100 ? '完成' : `${percentage}%`
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.user-sidebar {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.user-info h3 {
  margin: 10px 0 5px;
  color: #303133;
}

.user-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.user-menu {
  border-right: none;
}

.user-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-content h2 {
  margin: 0 0 20px;
  color: #303133;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-cover {
  position: relative;
  padding-top: 56.25%;
}

.course-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 16px;
}

.course-info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.course-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.course-meta .el-icon {
  margin-right: 4px;
}

.course-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price .price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}
</style> 