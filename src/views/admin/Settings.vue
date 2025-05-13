<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="basic">
        <el-form
          ref="basicFormRef"
          :model="basicForm"
          :rules="basicRules"
          label-width="120px"
        >
          <el-form-item label="网站名称" prop="siteName">
            <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
          </el-form-item>
          
          <el-form-item label="网站描述" prop="siteDescription">
            <el-input
              v-model="basicForm.siteDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入网站描述"
            />
          </el-form-item>
          
          <el-form-item label="网站Logo" prop="siteLogo">
            <el-upload
              class="logo-uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleLogoUpload"
            >
              <img v-if="basicForm.siteLogo" :src="basicForm.siteLogo" class="logo-image" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸：200x60 像素</div>
          </el-form-item>
          
          <el-form-item label="网站图标" prop="siteFavicon">
            <el-upload
              class="favicon-uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleFaviconUpload"
            >
              <img v-if="basicForm.siteFavicon" :src="basicForm.siteFavicon" class="favicon-image" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸：32x32 像素</div>
          </el-form-item>
          
          <el-form-item label="备案信息" prop="icp">
            <el-input v-model="basicForm.icp" placeholder="请输入备案号" />
          </el-form-item>
          
          <el-form-item label="版权信息" prop="copyright">
            <el-input v-model="basicForm.copyright" placeholder="请输入版权信息" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 样式设置 -->
      <el-tab-pane label="样式设置" name="style">
        <el-form
          ref="styleFormRef"
          :model="styleForm"
          label-width="120px"
        >
          <el-form-item label="主题色" prop="primaryColor">
            <el-color-picker v-model="styleForm.primaryColor" />
          </el-form-item>
          
          <el-form-item label="导航栏样式" prop="navbarStyle">
            <el-radio-group v-model="styleForm.navbarStyle">
              <el-radio :value="'light'">浅色</el-radio>
              <el-radio :value="'dark'">深色</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="侧边栏样式" prop="sidebarStyle">
            <el-radio-group v-model="styleForm.sidebarStyle">
              <el-radio :value="'light'">浅色</el-radio>
              <el-radio :value="'dark'">深色</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="布局模式" prop="layout">
            <el-radio-group v-model="styleForm.layout">
              <el-radio :value="'side'">侧边菜单</el-radio>
              <el-radio :value="'top'">顶部菜单</el-radio>
              <el-radio :value="'mix'">混合菜单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 其他设置 -->
      <el-tab-pane label="其他设置" name="other">
        <el-form
          ref="otherFormRef"
          :model="otherForm"
          label-width="120px"
        >
          <el-form-item label="注册方式" prop="registerMethods">
            <el-checkbox-group v-model="otherForm.registerMethods">
              <el-checkbox :value="'email'">邮箱注册</el-checkbox>
              <el-checkbox :value="'phone'">手机注册</el-checkbox>
              <el-checkbox :value="'wechat'">微信注册</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="评论功能" prop="enableComment">
            <el-switch v-model="otherForm.enableComment" />
          </el-form-item>
          
          <el-form-item label="评论审核" prop="commentAudit">
            <el-switch v-model="otherForm.commentAudit" />
          </el-form-item>
          
          <el-form-item label="注册审核" prop="registerAudit">
            <el-switch v-model="otherForm.registerAudit" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="form-actions">
      <el-button type="primary" @click="handleSave">保存设置</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getSiteSettings, updateSiteSettings } from '@/api/admin'
import { uploadFile } from '@/api/upload'

const activeTab = ref('basic')
const basicFormRef = ref(null)
const styleFormRef = ref(null)
const otherFormRef = ref(null)

// 基本设置表单
const basicForm = reactive({
  siteName: '',
  siteDescription: '',
  siteLogo: '',
  siteFavicon: '',
  icp: '',
  copyright: ''
})

// 样式设置表单
const styleForm = reactive({
  primaryColor: '#409EFF',
  navbarStyle: 'light',
  sidebarStyle: 'dark',
  layout: 'side'
})

// 其他设置表单
const otherForm = reactive({
  registerMethods: ['email'],
  enableComment: true,
  commentAudit: true,
  registerAudit: false
})

// 表单验证规则
const basicRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { required: true, message: '请输入网站描述', trigger: 'blur' }
  ],
  siteLogo: [
    { required: true, message: '请上传网站Logo', trigger: 'change' }
  ]
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

// 处理Logo上传
const handleLogoUpload = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    const { data } = await uploadFile(formData)
    basicForm.siteLogo = data.url
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 处理Favicon上传
const handleFaviconUpload = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    const { data } = await uploadFile(formData)
    basicForm.siteFavicon = data.url
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 加载设置
const loadSettings = async () => {
  try {
    // 临时使用模拟数据
    const mockSettings = {
      siteName: '在线教育平台',
      siteDescription: '专业的在线教育平台，提供优质的课程和直播服务',
      siteKeywords: '在线教育,在线课程,直播教学',
      siteLogo: 'https://picsum.photos/200/200?random=1',
      siteFavicon: 'https://picsum.photos/32/32?random=1',
      siteFooter: '© 2024 在线教育平台 版权所有',
      contactEmail: 'support@example.com',
      contactPhone: '400-123-4567',
      contactAddress: '北京市朝阳区xxx街道xxx号',
      smtpHost: 'smtp.example.com',
      smtpPort: 465,
      smtpUser: 'noreply@example.com',
      smtpPass: '********',
      storageType: 'local',
      storageConfig: {
        endpoint: 'http://localhost:9000',
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
        bucket: 'education'
      }
    }
    
    // 更新表单数据
    Object.assign(basicForm, {
      siteName: mockSettings.siteName,
      siteDescription: mockSettings.siteDescription,
      siteLogo: mockSettings.siteLogo,
      siteFavicon: mockSettings.siteFavicon,
      icp: mockSettings.icp,
      copyright: mockSettings.siteFooter
    })
    
    // TODO: 实现真实 API 调用
    // const { data } = await getSiteSettings()
    // Object.assign(basicForm, data.basic)
    // Object.assign(styleForm, data.style)
    // Object.assign(otherForm, data.other)
  } catch (error) {
    console.error('加载系统设置失败:', error)
  }
}

// 保存设置
const handleSave = async () => {
  try {
    const settings = {
      basic: basicForm,
      style: styleForm,
      other: otherForm
    }
    await updateSiteSettings(settings)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 重置设置
const handleReset = () => {
  loadSettings()
}

// 初始化
loadSettings()
</script>

<style scoped>
.settings {
  padding: 20px;
}

.logo-uploader {
  width: 200px;
  height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.favicon-uploader {
  width: 32px;
  height: 32px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-uploader:hover,
.favicon-uploader:hover {
  border-color: #409EFF;
}

.logo-image,
.favicon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.form-actions {
  margin-top: 20px;
  text-align: center;
}
</style> 