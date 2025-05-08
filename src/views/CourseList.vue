<template>
  <div class="course-list">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>在线教育平台</h1>
          <el-menu mode="horizontal" :router="true" class="nav-menu">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/courses">课程列表</el-menu-item>
            <el-menu-item index="/live">直播列表</el-menu-item>
            <el-menu-item index="/vip">VIP会员</el-menu-item>
          </el-menu>
        </div>
      </el-header>

      <el-main>
        <div class="page-content">
          <div class="page-header">
            <h1>课程列表</h1>
            <div class="filters">
              <el-select v-model="filters.category" placeholder="课程分类" clearable>
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="filters.level" placeholder="难度等级" clearable>
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="filters.sort" placeholder="排序方式">
                <el-option label="最新" value="latest" />
                <el-option label="最热" value="hot" />
                <el-option label="价格从低到高" value="price_asc" />
                <el-option label="价格从高到低" value="price_desc" />
              </el-select>
            </div>
          </div>

          <div class="course-grid">
            <div
              v-for="course in courses"
              :key="course.id"
              class="course-card"
              @click="router.push(`/course/${course.id}`)"
            >
              <div class="course-cover">
                <img :src="course.cover" :alt="course.title">
                <div class="course-status" :class="course.status">
                  {{ getStatusText(course.status) }}
                </div>
                <div class="course-duration" v-if="course.duration">
                  <el-icon><Timer /></el-icon>
                  {{ formatDuration(course.duration) }}
                </div>
              </div>
              <div class="course-info">
                <h3>{{ course.title }}</h3>
                <p class="course-desc">{{ course.description }}</p>
                <div class="course-meta">
                  <span class="teacher">
                    <el-icon><User /></el-icon>
                    {{ course.teacher }}
                  </span>
                  <span class="students">
                    <el-icon><UserFilled /></el-icon>
                    {{ course.students }}人学习
                  </span>
                </div>
                <div class="course-tags" v-if="course.tags && course.tags.length">
                  <el-tag
                    v-for="tag in course.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="course-price">
                  <span class="price">¥{{ course.price }}</span>
                  <el-button type="primary" size="small">立即报名</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Timer, User, UserFilled } from '@element-plus/icons-vue'
import { getCourseList } from '../api/course'

const router = useRouter()

const categories = [
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '移动开发', value: 'mobile' },
  { label: '数据库', value: 'database' },
  { label: '人工智能', value: 'ai' }
]

const levels = [
  { label: '入门', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const filters = ref({
  category: '',
  level: '',
  sort: 'latest'
})

const allCourses = ref([
  {
    id: 1,
    title: 'Vue3 实战课程',
    description: '从入门到精通的 Vue3 开发课程，包含组件开发、状态管理、路由等核心内容',
    cover: 'https://picsum.photos/400/225?random=1',
    status: 'live',
    duration: 120,
    teacher: '张老师',
    students: 1234,
    tags: ['Vue3', '前端开发'],
    price: 299
  },
  {
    id: 2,
    title: 'React 高级开发',
    description: 'React 高级特性与最佳实践，包含 Hooks、Context、性能优化等内容',
    cover: 'https://picsum.photos/400/225?random=2',
    status: 'upcoming',
    duration: 180,
    teacher: '李老师',
    students: 856,
    tags: ['React', '前端开发'],
    price: 399
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    description: 'Node.js 企业级应用开发，包含 Express、MongoDB、Redis 等内容',
    cover: 'https://picsum.photos/400/225?random=3',
    status: 'ended',
    duration: 240,
    teacher: '王老师',
    students: 567,
    tags: ['Node.js', '后端开发'],
    price: 499
  },
  {
    id: 4,
    title: 'Python 数据分析',
    description: 'Python 数据分析与可视化，包含 Pandas、NumPy、Matplotlib 等内容',
    cover: 'https://picsum.photos/400/225?random=4',
    status: 'live',
    duration: 150,
    teacher: '赵老师',
    students: 789,
    tags: ['Python', '数据分析'],
    price: 349
  }
])

const courses = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(4)

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    live: '直播中',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const formatDuration = (duration) => {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours}小时${minutes}分钟`
}

const loadCourses = async () => {
  try {
    // 模拟API调用
    // const { data } = await getCourseList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...filters.value
    // })
    // courses.value = data.list
    // total.value = data.total
    
    // 使用模拟数据
    let filteredCourses = [...allCourses.value]
    
    // 按分类筛选
    if (filters.value.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.tags && course.tags.includes(filters.value.category)
      )
    }
    
    // 按难度等级筛选
    if (filters.value.level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level === filters.value.level
      )
    }
    
    // 排序
    if (filters.value.sort === 'price_asc') {
      filteredCourses.sort((a, b) => a.price - b.price)
    } else if (filters.value.sort === 'price_desc') {
      filteredCourses.sort((a, b) => b.price - a.price)
    } else if (filters.value.sort === 'hot') {
      filteredCourses.sort((a, b) => b.students - a.students)
    }
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    courses.value = filteredCourses.slice(start, end)
    total.value = filteredCourses.length
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadCourses()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadCourses()
}

watch(filters, () => {
  currentPage.value = 1
  loadCourses()
}, { deep: true })

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.course-list {
  min-height: 100vh;
  background: #f5f7fa;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.nav-menu {
  border-bottom: none;
}

.el-main {
  padding-top: 80px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 16px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-cover {
  position: relative;
  padding-top: 56.25%;
}

.course-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.course-status.upcoming {
  background: #409EFF;
}

.course-status.live {
  background: #67C23A;
}

.course-status.ended {
  background: #909399;
}

.course-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-info {
  padding: 16px;
}

.course-info h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.course-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.course-meta .el-icon {
  margin-right: 4px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.course-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price .price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style> 