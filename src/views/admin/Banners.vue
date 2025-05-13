<template>
  <div class="banners">
    <div class="page-header">
      <h2>轮播图管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加轮播图
      </el-button>
    </div>

    <el-table :data="banners" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="图片" width="200">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            :preview-src-list="[row.image]"
            fit="cover"
            class="banner-image"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="link" label="链接" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="100" />
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
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加轮播图' : '编辑轮播图'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            class="banner-uploader"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <img v-if="form.image" :src="form.image" class="upload-image" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：1920x400 像素</div>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接地址" />
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getBannerList, createBanner, updateBanner, deleteBanner } from '@/api/admin'
import { uploadFile } from '@/api/upload'

const banners = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const form = reactive({
  title: '',
  description: '',
  image: '',
  link: '',
  sort: 0,
  status: 'active'
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传图片', trigger: 'change' }
  ],
  link: [
    { required: true, message: '请输入链接地址', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 加载轮播图列表
const loadBanners = async () => {
  try {
    // 临时使用模拟数据
    banners.value = [
      {
        id: 1,
        title: '新课程上线',
        image: 'https://picsum.photos/1200/400?random=1',
        link: '/courses',
        sort: 1,
        status: 'active'
      },
      {
        id: 2,
        title: '直播预告',
        image: 'https://picsum.photos/1200/400?random=2',
        link: '/live',
        sort: 2,
        status: 'active'
      }
    ]
    
    // TODO: 实现真实 API 调用
    // const { data } = await getBannerList()
    // banners.value = data.list
  } catch (error) {
    console.error('加载轮播图列表失败:', error)
  }
}

// 添加轮播图
const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    title: '',
    description: '',
    image: '',
    link: '',
    sort: 0,
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑轮播图
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除轮播图
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该轮播图吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteBanner(row.id)
      ElMessage.success('删除成功')
      loadBanners()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 上传前校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

// 处理上传
const handleUpload = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    const { data } = await uploadFile(formData)
    form.image = data.url
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (dialogType.value === 'add') {
      await createBanner(form)
      ElMessage.success('添加成功')
    } else {
      await updateBanner(form)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    loadBanners()
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 初始化
loadBanners()
</script>

<style scoped>
.banners {
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

.banner-image {
  width: 160px;
  height: 80px;
  border-radius: 4px;
}

.banner-uploader {
  width: 360px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-uploader:hover {
  border-color: #409EFF;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style> 