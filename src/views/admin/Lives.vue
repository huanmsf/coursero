<template>
  <div class="lives">
    <div class="page-header">
      <h2>直播管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        创建直播
      </el-button>
    </div>

    <el-table :data="lives" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="直播信息" min-width="300">
        <template #default="{ row }">
          <div class="live-info">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              class="live-cover"
            />
            <div class="live-details">
              <div class="title">{{ row.title }}</div>
              <div class="description">{{ row.description }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="讲师" width="120" />
      <el-table-column prop="startTime" label="开始时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.startTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewerCount" label="观看人数" width="100" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button 
            type="success" 
            link 
            @click="handleStart(row)"
            v-if="row.status === 'pending'"
          >
            开始直播
          </el-button>
          <el-button 
            type="warning" 
            link 
            @click="handleEnd(row)"
            v-if="row.status === 'live'"
          >
            结束直播
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

const lives = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    pending: 'info',
    live: 'success',
    ended: 'warning',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '未开始',
    live: '直播中',
    ended: '已结束',
    cancelled: '已取消'
  }
  return texts[status] || '未知'
}

// 加载直播列表
const loadLives = async () => {
  try {
    // TODO: 调用直播列表 API
    lives.value = [
      {
        id: 1,
        title: 'Vue3 新特性解析',
        description: '深入理解 Vue3 的新特性和最佳实践',
        cover: 'https://picsum.photos/200/120?random=1',
        teacher: '张老师',
        startTime: '2024-03-20T14:00:00',
        status: 'pending',
        viewerCount: 0
      },
      {
        id: 2,
        title: 'React 性能优化实战',
        description: 'React 应用性能优化的关键技巧',
        cover: 'https://picsum.photos/200/120?random=2',
        teacher: '李老师',
        startTime: '2024-03-19T10:00:00',
        status: 'live',
        viewerCount: 500
      }
    ]
    total.value = 2
  } catch (error) {
    console.error('加载直播列表失败:', error)
  }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  loadLives()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadLives()
}

// 创建直播
const handleAdd = () => {
  // TODO: 实现创建直播功能
  ElMessage.info('创建直播功能开发中')
}

// 编辑直播
const handleEdit = (row) => {
  // TODO: 实现编辑直播功能
  ElMessage.info('编辑直播功能开发中')
}

// 开始直播
const handleStart = (row) => {
  ElMessageBox.confirm(
    '确定要开始直播吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用开始直播 API
    ElMessage.success('直播已开始')
    loadLives()
  })
}

// 结束直播
const handleEnd = (row) => {
  ElMessageBox.confirm(
    '确定要结束直播吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用结束直播 API
    ElMessage.success('直播已结束')
    loadLives()
  })
}

// 删除直播
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该直播吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    loadLives()
  })
}

// 初始化
loadLives()
</script>

<style scoped>
.lives {
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

.live-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-cover {
  width: 120px;
  height: 68px;
  border-radius: 4px;
}

.live-details {
  flex: 1;
  min-width: 0;
}

.live-details .title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.live-details .description {
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