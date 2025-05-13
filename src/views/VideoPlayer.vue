<template>
  <div class="video-player">
    <div class="video-container">
      <video
        ref="videoRef"
        class="video"
        controls
        :src="videoUrl"
        @timeupdate="handleTimeUpdate"
        @ended="handleVideoEnded"
      ></video>
    </div>
    
    <div class="video-info">
      <h1>{{ lesson.title }}</h1>
      <div class="meta">
        <span class="duration">{{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}</span>
        <span class="views">{{ lesson.viewCount || 0 }} 次观看</span>
      </div>
      <div class="description">{{ lesson.description }}</div>
    </div>

    <div class="related-lessons" v-if="relatedLessons.length > 0">
      <h2>相关课程</h2>
      <div class="lesson-list">
        <div
          v-for="item in relatedLessons"
          :key="item.id"
          class="lesson-item"
          @click="playLesson(item)"
        >
          <div class="lesson-info">
            <h3>{{ item.title }}</h3>
            <span class="duration">{{ formatDuration(item.duration) }}</span>
          </div>
          <el-button type="primary" link>播放</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getLessonDetail, getRelatedLessons } from '../api/course'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)
const lesson = ref({})
const relatedLessons = ref([])
const currentTime = ref(0)
const duration = ref(0)

// 获取课程详情
const loadLessonDetail = async () => {
  try {
    const { data } = await getLessonDetail(route.params.id)
    lesson.value = data
    if (data.type === 'video') {
      videoRef.value.src = data.videoUrl
    } else if (data.type === 'live' && data.status === 'ended') {
      videoRef.value.src = data.recordUrl
    }
  } catch (error) {
    ElMessage.error('获取课程详情失败')
  }
}

// 获取相关课程
const loadRelatedLessons = async () => {
  try {
    const { data } = await getRelatedLessons(route.params.id)
    relatedLessons.value = data
  } catch (error) {
    ElMessage.error('获取相关课程失败')
  }
}

// 播放其他课程
const playLesson = (item) => {
  router.push(`/video/${item.id}`)
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 视频时间更新
const handleTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

// 视频播放结束
const handleVideoEnded = () => {
  // 可以在这里添加播放结束后的逻辑，比如自动播放下一集
  const currentIndex = relatedLessons.value.findIndex(item => item.id === lesson.value.id)
  if (currentIndex < relatedLessons.value.length - 1) {
    playLesson(relatedLessons.value[currentIndex + 1])
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadLessonDetail()
  loadRelatedLessons()
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
  }
})
</script>

<style scoped>
.video-player {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  margin-bottom: 20px;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-info {
  margin-bottom: 30px;
}

.video-info h1 {
  margin: 0 0 15px;
  font-size: 24px;
}

.meta {
  display: flex;
  gap: 20px;
  color: #666;
  margin-bottom: 15px;
}

.description {
  color: #666;
  line-height: 1.6;
}

.related-lessons {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.related-lessons h2 {
  margin: 0 0 20px;
  font-size: 18px;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.lesson-item:hover {
  background: #f0f2f5;
}

.lesson-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.lesson-info .duration {
  color: #666;
  font-size: 14px;
}
</style> 