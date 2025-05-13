<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="240px">
        <div class="logo">
          <h2>管理后台</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          :router="true"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/admin">
            <el-icon><DataLine /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          
          <el-sub-menu index="content">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/banners">轮播图管理</el-menu-item>
            <el-menu-item index="/admin/courses">课程管理</el-menu-item>
            <el-menu-item index="/admin/lives">直播管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/users">用户列表</el-menu-item>
            <el-menu-item index="/admin/roles">角色管理</el-menu-item>
            <el-menu-item index="/admin/permissions">权限管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/admin/settings">基本设置</el-menu-item>
            <el-menu-item index="/admin/menus">菜单配置</el-menu-item>
            <el-menu-item index="/admin/logs">系统日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div class="header-left">
            <el-icon class="toggle-sidebar" @click="toggleSidebar">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                  {{ userStore.userInfo?.username?.charAt(0) }}
                </el-avatar>
                <span class="username">{{ userStore.userInfo?.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox } from 'element-plus'
import {
  DataLine,
  Document,
  User,
  Setting,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => {
  const routeMap = {
    '/admin': '控制台',
    '/admin/banners': '轮播图管理',
    '/admin/courses': '课程管理',
    '/admin/lives': '直播管理',
    '/admin/users': '用户列表',
    '/admin/roles': '角色管理',
    '/admin/permissions': '权限管理',
    '/admin/settings': '基本设置',
    '/admin/menus': '菜单配置',
    '/admin/logs': '系统日志'
  }
  return routeMap[route.path] || routeMap['/admin']
})

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleProfile = () => {
  router.push('/user/profile')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logoutAction()
    router.push('/login')
  })
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.el-aside {
  background: #304156;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  border-bottom: 1px solid #1f2d3d;
}

.admin-menu {
  border-right: none;
}

.el-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-sidebar {
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.el-main {
  padding: 20px;
}
</style> 