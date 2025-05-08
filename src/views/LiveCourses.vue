<template>
  <div class="live-courses">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索直播课程"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 直播状态筛选 -->
    <div class="filters">
      <el-radio-group v-model="status" @change="handleFilter">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="upcoming">即将开始</el-radio-button>
        <el-radio-button label="live">直播中</el-radio-button>
        <el-radio-button label="ended">已结束</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 直播课程列表 -->
    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card" @click="viewCourse(course)">
        <div class="course-cover">
          <img :src="course.cover" :alt="course.title">
          <div class="live-status" :class="course.status">
            {{ getStatusText(course.status) }}
          </div>
          <div class="start-time" v-if="course.status === 'upcoming'">
            {{ formatTime(course.startTime) }}
          </div>
        </div>
        <div class="course-info">
          <h3>{{ course.title }}</h3>
          <p class="teacher">{{ course.teacher }}</p>
          <div class="course-meta">
            <span class="price">¥{{ course.price }}</span>
            <span class="students">{{ course.students }}人报名</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <el-button type="primary" :loading="loading" @click="loadMore">
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getLiveCourses } from '../api/course'
import { useCourseStore } from '../store/course'

const router = useRouter()
const courseStore = useCourseStore()

const searchQuery = ref('')
const status = ref('all')
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const hasMore = ref(true)
const courses = ref([])

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    live: '直播中',
    ended: '已结束'
  }
  return statusMap[status] || ''
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

const loadCourses = async (reset = false) => {
  if (loading.value) return
  loading.value = true

  try {
    const currentPage = reset ? 1 : page.value
    const params = {
      page: currentPage,
      pageSize: pageSize.value,
      search: searchQuery.value,
      status: status.value === 'all' ? undefined : status.value
    }

    const res = await getLiveCourses(params)
    if (reset) {
      courses.value = res.data
    } else {
      courses.value = [...courses.value, ...res.data]
    }

    hasMore.value = res.data.length === pageSize.value
    if (hasMore.value) {
      page.value++
    }
  } catch (error) {
    console.error('获取直播课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  loadCourses(true)
}

const handleFilter = () => {
  page.value = 1
  loadCourses(true)
}

const loadMore = () => {
  loadCourses()
}

const viewCourse = (course) => {
  courseStore.setCurrentCourse(course)
  router.push(`/live/${course.id}`)
}

onMounted(() => {
  loadCourses(true)
})
</script>

<style scoped>
.live-courses {
  padding: 16px;
}

.search-bar {
  margin-bottom: 16px;
}

.filters {
  margin-bottom: 16px;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-cover {
  position: relative;
  width: 100%;
  height: 120px;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.live-status.upcoming {
  background-color: #409eff;
}

.live-status.live {
  background-color: #f56c6c;
}

.live-status.ended {
  background-color: #909399;
}

.start-time {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}

.course-info {
  padding: 12px;
}

.course-info h3 {
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.students {
  font-size: 12px;
  color: #999;
}

.load-more {
  margin-top: 20px;
  text-align: center;
}
</style> 