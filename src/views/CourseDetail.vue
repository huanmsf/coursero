<template>
  <div class="course-detail">
    <!-- 课程信息 -->
    <div class="course-header">
      <div class="course-info">
        <h1>{{ course.title }}</h1>
        <div class="meta">
          <span class="teacher">{{ course.teacher }}</span>
          <span class="students">{{ course.students }}人学习</span>
          <span class="price">¥{{ course.price }}</span>
        </div>
        <div class="actions">
          <el-button type="primary" @click="handleBuy" v-if="!isPurchased">立即购买</el-button>
          <el-button type="success" @click="handleStudy" v-else>开始学习</el-button>
        </div>
      </div>
      <div class="course-cover">
        <img :src="course.cover" :alt="course.title">
      </div>
    </div>

    <!-- 课程内容 -->
    <div class="course-content">
      <div class="video-player">
        <VideoPlayer
          v-if="currentLesson"
          :src="currentLesson.videoUrl"
          :poster="course.cover"
          :is-vip="course.isVip"
          :preview-time="course.previewTime || 300"
          :token="userToken"
          @timeupdate="handleTimeUpdate"
          @buy-vip="handleBuyVip"
        />
        <div v-else class="no-lesson">
          <el-empty description="请选择要学习的章节" />
        </div>
      </div>
      <div class="lesson-list">
        <div class="lesson-item"
          v-for="lesson in lessons"
          :key="lesson.id"
          :class="{ active: currentLesson?.id === lesson.id }"
          @click="playLesson(lesson)"
        >
          <div class="lesson-info">
            <span class="lesson-title">{{ lesson.title }}</span>
            <span class="lesson-duration">{{ formatDuration(lesson.duration) }}</span>
          </div>
          <div class="lesson-progress" v-if="lesson.progress">
            <el-progress :percentage="lesson.progress" :show-text="false" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseDetail, getCourseLessons } from '../api/course'
import { useCourseStore } from '../store/course'
import VideoPlayer from '../components/VideoPlayer.vue'
import { useUserStore } from '../store/user'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const userStore = useUserStore()

const course = ref({})
const lessons = ref([])
const currentLesson = ref(null)
const isPurchased = ref(false)

const userToken = computed(() => userStore.token)

const loadCourseDetail = async () => {
  try {
    const res = await getCourseDetail(route.params.id)
    course.value = res.data
    courseStore.setCurrentCourse(course.value)
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error('获取课程详情失败')
  }
}

const loadLessons = async () => {
  try {
    const res = await getCourseLessons(route.params.id)
    lessons.value = res.data
    if (lessons.value.length > 0) {
      currentLesson.value = lessons.value[0]
    }
  } catch (error) {
    console.error('获取课程章节失败:', error)
    ElMessage.error('获取课程章节失败')
  }
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const playLesson = (lesson) => {
  currentLesson.value = lesson
}

const handleTimeUpdate = (time) => {
  if (currentLesson.value) {
    const progress = (time / currentLesson.value.duration) * 100
    currentLesson.value.progress = Math.min(progress, 100)
  }
}

const handleBuy = () => {
  router.push(`/payment/${course.value.id}`)
}

const handleStudy = () => {
  if (lessons.value.length > 0) {
    currentLesson.value = lessons.value[0]
  }
}

const handleBuyVip = () => {
  router.push('/vip')
}

onMounted(async () => {
  await loadCourseDetail()
  await loadLessons()
})
</script>

<style scoped>
.course-detail {
  padding: 16px;
}

.course-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-info {
  flex: 1;
}

.course-info h1 {
  margin: 0 0 16px;
  font-size: 24px;
}

.meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: #666;
}

.teacher {
  color: #409eff;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.course-cover {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-content {
  display: flex;
  gap: 20px;
}

.video-player {
  flex: 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.no-lesson {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.lesson-list {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lesson-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-item.active {
  background: #f0f7ff;
}

.lesson-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.lesson-title {
  font-size: 14px;
  color: #333;
}

.lesson-duration {
  font-size: 12px;
  color: #999;
}

.lesson-progress {
  height: 4px;
}
</style> 