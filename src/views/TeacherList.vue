<template>
  <div class="teacher-list">
    <h1>讲师团队</h1>
    <div class="teacher-grid">
      <div v-for="teacher in teachers" :key="teacher.id" class="teacher-card">
        <div class="avatar">
          <img :src="teacher.avatar" :alt="teacher.name" />
        </div>
        <div class="info">
          <h3>{{ teacher.name }}</h3>
          <p class="title">{{ teacher.title }}</p>
          <p class="description">{{ teacher.description }}</p>
          <div class="stats">
            <span>
              <el-icon><User /></el-icon>
              {{ teacher.students }} 学员
            </span>
            <span>
              <el-icon><VideoCamera /></el-icon>
              {{ teacher.courses }} 课程
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, VideoCamera } from '@element-plus/icons-vue'

const teachers = ref([
  {
    id: 1,
    name: '张老师',
    title: '前端开发专家',
    description: '10年前端开发经验，精通 Vue、React 等前端框架',
    avatar: 'https://picsum.photos/200/200?random=1',
    students: 1000,
    courses: 20
  },
  {
    id: 2,
    name: '李老师',
    title: '后端开发专家',
    description: '8年后端开发经验，精通 Java、Python、Node.js',
    avatar: 'https://picsum.photos/200/200?random=2',
    students: 800,
    courses: 15
  },
  {
    id: 3,
    name: '王老师',
    title: '移动开发专家',
    description: '5年移动开发经验，精通 iOS、Android 开发',
    avatar: 'https://picsum.photos/200/200?random=3',
    students: 600,
    courses: 10
  }
])
</script>

<style scoped>
.teacher-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.teacher-list h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

.teacher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.teacher-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-5px);
}

.avatar {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  padding: 20px;
}

.info h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 8px;
}

.title {
  color: #409eff;
  font-size: 14px;
  margin-bottom: 12px;
}

.description {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.stats {
  display: flex;
  gap: 16px;
  color: #909399;
  font-size: 14px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 