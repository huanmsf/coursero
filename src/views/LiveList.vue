<template>
  <div class="live-list">
    <div class="page-content">
      <div class="page-header">
        <h1>直播列表</h1>
        <el-button type="primary" @click="router.push('/live/push')">
          <el-icon><VideoCamera /></el-icon>
          开始直播
        </el-button>
      </div>
      <div class="filters">
        <el-select v-model="filters.status" placeholder="直播状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="即将开始" value="upcoming" />
          <el-option label="直播中" value="live" />
          <el-option label="已结束" value="ended" />
        </el-select>
        <el-select v-model="filters.category" placeholder="直播分类" clearable>
          <el-option label="全部" value="" />
          <el-option label="前端开发" value="frontend" />
          <el-option label="后端开发" value="backend" />
          <el-option label="移动开发" value="mobile" />
          <el-option label="人工智能" value="ai" />
        </el-select>
      </div>
    </div>

    <div class="live-grid">
      <div
        v-for="live in filteredLives"
        :key="live.id"
        class="live-card"
        @click="handleLiveClick(live)"
      >
        <div class="cover">
          <img 
            :src="live.cover" 
            :alt="live.title"
            @error="handleImageError"
            loading="lazy"
          />
          <div class="status" :class="live.status">
            {{ getStatusText(live.status) }}
          </div>
          <div class="countdown" v-if="live.status === 'upcoming'">
            {{ formatCountdown(live.startTime) }}
          </div>
        </div>
        <div class="content">
          <h3 class="title">{{ live.title }}</h3>
          <div class="info">
            <span class="teacher">
              <el-icon><User /></el-icon>
              {{ live.teacher }}
            </span>
            <span class="students">
              <el-icon><UserFilled /></el-icon>
              {{ live.students }}人报名
            </span>
          </div>
          <div class="price-info">
            <span class="price">¥{{ live.price }}</span>
            <el-button
              type="primary"
              size="small"
              :disabled="live.status === 'ended'"
              @click.stop="handleRegister(live)"
            >
              {{ getActionText(live.status) }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, UserFilled, VideoCamera } from '@element-plus/icons-vue'
import { getLiveList, registerLive } from '../api/live'

const router = useRouter()

const lives = ref([])
const categories = ref([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' },
  { id: 4, name: '人工智能' }
])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const filters = ref({
  status: '',
  category: ''
})

const filteredLives = computed(() => {
  return lives.value.filter(live => {
    if (filters.value.status && live.status !== filters.value.status) {
      return false
    }
    if (filters.value.category && live.categoryId !== filters.value.category) {
      return false
    }
    return true
  })
})

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

const handleImageError = (e) => {
  e.target.src = 'https://picsum.photos/800/450?random=' + Math.random()
}

const loadLives = async () => {
  try {
    const { data } = await getLiveList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    if (data && data.list) {
      lives.value = data.list
      total.value = data.total
    } else {
      ElMessage.warning('暂无直播数据')
    }
  } catch (error) {
    console.error('获取直播列表失败:', error)
    ElMessage.error('获取直播列表失败')
  }
}

const handleLiveClick = (live) => {
  router.push(`/live/${live.id}`)
}

const handleRegister = async (live) => {
  try {
    await registerLive(live.id)
    ElMessage.success('报名成功')
    router.push(`/live/${live.id}`)
  } catch (error) {
    ElMessage.error('报名失败')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadLives()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadLives()
}

onMounted(() => {
  loadLives()
})
</script>

<style scoped>
.live-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-content {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.filter-group {
  display: flex;
  gap: 16px;
}

.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.live-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.live-card:hover {
  transform: translateY(-5px);
}

.cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.live-card:hover .cover img {
  transform: scale(1.05);
}

.status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.status.live {
  background-color: #f56c6c;
}

.status.upcoming {
  background-color: #409eff;
}

.status.ended {
  background-color: #909399;
}

.countdown {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.content {
  padding: 15px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
  line-height: 1.4;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.teacher {
  display: flex;
  align-items: center;
  gap: 5px;
}

.students {
  display: flex;
  align-items: center;
  gap: 5px;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-button) {
  padding: 8px 16px;
}
</style> 