<template>
  <div class="course-detail">
    <div class="course-header">
      <div class="course-info">
        <h1>{{ course.title }}</h1>
        <div class="teacher-info">
          <el-avatar :src="course.teacher?.avatar" />
          <span>{{ course.teacher?.name }}</span>
        </div>
        <div class="course-meta">
          <el-tag>{{ course.category }}</el-tag>
          <el-tag type="success">{{ course.level }}</el-tag>
          <span class="students">{{ course.studentCount }} 学员</span>
          <span class="rating">{{ course.rating }} 分</span>
        </div>
      </div>
      <div class="course-actions" v-if="isTeacher">
        <el-button type="primary" @click="editCourse">编辑课程</el-button>
        <el-button type="success" @click="createChapter">添加章节</el-button>
      </div>
    </div>

    <div class="course-content">
      <div class="chapters">
        <div v-for="chapter in chapters" :key="chapter.id" class="chapter">
          <div class="chapter-header">
            <h3>{{ chapter.title }}</h3>
            <div class="chapter-actions" v-if="isTeacher">
              <el-button type="primary" link @click="editChapter(chapter)">编辑</el-button>
              <el-button type="danger" link @click="deleteChapter(chapter)">删除</el-button>
            </div>
          </div>
          <div class="lessons">
            <div v-for="lesson in chapter.lessons" :key="lesson.id" class="lesson">
              <div class="lesson-info">
                <el-icon><VideoPlay v-if="lesson.type === 'video'" /><VideoCamera v-else /></el-icon>
                <span>{{ lesson.title }}</span>
                <el-tag size="small" :type="getLessonStatusType(lesson.status)">
                  {{ getLessonStatusText(lesson.status) }}
                </el-tag>
              </div>
              <div class="lesson-actions">
                <el-button type="primary" link @click="playLesson(lesson)">
                  {{ lesson.type === 'video' ? '观看' : '进入直播' }}
                </el-button>
                <template v-if="isTeacher">
                  <el-button type="primary" link @click="editLesson(lesson)">编辑</el-button>
                  <el-button type="danger" link @click="deleteLesson(lesson)">删除</el-button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 章节编辑对话框 -->
    <el-dialog
      v-model="chapterDialogVisible"
      :title="editingChapter ? '编辑章节' : '添加章节'"
      width="500px"
    >
      <el-form :model="chapterForm" label-width="80px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterForm.title" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="chapterForm.order" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="chapterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveChapter">确定</el-button>
      </template>
    </el-dialog>

    <!-- 课程编辑对话框 -->
    <el-dialog
      v-model="courseDialogVisible"
      title="编辑课程"
      width="600px"
    >
      <el-form :model="courseForm" label-width="80px">
        <el-form-item label="课程标题">
          <el-input v-model="courseForm.title" />
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input type="textarea" v-model="courseForm.description" />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="courseForm.category">
            <el-option label="前端开发" value="frontend" />
            <el-option label="后端开发" value="backend" />
            <el-option label="移动开发" value="mobile" />
            <el-option label="人工智能" value="ai" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度等级">
          <el-select v-model="courseForm.level">
            <el-option label="初级" value="beginner" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
          >
            <img v-if="courseForm.cover" :src="courseForm.cover" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, VideoCamera, Plus } from '@element-plus/icons-vue'
import {
  getCourseDetail,
  getCourseChapters,
  updateCourse,
  createChapter as createChapterApi,
  updateChapter,
  deleteChapter as deleteChapterApi
} from '../api/course'

const route = useRoute()
const router = useRouter()
const course = ref({})
const chapters = ref([])
const isTeacher = ref(false) // 根据用户权限判断

// 章节对话框
const chapterDialogVisible = ref(false)
const editingChapter = ref(null)
const chapterForm = ref({
  title: '',
  order: 1
})

// 课程对话框
const courseDialogVisible = ref(false)
const courseForm = ref({
  title: '',
  description: '',
  category: '',
  level: '',
  cover: ''
})

// 获取课程详情
const loadCourseDetail = async () => {
  try {
    const { data } = await getCourseDetail(route.params.id)
    course.value = data
    courseForm.value = { ...data }
  } catch (error) {
    ElMessage.error('获取课程详情失败')
  }
}

// 获取章节列表
const loadChapters = async () => {
  try {
    const { data } = await getCourseChapters(route.params.id)
    chapters.value = data
  } catch (error) {
    ElMessage.error('获取章节列表失败')
  }
}

// 编辑课程
const editCourse = () => {
  courseDialogVisible.value = true
}

// 保存课程
const saveCourse = async () => {
  try {
    await updateCourse(course.value.id, courseForm.value)
    ElMessage.success('保存成功')
    courseDialogVisible.value = false
    loadCourseDetail()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 创建章节
const createChapter = () => {
  editingChapter.value = null
  chapterForm.value = {
    title: '',
    order: chapters.value.length + 1
  }
  chapterDialogVisible.value = true
}

// 编辑章节
const editChapter = (chapter) => {
  editingChapter.value = chapter
  chapterForm.value = { ...chapter }
  chapterDialogVisible.value = true
}

// 保存章节
const saveChapter = async () => {
  try {
    if (editingChapter.value) {
      await updateChapter(course.value.id, editingChapter.value.id, chapterForm.value)
    } else {
      await createChapterApi(course.value.id, chapterForm.value)
    }
    ElMessage.success('保存成功')
    chapterDialogVisible.value = false
    loadChapters()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除章节
const deleteChapter = async (chapter) => {
  try {
    await ElMessageBox.confirm('确定要删除该章节吗？')
    await deleteChapterApi(course.value.id, chapter.id)
    ElMessage.success('删除成功')
    loadChapters()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 播放课程
const playLesson = (lesson) => {
  if (lesson.type === 'video') {
    router.push(`/video/${lesson.id}`)
  } else {
    router.push(`/live/${lesson.id}`)
  }
}

// 获取课程状态类型
const getLessonStatusType = (status) => {
  const types = {
    published: 'success',
    draft: 'info',
    upcoming: 'warning',
    live: 'danger',
    ended: 'info'
  }
  return types[status] || 'info'
}

// 获取课程状态文本
const getLessonStatusText = (status) => {
  const texts = {
    published: '已发布',
    draft: '草稿',
    upcoming: '即将开始',
    live: '直播中',
    ended: '已结束'
  }
  return texts[status] || status
}

// 处理封面上传成功
const handleCoverSuccess = (response) => {
  courseForm.value.cover = response.url
}

onMounted(() => {
  loadCourseDetail()
  loadChapters()
})
</script>

<style scoped>
.course-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.course-info h1 {
  margin: 0 0 20px;
  font-size: 24px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chapters {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.chapter {
  margin-bottom: 30px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chapter-header h3 {
  margin: 0;
  font-size: 18px;
}

.lessons {
  border-left: 2px solid #eee;
  padding-left: 20px;
}

.lesson {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style> 