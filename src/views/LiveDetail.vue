<template>
  <div class="live-detail">
    <!-- 直播信息 -->
    <div class="live-header">
      <div class="live-info">
        <h1>{{ course.title }}</h1>
        <div class="meta">
          <span class="teacher">{{ course.teacher }}</span>
          <span class="students">{{ course.students }}人报名</span>
          <span class="price">¥{{ course.price }}</span>
        </div>
        <div class="status" :class="course.status">
          {{ getStatusText(course.status) }}
        </div>
        <div class="actions">
          <el-button type="primary" @click="handleBuy" v-if="!isPurchased">立即报名</el-button>
          <el-button type="success" @click="enterLive" v-else-if="course.status === 'live'">进入直播</el-button>
          <el-button type="info" disabled v-else-if="course.status === 'upcoming'">直播未开始</el-button>
          <el-button type="info" disabled v-else>直播已结束</el-button>
        </div>
      </div>
      <div class="live-cover">
        <img :src="course.cover" :alt="course.title">
        <div class="countdown" v-if="course.status === 'upcoming'">
          <span>距离直播开始还有</span>
          <div class="time">{{ countdown }}</div>
        </div>
      </div>
    </div>

    <!-- 直播内容 -->
    <div class="live-content">
      <div class="video-container">
        <VideoPlayer
          v-if="course.status === 'live'"
          :src="liveUrl"
          :poster="course.cover"
          :allow-danmaku="true"
          :is-live="true"
          ref="videoPlayer"
        />
        <div v-else class="placeholder">
          <img :src="course.cover" alt="课程封面" />
          <div class="placeholder-text">
            <template v-if="course.status === 'upcoming'">
              直播尚未开始
            </template>
            <template v-else>
              直播已结束
            </template>
          </div>
        </div>
      </div>

      <div class="chat-panel" v-if="course.status === 'live'">
        <div class="chat-messages" ref="chatMessagesRef">
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            class="message"
          >
            <span class="username">{{ message.username }}：</span>
            <span class="content">{{ message.content }}</span>
            <el-button
              type="text"
              size="small"
              @click="sendDanmaku(message.content)"
            >
              发送弹幕
            </el-button>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="chatMessage"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          >
            <template #append>
              <el-button @click="sendMessage">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseDetail, getLiveStatus } from '../api/course'
import { useCourseStore } from '../store/course'
import { useUserStore } from '../store/user'
import VideoPlayer from '@/components/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const userStore = useUserStore()

const course = ref({})
const isPurchased = ref(false)
const isLive = ref(false)
const liveUrl = ref('')
const chatMessage = ref('')
const chatMessages = ref([])
const chatMessagesRef = ref(null)
const countdown = ref('')
const videoPlayer = ref(null)

let timer = null
let ws = null

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
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

const updateCountdown = () => {
  const now = new Date().getTime()
  const startTime = new Date(course.value.startTime).getTime()
  const diff = startTime - now

  if (diff <= 0) {
    clearInterval(timer)
    countdown.value = '00:00:00'
    return
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const loadCourseDetail = async () => {
  try {
    const res = await getCourseDetail(route.params.id)
    if (res && res.data) {
      course.value = res.data
      courseStore.setCurrentCourse(course.value)

      if (course.value.status === 'upcoming') {
        timer = setInterval(updateCountdown, 1000)
      }
    } else {
      throw new Error('获取课程数据失败')
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error(error.message || '获取课程详情失败')
    // 如果获取失败，跳转到课程列表页
    router.push('/live')
  }
}

const connectWebSocket = () => {
  ws = new WebSocket(`wss://your-websocket-server/live/${course.value.id}`)

  ws.onopen = () => {
    console.log('WebSocket连接成功')
  }

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    chatMessages.value.push(message)
    nextTick(() => {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    })
  }

  ws.onclose = () => {
    console.log('WebSocket连接关闭')
  }

  ws.onerror = (error) => {
    console.error('WebSocket错误:', error)
  }
}

const sendDanmaku = (content) => {
  if (videoPlayer.value) {
    videoPlayer.value.addDanmaku(content)
  }
}

const sendMessage = () => {
  if (!chatMessage.value.trim()) return

  const message = {
    username: userStore.userInfo.nickname,
    content: chatMessage.value,
    timestamp: new Date().getTime()
  }

  ws.send(JSON.stringify(message))
  chatMessage.value = ''
  
  // 同时发送弹幕
  sendDanmaku(message.content)
}

const handleTimeUpdate = (time) => {
  // 处理播放时间更新
}

const handleBuy = () => {
  router.push(`/payment/${course.value.id}`)
}

const enterLive = async () => {
  try {
    const res = await getLiveStatus(course.value.id)
    liveUrl.value = res.data.streamUrl
    isLive.value = true
    connectWebSocket()
  } catch (error) {
    console.error('获取直播状态失败:', error)
    ElMessage.error('获取直播状态失败')
  }
}

onMounted(() => {
  loadCourseDetail()
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (ws) {
    ws.close()
  }
})
</script>

<style scoped>
.live-detail {
  padding: 16px;
}

.live-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.live-info {
  flex: 1;
}

.live-info h1 {
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

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  margin-bottom: 16px;
}

.status.upcoming {
  background-color: #409eff;
}

.status.live {
  background-color: #f56c6c;
}

.status.ended {
  background-color: #909399;
}

.live-cover {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.live-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.countdown {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.countdown .time {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
}

.live-content {
  display: flex;
  gap: 20px;
}

.video-container {
  flex: 1;
  display: flex;
  gap: 20px;
}

.placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.message {
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.message .el-button {
  margin-left: auto;
}

.username {
  color: #409eff;
  font-weight: bold;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #eee;
}

.live-info-panel {
  flex: 1;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.info-item {
  margin-bottom: 12px;
}

.info-item .label {
  color: #666;
  margin-right: 8px;
}

.info-item .value {
  color: #333;
}
</style> 