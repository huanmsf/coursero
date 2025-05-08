<template>
  <div class="recorded-courses">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索课程"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 筛选条件 -->
    <div class="filters">
      <el-select v-model="category" placeholder="课程分类" clearable @change="handleFilter">
        <el-option
          v-for="item in categories"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="sortBy" placeholder="排序方式" @change="handleFilter">
        <el-option
          v-for="item in sortOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <!-- 课程列表 -->
    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card" @click="viewCourse(course)">
        <img :src="course.cover" :alt="course.title" class="course-cover">
        <div class="course-info">
          <h3>{{ course.title }}</h3>
          <p class="teacher">{{ course.teacher }}</p>
          <div class="course-meta">
            <span class="price">¥{{ course.price }}</span>
            <span class="students">{{ course.students }}人学习</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <el-button type="primary" :loading="loading" @click="loadMore">
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getRecordedCourses } from '../api/course'
import { useCourseStore } from '../store/course'

const router = useRouter()
const courseStore = useCourseStore()

const searchQuery = ref('')
const category = ref('')
const sortBy = ref('newest')
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const hasMore = ref(true)
const courses = ref([])

const categories = [
  { value: 'programming', label: '编程开发' },
  { value: 'design', label: '设计' },
  { value: 'marketing', label: '营销' },
  { value: 'language', label: '语言' }
]

const sortOptions = [
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '最热' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' }
]

const loadCourses = async (reset = false) => {
  if (loading.value) return
  loading.value = true

  try {
    const currentPage = reset ? 1 : page.value
    const params = {
      page: currentPage,
      pageSize: pageSize.value,
      search: searchQuery.value,
      category: category.value,
      sort: sortBy.value
    }

    const res = await getRecordedCourses(params)
    if (reset) {
      courses.value = res.data
    } else {
      courses.value = [...courses.value, ...res.data]
    }

    hasMore.value = res.data.length === pageSize.value
    if (hasMore.value) {
      page.value++
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  loadCourses(true)
}

const handleFilter = () => {
  page.value = 1
  loadCourses(true)
}

const loadMore = () => {
  loadCourses()
}

const viewCourse = (course) => {
  courseStore.setCurrentCourse(course)
  router.push(`/course/${course.id}`)
}

onMounted(() => {
  loadCourses(true)
})
</script>

<style scoped>
.recorded-courses {
  padding: 16px;
}

.search-bar {
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.filters .el-select {
  width: 120px;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-cover {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.course-info {
  padding: 12px;
}

.course-info h3 {
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.students {
  font-size: 12px;
  color: #999;
}

.load-more {
  margin-top: 20px;
  text-align: center;
}
</style> 