<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { getUserInfo, updateUserInfo } from '@/api/user'

const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const userStore = useUserStore()
const userInfo = ref({
  avatar: DEFAULT_AVATAR,
  nickname: '',
  email: '',
  phone: '',
  bio: ''
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const { data } = await getUserInfo()
    userInfo.value = {
      ...data,
      avatar: data.avatar || DEFAULT_AVATAR
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败')
  }
}

// 保存用户信息
const saveUserInfo = async () => {
  try {
    await updateUserInfo(userInfo.value)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存用户信息失败:', error)
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
          <el-button type="primary" @click="saveUserInfo">保存</el-button>
        </div>
      </template>
      
      <div class="profile-content">
        <div class="avatar-upload">
          <el-avatar :size="100" :src="userInfo.avatar || DEFAULT_AVATAR" />
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="(res) => userInfo.avatar = res.data.url"
          >
            <el-button type="primary" size="small">更换头像</el-button>
          </el-upload>
        </div>

        <el-form label-width="100px" class="profile-form">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
          </el-form-item>
          
          <el-form-item label="个人简介">
            <el-input
              v-model="userInfo.bio"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  display: flex;
  gap: 40px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.profile-form {
  flex: 1;
}
</style> 