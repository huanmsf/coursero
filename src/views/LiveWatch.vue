<template>
  <div class="live-watch">
    <div class="live-container">
      <div class="video-container">
        <video ref="videoRef" playsinline></video>
        <div v-if="!isPlaying" class="play-overlay" @click="startPlay">
          <el-button type="primary" size="large" circle>
            <el-icon><VideoPlay /></el-icon>
          </el-button>
          <span>点击播放</span>
        </div>
        <div class="live-info">
          <h1>{{ live.title }}</h1>
          <div class="meta">
            <span class="teacher">
              <el-icon><User /></el-icon>
              {{ live.teacher }}
            </span>
            <span class="viewers">
              <el-icon><View /></el-icon>
              {{ viewerCount }}人观看
            </span>
            <span class="duration">
              <el-icon><Timer /></el-icon>
              {{ formatDuration(liveDuration) }}
            </span>
          </div>
        </div>
      </div>

      <div class="chat-container">
        <div class="chat-messages" ref="messageList">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
          >
            <span class="username">{{ message.username }}：</span>
            <span class="content">{{ message.content }}</span>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="messageInput"
            placeholder="发送消息..."
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, View, Timer, VideoPlay } from '@element-plus/icons-vue'
import { getLiveDetail, getLivePullUrl, getLiveMessages, sendLiveMessage, getLiveStream } from '../api/live'
import Hls from 'hls.js'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)
const messageList = ref(null)
const messageInput = ref('')
const live = ref({})
const viewerCount = ref(0)
const liveDuration = ref(0)
const messages = ref([])
const isPlaying = ref(false)
let hls = null
let messagesTimer = null
let durationTimer = null

// 加载直播信息
const loadLiveDetail = async () => {
  try {
    const { data } = await getLiveDetail(route.params.id)
    live.value = data
  } catch (error) {
    console.error('加载直播详情失败:', error)
    ElMessage.error('加载直播详情失败')
  }
}

// 加载直播流
const loadLiveStream = async () => {
  try {
    const res = await getLiveStream(route.params.id)
    if (res.code === 200 && res.data.stream) {
      // 确保 video 元素已经挂载
      await nextTick()
      const videoElement = videoRef.value
      if (!videoElement) {
        throw new Error('视频元素未找到')
      }
      
      const streamUrl = res.data.stream.streamUrl
      if (!streamUrl) {
        throw new Error('直播流地址无效')
      }

      // 使用 HLS.js 播放视频
      if (Hls.isSupported()) {
        if (hls) {
          hls.destroy()
        }
        hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(videoElement)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(error => {
            console.error('播放失败:', error)
            ElMessage.error('视频播放失败，请重试')
          })
        })
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('网络错误，尝试恢复...')
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('媒体错误，尝试恢复...')
                hls.recoverMediaError()
                break
              default:
                console.error('无法恢复的错误:', data)
                hls.destroy()
                ElMessage.error('视频播放失败，请重试')
                break
            }
          }
        })
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // 对于原生支持 HLS 的浏览器（如 Safari）
        videoElement.src = streamUrl
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play().catch(error => {
            console.error('播放失败:', error)
            ElMessage.error('视频播放失败，请重试')
          })
        })
      } else {
        throw new Error('您的浏览器不支持 HLS 视频播放')
      }
    } else {
      throw new Error(res.message || '获取直播流失败')
    }
  } catch (error) {
    console.error('加载直播流失败:', error)
    ElMessage.error(error.message || '加载直播流失败')
  }
}

// 加载消息
const loadMessages = async () => {
  try {
    const { data } = await getLiveMessages(route.params.id)
    messages.value = data
    scrollToBottom()
  } catch (error) {
    console.error('加载消息失败:', error)
    ElMessage.error('加载消息失败')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  try {
    await sendLiveMessage({
      liveId: route.params.id,
      content: messageInput.value
    })
    messageInput.value = ''
    await loadMessages()
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.chat-messages')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// 格式化时长
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 模拟观众数量变化
const simulateViewerCount = () => {
  setInterval(() => {
    viewerCount.value = Math.floor(Math.random() * 100) + 50
  }, 5000)
}

// 开始计时
const startDurationTimer = () => {
  durationTimer = setInterval(() => {
    liveDuration.value++
  }, 1000)
}

// 停止计时
const stopDurationTimer = () => {
  if (durationTimer) {
    clearInterval(durationTimer)
    durationTimer = null
  }
}

// 开始播放
const startPlay = async () => {
  try {
    await loadLiveStream()
    isPlaying.value = true
    startDurationTimer()
  } catch (error) {
    console.error('开始播放失败:', error)
    ElMessage.error('开始播放失败，请重试')
  }
}

onMounted(() => {
  loadLiveDetail()
  loadMessages()
  simulateViewerCount()
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
    hls = null
  }
  stopDurationTimer()
  if (messagesTimer) {
    clearInterval(messagesTimer)
  }
})
</script>

<style scoped>
.live-watch {
  padding: 20px;
}

.live-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.video-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #fff;
}

.live-info h1 {
  font-size: 24px;
  margin: 0 0 10px;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 12px;
  font-size: 14px;
}

.message .username {
  color: #409EFF;
  font-weight: bold;
}

.message .content {
  color: #606266;
}

.chat-input {
  padding: 20px;
  border-top: 1px solid #EBEEF5;
}

.play-overlay {
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
  gap: 16px;
  cursor: pointer;
  color: #fff;
}

.play-overlay span {
  font-size: 16px;
}
</style> 