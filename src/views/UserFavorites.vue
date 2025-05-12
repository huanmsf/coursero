<template>
  <div class="user-favorites">
    <h1>我的收藏</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="课程收藏" name="courses">
        <div class="course-grid">
          <div v-for="course in favoriteCourses" :key="course.id" class="course-card">
            <div class="cover">
              <img :src="course.cover" :alt="course.title" />
              <div class="actions">
                <el-button type="primary" @click="handleView(course)">查看课程</el-button>
                <el-button type="danger" @click="handleUnfavorite(course)">取消收藏</el-button>
              </div>
            </div>
            <div class="info">
              <h3>{{ course.title }}</h3>
              <p class="teacher">{{ course.teacher }}</p>
              <div class="stats">
                <span>
                  <el-icon><User /></el-icon>
                  {{ course.students }} 学员
                </span>
                <span class="price">¥{{ course.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="直播收藏" name="lives">
        <div class="live-grid">
          <div v-for="live in favoriteLives" :key="live.id" class="live-card">
            <div class="cover">
              <img :src="live.cover" :alt="live.title" />
              <div class="status" :class="live.status">
                {{ getStatusText(live.status) }}
              </div>
              <div class="countdown" v-if="live.status === 'upcoming'">
                {{ formatCountdown(live.startTime) }}
              </div>
              <div class="actions">
                <el-button type="primary" @click="handleViewLive(live)">查看直播</el-button>
                <el-button type="danger" @click="handleUnfavoriteLive(live)">取消收藏</el-button>
              </div>
            </div>
            <div class="info">
              <h3>{{ live.title }}</h3>
              <p class="teacher">{{ live.teacher }}</p>
              <div class="stats">
                <span>
                  <el-icon><User /></el-icon>
                  {{ live.students }} 学员
                </span>
                <span class="price">¥{{ live.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('courses')

// 模拟收藏的课程数据
const favoriteCourses = ref([
  {
    id: 1,
    title: 'Vue.js 高级特性实战',
    teacher: '张老师',
    students: 1000,
    price: 299,
    cover: 'https://picsum.photos/800/450?random=1'
  },
  {
    id: 2,
    title: 'React Hooks 完全指南',
    teacher: '李老师',
    students: 800,
    price: 199,
    cover: 'https://picsum.photos/800/450?random=2'
  }
])

// 模拟收藏的直播数据
const favoriteLives = ref([
  {
    id: 1,
    title: 'Vue.js 高级特性实战',
    teacher: '张老师',
    students: 1000,
    price: 299,
    cover: 'https://picsum.photos/800/450?random=3',
    status: 'upcoming',
    startTime: new Date(Date.now() + 3600000) // 1小时后
  },
  {
    id: 2,
    title: 'React Hooks 完全指南',
    teacher: '李老师',
    students: 800,
    price: 199,
    cover: 'https://picsum.photos/800/450?random=4',
    status: 'live'
  }
])

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    upcoming: '即将开始',
    live: '直播中',
    ended: '已结束'
  }
  return texts[status] || status
}

// 格式化倒计时
const formatCountdown = (startTime) => {
  const now = new Date()
  const diff = startTime - now
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours}小时${minutes}分钟后开始`
}

// 查看课程
const handleView = (course) => {
  router.push(`/courses/${course.id}`)
}

// 查看直播
const handleViewLive = (live) => {
  router.push(`/live/${live.id}`)
}

// 取消收藏课程
const handleUnfavorite = (course) => {
  ElMessageBox.confirm(
    '确定要取消收藏该课程吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    favoriteCourses.value = favoriteCourses.value.filter(c => c.id !== course.id)
    ElMessage.success('已取消收藏')
  })
}

// 取消收藏直播
const handleUnfavoriteLive = (live) => {
  ElMessageBox.confirm(
    '确定要取消收藏该直播吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    favoriteLives.value = favoriteLives.value.filter(l => l.id !== live.id)
    ElMessage.success('已取消收藏')
  })
}
</script>

<style scoped>
.user-favorites {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-favorites h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

:deep(.el-tabs__nav) {
  margin-bottom: 20px;
}

.course-grid,
.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card,
.live-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.course-card:hover,
.live-card:hover {
  transform: translateY(-5px);
}

.cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover:hover .actions {
  opacity: 1;
}

.status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.status.upcoming {
  background-color: #e6a23c;
}

.status.live {
  background-color: #f56c6c;
}

.status.ended {
  background-color: #909399;
}

.countdown {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
}

.info {
  padding: 20px;
}

.info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.teacher {
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}
</style> 