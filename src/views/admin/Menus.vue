<template>
  <div class="menus">
    <div class="page-header">
      <h2>菜单管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加菜单
      </el-button>
    </div>

    <el-table
      :data="menus"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" min-width="200">
        <template #default="{ row }">
          <span>
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由路径" min-width="200" />
      <el-table-column prop="component" label="组件路径" min-width="200" />
      <el-table-column prop="permission" label="权限标识" min-width="200" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'menu' ? 'primary' : 'info'">
            {{ row.type === 'menu' ? '菜单' : '按钮' }}
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
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAdd(row)">
            添加子菜单
          </el-button>
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加菜单' : '编辑菜单'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTree"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级菜单"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        
        <el-form-item label="图标" prop="icon" v-if="form.type === 'menu'">
          <el-input v-model="form.icon" placeholder="请输入图标名称">
            <template #append>
              <el-button @click="showIconSelect = true">
                选择图标
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="路由路径" prop="path" v-if="form.type === 'menu'">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        
        <el-form-item label="组件路径" prop="component" v-if="form.type === 'menu'">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限标识" />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图标选择器 -->
    <el-dialog
      title="选择图标"
      v-model="showIconSelect"
      width="800px"
    >
      <div class="icon-list">
        <div
          v-for="icon in iconList"
          :key="icon"
          class="icon-item"
          @click="selectIcon(icon)"
        >
          <el-icon><component :is="icon" /></el-icon>
          <span>{{ icon }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getMenuList,
  createMenu,
  updateMenu,
  deleteMenu
} from '@/api/admin'

const menus = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const showIconSelect = ref(false)
const currentMenu = ref(null)

const form = reactive({
  parentId: null,
  type: 'menu',
  name: '',
  icon: '',
  path: '',
  component: '',
  permission: '',
  sort: 0,
  status: 'active'
})

const rules = {
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '请输入权限标识', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 图标列表
const iconList = [
  'HomeFilled',
  'Document',
  'Setting',
  'User',
  'Lock',
  'Menu',
  'List',
  'Grid',
  'Star',
  'StarFilled',
  'Plus',
  'Minus',
  'Check',
  'Close',
  'Edit',
  'Delete',
  'Search',
  'Refresh',
  'Upload',
  'Download'
]

// 菜单树形数据
const menuTree = computed(() => {
  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }))
  }
  return buildTree(menus.value)
})

// 加载菜单列表
const loadMenus = async () => {
  try {
    // 临时使用模拟数据
    menus.value = [
      {
        id: 1,
        name: '控制台',
        path: '/admin/dashboard',
        icon: 'Odometer',
        sort: 1,
        status: 'active',
        children: []
      },
      {
        id: 2,
        name: '内容管理',
        path: '/admin/content',
        icon: 'Document',
        sort: 2,
        status: 'active',
        children: [
          {
            id: 21,
            name: '轮播图管理',
            path: '/admin/banners',
            icon: 'Picture',
            sort: 1,
            status: 'active'
          },
          {
            id: 22,
            name: '课程管理',
            path: '/admin/courses',
            icon: 'VideoPlay',
            sort: 2,
            status: 'active'
          },
          {
            id: 23,
            name: '直播管理',
            path: '/admin/lives',
            icon: 'VideoCamera',
            sort: 3,
            status: 'active'
          }
        ]
      },
      {
        id: 3,
        name: '用户管理',
        path: '/admin/users',
        icon: 'User',
        sort: 3,
        status: 'active',
        children: []
      },
      {
        id: 4,
        name: '系统设置',
        path: '/admin/settings',
        icon: 'Setting',
        sort: 4,
        status: 'active',
        children: [
          {
            id: 41,
            name: '角色管理',
            path: '/admin/roles',
            icon: 'UserFilled',
            sort: 1,
            status: 'active'
          },
          {
            id: 42,
            name: '权限管理',
            path: '/admin/permissions',
            icon: 'Lock',
            sort: 2,
            status: 'active'
          },
          {
            id: 43,
            name: '菜单管理',
            path: '/admin/menus',
            icon: 'Menu',
            sort: 3,
            status: 'active'
          },
          {
            id: 44,
            name: '系统日志',
            path: '/admin/logs',
            icon: 'Document',
            sort: 4,
            status: 'active'
          }
        ]
      }
    ]
    
    // TODO: 实现真实 API 调用
    // const { data } = await getMenuList()
    // menus.value = data.list
  } catch (error) {
    console.error('加载菜单列表失败:', error)
  }
}

// 添加菜单
const handleAdd = (row) => {
  dialogType.value = 'add'
  Object.assign(form, {
    parentId: row?.id || null,
    type: 'menu',
    name: '',
    icon: '',
    path: '',
    component: '',
    permission: '',
    sort: 0,
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  dialogType.value = 'edit'
  currentMenu.value = row
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该菜单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      loadMenus()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 选择图标
const selectIcon = (icon) => {
  form.icon = icon
  showIconSelect.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (dialogType.value === 'add') {
      await createMenu(form)
      ElMessage.success('添加成功')
    } else {
      await updateMenu(form)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    loadMenus()
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 初始化
loadMenus()
</script>

<style scoped>
.menus {
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

.icon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background-color: #f5f7fa;
  border-color: #409EFF;
}

.icon-item .el-icon {
  font-size: 24px;
}

.icon-item span {
  font-size: 12px;
  color: #606266;
}
</style> 