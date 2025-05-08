<template>
  <div class="live-list">
    <div class="live-header">
      <h1>直播课程</h1>
      <div class="live-filters">
        <el-select v-model="filter.status" placeholder="直播状态">
          <el-option label="全部" value="" />
          <el-option label="即将开始" value="upcoming" />
          <el-option label="直播中" value="live" />
          <el-option label="已结束" value="ended" />
        </el-select>
        <el-select v-model="filter.category" placeholder="课程分类">
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
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
        <div class="live-cover">
          <img :src="live.cover" :alt="live.title" />
          <div class="live-status" :class="live.status">
            {{ getStatusText(live.status) }}
          </div>
          <div class="live-countdown" v-if="live.status === 'upcoming'">
            {{ formatCountdown(live.startTime) }}
          </div>
        </div>
        <div class="live-info">
          <h3>{{ live.title }}</h3>
          <div class="live-meta">
            <span class="teacher">
              <el-icon><User /></el-icon>
              {{ live.teacher }}
            </span>
            <span class="students">
              <el-icon><UserFilled /></el-icon>
              {{ live.students }}人报名
            </span>
          </div>
          <div class="live-price">
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
import { User, UserFilled } from '@element-plus/icons-vue'
import { getLiveList, registerLive } from '../api/live'

const router = useRouter()

const lives = ref([])
const categories = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const filter = ref({
  status: '',
  category: ''
})

const filteredLives = computed(() => {
  return lives.value.filter(live => {
    if (filter.value.status && live.status !== filter.value.status) {
      return false
    }
    if (filter.value.category && live.categoryId !== filter.value.category) {
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

const loadLives = async () => {
  try {
    const { data } = await getLiveList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filter.value
    })
    lives.value = data.list
    total.value = data.total
  } catch (error) {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.live-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.live-header h1 {
  font-size: 32px;
  color: #303133;
}

.live-filters {
  display: flex;
  gap: 16px;
}

.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.live-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.live-card:hover {
  transform: translateY(-5px);
}

.live-cover {
  position: relative;
  padding-top: 56.25%;
}

.live-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.live-status.upcoming {
  background: #409EFF;
}

.live-status.live {
  background: #67C23A;
}

.live-status.ended {
  background: #909399;
}

.live-countdown {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

.live-info {
  padding: 16px;
}

.live-info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.4;
}

.live-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.live-meta .el-icon {
  margin-right: 4px;
}

.live-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-price .price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style> 