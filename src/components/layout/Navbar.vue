<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Setting, Logout } from '@element-plus/icons-vue'

const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const router = useRouter()
const userStore = useUserStore()
const showUserMenu = ref(false)

const userInfo = computed(() => userStore.userInfo)
const avatar = computed(() => userInfo.value?.avatar || DEFAULT_AVATAR)

// ... existing code ...
</script>

<template>
  <!-- ... existing code ... -->
  <div class="user-info" @click="showUserMenu = !showUserMenu">
    <el-avatar :size="32" :src="avatar" />
    <span class="username">{{ userInfo?.nickname || userInfo?.username }}</span>
  </div>
  <!-- ... existing code ... -->
</template>
// ... existing code ... 