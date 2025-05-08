<template>
  <div class="live-push">
    <div class="header">
      <h1>{{ live.title }}</h1>
      <div class="status">
        <el-tag :type="statusType">{{ statusText }}</el-tag>
        <span class="time">{{ formatTime(startTime) }}</span>
      </div>
    </div>

    <div class="content">
      <div class="main">
        <LivePusher
          v-if="pushUrl"
          :push-url="pushUrl"
          @start="handleStart"
          @stop="handleStop"
        />
      </div>

      <div class="sidebar">
        <div class="stats">
          <h3>直播数据</h3>
          <div class="stat-item">
            <span class="label">观看人数</span>
            <span class="value">{{ stats.viewers }}</span>
          </div>
          <div class="stat-item">
            <span class="label">点赞数</span>
            <span class="value">{{ stats.likes }}</span>
          </div>
          <div class="stat-item">
            <span class="label">评论数</span>
            <span class="value">{{ stats.comments }}</span>
          </div>
        </div>

        <div class="messages">
          <h3>实时消息</h3>
          <div class="message-list" ref="messageList">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message"
            >
              <span class="username">{{ message.username }}：</span>
              <span class="content">{{ message.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LivePusher from '../components/LivePusher.vue'
import {
  getLiveDetail,
  getLivePushUrl,
  getLiveStats,
  getLiveMessages,
  startLive,
  endLive
} from '../api/live'

const route = useRoute()
const router = useRouter()

const live = ref({})
const pushUrl = ref('')
const stats = ref({
  viewers: 0,
  likes: 0,
  comments: 0
})
const messages = ref([])
const startTime = ref(0)
const isLive = ref(false)

const statusType = computed(() => {
  return isLive.value ? 'success' : 'info'
})

const statusText = computed(() => {
  return isLive.value ? '直播中' : '未开始'
})

const loadLiveDetail = async () => {
  try {
    const { data } = await getLiveDetail(route.params.id)
    live.value = data
  } catch (error) {
    ElMessage.error('获取直播信息失败')
  }
}

const loadPushUrl = async () => {
  try {
    const { data } = await getLivePushUrl(route.params.id)
    pushUrl.value = data.url
  } catch (error) {
    ElMessage.error('获取推流地址失败')
  }
}

const loadStats = async () => {
  try {
    const { data } = await getLiveStats(route.params.id)
    stats.value = data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const loadMessages = async () => {
  try {
    const { data } = await getLiveMessages(route.params.id)
    messages.value = data
    scrollToBottom()
  } catch (error) {
    console.error('获取消息失败:', error)
  }
}

const handleStart = async () => {
  try {
    await startLive(route.params.id)
    isLive.value = true
    startTime.value = Date.now()
    ElMessage.success('直播已开始')
  } catch (error) {
    ElMessage.error('开始直播失败')
  }
}

const handleStop = async () => {
  try {
    await endLive(route.params.id)
    isLive.value = false
    ElMessage.success('直播已结束')
    router.push(`/live/${route.params.id}`)
  } catch (error) {
    ElMessage.error('结束直播失败')
  }
}

const scrollToBottom = () => {
  const messageList = document.querySelector('.message-list')
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '00:00:00'
  const now = Date.now()
  const diff = Math.floor((now - timestamp) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

let statsTimer = null
let messagesTimer = null

onMounted(async () => {
  await loadLiveDetail()
  await loadPushUrl()
  
  // 定时更新统计数据
  statsTimer = setInterval(loadStats, 5000)
  
  // 定时更新消息
  messagesTimer = setInterval(loadMessages, 3000)
})

onBeforeUnmount(() => {
  if (statsTimer) {
    clearInterval(statsTimer)
  }
  if (messagesTimer) {
    clearInterval(messagesTimer)
  }
})
</script>

<style scoped>
.live-push {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #303133;
}

.status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time {
  font-size: 14px;
  color: #606266;
}

.content {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.main {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stats h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-item .label {
  color: #606266;
}

.stat-item .value {
  color: #409EFF;
  font-weight: bold;
}

.messages {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.messages h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.message {
  margin-bottom: 8px;
  font-size: 14px;
}

.message .username {
  color: #409EFF;
  font-weight: bold;
}

.message .content {
  color: #606266;
}
</style> 