<template>
  <div class="live-pusher">
    <div class="video-container">
      <video
        ref="videoRef"
        class="preview"
        autoplay
        muted
        playsinline
      ></video>
      <div class="controls" v-show="showControls">
        <div class="status">
          <el-tag :type="statusType">{{ statusText }}</el-tag>
          <span class="duration">{{ formatTime(duration) }}</span>
        </div>
        <div class="buttons">
          <el-button
            type="primary"
            :icon="isPushing ? 'VideoPause' : 'VideoPlay'"
            @click="togglePush"
          >
            {{ isPushing ? '停止推流' : '开始推流' }}
          </el-button>
          <el-button
            type="info"
            :icon="isMuted ? 'Microphone' : 'Mute'"
            @click="toggleMute"
          >
            {{ isMuted ? '开启麦克风' : '关闭麦克风' }}
          </el-button>
          <el-button
            type="warning"
            :icon="isCameraOff ? 'VideoCamera' : 'VideoCameraFilled'"
            @click="toggleCamera"
          >
            {{ isCameraOff ? '开启摄像头' : '关闭摄像头' }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="settings">
      <el-form label-width="100px">
        <el-form-item label="摄像头">
          <el-select v-model="selectedCamera" @change="handleCameraChange">
            <el-option
              v-for="camera in cameras"
              :key="camera.deviceId"
              :label="camera.label"
              :value="camera.deviceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="麦克风">
          <el-select v-model="selectedMicrophone" @change="handleMicrophoneChange">
            <el-option
              v-for="mic in microphones"
              :key="mic.deviceId"
              :label="mic.label"
              :value="mic.deviceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
          <el-select v-model="selectedResolution" @change="handleResolutionChange">
            <el-option label="720p" value="720p" />
            <el-option label="1080p" value="1080p" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  VideoPlay,
  VideoPause,
  Microphone,
  Mute,
  VideoCamera,
  VideoCameraFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  pushUrl: {
    type: String,
    required: true
  }
})

const videoRef = ref(null)
const stream = ref(null)
const mediaRecorder = ref(null)
const isPushing = ref(false)
const isMuted = ref(false)
const isCameraOff = ref(false)
const duration = ref(0)
const startTime = ref(0)
const timer = ref(null)

const cameras = ref([])
const microphones = ref([])
const selectedCamera = ref('')
const selectedMicrophone = ref('')
const selectedResolution = ref('720p')

const showControls = ref(true)
let controlsTimer = null

const statusType = computed(() => {
  return isPushing.value ? 'success' : 'info'
})

const statusText = computed(() => {
  return isPushing.value ? '推流中' : '未开始'
})

const initDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter(device => device.kind === 'videoinput')
    microphones.value = devices.filter(device => device.kind === 'audioinput')
    
    if (cameras.value.length > 0) {
      selectedCamera.value = cameras.value[0].deviceId
    }
    if (microphones.value.length > 0) {
      selectedMicrophone.value = microphones.value[0].deviceId
    }
  } catch (error) {
    ElMessage.error('获取设备列表失败')
  }
}

const startStream = async () => {
  try {
    const constraints = {
      video: {
        deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined,
        width: selectedResolution.value === '1080p' ? 1920 : 1280,
        height: selectedResolution.value === '1080p' ? 1080 : 720
      },
      audio: {
        deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    videoRef.value.srcObject = stream.value

    // 初始化 MediaRecorder
    mediaRecorder.value = new MediaRecorder(stream.value, {
      mimeType: 'video/webm;codecs=vp8,opus'
    })

    mediaRecorder.value.ondataavailable = handleDataAvailable
    mediaRecorder.value.onstop = handleStop
  } catch (error) {
    ElMessage.error('启动摄像头失败')
  }
}

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    // 发送数据到服务器
    const formData = new FormData()
    formData.append('video', event.data)
    
    fetch(props.pushUrl, {
      method: 'POST',
      body: formData
    }).catch(error => {
      console.error('推流失败:', error)
      ElMessage.error('推流失败')
      stopPush()
    })
  }
}

const handleStop = () => {
  stopStream()
}

const startPush = () => {
  if (!stream.value) {
    ElMessage.warning('请先启动摄像头')
    return
  }

  mediaRecorder.value.start(1000) // 每秒发送一次数据
  isPushing.value = true
  startTime.value = Date.now()
  startTimer()
}

const stopPush = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  isPushing.value = false
  stopTimer()
}

const togglePush = () => {
  if (isPushing.value) {
    stopPush()
  } else {
    startPush()
  }
}

const toggleMute = () => {
  if (stream.value) {
    const audioTracks = stream.value.getAudioTracks()
    audioTracks.forEach(track => {
      track.enabled = !isMuted.value
    })
    isMuted.value = !isMuted.value
  }
}

const toggleCamera = () => {
  if (stream.value) {
    const videoTracks = stream.value.getVideoTracks()
    videoTracks.forEach(track => {
      track.enabled = isCameraOff.value
    })
    isCameraOff.value = !isCameraOff.value
  }
}

const handleCameraChange = async () => {
  if (stream.value) {
    stopStream()
    await startStream()
  }
}

const handleMicrophoneChange = async () => {
  if (stream.value) {
    stopStream()
    await startStream()
  }
}

const handleResolutionChange = async () => {
  if (stream.value) {
    stopStream()
    await startStream()
  }
}

const stopStream = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

const startTimer = () => {
  timer.value = setInterval(() => {
    duration.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const showControlsWithTimeout = () => {
  showControls.value = true
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

onMounted(async () => {
  await initDevices()
  await startStream()
  videoRef.value.addEventListener('mousemove', showControlsWithTimeout)
})

onBeforeUnmount(() => {
  stopPush()
  stopStream()
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  if (videoRef.value) {
    videoRef.value.removeEventListener('mousemove', showControlsWithTimeout)
  }
})
</script>

<style scoped>
.live-pusher {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.video-container {
  flex: 1;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.duration {
  font-size: 14px;
}

.buttons {
  display: flex;
  gap: 8px;
}

.settings {
  width: 300px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 