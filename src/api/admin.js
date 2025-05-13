import request from '@/utils/request'

// 轮播图管理
export function getBannerList() {
  return request({
    url: '/admin/banners',
    method: 'get'
  })
}

export function createBanner(data) {
  return request({
    url: '/admin/banners',
    method: 'post',
    data
  })
}

export function updateBanner(id, data) {
  return request({
    url: `/admin/banners/${id}`,
    method: 'put',
    data
  })
}

export function deleteBanner(id) {
  return request({
    url: `/admin/banners/${id}`,
    method: 'delete'
  })
}

// 网站设置
export function getSiteSettings() {
  return request({
    url: '/admin/settings',
    method: 'get'
  })
}

export function updateSiteSettings(data) {
  return request({
    url: '/admin/settings',
    method: 'put',
    data
  })
}

// 用户权限管理
export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

export function updateUserRole(id, role, data = {}) {
  return request({
    url: `/admin/users/${id}/role`,
    method: 'put',
    data: { role, ...data }
  })
}

export function getPermissionRequests() {
  return request({
    url: '/admin/permission-requests',
    method: 'get'
  })
}

export function handlePermissionRequest(id, action) {
  return request({
    url: `/admin/permission-requests/${id}`,
    method: 'put',
    data: { action }
  })
}

// 菜单管理
export function getMenuList() {
  return request({
    url: '/admin/menus',
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/admin/menus',
    method: 'post',
    data
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/admin/menus/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/admin/menus/${id}`,
    method: 'delete'
  })
}

// 系统日志
export function getSystemLogs(params) {
  return request({
    url: '/admin/logs',
    method: 'get',
    params
  })
}

// 数据统计
export function getDashboardStats() {
  return request({
    url: '/admin/dashboard/stats',
    method: 'get'
  })
}

export function getRecentOrders() {
  return request({
    url: '/admin/dashboard/recent-orders',
    method: 'get'
  })
}

export function getRecentUsers() {
  return request({
    url: '/admin/dashboard/recent-users',
    method: 'get'
  })
} 