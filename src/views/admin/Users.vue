<template>
  <div class="users">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 用户列表 -->
      <el-tab-pane label="用户列表" name="list">
        <el-table :data="users" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="用户信息" min-width="200">
            <template #default="{ row }">
              <div class="user-info">
                <el-avatar :size="40" :src="row.avatar">
                  {{ row.username?.charAt(0) }}
                </el-avatar>
                <div class="user-details">
                  <div class="username">{{ row.username }}</div>
                  <div class="email">{{ row.email }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" width="120">
            <template #default="{ row }">
              <el-tag :type="getRoleType(row.role)">
                {{ getRoleName(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEditRole(row)">
                修改角色
              </el-button>
              <el-button
                :type="row.status === 'active' ? 'danger' : 'success'"
                link
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'active' ? '禁用' : '启用' }}
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
      </el-tab-pane>

      <!-- 权限申请 -->
      <el-tab-pane label="权限申请" name="requests">
        <el-table :data="permissionRequests" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="申请人" min-width="200">
            <template #default="{ row }">
              <div class="user-info">
                <el-avatar :size="40" :src="row.user.avatar">
                  {{ row.user.username?.charAt(0) }}
                </el-avatar>
                <div class="user-details">
                  <div class="username">{{ row.user.username }}</div>
                  <div class="email">{{ row.user.email }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="requestType" label="申请类型" width="120">
            <template #default="{ row }">
              <el-tag>{{ getRequestTypeName(row.requestType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="申请理由" show-overflow-tooltip />
          <el-table-column prop="createTime" label="申请时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="success" link @click="handleApprove(row)">
                通过
              </el-button>
              <el-button type="danger" link @click="handleReject(row)">
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改用户角色"
      v-model="roleDialogVisible"
      width="400px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        label-width="80px"
      >
        <el-form-item label="角色">
          <el-select v-model="roleForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  getUserList,
  updateUserRole,
  getPermissionRequests,
  handlePermissionRequest
} from '@/api/admin'

const activeTab = ref('list')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const users = ref([])
const permissionRequests = ref([])
const roleDialogVisible = ref(false)
const roleFormRef = ref(null)
const currentUser = ref(null)

const roleForm = reactive({
  role: ''
})

// 获取角色类型
const getRoleType = (role) => {
  const typeMap = {
    admin: 'danger',
    teacher: 'warning',
    student: 'success'
  }
  return typeMap[role] || 'info'
}

// 获取角色名称
const getRoleName = (role) => {
  const nameMap = {
    admin: '管理员',
    teacher: '教师',
    student: '学生'
  }
  return nameMap[role] || '未知'
}

// 获取申请类型名称
const getRequestTypeName = (type) => {
  const nameMap = {
    teacher: '申请成为教师',
    admin: '申请成为管理员'
  }
  return nameMap[type] || '未知'
}

// 加载用户列表
const loadUsers = async () => {
  try {
    // 临时使用模拟数据
    users.value = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        createTime: '2024-03-01T10:00:00'
      },
      {
        id: 2,
        username: 'teacher1',
        email: 'teacher1@example.com',
        role: 'teacher',
        status: 'active',
        createTime: '2024-03-02T11:00:00'
      },
      {
        id: 3,
        username: 'student1',
        email: 'student1@example.com',
        role: 'student',
        status: 'active',
        createTime: '2024-03-03T12:00:00'
      }
    ]
    total.value = 3
    
    // TODO: 实现真实 API 调用
    // const { data } = await getUserList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   query: searchQuery.value
    // })
    // users.value = data.list
    // total.value = data.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

// 加载权限申请列表
const loadPermissionRequests = async () => {
  try {
    // 临时使用模拟数据
    permissionRequests.value = [
      {
        id: 1,
        user: {
          username: 'user1',
          email: 'user1@example.com',
          avatar: ''
        },
        requestType: 'teacher',
        reason: '想要成为讲师',
        status: 'pending',
        createTime: '2024-03-15T10:00:00'
      },
      {
        id: 2,
        user: {
          username: 'user2',
          email: 'user2@example.com',
          avatar: ''
        },
        requestType: 'teacher',
        reason: '有丰富的教学经验',
        status: 'pending',
        createTime: '2024-03-15T11:00:00'
      }
    ]
    
    // TODO: 实现真实 API 调用
    // const { data } = await getPermissionRequests()
    // permissionRequests.value = data.list
  } catch (error) {
    console.error('加载权限请求失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  loadUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadUsers()
}

// 修改角色
const handleEditRole = (row) => {
  currentUser.value = row
  roleForm.role = row.role
  roleDialogVisible.value = true
}

const handleRoleSubmit = async () => {
  if (!currentUser.value) return
  
  try {
    await updateUserRole(currentUser.value.id, roleForm.role)
    ElMessage.success('修改成功')
    roleDialogVisible.value = false
    loadUsers()
  } catch (error) {
    ElMessage.error('修改失败')
  }
}

// 切换用户状态
const handleToggleStatus = (row) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该用户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateUserRole(row.id, row.role, {
        status: row.status === 'active' ? 'inactive' : 'active'
      })
      ElMessage.success(`${action}成功`)
      loadUsers()
    } catch (error) {
      ElMessage.error(`${action}失败`)
    }
  })
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await updateUserRole(row.id, row.role, { deleted: true })
      ElMessage.success('删除成功')
      loadUsers()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 处理权限申请
const handleApprove = async (row) => {
  try {
    await handlePermissionRequest(row.id, 'approve')
    ElMessage.success('已通过申请')
    loadPermissionRequests()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleReject = async (row) => {
  try {
    await handlePermissionRequest(row.id, 'reject')
    ElMessage.success('已拒绝申请')
    loadPermissionRequests()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
loadUsers()
loadPermissionRequests()
</script>

<style scoped>
.users {
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
  gap: 16px;
}

.search-input {
  width: 300px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  color: #303133;
}

.email {
  font-size: 12px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 