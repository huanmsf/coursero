<template>
  <div class="home">
    <div class="page-content">
      <div class="banner">
        <el-carousel height="400px">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <img :src="item.image" :alt="item.title" class="banner-image">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>热门课程</h2>
          <el-button type="primary" link @click="router.push('/courses')">
            查看更多
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="course-grid">
          <div
            v-for="course in hotCourses"
            :key="course.id"
            class="course-card"
            @click="router.push(`/course/${course.id}`)"
          >
            <div class="course-cover">
              <img :src="course.cover" :alt="course.title">
              <div class="course-status" :class="course.status">
                {{ getStatusText(course.status) }}
              </div>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <div class="course-meta">
                <span class="teacher">
                  <el-icon><User /></el-icon>
                  {{ course.teacher.name }}
                </span>
                <span class="students">
                  <el-icon><UserFilled /></el-icon>
                  {{ course.studentCount }}人学习
                </span>
              </div>
              <div class="course-price">
                <span class="price">¥{{ course.price }}</span>
                <el-button type="primary" size="small">立即报名</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>最新直播</h2>
          <el-button type="primary" link @click="router.push('/live')">
            查看更多
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="live-grid">
          <div
            v-for="live in latestLives"
            :key="live.id"
            class="live-card"
            @click="router.push(`/live/${live.id}`)"
          >
            <div class="live-cover">
              <img :src="live.cover" :alt="live.title">
              <div class="live-status" :class="live.status">
                {{ getStatusText(live.status) }}
              </div>
              <div class="live-countdown" v-if="live.status === 'upcoming'">
                {{ formatCountdown(live.startTime) }}
              </div>
            </div>
            <div class="live-info">
              <h3>{{ live.title }}</h3>
              <div class="live-meta">
                <span class="teacher">
                  <el-icon><User /></el-icon>
                  {{ live.teacher }}
                </span>
                <span class="students">
                  <el-icon><UserFilled /></el-icon>
                  {{ live.students }}人报名
                </span>
              </div>
              <div class="live-price">
                <span class="price">¥{{ live.price }}</span>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="live.status === 'ended'"
                >
                  {{ getActionText(live.status) }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, User, UserFilled } from '@element-plus/icons-vue'
import { getCourseList } from '../api/course'
import { getLiveList } from '../api/live'

const router = useRouter()

const banners = ref([
  {
    id: 1,
    title: 'Vue3 实战课程',
    description: '从入门到精通的 Vue3 开发课程',
    image: 'https://picsum.photos/1920/400?random=1'
  },
  {
    id: 2,
    title: 'React 高级开发',
    description: 'React 高级特性与最佳实践',
    image: 'https://picsum.photos/1920/400?random=2'
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    description: 'Node.js 企业级应用开发',
    image: 'https://picsum.photos/1920/400?random=3'
  }
])

const hotCourses = ref([])
const latestLives = ref([])

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    live: '直播中',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const getActionText = (status) => {
  const actionMap = {
    upcoming: '立即报名',
    live: '进入直播',
    ended: '查看回放'
  }
  return actionMap[status] || '报名'
}

const formatCountdown = (startTime) => {
  const now = new Date().getTime()
  const start = new Date(startTime).getTime()
  const diff = start - now

  if (diff <= 0) return '即将开始'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${days}天${hours}时${minutes}分${seconds}秒`
}

const loadHotCourses = async () => {
  try {
    const { data } = await getCourseList({ page: 1, pageSize: 4 })
    hotCourses.value = data.list
  } catch (error) {
    console.error('获取热门课程失败:', error)
  }
}

const loadLatestLives = async () => {
  try {
    const { data } = await getLiveList({ page: 1, pageSize: 4 })
    latestLives.value = data.list
  } catch (error) {
    console.error('获取最新直播失败:', error)
  }
}

onMounted(() => {
  loadHotCourses()
  loadLatestLives()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.nav-menu {
  border-bottom: none;
}

.el-main {
  padding-top: 80px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.banner {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
}

.banner-content h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.banner-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.course-grid,
.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.course-card,
.live-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover,
.live-card:hover {
  transform: translateY(-5px);
}

.course-cover,
.live-cover {
  position: relative;
  padding-top: 56.25%;
}

.course-cover img,
.live-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-status,
.live-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.course-status.upcoming,
.live-status.upcoming {
  background: #409EFF;
}

.course-status.live,
.live-status.live {
  background: #67C23A;
}

.course-status.ended,
.live-status.ended {
  background: #909399;
}

.live-countdown {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

.course-info,
.live-info {
  padding: 16px;
}

.course-info h3,
.live-info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.4;
}

.course-meta,
.live-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.course-meta .el-icon,
.live-meta .el-icon {
  margin-right: 4px;
}

.course-price,
.live-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price .price,
.live-price .price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}
</style> 