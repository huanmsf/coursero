<template>
  <div class="live-push">
    <div class="live-container">
      <div class="video-container">
        <video ref="localVideo" autoplay muted playsinline></video>
        <div class="controls">
          <el-button type="primary" @click="startLive" :disabled="isLive">
            <el-icon><VideoPlay /></el-icon>
            开始直播
          </el-button>
          <el-button type="danger" @click="stopLive" :disabled="!isLive">
            <el-icon><VideoPause /></el-icon>
            结束直播
          </el-button>
          <el-button @click="toggleCamera" :disabled="!isLive || streamType === 'desktop'">
            <el-icon><Camera /></el-icon>
            {{ isCameraOn ? '关闭摄像头' : '开启摄像头' }}
          </el-button>
          <el-button @click="toggleMicrophone" :disabled="!isLive">
            <el-icon><Microphone /></el-icon>
            {{ isMicrophoneOn ? '关闭麦克风' : '开启麦克风' }}
          </el-button>
          <el-button @click="switchStreamSource" :disabled="isLive">
            <el-icon><Monitor /></el-icon>
            {{ streamType === 'camera' ? '切换到桌面共享' : '切换到摄像头' }}
          </el-button>
        </div>
      </div>
      <div class="info-panel">
        <h2>直播信息</h2>
        <div class="info-item">
          <span class="label">直播标题：</span>
          <el-input v-model="liveTitle" placeholder="请输入直播标题" />
        </div>
        <div class="info-item">
          <span class="label">直播分类：</span>
          <el-select v-model="liveCategory" placeholder="请选择分类">
            <el-option label="前端开发" value="frontend" />
            <el-option label="后端开发" value="backend" />
            <el-option label="移动开发" value="mobile" />
            <el-option label="人工智能" value="ai" />
          </el-select>
        </div>
        <div class="info-item">
          <span class="label">直播来源：</span>
          <el-tag :type="streamType === 'camera' ? 'primary' : 'success'">
            {{ streamType === 'camera' ? '摄像头' : '桌面共享' }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">直播状态：</span>
          <el-tag :type="isLive ? 'success' : 'info'">
            {{ isLive ? '直播中' : '未开始' }}
          </el-tag>
        </div>
        <div class="info-item" v-if="isLive">
          <span class="label">观看人数：</span>
          <span class="value">{{ viewerCount }}</span>
        </div>
        <div class="info-item" v-if="isLive">
          <span class="label">直播时长：</span>
          <span class="value">{{ formatDuration(liveDuration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { VideoPlay, VideoPause, Camera, Microphone, Monitor } from '@element-plus/icons-vue'
import { startLiveStream, stopLiveStream, createLive } from '../api/live'

const router = useRouter()
const localVideo = ref(null)
const isLive = ref(false)
const isCameraOn = ref(true)
const isMicrophoneOn = ref(true)
const liveTitle = ref('')
const liveCategory = ref('')
const viewerCount = ref(0)
const liveDuration = ref(0)
const streamType = ref('camera') // 'camera' 或 'desktop'
let mediaStream = null
let durationTimer = null

// 切换流媒体来源
const switchStreamSource = async () => {
  if (isLive.value) {
    ElMessage.warning('请先结束直播再切换来源')
    return
  }

  try {
    if (streamType.value === 'camera') {
      // 切换到桌面共享
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false // 桌面共享时不自动请求音频
      })
      streamType.value = 'desktop'
    } else {
      // 切换到摄像头
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false // 不自动请求音频
        })
      } catch (error) {
        if (error.name === 'NotFoundError') {
          ElMessage.warning('未找到摄像头设备')
          return
        }
        throw error
      }
      streamType.value = 'camera'
    }
    
    // 显示预览
    localVideo.value.srcObject = mediaStream
    
    // 监听流结束事件
    mediaStream.getVideoTracks()[0].onended = () => {
      if (streamType.value === 'desktop') {
        ElMessage.info('桌面共享已结束')
        switchStreamSource()
      }
    }
  } catch (error) {
    console.error('切换流媒体来源失败:', error)
    ElMessage.error('切换流媒体来源失败')
  }
}

