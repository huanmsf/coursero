<template>
  <div class="permissions">
    <div class="page-header">
      <h2>权限管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加权限
      </el-button>
    </div>

    <el-table :data="permissions" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="权限名称" width="150" />
      <el-table-column prop="code" label="权限标识" width="150" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="row.type === 'menu' ? 'success' : 'warning'">
            {{ row.type === 'menu' ? '菜单' : '操作' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parent" label="父级" width="120">
        <template #default="{ row }">
          {{ row.parent || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" min-width="200" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加权限' : '编辑权限'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="operation">操作</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级" prop="parent">
          <el-select
            v-model="form.parent"
            placeholder="请选择父级权限"
            clearable
          >
            <el-option
              v-for="item in parentOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入权限描述"
          />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const permissions = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

// 表单数据
const form = reactive({
  name: '',
  code: '',
  type: 'menu',
  parent: '',
  path: '',
  description: ''
})

// 父级选项
const parentOptions = computed(() => {
  return permissions.value.filter(p => p.type === 'menu')
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入路径', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入权限描述', trigger: 'blur' }
  ]
}

// 加载权限列表
const loadPermissions = async () => {
  try {
    // TODO: 调用权限列表 API
    permissions.value = [
      {
        id: 1,
        name: '系统管理',
        code: 'system',
        type: 'menu',
        parent: '',
        path: '/admin/system',
        description: '系统管理相关功能'
      },
      {
        id: 2,
        name: '用户管理',
        code: 'user',
        type: 'menu',
        parent: 'system',
        path: '/admin/system/user',
        description: '用户管理相关功能'
      },
      {
        id: 3,
        name: '添加用户',
        code: 'user_add',
        type: 'operation',
        parent: 'user',
        path: '',
        description: '添加用户操作权限'
      }
    ]
  } catch (error) {
    console.error('加载权限列表失败:', error)
  }
}

// 添加权限
const handleAdd = () => {
  dialogType.value = 'add'
  form.name = ''
  form.code = ''
  form.type = 'menu'
  form.parent = ''
  form.path = ''
  form.description = ''
  dialogVisible.value = true
}

// 编辑权限
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
        loadPermissions()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 删除权限
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该权限吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    loadPermissions()
  })
}

// 初始化
loadPermissions()
</script>

<style scoped>
.permissions {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 