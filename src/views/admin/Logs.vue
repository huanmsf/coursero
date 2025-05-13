<template>
  <div class="logs">
    <div class="page-header">
      <h2>系统日志</h2>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索日志"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          @change="handleSearch"
        />
        <el-select
          v-model="logType"
          placeholder="日志类型"
          clearable
          @change="handleSearch"
        >
          <el-option label="操作日志" value="operation" />
          <el-option label="登录日志" value="login" />
          <el-option label="系统日志" value="system" />
          <el-option label="错误日志" value="error" />
        </el-select>
      </div>
    </div>

    <el-table :data="logs" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getLogType(row.type)">
            {{ getLogTypeName(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="操作人" width="120" />
      <el-table-column prop="action" label="操作" min-width="200" />
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column prop="userAgent" label="浏览器" min-width="200" />
      <el-table-column prop="createTime" label="操作时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleViewDetail(row)">
            详情
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

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="日志详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志类型">
          <el-tag :type="getLogType(currentLog.type)">
            {{ getLogTypeName(currentLog.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentLog.username }}
        </el-descriptions-item>
        <el-descriptions-item label="操作">
          {{ currentLog.action }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ currentLog.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="浏览器">
          {{ currentLog.userAgent }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">
          {{ new Date(currentLog.createTime).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <pre class="log-detail-pre">{{ formatJson(currentLog.params) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="响应结果" :span="2">
          <pre class="log-detail-pre">{{ formatJson(currentLog.result) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2" v-if="currentLog.error">
          <pre class="log-detail-pre error">{{ currentLog.error }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const logs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const dateRange = ref([])
const logType = ref('')
const detailVisible = ref(false)
const currentLog = reactive({})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 获取日志类型
const getLogType = (type) => {
  const typeMap = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取日志类型名称
const getLogTypeName = (type) => {
  const nameMap = {
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误'
  }
  return nameMap[type] || '未知'
}

// 格式化 JSON
const formatJson = (json) => {
  if (!json) return ''
  try {
    return JSON.stringify(json, null, 2)
  } catch (e) {
    return json
  }
}

// 加载日志列表
const loadLogs = async () => {
  try {
    // TODO: 调用日志列表 API
    logs.value = [
      {
        id: 1,
        type: 'operation',
        username: 'admin',
        action: '创建用户',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        createTime: '2024-03-20T10:00:00',
        params: {
          username: 'test',
          email: 'test@example.com'
        },
        result: {
          code: 200,
          message: '创建成功'
        }
      },
      {
        id: 2,
        type: 'error',
        username: 'admin',
        action: '删除用户',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        createTime: '2024-03-20T09:00:00',
        params: {
          userId: 100
        },
        error: '用户不存在'
      }
    ]
    total.value = 2
  } catch (error) {
    console.error('加载日志列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadLogs()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  loadLogs()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadLogs()
}

// 查看详情
const handleViewDetail = (row) => {
  Object.assign(currentLog, row)
  detailVisible.value = true
}

// 初始化
loadLogs()
</script>

<style scoped>
.logs {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 200px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-detail-pre {
  margin: 0;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.log-detail-pre.error {
  color: #f56c6c;
  background-color: #fef0f0;
}
</style> 