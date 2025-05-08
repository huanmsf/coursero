<template>
  <div class="video-player">
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      class="video"
      @timeupdate="handleTimeUpdate"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
    ></video>
    <div class="danmaku-container" ref="danmakuContainer">
      <div
        v-for="(danmaku, index) in activeDanmakus"
        :key="index"
        class="danmaku"
        :style="{
          top: `${danmaku.top}px`,
          color: danmaku.color,
          fontSize: `${danmaku.size}px`,
          animationDuration: `${danmaku.duration}s`
        }"
      >
        {{ danmaku.content }}
      </div>
    </div>
    <div class="controls" v-show="showControls">
      <div class="progress-bar" @click="handleSeek">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
        <div class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
        <div class="preview-mask" v-if="isVip && isPreviewEnded" :style="{ width: `${(previewTime / duration) * 100}%` }"></div>
      </div>
      <div class="buttons">
        <el-button type="text" @click="togglePlay">
          <el-icon :size="20">
            <component :is="isPlaying ? 'VideoPause' : 'VideoPlay'" />
          </el-icon>
        </el-button>
        <el-button type="text" @click="toggleMute">
          <el-icon :size="20">
            <component :is="isMuted ? 'Mute' : 'Microphone'" />
          </el-icon>
        </el-button>
        <el-slider
          v-model="volume"
          :min="0"
          :max="100"
          :step="1"
          :show-tooltip="false"
          class="volume-slider"
          @change="handleVolumeChange"
        />
        <el-button type="text" @click="toggleFullscreen">
          <el-icon :size="20">
            <component :is="isFullscreen ? 'Close' : 'FullScreen'" />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="preview-overlay" v-if="isVip && isPreviewEnded">
      <div class="preview-content">
        <h3>试看时间已结束</h3>
        <p>购买VIP即可观看完整内容</p>
        <el-button type="primary" @click="handleBuyVip">立即购买</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  VideoPlay,
  VideoPause,
  Microphone,
  Mute,
  FullScreen,
  Close
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Hls from 'hls.js'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  allowDanmaku: {
    type: Boolean,
    default: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  isVip: {
    type: Boolean,
    default: false
  },
  previewTime: {
    type: Number,
    default: 300
  },
  token: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['timeupdate', 'play', 'pause', 'ended'])

const videoRef = ref(null)
const showControls = ref(true)
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const volume = ref(100)

let controlsTimer = null

const danmakuContainer = ref(null)
const danmakus = ref([])
const activeDanmakus = ref([])

const colors = ['#fff', '#ff0', '#0ff', '#f0f', '#0f0', '#f00']
const sizes = [16, 18, 20]

const isPreviewEnded = ref(false)
const previewEndTime = ref(0)

let hls = null

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  
  currentTime.value = videoRef.value.currentTime
  duration.value = videoRef.value.duration
  progress.value = (currentTime.value / duration.value) * 100
  
  // 检查试看时间
  if (props.isVip && !isPreviewEnded.value) {
    if (currentTime.value >= props.previewTime) {
      isPreviewEnded.value = true
      previewEndTime.value = currentTime.value
      videoRef.value.pause()
      ElMessage.warning('试看时间已结束，请购买VIP继续观看')
    }
  }
  
  emit('timeupdate', currentTime.value)
}

const handleSeek = (e) => {
  if (!props.isVip || !isPreviewEnded.value) return
  
  const rect = e.target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const seekTime = percent * duration.value
  
  // 如果尝试跳转到试看时间之后，则不允许
  if (seekTime > props.previewTime) {
    e.preventDefault()
    ElMessage.warning('试看时间已结束，请购买VIP继续观看')
    return
  }
  
  videoRef.value.currentTime = seekTime
}

const handlePlay = () => {
  if (props.isVip && isPreviewEnded.value) {
    videoRef.value.pause()
    ElMessage.warning('试看时间已结束，请购买VIP继续观看')
    return
  }
  
  isPlaying.value = true
  emit('play')
}

const handlePause = () => {
  isPlaying.value = false
  emit('pause')
}

const handleEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const togglePlay = () => {
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

const handleVolumeChange = (value) => {
  videoRef.value.volume = value / 100
  isMuted.value = value === 0
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const hideControls = () => {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

const showControlsWithTimeout = () => {
  showControls.value = true
  hideControls()
}

const addDanmaku = (content, options = {}) => {
  if (!props.allowDanmaku) return
  
  const danmaku = {
    content,
    top: Math.random() * (danmakuContainer.value?.clientHeight || 300),
    color: options.color || colors[Math.floor(Math.random() * colors.length)],
    size: options.size || sizes[Math.floor(Math.random() * sizes.length)],
    duration: options.duration || 10,
    timestamp: Date.now()
  }
  
  danmakus.value.push(danmaku)
  activeDanmakus.value.push(danmaku)
  
  setTimeout(() => {
    const index = activeDanmakus.value.indexOf(danmaku)
    if (index > -1) {
      activeDanmakus.value.splice(index, 1)
    }
  }, danmaku.duration * 1000)
}

const handleBuyVip = () => {
  // 实现购买VIP的逻辑
}

const initHls = () => {
  if (Hls.isSupported()) {
    hls = new Hls({
      xhrSetup: (xhr, url) => {
        // 添加token到请求头
        xhr.setRequestHeader('Authorization', `Bearer ${props.token}`)
      }
    })
    
    hls.loadSource(props.src)
    hls.attachMedia(videoRef.value)
    
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (props.isVip) {
        // 设置最大播放时间为试看时间
        videoRef.value.currentTime = 0
        videoRef.value.duration = props.previewTime
      }
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
            console.error('无法恢复的错误')
            hls.destroy()
            break
        }
      }
    })
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    // 对于Safari浏览器
    videoRef.value.src = props.src
  }
}

onMounted(() => {
  initHls()
  videoRef.value.addEventListener('mousemove', showControlsWithTimeout)
  videoRef.value.addEventListener('mouseleave', hideControls)
})

onBeforeUnmount(() => {
  if (hls) {
    hls.destroy()
  }
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  videoRef.value.removeEventListener('mousemove', showControlsWithTimeout)
  videoRef.value.removeEventListener('mouseleave', hideControls)
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 16px;
  transition: opacity 0.3s;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-bottom: 8px;
  cursor: pointer;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #409eff;
  border-radius: 2px;
}

.time {
  position: absolute;
  top: -20px;
  right: 0;
  color: #fff;
  font-size: 12px;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.volume-slider {
  width: 100px;
}

:deep(.el-slider__runway) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-slider__bar) {
  background-color: #409eff;
}

:deep(.el-slider__button) {
  border-color: #409eff;
}

.danmaku-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.danmaku {
  position: absolute;
  white-space: nowrap;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: danmaku-move linear;
  animation-fill-mode: forwards;
}

@keyframes danmaku-move {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}

.preview-mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.preview-content {
  text-align: center;
  color: #fff;
  padding: 20px;
}

.preview-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
}

.preview-content p {
  font-size: 16px;
  margin-bottom: 24px;
  color: #ccc;
}
</style> 