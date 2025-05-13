<template>
  <div class="courses">
    <div class="page-header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加课程
      </el-button>
    </div>

    <el-table :data="courses" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="课程信息" min-width="300">
        <template #default="{ row }">
          <div class="course-info">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              class="course-cover"
            />
            <div class="course-details">
              <div class="title">{{ row.title }}</div>
              <div class="description">{{ row.description }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="讲师" width="120" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="studentCount" label="学习人数" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="success" link @click="handlePublish(row)">
            {{ row.status === 'published' ? '下架' : '发布' }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const courses = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载课程列表
const loadCourses = async () => {
  try {
    // TODO: 调用课程列表 API
    courses.value = [
      {
        id: 1,
        title: 'Vue.js 高级特性实战',
        description: '从入门到精通的 Vue.js 开发课程',
        cover: 'https://picsum.photos/200/120?random=1',
        teacher: '张老师',
        price: 299,
        studentCount: 1000,
        status: 'published'
      },
      {
        id: 2,
        title: 'React Hooks 完全指南',
        description: 'React Hooks 高级特性与最佳实践',
        cover: 'https://picsum.photos/200/120?random=2',
        teacher: '李老师',
        price: 199,
        studentCount: 800,
        status: 'draft'
      }
    ]
    total.value = 2
  } catch (error) {
    console.error('加载课程列表失败:', error)
  }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  loadCourses()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadCourses()
}

// 添加课程
const handleAdd = () => {
  // TODO: 实现添加课程功能
  ElMessage.info('添加课程功能开发中')
}

// 编辑课程
const handleEdit = (row) => {
  // TODO: 实现编辑课程功能
  ElMessage.info('编辑课程功能开发中')
}

// 发布/下架课程
const handlePublish = (row) => {
  const action = row.status === 'published' ? '下架' : '发布'
  ElMessageBox.confirm(
    `确定要${action}该课程吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用发布/下架 API
    ElMessage.success(`${action}成功`)
    loadCourses()
  })
}

// 删除课程
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该课程吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    loadCourses()
  })
}

// 初始化
loadCourses()
</script>

<style scoped>
.courses {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.course-cover {
  width: 120px;
  height: 68px;
  border-radius: 4px;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-details .title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-details .description {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 