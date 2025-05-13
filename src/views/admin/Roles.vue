<template>
  <div class="roles">
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加角色
      </el-button>
    </div>

    <el-table :data="roles" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="角色名称" width="120" />
      <el-table-column prop="code" label="角色标识" width="120" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="permissions" label="权限" min-width="300">
        <template #default="{ row }">
          <el-tag
            v-for="perm in row.permissions"
            :key="perm"
            class="permission-tag"
            size="small"
          >
            {{ perm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button 
            type="success" 
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

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox label="admin">管理员</el-checkbox>
            <el-checkbox label="teacher">教师</el-checkbox>
            <el-checkbox label="student">学生</el-checkbox>
            <el-checkbox label="content">内容管理</el-checkbox>
            <el-checkbox label="user">用户管理</el-checkbox>
            <el-checkbox label="system">系统设置</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const roles = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

// 表单数据
const form = reactive({
  name: '',
  code: '',
  description: '',
  permissions: [],
  status: 'active'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ],
  permissions: [
    { type: 'array', required: true, message: '请选择权限', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 加载角色列表
const loadRoles = async () => {
  try {
    // TODO: 调用角色列表 API
    roles.value = [
      {
        id: 1,
        name: '超级管理员',
        code: 'super_admin',
        description: '系统最高权限角色',
        permissions: ['admin', 'teacher', 'student', 'content', 'user', 'system'],
        status: 'active'
      },
      {
        id: 2,
        name: '教师',
        code: 'teacher',
        description: '课程管理和教学相关权限',
        permissions: ['teacher', 'content'],
        status: 'active'
      }
    ]
  } catch (error) {
    console.error('加载角色列表失败:', error)
  }
}

// 添加角色
const handleAdd = () => {
  dialogType.value = 'add'
  form.name = ''
  form.code = ''
  form.description = ''
  form.permissions = []
  form.status = 'active'
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用添加/编辑 API
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '编辑成功')
        dialogVisible.value = false
        loadRoles()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该角色吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用状态切换 API
    ElMessage.success(`${action}成功`)
    loadRoles()
  })
}

// 删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    loadRoles()
  })
}

// 初始化
loadRoles()
</script>

<style scoped>
.roles {
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

.permission-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 