// 开始直播
const startLive = async () => {
  if (!liveTitle.value) {
    ElMessage.warning('请输入直播标题')
    return
  }
  if (!liveCategory.value) {
    ElMessage.warning('请选择直播分类')
    return
  }

  try {
    // 如果没有媒体流，先获取
    if (!mediaStream) {
      if (streamType.value === 'camera') {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false // 不自动请求音频
          })
        } catch (error) {
          if (error.name === 'NotFoundError') {
            ElMessage.warning('未找到摄像头设备')
            return
          }
          throw error
        }
      } else {
        // 桌面共享
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
            displaySurface: 'monitor',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: false
        })
      }
    }
    
    // 显示本地视频
    localVideo.value.srcObject = mediaStream
    
    // 监听流结束事件
    mediaStream.getVideoTracks()[0].onended = () => {
      if (streamType.value === 'desktop') {
        ElMessage.info('桌面共享已结束')
        stopLive()
      }
    }
    
    // 先创建直播
    const { data: liveData } = await createLive({
      title: liveTitle.value,
      category: liveCategory.value,
      streamType: streamType.value
    })

    // 开始直播
    await startLiveStream({
      id: liveData.id,
      stream: mediaStream
    })
    
    isLive.value = true
    ElMessage.success('直播已开始')
    
    // 开始计时
    startDurationTimer()
    
    // 模拟观众数量变化
    simulateViewerCount()
  } catch (error) {
    console.error('开始直播失败:', error)
    ElMessage.error('开始直播失败')
  }
}

// 结束直播
const stopLive = async () => {
  try {
    await stopLiveStream()
    
    // 停止媒体流
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      mediaStream = null
    }
    
    isLive.value = false
    ElMessage.success('直播已结束')
    
    // 停止计时
    stopDurationTimer()
    
    // 重置数据
    viewerCount.value = 0
    liveDuration.value = 0
  } catch (error) {
    console.error('结束直播失败:', error)
    ElMessage.error('结束直播失败')
  }
}

// 切换摄像头
const toggleCamera = async () => {
  if (!mediaStream) return

  try {
    const videoTrack = mediaStream.getVideoTracks()[0]
    if (videoTrack) {
      if (videoTrack.enabled) {
        videoTrack.enabled = false
        isCameraOn.value = false
      } else {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          })
          const newVideoTrack = newStream.getVideoTracks()[0]
          mediaStream.removeTrack(videoTrack)
          mediaStream.addTrack(newVideoTrack)
          isCameraOn.value = true
        } catch (error) {
          if (error.name === 'NotFoundError') {
            ElMessage.error('未找到摄像头设备')
            return
          }
          throw error
        }
      }
    }
  } catch (error) {
    console.error('切换摄像头失败:', error)
    ElMessage.error('切换摄像头失败')
  }
}

// 切换麦克风
const toggleMicrophone = async () => {
  if (!mediaStream) return

  try {
    const audioTrack = mediaStream.getAudioTracks()[0]
    if (audioTrack) {
      if (audioTrack.enabled) {
        audioTrack.enabled = false
        isMicrophoneOn.value = false
      } else {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          })
          const newAudioTrack = newStream.getAudioTracks()[0]
          if (audioTrack) {
            mediaStream.removeTrack(audioTrack)
          }
          mediaStream.addTrack(newAudioTrack)
          isMicrophoneOn.value = true
        } catch (error) {
          if (error.name === 'NotFoundError') {
            ElMessage.error('未找到麦克风设备')
            return
          }
          throw error
        }
      }
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        })
        const newAudioTrack = newStream.getAudioTracks()[0]
        mediaStream.addTrack(newAudioTrack)
        isMicrophoneOn.value = true
      } catch (error) {
        if (error.name === 'NotFoundError') {
          ElMessage.error('未找到麦克风设备')
          return
        }
        throw error
      }
    }
  } catch (error) {
    console.error('切换麦克风失败:', error)
    ElMessage.error('切换麦克风失败')
  }
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

// 模拟观众数量变化
const simulateViewerCount = () => {
  setInterval(() => {
    if (isLive.value) {
      viewerCount.value = Math.floor(Math.random() * 100) + 1
    }
  }, 5000)
}

// 格式化时长
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  stopDurationTimer()
})
</script>

<style scoped>
.live-push {
  padding: 20px;
  min-height: calc(100vh - 40px);
  background: #f5f7fa;
}

.live-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
}

.video-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 16/9;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex: 1;
  position: relative;
  z-index: 1;
}

.controls {
  padding: 20px;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.info-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.info-panel h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}

.info-item {
  margin-bottom: 20px;
}

.info-item .label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

:deep(.el-input),
:deep(.el-select) {
  width: 100%;
}

:deep(.el-button) {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style> 